var AWS = require("aws-sdk");
var memcached = require("memcached");
var redis = require("redis");
function autoScaling(cpuPercent, cacheName, timeBeforeNextScale, cache)
{
	AWS.config.loadFromPath('/var/www/html/repo/nodeJsDemo/config.json');
	var elasticache = new AWS.ElastiCache();
	var params = {
		CacheClusterId: cacheName
	};
	elasticache.describeCacheClusters(params, function(err, data){
			var nodeNum = data['CacheClusters'][0]['NumCacheNodes'];
			var engineType = data['CacheClusters'][0]['Engine'];
			checkSleep(data['CacheClusters'][0]['Engine'],cache,  function(data){
				if(!data){
					console.log(data);
					var averageCPU = 0;
					checkCPU(nodeNum, averageCPU, engineType, function(averageCPU, engineType){
						if(averageCPU <= cpuPercent)
						{
							console.log("test");
							nodeNum+=1;
							scaleCluster(elasticache, nodeNum, function(){
								sleepExecution(engineType, timeBeforeNextScale, cache);
							});
						}
						else if (averageCPU > cpuPercent)
						{
							nodeNum=nodeNum-1;
							console.log(nodeNum);
							if(nodeNum > 0){
								scaleCluster(elasticache,nodeNum,function(){
									sleepExecution(engineType, timeBeforeNextScale, cache);
								});
							}
						}
						else{
							console.log("test");
						}
					});
				}
			});
	});
}
function checkCPU(nodeNum, averageCPU, engineType, callback)
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
				Period: 60,
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
						callback(averageCPU, engineType);
					}
					else{tasksCompleted++;}
				}
			});
		}
}
function scaleCluster(elasticache, nodeNum, callback)
{
	var nodeId = String(nodeNum+1);
	var stringLength = 4 - nodeId.length;
	for(var i = 0; i<stringLength; i++)
	{
		nodeId = '0'+nodeId;
	}
	console.log(nodeId);
	console.log(nodeNum);
	params = {
		CacheClusterId: 'poc-eh-memcache',
		NumCacheNodes: nodeNum,
		ApplyImmediately: true,
		CacheNodeIdsToRemove: [nodeId]
	};
	elasticache.modifyCacheCluster(params, function(err, data){
	});
	callback();
}
function sleepExecution(cacheEngineType, timeBeforeNextScale, cache){
	if(cacheEngineType == 'redis')
	{
		cache.set('sleep', 'true', function(err){
			cache.expire('sleep', timeBeforeNextScale, function(err){
				cache.quit();
			});
		});
	}
	else{
		cache.set('sleep', 'true', timeBeforeNextScale, function(err){
			cache.end();
		});
	}
}
function checkSleep(cacheEngineType,cache, callback){
	if(cacheEngineType == 'redis'){
		cache.get('sleep', function(err,data){
			if(err){throw err;}
			else{
				if(data == 'true'){
					cache.quit();}
				callback(data);
			}
		});
	}
	else{
		cache.get('sleep', function(err,data){
			if(err){throw err;}
			else{
				if(data == 'true'){
					cache.end();}
				callback(data);
			}
		});
	} 
}
exports.autoScaling = autoScaling;
