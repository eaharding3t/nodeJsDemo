var mysql = require("mysql");
function mySqlQuery(getData, htmlString, functionCalledFrom, callback){
	var queryString = "";
	//Based on which function called queryDB use a specific query
	if(functionCalledFrom.length == 1)
	{
		queryString = 'Select subjectName from subjectTable';
	}
	else if(functionCalledFrom.length == 2)
	{
		queryString = 'Select courseName from subjectTable, courseIDTable'
		+ ' WHERE (courseIDTable.subjectID = subjectTable.subjectID)'
		+ ' AND (subjectTable.subjectName = '+getData['subject']+')';
	}
	else if(functionCalledFrom.length == 3)
	{
		queryString = 'Select sectionName from subjectTable, courseIDTable, sectionTable'
		+' WHERE (sectionTable.subjectID = subjectTable.subjectID)'
		+' AND (sectionTable.courseID = courseIDTable.courseID)'
		+' AND (subjectTable.subjectName = '+getData['subject']+')'
		+' AND (courseIDTable.courseName = '+getData['courseID']+')';		
	}
	//For different servers change connection data
	var connection = mysql.createConnection({
		host : 'ec2-54-85-7-38.compute-1.amazonaws.com',
		database: 'mydb',
		user : 'root',
		password: 'password'
	});
	//Execute the selected query and build html options to return to the callback function
	connection.query(queryString, function(error, rows, feilds){
		if(error){throw error;}
  		for (var i=0; i < rows.length; i++) {
  			if(redun.indexOf(rows[i][functionCalledFrom[0]]) == -1)
  			{
   				htmlString += '<option value="'+rows[i][functionCalledFrom[0]]+'">' 
   				+ String(rows[i][functionCalledFrom[0]]) + "</option>";
   				redun.push(rows[i][functionCalledFrom[0]]);
   			}
  		}
  		callback(htmlString);
	});
}
exports.mySqlQuery = mySqlQuery;