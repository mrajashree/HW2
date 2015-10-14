var subject = require('./subject.js')
var mock = require('mock-fs');
subject.inc('nde-000-0000',undefined);
subject.inc('nde-000-0000',undefined);
subject.inc('nde-000-0000',"something");
subject.inc(-1,undefined);
subject.inc(-1,undefined);
subject.inc(-1,"something");
subject.inc(1,undefined);
subject.inc(1,undefined);
subject.inc(1,"something");
subject.weird(8,-1,41,"strict");
subject.weird(8,-1,41,"strict");
subject.weird(8,-1,41,"something");
subject.weird(8,-1,41,'werv');
subject.weird(8,-1,41,'heyywerv');
subject.weird(8,-1,43,"strict");
subject.weird(8,-1,43,"strict");
subject.weird(8,-1,43,"something");
subject.weird(8,-1,43,'werv');
subject.weird(8,-1,43,'heyywerv');
subject.weird(8,1,41,"strict");
subject.weird(8,1,41,"strict");
subject.weird(8,1,41,"something");
subject.weird(8,1,41,'werv');
subject.weird(8,1,41,'heyywerv');
subject.weird(8,1,43,"strict");
subject.weird(8,1,43,"strict");
subject.weird(8,1,43,"something");
subject.weird(8,1,43,'werv');
subject.weird(8,1,43,'heyywerv');
subject.weird(6,-1,41,"strict");
subject.weird(6,-1,41,"strict");
subject.weird(6,-1,41,"something");
subject.weird(6,-1,41,'werv');
subject.weird(6,-1,41,'heyywerv');
subject.weird(6,-1,43,"strict");
subject.weird(6,-1,43,"strict");
subject.weird(6,-1,43,"something");
subject.weird(6,-1,43,'werv');
subject.weird(6,-1,43,'heyywerv');
subject.weird(6,1,41,"strict");
subject.weird(6,1,41,"strict");
subject.weird(6,1,41,"something");
subject.weird(6,1,41,'werv');
subject.weird(6,1,41,'heyywerv');
subject.weird(6,1,43,"strict");
subject.weird(6,1,43,"strict");
subject.weird(6,1,43,"something");
subject.weird(6,1,43,'werv');
subject.weird(6,1,43,'heyywerv');
subject.weird('str-000-0000',-1,41,"strict");
subject.weird('str-000-0000',-1,41,"strict");
subject.weird('str-000-0000',-1,41,"something");
subject.weird('str-000-0000',-1,41,'werv');
subject.weird('str-000-0000',-1,41,'heyywerv');
subject.weird('str-000-0000',-1,43,"strict");
subject.weird('str-000-0000',-1,43,"strict");
subject.weird('str-000-0000',-1,43,"something");
subject.weird('str-000-0000',-1,43,'werv');
subject.weird('str-000-0000',-1,43,'heyywerv');
subject.weird('str-000-0000',1,41,"strict");
subject.weird('str-000-0000',1,41,"strict");
subject.weird('str-000-0000',1,41,"something");
subject.weird('str-000-0000',1,41,'werv');
subject.weird('str-000-0000',1,41,'heyywerv');
subject.weird('str-000-0000',1,43,"strict");
subject.weird('str-000-0000',1,43,"strict");
subject.weird('str-000-0000',1,43,"something");
subject.weird('str-000-0000',1,43,'werv');
subject.weird('str-000-0000',1,43,'heyywerv');
mock({"path/fileExists":{},"path/fileExistswithContents":{"file_content.txt":"fileContents"},"pathContent":{"file1":"text content","file2":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"pathContent":{"file1":"text content","file2":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{},"path/fileExistswithContents":{"file_content.txt":"fileContents"}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{},"path/fileExistswithContents":{"file_content.txt":"fileContents"},"pathContent":{"file1":"text content","file2":""}});
	subject.fileTest('path/fileExists','pathContent/file2');
mock.restore();
mock({"pathContent":{"file1":"text content","file2":""}});
	subject.fileTest('path/fileExists','pathContent/file2');
mock.restore();
mock({"path/fileExists":{},"path/fileExistswithContents":{"file_content.txt":"fileContents"}});
	subject.fileTest('path/fileExists','pathContent/file2');
mock.restore();
mock({});
	subject.fileTest('path/fileExists','pathContent/file2');
mock.restore();
mock({"path/fileExists":{},"path/fileExistswithContents":{"file_content.txt":"fileContents"},"pathContent":{"file1":"text content","file2":""}});
	subject.fileTest('path/fileExistswithContents','pathContent/file1');
mock.restore();
mock({"pathContent":{"file1":"text content","file2":""}});
	subject.fileTest('path/fileExistswithContents','pathContent/file1');
mock.restore();
mock({"path/fileExists":{},"path/fileExistswithContents":{"file_content.txt":"fileContents"}});
	subject.fileTest('path/fileExistswithContents','pathContent/file1');
mock.restore();
mock({});
	subject.fileTest('path/fileExistswithContents','pathContent/file1');
mock.restore();
mock({"path/fileExists":{},"path/fileExistswithContents":{"file_content.txt":"fileContents"},"pathContent":{"file1":"text content","file2":""}});
	subject.fileTest('path/fileExistswithContents','pathContent/file2');
mock.restore();
mock({"pathContent":{"file1":"text content","file2":""}});
	subject.fileTest('path/fileExistswithContents','pathContent/file2');
mock.restore();
mock({"path/fileExists":{},"path/fileExistswithContents":{"file_content.txt":"fileContents"}});
	subject.fileTest('path/fileExistswithContents','pathContent/file2');
mock.restore();
mock({});
	subject.fileTest('path/fileExistswithContents','pathContent/file2');
mock.restore();
mock({"path/fileExists":{},"path/fileExistswithContents":{"file_content.txt":"fileContents"},"pathContent":{"file1":"text content","file2":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"pathContent":{"file1":"text content","file2":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{},"path/fileExistswithContents":{"file_content.txt":"fileContents"}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{},"path/fileExistswithContents":{"file_content.txt":"fileContents"},"pathContent":{"file1":"text content","file2":""}});
	subject.fileTest('path/fileExists','pathContent/file2');
mock.restore();
mock({"pathContent":{"file1":"text content","file2":""}});
	subject.fileTest('path/fileExists','pathContent/file2');
mock.restore();
mock({"path/fileExists":{},"path/fileExistswithContents":{"file_content.txt":"fileContents"}});
	subject.fileTest('path/fileExists','pathContent/file2');
mock.restore();
mock({});
	subject.fileTest('path/fileExists','pathContent/file2');
mock.restore();
mock({"path/fileExists":{},"path/fileExistswithContents":{"file_content.txt":"fileContents"},"pathContent":{"file1":"text content","file2":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"pathContent":{"file1":"text content","file2":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{},"path/fileExistswithContents":{"file_content.txt":"fileContents"}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{},"path/fileExistswithContents":{"file_content.txt":"fileContents"},"pathContent":{"file1":"text content","file2":""}});
	subject.fileTest('path/fileExists','pathContent/file2');
mock.restore();
mock({"pathContent":{"file1":"text content","file2":""}});
	subject.fileTest('path/fileExists','pathContent/file2');
mock.restore();
mock({"path/fileExists":{},"path/fileExistswithContents":{"file_content.txt":"fileContents"}});
	subject.fileTest('path/fileExists','pathContent/file2');
mock.restore();
mock({});
	subject.fileTest('path/fileExists','pathContent/file2');
mock.restore();
subject.normalize('1-850-161-0698 x4228');
subject.format('840-045-4270 x79077','840-045-4270 x79077',options={normalize:'someValue'});
subject.format('840-045-4270 x79077','840-045-4270 x79077','840-045-4270 x79077');
subject.blackListNumber('601-995-6575');
subject.blackListNumber('212-000-0000');
