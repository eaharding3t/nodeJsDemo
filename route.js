//Called from the server when a request is recieved. Calls the correct handler.
function route(handle, connection, pathname, getData, response)
{
	if( typeof handle[pathname] === 'function')
	{
 		handle[pathname](connection, getData, response);
	}
	else if(handle[pathname] === '')
	{
		handle['onLoad'](connection, getData, response);
	}
	else
	{
		response.writeHead(200, {"Content-Type" : "text/plain"});
		response.write("404 not found");
		response.end();
	}
}
exports.route = route;