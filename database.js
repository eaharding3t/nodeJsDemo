var mongojs = require("mongojs");
var hardCoded = require("./hardCoded");
var mySqlQuery = require("./mySqlQuery");
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
			var uri = "mongodb://root:password@ds033699.mongolab.com:33699/ke_db",
    			db = mongojs.connect(uri, ["classDB"]);

			if(functionCalledFrom.length == 1) {
				db.classDB.find().sort({subject:''}, function(err, docs) {
					var last = "";
					var next = "";
					for (var i=0; i<docs.length; i++) {
    					next = docs[i]["subject"];
						if (next != last) {
							htmlString += '<option value="' + docs[i]["subject"] + '">' + String(docs[i]["subject"]) + "</option>";	
						}
						last = next;
    				}
    				callback(htmlString);
				});
			}

			if(functionCalledFrom.length == 2) {
				db.classDB.find({subject:getData[functionCalledFrom[1]]}).sort({classID:''}, function(err, docs) {
					var last = "";
					var next = ""; 
    				for (var i=0; i<docs.length; i++) {
    					next = docs[i]["classID"];
    					if (next != last) {
    						htmlString += '<option value="' + docs[i]["classID"] + '">' + String(docs[i]["classID"]) + "</option>";
    					}
    					last = next;
    				}
    				callback(htmlString);
				});
			}

			if(functionCalledFrom.length == 3) {
				db.classDB.find({classID:getData[functionCalledFrom[1]], subject:getData[functionCalledFrom[2]]}, function(err, docs) {    
    				for (var i=0; i<docs.length; i++) {
    					htmlString += '<option value="' + docs[i]["section"] + '">' + String(docs[i]["section"]) + "</option>";
    				}
    				callback(htmlString);
				});
			}
		}
	}
}
exports.queryDB = queryDB;