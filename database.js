var mysql = require("mysql");
var AWS = require("aws-sdk");
var mongojs = require("mongojs");
function queryDB(getData, htmlString, databaseType, functionCalledFrom)
{
	var queryString ="";
	return function(callback, errback){
		//This is a hard-coded version of the sql database
		if(databaseType == 0){
			if(functionCalledFrom.length == 0)
			{
				queryString = 'SELECT subject FROM classDB';
			}
			var redun = [];
			var rows = [];
			rows[0] = {subject:'math',classID:'algebra',section:'001',time:130,room:'001',
			waitList:0,slotsTotal:50,slotsOpen:25,teacher: 'mathTeacher'};
			rows[1]={'subject':'math','classID':'linear','section':'500','time':730,
				'room': '320','waitList':5,'slotsTotal':60,'slotsOpen':0,'teacher': 'Jim'};
			rows[2]={'subject':'math','classID':'calculus','section':'201','time':730,
				'room': '320','waitList':5,'slotsTotal':60,'slotsOpen':0,'teacher': 'Bob'};
			rows[3]={'subject':'math','classID':'geometry','section':'101','time':830,
				'room': '320','waitList':5,'slotsTotal':60,'slotsOpen':0,'teacher': 'John'};
			rows[4]={'subject':'english','classID':'modern lit','section':'400','time':1230,
				'room': '301','waitList':0,'slotsTotal':60,'slotsOpen':15,'teacher': 'englishTeacher'};
			rows[5] = {'subject':'computerScience','classID':'data structures','section':'430','time':530,
				'room': '305','waitList':20,'slotsTotal':60,'slotsOpen':0,'teacher': 'computerScienceTeacher'};
			rows[6]={'subject':'computerEngineering','classID':'data','section':'432','time':230,
				'room': '305','waitList':20,'slotsTotal':60,'slotsOpen':12,'teacher': 'computerEngineeringTeacher'};
			rows[7]={'subject':'electrical','classID':'wiring','section':'436','time':235,
				'room': '325','waitList':10,'slotsTotal':60,'slotsOpen':12,'teacher': 'electricalTeacher'};
			for (var i=0; i < rows.length; i++) {
				var select = true;
				for(var k = 1; k<functionCalledFrom.length;k++)
				{
					if(rows[i][functionCalledFrom[k]] == getData[functionCalledFrom[k]]){
					}
					else
					{
						select = false;
						break;
					}
				}
				if(select){
  					if(redun.indexOf(rows[i][functionCalledFrom[0]]) == -1)
  					{
   						htmlString += '<option value="'+rows[i][functionCalledFrom[0]]+'">' + String(rows[i][functionCalledFrom[0]]) + "</option>";
   						redun.push(rows[i][functionCalledFrom[0]]);
   					}
   				}
			}
  					callback(htmlString);
		}
		//This call uses the data from a mysql server of your choice.
		else if (databaseType == 1)
		{
			if(functionCalledFrom.length == 1)
			{
				queryString = 'SELECT subject FROM classDB';
			}
			else
			{
				queryString = "SELECT "+functionCalledFrom[0]+" FROM classDB where ";
				for(var i =1;i<functionCalledFrom.length;i++){
					if(i>1)
					{
						queryString+=" AND ";
					}
					queryString +=functionCalledFrom[i]+"="+'"'+getData[functionCalledFrom[i]]+'"';
				}
			}
			var redun =[];
			//For different servers change connection data
			var connection = mysql.createConnection({
			host : '127.0.0.1',
			database: 'test',
			user : 'root',
			password: 'He18272752!'
			});
			connection.query(queryString, function(error, rows, feilds){
				if(error)
				{
					throw error;
				}
  				for (var i=0; i < rows.length; i++) {
  					if(redun.indexOf(rows[i][functionCalledFrom[0]]) == -1)
  					{
   						htmlString += '<option value="'+rows[i][functionCalledFrom[0]]+'">' + String(rows[i][functionCalledFrom[0]]) + "</option>";
   						redun.push(rows[i][functionCalledFrom[0]]);
   					}
  				}
  				callback(htmlString);
			});
		}
		else if(databaseType == 2)
		{
			var redun = [];
			AWS.config.loadFromPath('./config.json');
			var db = new AWS.DynamoDB();
			if(functionCalledFrom[0] == 'subject'){
				var params = {
					TableName: 'classTable',
					AttributesToGet: [functionCalledFrom[0]],
				}
				db.scan(params, function(err,data){
					if(err)
						{throw err;}
					else{
						console.log(data['Items'][0]['subject']['S']);
						for (var i=0; i < data['Items'].length; i++) {
  							if(redun.indexOf(data['Items'][i]['subject']['S']) == -1)
  							{
   								htmlString += '<option value="'+data['Items'][i]['subject']['S']+'">' + String(data['Items'][i]['subject']['S']) + "</option>";
   								redun.push(data['Items'][i]['subject']['S']);
   							}
  						}
  						callback(htmlString);
					}

				});
			}
			else if(functionCalledFrom[0] == 'classID')
			{
				var params = {
					TableName:'classTable',
					IndexName: functionCalledFrom[1]+"-index",
					AttributesToGet: [functionCalledFrom[0]],
					KeyConditions: {
						"subject":
						{
							"AttributeValueList": [{"S" : getData['subject']}],
							ComparisonOperator: 'EQ'
						}
					}
				}
				db.query(params, function(err,data){
					if(err)
						{throw err;}
					else{
						console.log(data['Items'][0]['classID']['S']);
						for (var i=0; i < data['Items'].length; i++) {
  							if(redun.indexOf(data['Items'][i]['classID']['S']) == -1)
  							{
   								htmlString += '<option value="'+data['Items'][i]['classID']['S']+'">' + String(data['Items'][i]['classID']['S']) + "</option>";
   								redun.push(data['Items'][i]['classID']['S']);
   							}
  						}
  						callback(htmlString);
					}
				});
			}
			else if(functionCalledFrom[0] == 'section')
			{
				var params = {
					TableName:'classTable',
					IndexName: "classID"+"-index",
					AttributesToGet: ["section"],
					KeyConditions: {
						"classID":
						{
							"AttributeValueList": [{"S" : getData['classID']}],
							ComparisonOperator: 'EQ'
						}
					}
				}
				db.query(params, function(err,data){
					if(err)
						{throw err;}
					else{
						console.log(data['Items'][0]['section']['S']);
						for (var i=0; i < data['Items'].length; i++) {
  							if(redun.indexOf(data['Items'][i]['section']['S']) == -1)
  							{
   								htmlString += '<option value="'+data['Items'][i]['section']['S']+'">' + String(data['Items'][i]['section']['S']) + "</option>";
   								redun.push(data['Items'][i]['section']['S']);
   							}
  						}
  						callback(htmlString);
					}
				});
			}
		}
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