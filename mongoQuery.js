var mongojs = require("mongojs");
function mongoQuery(getData, htmlString, functionCalledFrom, callback) {
	var uri = "mongodb://root:password@ds033699.mongolab.com:33699/ke_db",
		db = mongojs.connect(uri, ["collection"]);

	//access db for subject list
	if(functionCalledFrom.length == 1) {
		db.collection.find().sort({subject:''}, function(err, docs) {
			var last = "";
			var next = "";
			for (var i=0; i<docs.length; i++) {
    			next = docs[i]["subject"];
				if (next != last) {
					htmlString += '<option value="' + docs[i]["subject"] + '">' + docs[i]["subject"] + "</option>";	
				}
				last = next;
    		}
    		callback(htmlString);
		});
	}

	//access db for course list
	if(functionCalledFrom.length == 2) {
		db.collection.find({subject:getData[functionCalledFrom[1]]}).sort({courseID:''}, function(err, docs) {
			var last = "";
			var next = ""; 
    		for (var i=0; i<docs.length; i++) {
    			next = docs[i]["courseID"];
    			if (next != last) {
    				htmlString += '<option value="' + docs[i]["courseID"] + '">' + docs[i]["courseID"] + "</option>";
    			}
    			last = next;
    		}
    		callback(htmlString);
		});
	}

	//access db for section list
	if(functionCalledFrom.length == 3) {
		db.collection.find({courseID:getData[functionCalledFrom[1]], subject:getData[functionCalledFrom[2]]}, function(err, docs) {    
    		for (var i=0; i<docs.length; i++) {
    			htmlString += '<option value="' + docs[i]["section"] + '">' + docs[i]["section"] + "</option>";
    		}
    		callback(htmlString);
		});
	}
}
exports.mongoQuery = mongoQuery;