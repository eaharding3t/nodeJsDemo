var http = require('http');
var url = require('url');
var mysql = require('mysql');
var os = require('os');
//Called when server first starts
// Creates the listeners and calls route
function start(handle, route)
{
	//Called when a request hits the server.
	//Takes getData from the request then makes a call to the router to deal with callbacks
	function onRequest(request, response)
	{
		var getData = "";
		var pathname = url.parse(request.url).pathname;
		getData = url.parse(request.url, true).query;
		if(getData['loadTest'])
		{
			var connection = mysql.createConnection({
				host : "",
				database: "",
				user: "",
				password: ""
			});
			connection.query("Select * from course",function(error,rows,feilds){
				route(handle, pathname, getData, response);
			});
		}
		else{
			route(handle ,pathname, getData, response);
		}
		
	}
	http.createServer(onRequest).listen(1337, os.hostname());
}
exports.start = start;
