var mysql = require("mysql");
function mySqlQuery(getData, htmlString, functionCalledFrom, callback){
	var queryString = "";
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
			host : '127.0.0.1',
			database: 'test',
			user : 'root',
			password: 'password123$'
			});
			connection.query(queryString, function(error, rows, feilds){
				if(error)
				{
					throw error;
				}
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