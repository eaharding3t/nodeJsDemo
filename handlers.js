var mysql = require("mysql");
var database = require("./database");
var mongojs = require("mongojs");
var AWS = require("aws-sdk");
var fs = require("fs");
var memcache = require("memcached");
var redis = require("redis");
var elasticacheAutoScaling = require('./elasticacheAutoScaling');
// Called on database selection to populate subject list
function onLoading(getData, response)
{
	//generates base form html so that the database query can add options
	var test = '<form action="">'+ 
     	'<select id="subjectL" onchange="subjectExpand(this.value)">'+
     	'<option value="">Select a subject</option>';
    //Funtion returns a function that generates the html for the options of the select box
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
	//generates base form html so that the database query can add options
	var temp = "document.getElementById('subjectL').value";
	var list = '<form action="">'+ 
  		'<select id="courseL" onchange="courseExpand(this.value,'+temp+') ">'+
  		'<option value="">Select a courseID</option>';
  	//Funtion returns a function that generates the html for the options of the select box
	database.queryDB(getData, list, getData['databaseType'], ['courseID','subject'])(function(htmlString){
		htmlString+='</select>'+'</form>';
  		var headers = {};
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
	//generates base form html so that the database query can add options
	var temp = "document.getElementById('subjectL').value, document.getElementById('courseL').value";
	var list = '<form action="">'+ 
  		'<select id="sectionL" onchange="sectionExpand('+temp+',this.value)">'+
  		'<option value="">Select a section</option>';
  		var functionCalledFrom = ['section','courseID','subject'];
  	//Funtion returns a function that generates the html for the options of the select box
	database.queryDB(getData, list, getData['databaseType'], functionCalledFrom)(function(htmlString){
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
	//Generates the details table based on the type of database selected
	if(getData['databaseType'] == 0) {
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
		for(var i = 0; i < rows.length; i++) {
			if(rows[i]['subject'] == getData['subject'] && rows[i]['courseID'] == getData['courseID'] && rows[i]['section'] == getData['section']) {
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
		temp = "document.getElementById('subjectL').value, document.getElementById('courseL').value";
		table+='<br/><div id = "cacheIt"><button onclick = "cacheIt('+temp+')">Cache your results</button></div>';
	    	response.writeHead(200, headers);
	 		response.write(table);
	 		response.end();
	}
	if (getData['databaseType'] == 1) {
		var connection = mysql.createConnection({
				host : "pocdb.2020ar.com",
						database: "mydb",
						user: "testuser",
						password: "password123"
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
	else if (getData['databaseType'] == 2) {
		try {
			AWS.config.update({"accessKeyId": process.env.AWS_ACCESS_KEY_ID, "secretAccessKey": process.env.AWS_SECRET_KEY, "region": "us-east-1"});
			var db = new AWS.DynamoDB();
			var table ="";
			var params = {
				TableName:'course',
				IndexName: "section"+"-index",
				KeyConditions: {
					"section":
					{
						"AttributeValueList": [{"S" : getData['section']}],
						ComparisonOperator: 'EQ'
					}
				}
			}
			try {
				db.query(params, function(err,data) {
					var locate = 0;
					for (var i=0; i<data['Items'].length; i++) {
						if (getData['course']==data['Items'][i]['course']['S'] && getData['subject']==data['Items'][i]['subject']['S']) {
							locate = i;
							break;
						}
					}
					//console.log(data['Items']);
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
								'<td>' + String(data['Items'][locate]["time"]['S']) + '</td>'+
								'<td>' + String(data['Items'][locate]["room"]['S']) + '</td>'+
								'<td>' + String(data['Items'][locate]["waitList"]['N']) + '</td>'+
		 					'</tr>'+
							'</table>';

					var headers = {};
  					headers["Content-Type"] = "text/html";
    					headers["Access-Control-Allow-Origin"] = "*";
    					var temp = "document.getElementById('subjectL').value, document.getElementById('courseL').value, document.getElementById('subjectL')";
    					table +='<br><div id = "fileUpload"><button onclick = "fileUpload('+temp+')">Upload a file</button></div>';
					temp = "document.getElementById('subjectL').value, document.getElementById('courseL').value";
					table+='<br/><div id = "cacheIt"><button onclick = "cacheIt('+temp+')">Cache your results</button></div>';
					response.writeHead(200, headers);
					response.write(table);
					response.end();
				});
			}
			catch(err){}
		}catch(err){}
	}

	//mongo section details table
	else if (getData['databaseType'] == 3) {
		var uri = "mongodb://root:password@ds033699.mongolab.com:33699/ke_db",
    		db = mongojs.connect(uri, ["collection"]),
    		table = "";

		db.collection.find({subject:getData["subject"], courseID:getData["courseID"], section:getData["section"]}, function(err, docs) {
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
    			var temp = "document.getElementById('subjectL').value, document.getElementById('courseL').value, document.getElementById('sectionL').value";
    			table+='<br><div id = "fileUpload"><button onclick = "fileUpload('+temp+')">Upload a file</button></div>';
			temp = "document.getElementById('subjectL').value, document.getElementById('courseL').value";
			table+='<br/><div id = "cacheIt"><button onclick = "cacheIt('+temp+')">Cache your results</button></div>';
			response.writeHead(200, headers);
			response.write(table);
			response.end();
		});
	}
}

//called when user presses "Upload a file" button
//nested in order to run synchronously
function fileUpload(getData, response) {
	try {
		AWS.config.update({"accessKeyId": process.env.AWS_ACCESS_KEY_ID, "secretAccessKey": process.env.AWS_SECRET_KEY, "region": "us-east-1"});
		var s3 = new AWS.S3();
		var file = "./courseDetails.txt";
		var details = "subject=" + getData['subject'] + " courseID="+getData['courseID']+" section="+getData['section'];
		var bucket = 'ke_bucket';
		var S3_Info = '';

		var fileCounter;
		var params = {
  			Bucket: bucket,
		};
		//get correct number of file to upload
		s3.listObjects(params, function(err, data) {
  			if (err) console.log(err, err.stack);
  			else     fileCounter = data.Contents.length;	
			fileCounter++;
			var currentFile = "courseDetails" + String(fileCounter) + ".txt";
			//write file to server
			fs.writeFile(file, details,function(err){
				if(err){throw err;}
				var file2 = "./courseDetails.txt";
				//read file again and put the data into S3 params
				fs.readFile(file2, function(err, data) {
					if(err) {throw err;}
					var params = {
  						Bucket: bucket,
  						Key: currentFile,
  						Body: data,
					}
					//Add object to S3 with the given params
					s3.putObject(params, function(err, data) {
  						if (err) console.log(err, err.stack);
  						//beginning building html
  						S3_Info += '<h1>S3 Information</h1>' +
						'<p>File: ' + currentFile + ' put into Bucket: ' + bucket + '</p>';
						S3_Info += '<p>Bucket: ' + bucket + ' currently contains ';			      
  						var params = {
      						Bucket: bucket,
  						};
  						//list objects in bucket, add to html
  						s3.listObjects(params, function(err, data) {
    						if (err) console.log(err, err.stack);
    						else {
      							for (var i=0; i<data.Contents.length; i++) {
        							S3_Info += String(data.Contents[i].Key) + ', ';
      							}   
    						}
    						//get access control policy on current bucket, add to html
    						S3_Info += '</p><p>Bucket: ' + bucket + ' is owned by ';
    						s3.getBucketAcl(params, function(err, data) {
      							if (err) console.log(err, err.stack);
      							else {
        							S3_Info += data.Owner.DisplayName + ' with permissions: ' + data.Grants[0].Permission + '</p>';
        						}
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
	catch(err) {}	
}

function loadTest(getData, response) {
	if(getData['loadTest'] == 'true') {
		switch(getData['databaseType'])	{
			case '1':
				var connection = mysql.createConnection({
					host : "pocdb.2020ar.com",
					database: "mydb",
					user: "testuser",
					password: "password123"
				});
				var rand = String(Math.round(Math.random()*100000));
				connection.query("select * from Subjects, Courses where Courses.SubjectID = Subjects.ID OR Courses.ID =" + rand + " LIMIT "+ rand, function(error,rows,feilds) {
					var loadTestList = "<p>"+rand+"<br/>";
					for (var i = 0; i < rows.length; i++){
						loadTestList += String(rows[i]['Name'])+'<br/>';
					}
					loadTestList += "</p>";
					var headers = {};
  					headers["Content-Type"] = "text/html";
  					headers["Access-Control-Allow-Origin"] = "*";
					response.writeHead(200, headers);
					response.write(loadTestList);
					response.end();
				});
				break;
			case '2':
				try {
					AWS.config.update({"accessKeyId": process.env.AWS_ACCESS_KEY_ID, "secretAccessKey": process.env.AWS_SECRET_KEY, "region": "us-east-1"});
					var db = new AWS.DynamoDB();
					var rand = Math.round(Math.random()*10000);
					var params = {
						TableName: 'course',
						AttributesToGet: ['sectionID']
						//	Limit: rand
					};
					try {
						db.scan(params, function(err, data) {
							var loadTestList = "<p>"+rand+"<br/>";
							if (data != null) {
								for (var i = 0; i < data['Items'].length; i++) {
									loadTestList += String(data['Items'][i]['sectionID']['N'])+"<br/>";
								}
								loadTestList += "</p>";
								var headers = {};
								headers["Content-Type"] = "text/html";
  								headers["Access-Control-Allow-Origin"] = "*";
								response.writeHead(200, headers);
								response.write(loadTestList);
								response.end();
							}
						});
					}
					catch(err) {}
				}
				catch(err) {}
				break;
			case '3':
				var uri = "mongodb://root:password@ds033699.mongolab.com:33699/ke_db",
					db = mongojs.connect(uri, ["loadTest"]),
					rand = Math.round(Math.random()*10000);
				db.loadTest.find(function(err, docs) {
    				var loadTestList = "<p>"+rand+"<br/>";
					for(var i = 0; i < docs.length; i++) {
						loadTestList += String(docs[i]["Course"])+"<br/>";
					}
					loadTestList += "</p>";
					var headers = {};
					headers["Content-Type"] = "text/html";
  					headers["Access-Control-Allow-Origin"] = "*";
					response.writeHead(200, headers);
					response.write(loadTestList);
					response.end();
				});
				break;
		}
	}
}
function cacheIt(getData, response)
{
	if(getData['cacheType'] == 'memcache')
	{
		AWS.config.update({"accessKeyId": process.env.AWS_ACCESS_KEY_ID, "secretAccessKey": process.env.AWS_SECRET_KEY, "region": "us-east-1"});
		var memConfig = new AWS.ElastiCache();
		var params = {
			CacheClusterId: 'poc-eh-memcache',
			ShowCacheNodeInfo: true
		};
		var nodes = [];
		memConfig.describeCacheClusters(params, function(err,data){
			if(err){throw err;}
			for(var i = 0; i<data['CacheClusters'][0]['CacheNodes'].length; i++)
			{
				nodes[i] = String(data['CacheClusters'][0]['CacheNodes'][i]['Endpoint']['Address'] +':'+data['CacheClusters'][0]['CacheNodes'][i]['Endpoint']['Port']);
			}
		var cache = new memcache(nodes);
		cache.set(getData['key'], getData['value'], 120,  function(err){
			if(err){throw err;}
			else{
				cache.get(getData['key'], function(err,data){
					if(err){throw err;}
					else{
						var headers={};
						headers["Content-Type"] = "text/html";
						headers["Access-Control-Allow-Origin"] = "*";
						response.writeHead(200, headers);
						response.write("<p>"+data+"</p>");
						cache.end();
						response.end();
					}
				});
			}
		});
		});
	}
	else if(getData['cacheType'] == 'redis')
	{
	var cache = redis.createClient(6379,"pocredis.2020ar.com");
	cache.set(getData['key'], getData['value'], function(err){
		if(err){throw err;}
		else{
			cache.expire(getData['key'], 120, function(err){
			});
			cache.get(getData['key'], function(err, data){
				if(err){throw err;}
				else{
					var headers={};
					headers["Content-Type"] = "text/html";
					headers["Access-Control-Allow-Origin"] = "*";
					response.writeHead(200, headers);
					response.write("<p>"+data+"</p>");
					cache.quit();
					response.end();
				}
			});
		}
	});
}
}
exports.fileUpload = fileUpload;
exports.onLoading = onLoading;
exports.subjectExpand = subjectExpand;
exports.courseExpand = courseExpand;
exports.sectionExpand = sectionExpand;
exports.loadTest = loadTest;
exports.cacheIt = cacheIt;
