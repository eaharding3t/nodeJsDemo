//All of these requires allow the functions that are written in different files to be passed between files
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
server.start(handle, router.route);
