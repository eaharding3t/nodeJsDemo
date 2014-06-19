var memcached = require('memcached');
var redis = require('redis');
var AWS = require('aws-sdk');
function cacheLoadTest(){
    var memConfig = new AWS.ElastiCache();
	var params = {
        CacheClusterId: 'poc-eh-memcache',
        ShowCacheNodeInfo: true
    };
    var nodes = [];
    memConfig.describeCacheClusters(params, function(err,data){
        if(err){throw err;}
        for(var i = 0; i<data['CacheClusters'][0]['CacheNodes'].length; i++){
            nodes[i] = String(data['CacheClusters'][0]['CacheNodes'][i]['Endpoint']['Address'] +':'+data['CacheClusters'][0]['CacheNodes'][i]['Endpoint']['Port']);
        }
        var cache = new memcache(nodes);
        for(var i = 0; i<10000; i++){
    	   var key = "key" + String(i);
    	   var value = String(i);
    	   cache.set(key, value, 120, function(err){
    	   });
        }
    });
}
function redisLoadTest(){
    var memConfig = new AWS.ElastiCache();
	var params = {
        ReplicationGroupId: 'poc-eh-redis-rep'
    };
    var cache;
    memConfig.describeReplicationGroups(params, function(err,data){
        var nodeNum = data['ReplicationGroups'][0]['MemberClusters'].length;
        for(var i = 0; i < nodeNum; i++){
            var id = data['ReplicationGroups'][0]['MemberClusters'][i]['ReplicationGroupId'];
            params = {
                CacheClusterId: id
            };
            memConfig.describeCacheClusters(params, function(err, data){
                for(var w = 0; w < 250; w++){
                    cache = redis.createClient(6379, data['CacheClusters'][0]['CacheNodes'][0]['Endpoint']['Address']);
                    cache.get('test', function(err, data){
                    });
                }
            })
        }
    });
}