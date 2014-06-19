//All of these requires allow the functions that are written in different files to be passed between files
require('newrelic');
var server = require("./server");
var router = require("./route");
var handlers = require("./handlers");
var handle = {};
//These handles to functions allow the node server to tell when it hits a valid (handled) route
handle['/onLoading'] = handlers.onLoading;
handle['/subjectExpand'] = handlers.subjectExpand;
handle['/courseExpand'] = handlers.courseExpand;
handle['/sectionExpand'] = handlers.sectionExpand;
handle['/fileUpload'] = handlers.fileUpload;
handle['/loadTest'] = handlers.loadTest;
handle['/cacheIt'] = handlers.cacheIt;
handle['/sqs'] = handlers.sqs;
//Calls the function in server that listens on port 1337
server.start(handle, router.route);
