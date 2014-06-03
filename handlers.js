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
  		var headers = {};
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
	database.queryDB(getData, list, getData['databaseType'], ['classID','subject'])(function(htmlString){
		htmlString+='</select>'+'</form>';
  		var headers = {};
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
	database.queryDB(getData, list, getData['databaseType'], help)(function(htmlString){
		htmlString+='</select>'+'</form>';
  		var headers = {};
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
	if (getData['databaseType'] == 1) {
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
    		var temp = "document.getElementById('subjectL').value, document.getElementById('classL').value, document.getElementById('sectionL').value";
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
    		var temp = "document.getElementById('subjectL').value, document.getElementById('classL').value, document.getElementById('subjectL')";
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
    		var temp = "document.getElementById('subjectL').value, document.getElementById('classL').value, document.getElementById('sectionL').value";
    		table+='<br><div id = "fileUpload"><button onclick = "fileUpload('+temp+')">Upload a file</button></div>';
			response.writeHead(200, headers);
			response.write(table);
			response.end();
		});
	}
}

function fileUpload(getData, response) {
	AWS.config.loadFromPath('./config.json');
	var s3 = new AWS.S3();
	var file = "./classDetails.txt";
	var details = "subject=" + getData['subject'] + " classID="+getData['classID']+" section="+getData['section'];
	var bucket = 'ke_bucket';
	var S3_Info = '';

	var fileCounter;
	var params = {
  		Bucket: bucket,
	};
	console.log("listObjects");
	s3.listObjects(params, function(err, data) {
  		if (err) console.log(err, err.stack);
  		else     fileCounter = data.Contents.length;	
		fileCounter++;
		var currentFile = "classDetails" + String(fileCounter) + ".txt";
		fs.writeFile(file, details,function(err){
			if(err) {
				throw err;
			}
			var file2 = "./classDetails.txt";
			fs.readFile(file2, function(err, data) {
				if(err) {
					throw err;
				}
				var params = {
  					Bucket: bucket,
  					Key: currentFile,
  					Body: data,
				}
				console.log("putObject");
				s3.putObject(params, function(err, data) {
  					if (err) console.log(err, err.stack);
  					console.log("in putObject");
  					S3_Info += '<h1>S3 Information</h1>' +
					'<p>File: ' + currentFile + ' put into Bucket: ' + bucket + '</p>';
					S3_Info += '<p>Bucket: ' + bucket + ' currently contains ';			      
  					var params = {
      				Bucket: bucket,
  					};
  					console.log("listObjects");
  					s3.listObjects(params, function(err, data) {
    					if (err) console.log(err, err.stack);
    					else {
      						for (var i=0; i<data.Contents.length; i++) {
        						S3_Info += String(data.Contents[i].Key) + ', ';
      						}   
    					}
    					S3_Info += '</p><p>Bucket: ' + bucket + ' is owned by ';
    					console.log("getBucketAcl");
    					s3.getBucketAcl(params, function(err, data) {
      						if (err) console.log(err, err.stack);
      						else {
        						S3_Info += data.Owner.DisplayName + ' with permissions: ' + data.Grants[0].Permission + '</p>';
        					}
        					console.log(S3_Info);
      						var headers = {};
  							headers["Content-Type"] = "text/html";
  							headers["Access-Control-Allow-Origin"] = "*";
							response.writeHead(200, headers);
							response.write(S3_Info);
							response.end();
    					});
  					});	           
				});
			});
		});
	});	
}

exports.fileUpload = fileUpload;
exports.onLoading = onLoading;
exports.subjectExpand = subjectExpand;
exports.classExpand = classExpand;
exports.sectionExpand = sectionExpand;
