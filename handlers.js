var sql = require("mysql");
// Called on page load to populate subject list
function onLoad(connection, getData, response)
{
	connection.query('SELECT subject FROM classDB', function(error, rows, feilds){
		if(error)
		{
			throw error;
		}
		var test = '<form action="">'+ 
  		'<select name="customers" onchange="classExpand(this.value)">'+
  '<option value="">Select a subject/option>'+
  '<option value="MATH">Math</option>'+
  '<option value="CS">Computer Science</option>'+
  '<option value="ENGL">English</option>'+
  '<option value="EE">Electrical Engineering</option>'+
  '<option value="CE">Computer Engineering</option>'+
  '</select>'+
  '</form>'+
  '<br>';
		response.writeHead(200, {"Content-Type" : "text/html"});
		response.write(test);
		response.end();
	});
}
//Called when the user first selects a subject
function subjectExpand(connection, getData, response)
{
	connection.query('SELECT classID FROM classDB WHERE subject == ?', [getData["subject"]], function(error, rows, feilds){
		if(error)
		{
			throw error;
		}
		response.writeHead(200, {"Content-Type" : "text/plain"});
		response.write(feilds);
		response.end();
	});
}
//Called when a user first selects a class
function classExpand(connection, getData, response)
{
	connection.query('SELECT section FROM classDB WHERE subject == ? AND classID == ?', [getData["subject"], getData["classID"]], function(error, rows, feilds){
		if(error)
		{
			throw error;
		}
		response.writeHead(200, {"Content-Type" : "text/plain"});
		response.write(feilds);
		response.end();
	});
}
//Called when a user first selects a section
function sectionExpand(connection, getData, response)
{
	connection.query('SELECT slotsOpen, slotsTotal, teacher, time, room FROM classDB WHERE subject == ? AND classID == ? AND section == ?',
	 [getData["subject"], getData["classID"], getData["section"]],
	 function(error, rows, feilds){
	 	if(error)
	 	{
	 		throw error;
	 	}
	 	response.writeHead(200, {"Content-Type" : "text/plain"});
	 	response.write(feilds);
	 	response.end();
	 });
}
exports.onLoad = onLoad;
exports.subjectExpand = subjectExpand;
exports.classExpand = classExpand;
exports.sectionExpand = sectionExpand;
