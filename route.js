//Called from the server when a request is recieved. Calls the correct handler. If no handler is present it returns the start page.
function route(handle, pathname, getData, response)
{
	if (typeof handle[pathname] === 'function') {
 		handle[pathname](getData, response);
	}	
	else {
		response.writeHead(200, {"Content-Type" : "text/html"});
		var htm= '<!DOCTYPE html><html><head><script type = "text/javascript" src="./script.js">'

					+'</script></head>'
					+'<body onload="onLoading()">'
					+'<div id = "subjectList">testing this subject</div>'
					+'<div id = "classList">testing this class</div>'
					+'<div id = "sectionList">testing this section</div>'
					+'<div id = "detailsList">testing these details</div>'
					+'</body>'
					+'</html>';
		response.write(htm);
		response.end();
	}
}
exports.route = route;
