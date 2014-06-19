var AWS = require("aws-sdk");
var memcached = require("memcached");
function autoScaling(memoryRemaining, cacheName, timeBeforeNextScale, cache)
{
	AWS.config.update({"accessKeyId": process.env.AWS_ACCESS_KEY_ID, "secretAccessKey": process.env.AWS_SECRET_KEY, "region": "us-east-1"});
	var elasticache = new AWS.ElastiCache();
	var params = {
		CacheClusterId: cacheName
	};
	//Provides the number of cache nodes we currently have (and other data) so that scaling actions can be taken.
	elasticache.describeCacheClusters(params, function(err, data){
			var nodeNum = data['CacheClusters'][0]['NumCacheNodes'];
			//Ensures that no scaling activity has happened so recently that this scaling action is not illegal
			checkSleep(cache,  function(sleepy){
				if(sleepy != 'true'){
					var totalMemoryRemaining = 0;
					//Checks the average amount of space available to the cluster over the past 2 minutes
					checkMemory(nodeNum, totalMemoryRemaining, function(totalMemoryRemaining){
						if(totalMemoryRemaining <= memoryRemaining)
						{
							nodeNum+=1;
							//Scales the number of nodes up by one node and then sets the sleep flag so that no more scaling can happen for the next X seconds
							scaleCluster(elasticache, nodeNum,true, function(){
								sleepExecution(timeBeforeNextScale, cache);
							});
						}
						else if (totalMemoryRemaining > memoryRemaining)
						{
							nodeNum=nodeNum-1;
							if(nodeNum > 0){
								//Scales the number of nodes down by one if there are two or more nodes and then sets the sleep flag so that no more
								//scaling can happen for the next X seconds
								scaleCluster(elasticache,nodeNum,false, function(){
									sleepExecution(timeBeforeNextScale, cache);
								});
							}
						}
						else{
						}
					});
				}
			});
	});
}
//Checks the average amound of space available to the cluster over the past 2 minutes
function checkMemory(nodeNum, totalMemoryRemaining,  callback)
{
	var tasksCompleted = 0;
	var cloudWatch = new AWS.CloudWatch();
	//Loops through all of the memcache nodes
	for(var i = 0; i < nodeNum; i++)
		{
			var nodeId = String(nodeNum+1);
			var stringLength = 4 - nodeId.length;
			for(var i = 0; i<stringLength; i++){
				nodeId = '0'+nodeId;
			}
			var startDate = new Date();
			startDate.setMinutes(startDate.getMinutes()-2);
			var endDate = new Date();
			params = {
				Namespace: 'AWS/ElastiCache',
				Period: 120,
				MetricName: 'FreeableMemory',
				Dimensions: [
				{Name: 'CacheClusterId',Value: 'poc-eh-memcache'},
				{Name: 'CacheNodeId', Value: nodeId} 
				],
				Statistics: [
					'Average'
				],
				StartTime: startDate,
				EndTime: endDate,
				Unit: 'Bytes'
			};
			//Gets the amount of avalible memory remaining in the cache node
			cloudWatch.getMetricStatistics(params, function(err,data){
				if(err){throw err;}
				else{
					totalMemoryRemaining+=data['Datapoints'][0]['Average'];
					if(tasksCompleted == (nodeNum-1))
					{
						callback(totalMemoryRemaining);
					}
					else{tasksCompleted++;}
				}
			});
		}
}
//Scales the number of memcache nodes up or down depending on memory consumpsion
function scaleCluster(elasticache, nodeNum, direction, callback)
{
	var nodeId = String(nodeNum+1);
	var stringLength = 4 - nodeId.length;
	for(var i = 0; i<stringLength; i++)
	{
		nodeId = '0'+nodeId;
	}
	var params = {};
	//Params for upscaling
	if(direction){
		params = {
			CacheClusterId: 'poc-eh-memcache',
			NumCacheNodes: nodeNum,
			ApplyImmediately: true,
		};
	}
	//Params for downscaling
	else{ 
		params = {
			CacheClusterId: 'poc-eh-memcache',
			NumCacheNodes: nodeNum,
			ApplyImmediately: true,
			CacheNodeIdsToRemove: [nodeId]
		};
	}
	elasticache.modifyCacheCluster(params, function(err, data){
	});
	callback();
}
//Sets the sleep flag in the cache to true for the next X seconds
function sleepExecution(cacheEngineType, timeBeforeNextScale, cache){
	cache.set('sleep', 'true', timeBeforeNextScale, function(err){
		cache.end();
	});
}
//Checks to see if the sleep flag is true to determine if scaling can occur
function checkSleep(cache, callback){
	cache.get('sleep', function(err,data){
		if(err){throw err;}
		else{
			if(data == 'true'){
				cache.end();}
			callback(data);
		}
	}); 
}
exports.autoScaling = autoScaling;
