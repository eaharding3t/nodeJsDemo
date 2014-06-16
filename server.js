var http = require('http');
var url = require('url');
var mysql = require('mysql');
var os = require('os');
var memcache = require("memcached");
var AWS = require("aws-sdk");
var elasticacheAutoScaling = require("./elasticacheAutoScaling.js");
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
		route(handle ,pathname, getData, response);	
	}
	http.createServer(onRequest).listen(1337, os.hostname());
	AWS.config.loadFromPath('/var/www/html/repo/nodeJsDemo/config.json');
        var memConfig = new AWS.ElastiCache();
	setInterval(function(){
        	var params = {
        		CacheClusterId: 'poc-eh-memcache',
        		ShowCacheNodeInfo: true
        	};
        	var nodes = [];
        	memConfig.describeCacheClusters(params, function(err,data){
        		if(err){throw err;}
                	for(var i = 0; i<data['CacheClusters'][0]['CacheNodes'].length; i++)
                	{
                		nodes[i] = String(data['CacheClusters'][0]['CacheNodes'][i]['Endpoint']['Address'] +':'+data['CacheClusters'][0]['CacheNodes'][i]['Endpoint']['Port']);
                	}
        		var cache = new memcache(nodes);
			console.log("testing");
			elasticacheAutoScaling.autoScaling(2000000, 'poc-eh-memcache', 300, cache);
		});
	}, 5000);
}
exports.start = start;
