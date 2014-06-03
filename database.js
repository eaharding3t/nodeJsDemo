var hardCoded = require("./hardCoded");
var mySqlQuery = require("./mySqlQuery");
var awsQuery = require("./awsQuery");
var mongoQuery = require("./mongoQuery");
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
			mySqlQuery.mySqlQuery(getData, htmlString, functionCalledFrom, callback);
		}
		//Dynamodb for different database change the config.json file
		else if(databaseType == 2)
		{
			awsQuery.awsQuery(getData, htmlString, functionCalledFrom, callback);
		}
		//MongoDB
		else if (databaseType == 3)
		{
			mongoQuery.mongoQuery(getData, htmlString, functionCalledFrom, callback);
		}
	}
}
exports.queryDB = queryDB;