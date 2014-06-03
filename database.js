var mongojs = require("mongojs");
var hardCoded = require("./hardCoded");
var mySqlQuery = require("./mySqlQuery");
var awsQuery = require("./awsQuery");
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
			var uri = "mongodb://root:password@ds033699.mongolab.com:33699/ke_db",
    			db = mongojs.connect(uri, ["subject", "courseID", "section"]);

			if(functionCalledFrom.length == 1) {
				db.subject.find({}, function(err, docs) {
					for (var i=0; i<docs.length; i++) {
						htmlString += '<option value="' + docs[i]["subjectID"] + '">' + docs[i]["subjectName"] + "</option>";					
   					}
    				callback(htmlString);
				});
			}

			if(functionCalledFrom.length == 2) {
				db.courseID.find({subjectID:getData[functionCalledFrom[1]]}, function(err, docs) {
    				for (var i=0; i<docs.length; i++) {
    					htmlString += '<option value="' + docs[i]["courseID"] + '">' + docs[i]["courseName"] + "</option>";
    				}
    				callback(htmlString);
				});
			}

			if(functionCalledFrom.length == 3) {
				db.section.find({courseID:getData[functionCalledFrom[1]], subjectID:getData[functionCalledFrom[2]]}, function(err, docs) {    
    				for (var i=0; i<docs.length; i++) {
    					htmlString += '<option value="' + docs[i]["sectionID"] + '">' + String(docs[i]["sectionName"]) + "</option>";
    				}
    				callback(htmlString);
				});
			}
		}
	}
}
exports.queryDB = queryDB;