var mysql = require("mysql");
function mySqlQuery(getData, htmlString, functionCalledFrom, callback){
	var queryString = "";
	//Based on which function called queryDB use a specific query
	console.log("test2");
	if(functionCalledFrom.length == 1)
	{
		queryString = 'Select Name from subjectTable';
	}
	else if(functionCalledFrom.length == 2)
	{
		queryString = 'Select Name from Subjects, Courses'
		+ ' WHERE (Courses.SubjectID = Subjects.ID)'
		+ ' AND (Subjects.Name = '+getData['subject']+')';
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
		host : 'ec2-54-85-7-38.compute-1.amazonaws.com',
		database: 'mydb',
		user : 'root',
		password: 'password'
	});
	//Execute the selected query and build html options to return to the callback function
	if(functionCalledFrom.length != 3)
	{
		console.log("test3");
	connection.query(queryString, function(error, rows, feilds){
		if(error){throw error;}
		console.log("test4");
  		for (var i=0; i < rows.length; i++) {
   				htmlString += '<option value="'+rows[i][functionCalledFrom[0]]+'">' 
   				+ String(rows[i][functionCalledFrom[0]]) + "</option>";
   			}
  		}
  		callback(htmlString);
	});
}
}
exports.mySqlQuery = mySqlQuery;