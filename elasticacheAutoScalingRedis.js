var redis = require("redis");
var AWS = require("aws-sdk");
function autoScaling(cpuPercent, cacheName, timeBeforeNextScale, cache)
{
	AWS.config.update({"accessKeyId": process.env.AWS_ACCESS_KEY_ID, "secretAccessKey": process.env.AWS_SECRET_KEY, "region": "us-east-1"});
	var elasticache = new AWS.ElastiCache();
	var params = {
		ReplicationGroupId: 'poc-eh-redis-rep'
	};
	//Grabs a description of the replication group so that the number of read replicas can be passed on
	elasticache.describeReplicationGroups(params, function(err, data){
		var nodeNum = data['ReplicationGroups'][0]['MemberClusters'].length;
		//Ensures that no scaling activity has happened so recently that this scaling action is not illegal
		checkSleep(cache, function(sleepy){
			if(sleepy != 'true'){
				var readAttempts = 0;
				//Checks the number of reads that have hit read replicas in the past 2 minutes
				checkReads(nodeNum, readAttempts, data, function(readAttempts){
					if(readAttempts >= cpuPercent){
						nodeNum+=1;
						//Scales the number of read replicas up with the following naming scheme: a1 (frist) a2 (scecond) etc. and then
						//sleeps scaling activity for the next X seconds
						scaleReadReplicas(elasticache, nodeNum, function(){
							sleepExecution(timeBeforeNextScale, cache);
						});
					}
					else if(readAttempts < cpuPercent){
						if(nodeNum>1){
							//Scales the number of read replicas down taking the most recent one down first and then
							//sleeps scaling activity for the next X seconds
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
//Reports the number of reads hitting read replicas in the past two minutes
function checkReads(nodeNum, readAttempts, clustersData, callback){
	var tasksCompleted = 0;
	var cloudWatch = new AWS.CloudWatch();
	//Loops through all cache clusters in the replication group
	for(var i = 0; i<nodeNum; i++){
		var startDate = new Date();
		startDate.setMinutes(startDate.getMinutes()-2);
		var endDate = new Date();
		var params = {
			Namespace: 'AWS/ElastiCache',
			Period: 120,
			MetricName: 'GetTypeCmds',
			Dimensions: [
				{Name: 'CacheClusterId', Value: clustersData['ReplicationGroups'][0]['MemberClusters'][i]['ReplicationGroupId']},
				{Name: 'CacheNodeId', Value: '0001'}
			],
			Statistics: [
				'Average'
			],
			StartTime: startDate,
			EndTime: endDate,
			Unit: 'Count'
		};
		//Queries cloudWatch for the number of hits on read replicas in the last two minutes
		cloudWatch.getMetricStatistics(params, function(err,data){
			if(err){throw err;}
			else{
				readAttempts += data['Datapoints'][0]['Average'];
				if(tasksCompleted == (nodeNum-1)){
					readAttempts = readAttempts/nodeNum;
					callback(readAttempts);
				}
			}
		});
	}
}
//Scales the number of read replicas up with the following naming scheme: a1 (frist) a2 (scecond) etc.
function scaleCluster(elasticache, nodeNum, callback){
	var nodeID = 'a'+ String(nodeNum);
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
//Scales the number of read replicas down taking the most recent one down first
function descaleCluster(elasticache, nodeNum, callback){
	var nodeID = 'a'+ String(nodeNum);
	var params = {
		CacheClusterId: nodeID
	};
	deleteCacheCluster(params, function(err, data){
	});
	callback();
}
//sleeps scaling activity for the next X seconds
function sleepExecution(timeBeforeNextScale, cache){
	cache.set('sleep', 'true', function(err){
		cache.expire('sleep', timeBeforeNextScale, function(err){
			cache.quit();
		});
	});
}
//Ensures that no scaling activity has happened so recently that this scaling action is not illegal
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
