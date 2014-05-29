var mysql = require("mysql");
var database = require("./database");
var mongojs = require("mongojs");
var AWS = require("aws-sdk");
// Called on page load to populate subject list
function onLoading(getData, response)
{
	var test = '<form action="">'+ 
     	'<select id="subjectL" onchange="subjectExpand(this.value)">'+
     	'<option value="">Select a subject</option>';
	database.queryDB(getData, test, getData['dataType'], ['subject'])(function(htmlString){
		htmlString+='</select>'+'</form>';
  		var headers = {}
  		headers["Content-Type"] = "text/html";
  		headers["Access-Control-Allow-Origin"] = "*";
		response.writeHead(200, headers);
		response.write(htmlString);
		response.end();
	}, function(errback){throw errback});
}
//Called when the user first selects a subject
function subjectExpand(getData, response)
{
	var temp = "document.getElementById('subjectL').value";
	var list = '<form action="">'+ 
  		'<select id="classL" onchange="classExpand(this.value,'+temp+') ">'+
  		'<option value="">Select a classID</option>';
	database.queryDB(getData, list, getData['dataType'], ['classID','subject'])(function(htmlString){
		htmlString+='</select>'+'</form>';
  		var headers = {}
  		headers["Content-Type"] = "text/html";
  		headers["Access-Control-Allow-Origin"] = "*";
		response.writeHead(200, headers);
		response.write(htmlString);
		response.end();
	}, function(errback){throw errback;});
}
//Called when a user first selects a class
function classExpand(getData, response)
{
	var temp = "document.getElementById('subjectL').value, document.getElementById('classL').value";
	var list = '<form action="">'+ 
  		'<select id="sectionL" onchange="sectionExpand('+temp+',this.value)">'+
  		'<option value="">Select a section</option>';
  		var help = ['section','classID','subject'];
  		console.log(help[0]);
	database.queryDB(getData, list, getData['dataType'], help)(function(htmlString){
		htmlString+='</select>'+'</form>';
  		var headers = {}
  		headers["Content-Type"] = "text/html";
  		headers["Access-Control-Allow-Origin"] = "*";
		response.writeHead(200, headers);
		response.write(htmlString);
		response.end();
	}, function(errback){throw errback;});
}
//Called when a user first selects a section
function sectionExpand(getData, response)
{
	if (getData['dataType'] == 1) {
		var connection = mysql.createConnection({
				host : '127.0.0.1',
				database: 'test',
				user : 'root',
				password: 'He18272752!'
			});
		connection.query('SELECT slotsOpen, slotsTotal, teacher, time, room, waitList FROM classDB WHERE subject = ? AND classID = ? AND section = ?',
	 	[getData["subject"], getData["classID"], getData["section"]],
	 	function(error, rows, feilds){
	 		if(error)
	 		{
	 			throw error;
	 		}

	 		var table = '<table border="1" style="width:500px">'+
						'<tr>'+
  							'<td>Slots open</td>'+
  							'<td>Slots total</td>'+		
  							'<td>Teacher</td>'+
  							'<td>Time</td>'+
  							'<td>Room</td>'+
  							'<td>Waitlist</td>'+
						'</tr>'+
						'<tr>'+
							'<td>' + String(rows[0]['slotsOpen']) + '</td>'+
							'<td>' + String(rows[0]['slotsTotal']) + '</td>'+
							'<td>' + String(rows[0]['teacher']) + '</td>'+
							'<td>' + String(rows[0]['time']) + '</td>'+
							'<td>' + String(rows[0]['room']) + '</td>'+
							'<td>' + String(rows[0]['waitList']) + '</td>'+
		 				'</tr>'+
						'</table>';

	 		var headers = {};
  			headers["Content-Type"] = "text/html";
    		headers["Access-Control-Allow-Origin"] = "*";
	    	response.writeHead(200, headers);
	 		response.write(table);
	 		response.end();
	 	});
	}
	else if (getData['dataType'] == 2){
		AWS.config.loadFromPath('./config.json');
		var db = new AWS.DynamoDB();
		var table ="";
		var params = {
			TableName:'classTable',
			IndexName: "classID"+"-index",
			KeyConditions: {
				"classID":
				{
					"AttributeValueList": [{"S" : getData['classID']}],
					ComparisonOperator: 'EQ'
				}
			}
		}
		db.query(params, function(err,data){
			var locate = 0;
			for(var i =0;i<data['Items'].length;i++)
			{
				if(getData['section']==data['Items'][i]['section']['S'])
				{
					locate = i;
					break;
				}
			}
			table += '<table border="1" style="width:500px">'+
						'<tr>'+
  							'<td>Slots open</td>'+
  							'<td>Slots total</td>'+		
  							'<td>Teacher</td>'+
  							'<td>Time</td>'+
  							'<td>Room</td>'+
  							'<td>Waitlist</td>'+
						'</tr>'+
						'<tr>'+
							'<td>' + String(data['Items'][locate]['slotsOpen']['N']) + '</td>'+
							'<td>' + String(data['Items'][locate]["slotsTotal"]['N']) + '</td>'+
							'<td>' + String(data['Items'][locate]["teacher"]['S']) + '</td>'+
							'<td>' + String(data['Items'][locate]["time"]['N']) + '</td>'+
							'<td>' + String(data['Items'][locate]["room"]['S']) + '</td>'+
							'<td>' + String(data['Items'][locate]["waitList"]['N']) + '</td>'+
		 				'</tr>'+
						'</table>';

			var headers = {};
  			headers["Content-Type"] = "text/html";
    		headers["Access-Control-Allow-Origin"] = "*";
			response.writeHead(200, headers);
			response.write(table);
			response.end();
		});
	}

	//mongo
	else if (getData['dataType'] == 3) {
		var uri = "mongodb://root:password@ds033699.mongolab.com:33699/ke_db",
    	db = mongojs.connect(uri, ["classDB"]),
    	table = "";

		db.classDB.find({subject:getData["subject"], classID:getData["classID"], section:getData["section"]}, function(err, docs) {
			table += '<table border="1" style="width:500px">'+
						'<tr>'+
  							'<td>Slots open</td>'+
  							'<td>Slots total</td>'+		
  							'<td>Teacher</td>'+
  							'<td>Time</td>'+
  							'<td>Room</td>'+
  							'<td>Waitlist</td>'+
						'</tr>'+
						'<tr>'+
							'<td>' + String(docs[0]["slotsOpen"]) + '</td>'+
							'<td>' + String(docs[0]["slotsTotal"]) + '</td>'+
							'<td>' + String(docs[0]["teacher"]) + '</td>'+
							'<td>' + String(docs[0]["time"]) + '</td>'+
							'<td>' + String(docs[0]["room"]) + '</td>'+
							'<td>' + String(docs[0]["waitList"]) + '</td>'+
		 				'</tr>'+
						'</table>';

			var headers = {};
  			headers["Content-Type"] = "text/html";
    		headers["Access-Control-Allow-Origin"] = "*";
			response.writeHead(200, headers);
			response.write(table);
			response.end();
		});
	}
}

exports.onLoading = onLoading;
exports.subjectExpand = subjectExpand;
exports.classExpand = classExpand;
exports.sectionExpand = sectionExpand;
