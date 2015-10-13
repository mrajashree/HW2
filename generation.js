var esprima = require("esprima");
var options = {tokens:true, tolerant: true, loc: true, range: true };
var faker = require("faker");
var fs = require("fs");
faker.locale = "en";
var mock = require('mock-fs');
var _ = require('underscore');
var Random = require('random-js');
var file_being_used;

function main()
{
	var args = process.argv.slice(2);

	if( args.length == 0 )
	{
		args = ["subject.js"];
	}
	var filePath = args[0];
	file_being_used = filePath;

	constraints(filePath);

	generateTestCases()

}

var engine = Random.engines.mt19937().autoSeed();

function createConcreteIntegerValue( greaterThan, constraintValue )
{
	if( greaterThan )
		return Random.integer(constraintValue,constraintValue+10)(engine);
	else
		return Random.integer(constraintValue-10,constraintValue)(engine);
}

function Constraint(properties)
{
	this.ident = properties.ident;
	this.expression = properties.expression;
	this.operator = properties.operator;
	this.value = properties.value;
	this.funcName = properties.funcName;
	// Supported kinds: "fileWithContent","fileExists"
	// integer, string, phoneNumber
	this.kind = properties.kind;
}

function fakeDemo()
{
	console.log( faker.phone.phoneNumber() );
	console.log( faker.phone.phoneNumberFormat() );
	console.log( faker.phone.phoneFormats() );
}

var functionConstraints =
{
}

var mockFileLibrary = 
{
	pathExists:
	{
		'path/fileExists': {},
		'path/fileExistswithContents':
		{
			"file_content.txt" : "fileContents"
		}
	},
	fileWithContent:
	{
		pathContent: 
		{	
  			file1: 'text content',
  			file2: '',
		}
	}
};
var path = [];

function permutation_compute(ele,nextlist,newpath,total_levels,copy_params)
{
	newpath.push(ele);
	var retstr = [];
	if(newpath.length==total_levels)
	{
		retstr.push(newpath);
		return retstr;
	}

	var pathlist = [];	

	for(i in nextlist)
	{
		new_ele = nextlist[i];
		new_nextlist = copy_params[param_name[(newpath.length)+1]];
		retstr = permutation_compute(new_ele,new_nextlist,newpath.slice(),total_levels,copy_params);
		
		for (var j=0; j<retstr.length; j++) {
			pathlist.push(retstr[j]);
		}
	}
	return pathlist;
}

function generateTestCases()
{

	var content = "var subject = require('./"+file_being_used+"')\nvar mock = require('mock-fs');\n";
	for ( var funcName in functionConstraints )
	{
		var params = {};
		var copy_params = {};

		// initialize params
		for (var i =0; i < functionConstraints[funcName].params.length; i++ )
		{
			var paramName = functionConstraints[funcName].params[i];
			//params[paramName] = '\'' + faker.phone.phoneNumber()+'\'';
			params[paramName] = '\'\'';
			copy_params[paramName] = [];
		}
		// update parameter values based on known constraints.
		var constraints = functionConstraints[funcName].constraints;
		console.log("CONSTRAINTS:",constraints);
		//console.log(typeof(functionConstraints[funcName].constraints))
		// Handle global constraints...
		var fileWithContent = _.some(constraints, {kind: 'fileWithContent' });
		var pathExists      = _.some(constraints, {kind: 'fileExists' });
		
		// plug-in values for parameters
		for( var c = 0; c < constraints.length; c++ )
		{
			var constraint = constraints[c];
			if(  constraint.ident  )
			{
				console.log("value : ",constraint.value)
				params[constraint.ident] = constraint.value;
				copy_params[constraint.ident].push(constraint.value);
			}
			
		}
		console.log("Before:", copy_params)
		//console.log(constraints)
		//params example: { p: [ -1, 1 ], q: [ 'undefined', 'werw' ] }
		
		param_name = Object.keys(copy_params)
		//console.log(params[param_name[0]]);
		var path = [];
		var ret_path = [];
			
		for(var i=0; i<copy_params[param_name[0]].length; i++)
		{
			var pathstr = [];
			var first_ele = copy_params[param_name[0]][i];
			console.log("num params : ",param_name.length);
			if(param_name.length > 1)
			{
				var nextlist = copy_params[param_name[1]];
				ret_path = permutation_compute(first_ele,nextlist.slice(),pathstr.slice(),param_name.length,copy_params);
					for( var j =0; j < ret_path.length; j++)
					path.push(ret_path[j]);
			}
			else
			{
				var some = [];
				some.push(copy_params[param_name[0]][i]);
				path.push(some);
			}
		}
		
		// Prepare function arguments.
		for(combination in path)
		{
			var args = Object.keys(path[combination]).map( function(k) {return path[combination][k]; }).join(",");
			//console.log(args);
			if( pathExists || fileWithContent )
			{
				content += generateMockFsTestCases(pathExists,fileWithContent,funcName, args);
				// Bonus...generate constraint variations test cases....
				content += generateMockFsTestCases(!pathExists,fileWithContent,funcName, args);
				content += generateMockFsTestCases(pathExists,!fileWithContent,funcName, args);
				content += generateMockFsTestCases(!pathExists,!fileWithContent,funcName, args);
			}
			else
			{
				//console.log(content)
				// Emit simple test case.
				content += "subject.{0}({1});\n".format(funcName, args );
			}
		}

	}


	fs.writeFileSync('test.js', content, "utf8");

}

function generateMockFsTestCases (pathExists,fileWithContent,funcName,args) 
{
	var testCase = "";
	// Build mock file system based on constraints.
	var mergedFS = {};
	if( pathExists )
	{
		for (var attrname in mockFileLibrary.pathExists) { mergedFS[attrname] = mockFileLibrary.pathExists[attrname]; }
	}
	if( fileWithContent )
	{
		for (var attrname in mockFileLibrary.fileWithContent) { mergedFS[attrname] = mockFileLibrary.fileWithContent[attrname]; }
	}

	testCase += 
	"mock(" +
		JSON.stringify(mergedFS)
		+
	");\n";

	testCase += "\tsubject.{0}({1});\n".format(funcName, args );
	testCase+="mock.restore();\n";
	return testCase;
}

function constraints(filePath)
{
   var buf = fs.readFileSync(filePath, "utf8");
	var result = esprima.parse(buf, options);

	traverse(result, function (node) 
	{
		if (node.type === 'FunctionDeclaration') 
		{
			var funcName = functionName(node);
			console.log("Line : {0} Function: {1}".format(node.loc.start.line, funcName ));

			var params = node.params.map(function(p) {return p.name});
			
			functionConstraints[funcName] = {constraints:[], params: params};
			// Check for expressions using argument.
			traverse(node, function(child)
			{
				if( child.type === 'BinaryExpression' && child.operator == "==")
				{
					if( child.left.type == 'Identifier' && params.indexOf( child.left.name ) > -1)
					{
						// get expression from original source code:
						var expression = buf.substring(child.range[0], child.range[1]);
						var rightHand = buf.substring(child.right.range[0], child.right.range[1])
								
						functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: child.left.name,
								value: rightHand,
								funcName: funcName,
								kind: "integer",
								operator : child.operator,
								expression: expression
							}),
							new Constraint(
							{
								ident: child.left.name,
								value: rightHand,
								funcName: funcName,
								kind: "string",
								operator : child.operator,
								expression: expression
							}),
							new Constraint(
							{
								ident: child.left.name,
								value: '"something"',
								funcName: funcName,
								kind: "string",
								operator : child.operator,
								expression: expression
							}));
					}
					if( child.left.type == 'Identifier' && child.left.name)
					{
						console.log("NAME : ",child.left.name)
						var expression = buf.substring(child.range[0], child.range[1]);
						var rightHand = buf.substring(child.right.range[0], child.right.range[1]);
						functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: params[0],
								value: "'"+String(rightHand.substring(1,4)+"-000-0000")+"'",
								funcName: funcName,
								kind: "integer",
								operator : child.operator,
								expression: expression
							}));

					}
				}

				if( child.type === 'BinaryExpression' && child.operator == "<")
				{
					if( child.left.type == 'Identifier' && params.indexOf( child.left.name ) > -1)
					{
						// get expression from original source code:
						var expression = buf.substring(child.range[0], child.range[1]);
						var rightHand = buf.substring(child.right.range[0], child.right.range[1])

						functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: child.left.name,
								value: parseInt(rightHand)-1,
								funcName: funcName,
								kind: "integer",
								operator : child.operator,
								expression: expression
							}),
							new Constraint(
							{
								ident: child.left.name,
								value: parseInt(rightHand)+1,
								funcName: funcName,
								kind: "integer",
								operator : child.operator,
								expression: expression
							}));
					}
				}

				if( child.type === 'BinaryExpression' && child.operator == ">")
				{
					if( child.left.type == 'Identifier' && params.indexOf( child.left.name ) > -1)
					{
						// get expression from original source code:
						var expression = buf.substring(child.range[0], child.range[1]);
						var rightHand = buf.substring(child.right.range[0], child.right.range[1])

						functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: child.left.name,
								value: parseInt(rightHand)+1,
								funcName: funcName,
								kind: "integer",
								operator : child.operator,
								expression: expression
							}),
							new Constraint(
							{
								ident: child.left.name,
								value: parseInt(rightHand)-1,
								funcName: funcName,
								kind: "integer",
								operator : child.operator,
								expression: expression
							}));
					}
				}

				if( child.type == "CallExpression" && 
					 child.callee.property &&
					 child.callee.property.name =="readFileSync" )
				{
					for( var p =0; p < params.length; p++ )
					{
						if( child.arguments[0].name == params[p] )
						{
							functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: params[p],
								value:  "'pathContent/file1'",
								funcName: funcName,
								kind: "fileWithContent",
								operator : child.operator,
								expression: expression
							}),
							new Constraint(
							{
								ident: params[p],
								value:  "'pathContent/file2'",
								funcName: funcName,
								kind: "fileWithContent",
								operator : child.operator,
								expression: expression
							}));
						}
					}
				}

				if( child.type == "CallExpression" && 
					 child.callee.property &&
					 child.callee.property.name =="readdirSync" )
				{
					for( var p =0; p < params.length; p++ )
					{
						if( child.arguments[0].name == params[p] )
						{
							functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: params[0],
								value:  "'path/fileExistswithContents'",
								funcName: funcName,
								kind: "fileWithContent",
								operator : child.operator,
								expression: expression
							}),
							new Constraint(
							{
								ident: params[0],
								value:  "'path/fileExists'",
								funcName: funcName,
								kind: "fileWithContent",
								operator : child.operator,
								expression: expression
							}));
						}
					}
				}

				if( child.type == "CallExpression" &&
					 child.callee.property &&
					 child.callee.property.name =="existsSync")
				{
					for( var p =0; p < params.length; p++ )
					{
						if( child.arguments[0].name == params[p] )
						{
							functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: params[0],
								// A fake path to a file
								value:  "'path/fileExists'",
								funcName: funcName,
								kind: "fileExists",
								operator : child.operator,
								expression: expression
							}));
						}
					}
				}

				if( child.type == "CallExpression" &&
					 child.callee.property &&
					 child.callee.property.name =="replace")
				{
					var new_phone = "'"+String(faker.phone.phoneNumber())+"'";
						
					for( var p =0; p < params.length; p++ )
					{
						functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: params[p],
								// A fake path to a file
								value:  new_phone,
								funcName: funcName,
								kind: "string",
								operator : child.operator,
								expression: expression
							}));
					}
				}

				if( child.type == "CallExpression" &&
					 child.callee.property &&
					 child.callee.property.name =="indexOf")
				{
					functionConstraints[funcName].constraints.push( 
						new Constraint(
						{
							ident: child.callee.object.name,
							value:  "'"+String((child.arguments)[0].value)+"'",
							funcName: funcName,
							kind: "string",
							operator : child.operator,
							expression: expression
						}),
						new Constraint(
						{
							ident: child.callee.object.name,
							value:  "'heyy"+String((child.arguments)[0].value)+"'",
							funcName: funcName,
							kind: "string",
							operator : child.operator,
							expression: expression
						}));
				}

				if( child.type == "CallExpression" &&
					 child.callee.property &&
					 child.callee.property.name =="substring")
				{
					//console.log("NAMEEEEEEEEEEEEE : ",node.body.body[0].declarations[0]);
					//var expression = buf.substring(child.range[0], child.range[1]);
					//console.log("PLEASAAAAAAAAAAAAAAAAAA : ",node.range[0]);
					var new_phone = "'"+String(faker.phone.phoneNumber())+"'";
					for( var p =0; p < params.length; p++ )
					{
						functionConstraints[funcName].constraints.push(
							new Constraint(
							{
								ident: params[p],
								// A fake path to a file
								value:  new_phone,
								funcName: funcName,
								kind: "string",
								operator : child.operator,
								expression: expression
							}));
							
					}
				}

				if(child.type === 'UnaryExpression' && child.operator == '!')
				{
					if(child.argument.type === 'MemberExpression')
					{
						if(child.argument.object)
						{
							var property = child.argument.property.name;
							var value_key = "someValue";
							var obj_name = child.argument.object.name;
							functionConstraints[funcName].constraints.push(
								new Constraint(
								{
									ident: obj_name,
									value:  obj_name+"={"+property+":'"+String(value_key)+"'}",
									funcName: funcName,
									kind: "Object",
									operator : child.operator,
									expression: expression
								}));
						}
					}

				}
				
			});

			//console.log( functionConstraints[funcName]);

		}
	});
}

function traverse(object, visitor) 
{
    var key, child;

    visitor.call(null, object);
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}

function traverseWithCancel(object, visitor)
{
    var key, child;

    if( visitor.call(null, object) )
    {
	    for (key in object) {
	        if (object.hasOwnProperty(key)) {
	            child = object[key];
	            if (typeof child === 'object' && child !== null) {
	                traverseWithCancel(child, visitor);
	            }
	        }
	    }
 	 }
}

function functionName( node )
{
	if( node.id )
	{
		return node.id.name;
	}
	return "";
}


if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

main();
