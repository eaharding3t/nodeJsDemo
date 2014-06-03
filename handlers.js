var mysql = require("mysql");
var database = require("./database");
var mongojs = require("mongojs");
var AWS = require("aws-sdk");
var fs = require("fs");
// Called on page load to populate subject list
function onLoading(getData, response)
{
	var test = '<form action="">'+ 
     	'<select id="subjectL" onchange="subjectExpand(this.value)">'+
     	'<option value="">Select a subject</option>';
	database.queryDB(getData, test, getData['databaseType'], ['subject'])(function(htmlString){
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
  		'<select id="courseL" onchange="courseExpand(this.value,'+temp+') ">'+
  		'<option value="">Select a courseID</option>';
	database.queryDB(getData, list, getData['databaseType'], ['courseID','subject'])(function(htmlString){
		htmlString+='</select>'+'</form>';
  		var headers = {}
  		headers["Content-Type"] = "text/html";
  		headers["Access-Control-Allow-Origin"] = "*";
		response.writeHead(200, headers);
		response.write(htmlString);
		response.end();
	}, function(errback){throw errback;});
}
//Called when a user first selects a course
function courseExpand(getData, response)
{
	var temp = "document.getElementById('subjectL').value, document.getElementById('courseL').value";
	var list = '<form action="">'+ 
  		'<select id="sectionL" onchange="sectionExpand('+temp+',this.value)">'+
  		'<option value="">Select a section</option>';
  		var help = ['section','courseID','subject'];
  		console.log(help[0]);
	database.queryDB(getData, list, getData['databaseType'], help)(function(htmlString){
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
	if(getData['databaseType'] == 0)
	{
		var locate = 0;
		var rows = [];
		rows[0] = {subject:'math',courseID:'algebra',section:'001',time:130,room:'001',
			waitList:0,slotsTotal:50,slotsOpen:25,teacher: 'mathTeacher'};
		rows[1]={'subject':'math','courseID':'linear','section':'500','time':730,
			'room': '320','waitList':5,'slotsTotal':60,'slotsOpen':0,'teacher': 'Jim'};
		rows[2]={'subject':'math','courseID':'calculus','section':'201','time':730,
			'room': '320','waitList':5,'slotsTotal':60,'slotsOpen':0,'teacher': 'Bob'};
		rows[3]={'subject':'math','courseID':'geometry','section':'101','time':830,
			'room': '320','waitList':5,'slotsTotal':60,'slotsOpen':0,'teacher': 'John'};
		rows[4]={'subject':'english','courseID':'modern lit','section':'400','time':1230,
			'room': '301','waitList':0,'slotsTotal':60,'slotsOpen':15,'teacher': 'englishTeacher'};
		rows[5] = {'subject':'computerScience','courseID':'data structures','section':'430','time':530,
			'room': '305','waitList':20,'slotsTotal':60,'slotsOpen':0,'teacher': 'computerScienceTeacher'};
		rows[6]={'subject':'computerEngineering','courseID':'data','section':'432','time':230,
			'room': '305','waitList':20,'slotsTotal':60,'slotsOpen':12,'teacher': 'computerEngineeringTeacher'};
		rows[7]={'subject':'electrical','courseID':'wiring','section':'436','time':235,
				'room': '325','waitList':10,'slotsTotal':60,'slotsOpen':12,'teacher': 'electricalTeacher'};
		for(var i = 0; i < rows.length; i++)
		{
			if(rows[i]['subject'] == getData['subject'] && rows[i]['courseID'] == getData['courseID'] && rows[i]['section'] == getData['section'])
			{
				locate = i;
			}
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
					'<td>' + String(rows[locate]['slotsOpen']) + '</td>'+
					'<td>' + String(rows[locate]['slotsTotal']) + '</td>'+
					'<td>' + String(rows[locate]['teacher']) + '</td>'+
					'<td>' + String(rows[locate]['time']) + '</td>'+
					'<td>' + String(rows[locate]['room']) + '</td>'+
					'<td>' + String(rows[locate]['waitList']) + '</td>'+
		 		'</tr>'+
				'</table>';

	 		var headers = {};
  			headers["Content-Type"] = "text/html";
    		headers["Access-Control-Allow-Origin"] = "*";
    		var temp = "document.getElementById('subjectL').value, document.getElementById('courseL').value, document.getElementById('sectionL').value";
    		table+='<br><div id = "fileUpload"><button onclick = "fileUpload('+temp+')">Upload a file</button></div>';
	    	response.writeHead(200, headers);
	 		response.write(table);
	 		response.end();
	}
	if (getData['databaseType'] == 1) {
		var connection = mysql.createConnection({
				host : '127.0.0.1',
				database: 'test',
				user : 'root',
				password: 'password123$'
			});
		connection.query('Select room, time, waitList, slotsTotal, slotsOpen, teacher from subjectTable, courseIDTable, sectionTable WHERE (sectionTable.subjectID = subjectTable.subjectID) AND (sectionTable.courseID = courseIDTable.courseID) AND (sectionName = ?) AND (courseName = ?) AND (subjectName = ?)',
	 	[getData["subject"], getData["courseID"], getData["section"]],
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
    		var temp = "document.getElementById('subjectL').value, document.getElementById('courseL').value, document.getElementById('sectionL').value";
    		table+='<br><div id = "fileUpload"><button onclick = "fileUpload('+temp+')">Upload a file</button></div>';
	    	response.writeHead(200, headers);
	 		response.write(table);
	 		response.end();
	 	});
	}
	else if (getData['databaseType'] == 2){
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
			console.log(data['Items']);
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
    		var temp = "document.getElementById('subjectL').value, document.getElementById('courseL').value, document.getElementById('subjectL')";
    		table+='<br><div id = "fileUpload"><button onclick = "fileUpload('+temp+')">Upload a file</button></div>';
			response.writeHead(200, headers);
			response.write(table);
			response.end();
		});
	}

	//mongo
	else if (getData['databaseType'] == 3) {
		var uri = "mongodb://root:password@ds033699.mongolab.com:33699/ke_db",
    	db = mongojs.connect(uri, ["classDB"]),
    	table = "";

		db.classDB.find({subject:getData["subject"], classID:getData["courseID"], section:getData["section"]}, function(err, docs) {
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
    		table+='<br><div id = "fileUpload"><button onclick = "fileUpload()">Upload a file</button></div>';
			response.writeHead(200, headers);
			response.write(table);
			response.end();
		});
	}
}

function fileUpload(getData, response) {
	AWS.config.loadFromPath('./config.json');
	var s3 = new AWS.S3();
	var file = "./courseDetails.txt";
	var details = "subject=" + getData['subject'] + "courseID="+getData['courseID']+"section="+getData['section'];
	fs.writeFile(file, details,function(err){
		if(err){throw err;}
		var file2 = "./courseDetails.txt";
		console.log("test");
		fs.readFile(file2, function(err, data) {
			if(err) {throw err;}
			console.log(data);
			var params = {
  				Bucket: 'ke_bucket', // required
  				Key: 'ke_key', // required
  				Body: data,
			}
			s3.putObject(params, function(err, data) {
  				if (err) console.log(err, err.stack);
  				else     console.log(data);           
			});
		});
	});
}

exports.fileUpload = fileUpload;
exports.onLoading = onLoading;
exports.subjectExpand = subjectExpand;
exports.courseExpand = courseExpand;
exports.sectionExpand = sectionExpand;
