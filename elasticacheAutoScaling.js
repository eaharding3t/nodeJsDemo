function autoScaling(cpuPercent, cacheName, timeBeforeNextScale)
{
	AWS.config.loadFromPath('/var/www/html/repo/nodeJsDemo/config.json');
	var elasticache = new ElastiCache();
	var params = {
		CacheClusterId: cacheName
	};
	elasticache.describeCacheClusters(params, function(err, data){
			//checkSleep(data['CacheClusters'][0]['Engine'], fuction(data){
			//if(!data){
				var cloudWatch = new AWS.CloudWatch();
				var averageCPU = 0;
				var tasksCompleted = 0;
				var nodeNum = data['CacheClusters'][0]['NumCacheNodes'];
				checkCPU(nodeNum, function(averageCPU){
					if(averageCPU >= cpuPercent)
					{
						console.log("test");
						nodeNum+=1;
						//scaleCluster(elasticache, nodeNum, function(){
							//sleepExecution(data['CacheClusters'][0]['Engine'], timeBeforeNextScale);
						//});
					}
					else if (averageCPU < cpuPercent)
					{
						nodeNum=nodNum-1;
						console.log("test");
						//scaleCluster(elasticache,nodeNum,function(){
							//sleepExecution(data['CacheClusters'][0]['Engine'], timeBeforeNextScale);
						//});
					}
				});
			//}
		//});
	});
}
	
}
function checkCPU(nodeNum, callback)
{
	var tasksCompleted = 0;
	for(int i = 0; i < nodeNum; i++)
		{
			var val = '000'+String(i);
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
				StartTime: 'Thu Jun 12 2014 10:00:00 GMT-0800 (PST)',
				EndTime: 'Thu Jun 12 2014 12:00:00 GMT-0800 (PST)',
				Unit: 'Bytes'
			};
			cloudWatch.getMetricStatistics(params, function(err,data){
				if(err){throw err;}
				else{
					averageCPU+=data['Datapoints'][0]['Average'];
					if(tasksCompleted == (nodeNum-1)
					{
						averageCPU = averageCPU/nodeNum;
						callback(averageCPU);
					}
					else{tasksCompleted++;}
				}
			});
		}
}
function scaleCluster(elasticache, nodeNum, callback)
{
	params = {
		CacheClusterId: 'poc-eh-memcache',
		NumCacheNodes: nodNum,
		ApplyImmediately: true
	};
	elasticache.modifyCacheCluster(params, function(err, data){
	});
	callback();
}
function sleepExecution(cacheEngineType, timeBeforeNextScale){
	if(cacheEngineType == 'redis')
	{
		var cache = redis.createClient(6379, "pocreids.2020ar.com");
		cache.set('sleep', 'true', function(err){
			cache.expire('sleep', timeBeforeNextScale, function(err){
			});
		});
	}
	else{
		var cache = memcache("pocmemcache.2020ar.com");
		cache.set('sleep', 'true', timeBeforeNextScale, function(err){

		});
	}
}
function checkSleep(cacheEngineType, callback){
	if(cacheEngineType == 'redis'){
		var cache = redis.createClient(6379,"pocreids.2020ar.com");
		cache.get('sleep', function(err,data){
			if(err){throw err;}
			else{
				cache.quit();
				callback(data);
			}
		});
	}
	else{
		var cache = memcache("pocmemcache.2020ar.com");
		cache.get('sleep', function(err,data){
			if(err){throw err;}
			else{
				cache.end();
				callback(data);
			}
		});
	} 
}