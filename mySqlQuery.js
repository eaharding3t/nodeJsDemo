var mysql = require("mysql");
function mySqlQuery(getData, htmlString, functionCalledFrom, callback){
	var queryString = "";
	//Based on which function called queryDB use a specific query
	if(functionCalledFrom.length == 1)
	{
		queryString = 'Select Name AS subject from Subjects LIMIT 100';
	}
	else if(functionCalledFrom.length == 2)
	{
		queryString = 'Select Courses.Name as courseID from Subjects, Courses'
		+ ' WHERE (Courses.SubjectID = Subjects.ID)'
		+ ' AND (Subjects.Name = "'+getData['subject']+'")';
	}
	else if(functionCalledFrom.length == 3)
	{
		queryString = 'Select sectionName from subjectTable, Courses, sectionTable'
		+' WHERE (sectionTable.subjectID = subjectTable.subjectID)'
		+' AND (sectionTable.courseID = Courses.courseID)'
		+' AND (subjectTable.subjectName = '+getData['subject']+')'
		+' AND (Courses.courseName = '+getData['courseID']+')';		
	}
	//For different servers change connection data
	var connection = mysql.createConnection({
		host : "pocdb.2020ar.com",
		database: "mydb",
		user: "testuser",
		password: "password123"
	});
	//Execute the selected query and build html options to return to the callback function
	if(functionCalledFrom.length != 3)
	{
		connection.query(queryString, function(error, rows, feilds){
			if(error){throw error;}
  			for (var i=0; i < rows.length; i++) {
   				htmlString += '<option value="'+rows[i][functionCalledFrom[0]]+'">' 
   				+ String(rows[i][functionCalledFrom[0]]) + "</option>";
   			}
  			callback(htmlString);
  		});
	}
}

exports.mySqlQuery = mySqlQuery;
