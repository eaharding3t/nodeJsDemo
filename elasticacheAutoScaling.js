var AWS = require("aws-sdk");
var memcached = require("memcached");
function autoScaling(cpuPercent, cacheName, timeBeforeNextScale, cache)
{
	AWS.config.loadFromPath('/var/www/html/repo/nodeJsDemo/config.json');
	var elasticache = new AWS.ElastiCache();
	var params = {
		CacheClusterId: cacheName
	};
	elasticache.describeCacheClusters(params, function(err, data){
			var nodeNum = data['CacheClusters'][0]['NumCacheNodes'];
			checkSleep(cache,  function(sleepy){
				if(sleepy != 'true'){
					var averageCPU = 0;
					checkCPU(nodeNum, averageCPU, function(averageCPU){
						if(averageCPU <= cpuPercent)
						{
							nodeNum+=1;
							scaleCluster(elasticache, nodeNum,true, function(){
								sleepExecution(timeBeforeNextScale, cache);
							});
						}
						else if (averageCPU > cpuPercent)
						{
							nodeNum=nodeNum-1;
							if(nodeNum > 0){
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
function checkCPU(nodeNum, averageCPU,  callback)
{
	var tasksCompleted = 0;
	var cloudWatch = new AWS.CloudWatch();
	for(var i = 0; i < nodeNum; i++)
		{
			var val = '000'+String(i+1);
			var startDate = new Date();
			startDate.setMinutes(startDate.getMinutes()-2);
			var endDate = new Date();
			params = {
				Namespace: 'AWS/ElastiCache',
				Period: 120,
				MetricName: 'FreeableMemory',
				Dimensions: [
				{Name: 'CacheClusterId',Value: 'poc-eh-memcache'},
				{Name: 'CacheNodeId', Value: val} 
				],
				Statistics: [
					'Average'
				],
				StartTime: startDate,
				EndTime: endDate,
				Unit: 'Bytes'
			};
			cloudWatch.getMetricStatistics(params, function(err,data){
				if(err){throw err;}
				else{
					averageCPU+=data['Datapoints'][0]['Average'];
					if(tasksCompleted == (nodeNum-1))
					{
						averageCPU = averageCPU/nodeNum;
						callback(averageCPU);
					}
					else{tasksCompleted++;}
				}
			});
		}
}
function scaleCluster(elasticache, nodeNum, direction, callback)
{
	var nodeId = String(nodeNum+1);
	var stringLength = 4 - nodeId.length;
	for(var i = 0; i<stringLength; i++)
	{
		nodeId = '0'+nodeId;
	}
	var params = {};
	if(direction){
		params = {
			CacheClusterId: 'poc-eh-memcache',
			NumCacheNodes: nodeNum,
			ApplyImmediately: true,
		};
	}
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
function sleepExecution(cacheEngineType, timeBeforeNextScale, cache){
	cache.set('sleep', 'true', timeBeforeNextScale, function(err){
		cache.end();
	});
}
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
