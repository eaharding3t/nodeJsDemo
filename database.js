var hardCoded = require("./hardCoded");
var mySqlQuery = require("./mySqlQuery");
var mongoQuery = require("./mongoQuery");
var dynamoQuery = require("./dynamoQuery");
function queryDB(getData, htmlString, databaseType, functionCalledFrom)
{
	return function(callback, errback){
		//This is a hard-coded version of the sql database
		if(databaseType == 0){
			hardCoded.hardCoded(getData, htmlString, functionCalledFrom, callback);
		}
		//This call uses the data from a mysql server of your choice.
		else if (databaseType == 1)
		{
			console.log("test");
			mySqlQuery.mySqlQuery(getData, htmlString, functionCalledFrom, callback);
		}
		//Dynamodb for different database change the config.json file
		else if(databaseType == 2)
		{
			dynamoQuery.dynamoQuery(getData, htmlString, functionCalledFrom, callback);
		}
		//MongoDB
		else if (databaseType == 3)
		{
			mongoQuery.mongoQuery(getData, htmlString, functionCalledFrom, callback);
		}
	}
}
exports.queryDB = queryDB;