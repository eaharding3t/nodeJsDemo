var redis = require("redis");
var AWS = require("aws-sdk");
function autoScaling(cpuPercent, cacheName, timeBeforeNextScale, cache)
{
	AWS.config.loadFromPath('/var/www/html/repo/nodeJsDemo/config.json');
	var elasticache = new AWS.ElastiCache();
	var params = {
		ReplicationGroupId: 'poc-eh-redis-rep'
	};
	elasticache.describeReplicationGroups(params, function(err, data){
		var nodeNum = data['ReplicationGroups'][0]['MemberClusters'].length;
		checkSleep(cache, function(sleepy){
			if(sleepy != 'true'){
				var readAttempts = 0;
				checkReads(nodeNum, readAttempts, data, function(readAttempts){
					if(readAttempts >= cpuPercent){
						nodeNum+=1;
						scaleReadReplicas(elasticache, nodeNum, function(){
							sleepExecution(timeBeforeNextScale, cache);
						});
					}
					else if(readAttempts < cpuPercent){
						if(nodeNum>1){
							descaleReadReplicas(elasticache, nodeNum, function(){
								sleepExecution(timeBeforeNextScale, cache);
							});
						}
					}
				});
			}
		});
	});
}
function checkReads(nodeNum, readAttempts, clustersData, callback){
	var tasksCompleted = 0;
	var cloudWatch = new AWS.CloudWatch();
	for(var i = 0; i<nodeNum; i++){
		var startDate = new Date();
		startDate.setMinutes(startDate.getMinutes()-2);
		var endDate = new Date();
		var params = {
			Namespace: 'AWS/ElastiCache',
			Period: 120,
			MetricName: 'GetTypeCmds',
			Dimensions: [
				{Name: 'CacheClusterId', Value: clustersData['ReplicationGroups'][0]['MemberClusters'][0]},
				{Name: 'CacheNodeId', Value: '0001'}
			],
			Statistics: [
				'Average'
			],
			StartTime: startDate,
			EndTime: endDate,
			Unit: 'Count'
		};
		cloudWatch.getMetricStatistics(params, function(err,data){
			if(err){throw err;}
			else{
				readAttempts += data['Datapoints'][0]['Average'];
				if(tasksCompleted == (nodeNum-1)){
					callback(readAttempts);
				}
			}
		});
	}
}
function scaleCluster(elasticache, nodeNum, callback){
	var nodeID = String(nodeNum);
	var params = {
		CacheClusterId: nodeID,
		ReplicationGroupId: 'cacheName',
		NumCacheNodes: 1,
		CacheNodeType: 'cache.t1.micro',
		Engine: 'redis',
		CacheSubnetGroupName: 'default',
		SecurityGroupIds: ['sg-12254277'],
		PreferredAvailabilityZone: 'us-east-1a',
		Port: 6379
	};
	elasticache.createCacheCluster(params, function(err, data){
	}); 
	callback();
}
function descaleCluster(elasticache, nodeNum, callback){
	var nodeID = String(nodeNum);
	var params = {
		CacheClusterId: nodeID
	};
	deleteCacheCluster(params, function(err, data){
	});
	callback();
}
function sleepExecution(timeBeforeNextScale, cache){
	cache.set('sleep', 'true', function(err){
		cache.expire('sleep', timeBeforeNextScale, function(err){
			cache.quit();
		});
	});
}
function checkSleep(cache, callback){
	cache.get('sleep', function(err, data){
		if(err){throw err;}
		else{
			if(data == 'true'){
				cahce.quit();
			}
			callback(data);
		}
	});
}
exports.autoScalingRedis = autoScaling;
