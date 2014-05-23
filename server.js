var http = require('http');
var url = require('url');
var mysql = require('mysql');
//Called when server first starts
// Opens connection to database and creates the listeners
function start(handle, route)
{
	var connection = mysql.createConnection({
	host : '127.0.0.1',
	database: 'test',
	user : 'root',
	password: 'He18272752!'
	});
	//Called when a request hits the server.
	//Takes getData from the request then makes a call to the router to deal with callbacks
	function onRequest(request, response)
	{
		var getData = "";
		var pathname = url.parse(request.url).pathname;
		getData = url.parse(request.url, true).query;
		route(handle ,connection,  pathname, getData, response);
		
	}
	http.createServer(onRequest).listen(1337,'localhost');
}
exports.start = start;
