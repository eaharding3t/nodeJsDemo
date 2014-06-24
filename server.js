var http = require('http');
var url = require('url');
var mysql = require('mysql');
var os = require('os');
var memcache = require("memcached");
var AWS = require("aws-sdk");
var redis = require("redis");
var elasticacheAutoScaling = require("./elasticacheAutoScaling.js");
var elasticacheAutoScalingRedis = require("./elasticacheAutoScalingRedis.js");
var port = process.env.PORT;
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
	http.createServer(onRequest).listen(port, os.hostname());
	AWS.config.update({"accessKeyId": process.env.AWS_ACCESS_KEY_ID, "secretAccessKey": process.env.AWS_SECRET_KEY, "region": "us-east-1"});
        var memConfig = new AWS.ElastiCache();
	//If the config file says that the engine is redis, a conection to the redis node is established and every minute it checks to see if a new read replica is needed. 
	if(process.env.CACHE_AUTOSCALING_TYPE == 'redis'){
		
        var cache = redis.createClient(6379, "pocredis.2020ar.com");
        cache.get('lock', function(err,data){
        	if(err){throw err;}
        	else{
        		if(data != 'true'){
        			cache.set('lock', 'true', function(){});
					setInterval(function(){
						elasticacheAutoScalingRedis.autoScalingRedis(100, 'poc-eh-redis-rep', 300, cache, 60000);
        	         });
        	   }
            }
        });
    }
	//If the config file says that the engine is memcache, all of the nodes in the cluster are found and a connection is generated to all of them and every
	//minute it checks to see if a new node is needed.
	else if(process.env.CACHE_AUTOSCALING_TYPE == 'memcache'){
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
        	var lockCheck = new memcache(nodes);
        	lockCheck.get('lock', function(err,data){
        		if(err){throw err;}
        		else{
        			if(data != 'true'){
        				lockCheck.set('lock', 'true', 0,  function(){});
        				setInterval(function(){
							//The following set of calls (memConfig.describeCacheClusters plus callback) allows you to connect to all memcahce nodes in the cache cluster
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
								elasticacheAutoScaling.autoScaling(2000000, 'poc-eh-memcache', 300, cache);
							});
						}, 60000);
        			}
        		}
        	});
	});
}
}
exports.start = start;
