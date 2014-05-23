var sql = require("mysql");
// Called on page load to populate subject list
function onLoading(connection, getData, response, headers)
{
	connection.query('SELECT subject FROM classDB', function(error, rows, feilds){
		if(error)
		{
			throw error;
		}
		var redun = [];
  		var test = '<form action="">'+ 
     	'<select id="subjectL" onchange="subjectExpand(this.value)">'+
     	'<option value="">Select a subject</option>';
  		for (var i=0; i < rows.length; i++) {
  			if(redun.indexOf(rows[i]['subject']) == -1)
  			{
   				test += '<option value="'+rows[i]['subject']+'">' + String(rows[i]['subject']) + "</option>";
   				redun.push(rows[i]['subject']);
   			}
  		}
  		test += '</select>'+'</form>';
  		var headers = {}
  		headers["Content-Type"] = "text/html";
  		headers["Access-Control-Allow-Origin"] = "*";
		response.writeHead(200, headers);
		response.write(test);
		response.end();
	});
}
//Called when the user first selects a subject
function subjectExpand(connection, getData, response, headers)
{
	connection.query('SELECT classID FROM classDB WHERE subject = ?', [getData["subject"]], function(error, rows, feilds){
		if(error)
		{
			throw error;
		}
		var redun = [];
		var temp = "document.getElementById('subjectL').value";
		var list = '<form action="">'+ 
  					'<select id="classL" onchange="classExpand(this.value,'+temp+') ">'+
  					'<option value="">Select a classID</option>';
		for (var i=0; i < rows.length; i++) {
			if(redun.indexOf(rows[i]['classID']) == -1)
			{
				list += '<option value="' + rows[i]['classID'] + '">' + String(rows[i]['classID']) + "</option>";
				redun.push(rows[i]['classID']);
			}
		}
		list += '</select>'+
				'</form>';


  		var headers = {};
  		headers["Content-Type"] = "text/html";
    		headers["Access-Control-Allow-Origin"] = "*";
    		response.writeHead(200, headers);
		response.write(list);
		response.end();
	});

}
//Called when a user first selects a class
function classExpand(connection, getData, response, headers)
{
	connection.query('SELECT section FROM classDB WHERE subject = ? AND classID = ?', [getData["subject"], getData["classID"]], function(error, rows, feilds){
		if(error)
		{
			throw error;
		}
		var redun = [];
		var temp = "document.getElementById('subjectL').value, document.getElementById('classL').value";
		var list = '<form action="">'+ 
  					'<select id="sectionL" onchange="sectionExpand('+temp+',this.value)">'+
  					'<option value="">Select a section</option>';
		for (var i=0; i < rows.length; i++) {
			if(redun.indexOf(rows[i]['section']) == -1)
			{
				list += '<option value="' + rows[i]['section'] + '">' + String(rows[i]['section']) + '</option>';
				redun.push(rows[i]['section']);
			}
		}
		list += '</select>'+
				'</form>';


		var headers = {};
  		headers["Content-Type"] = "text/html";
    		headers["Access-Control-Allow-Origin"] = "*";
    		response.writeHead(200, headers);
		response.write(list);
		response.end();

	});
}
//Called when a user first selects a section
function sectionExpand(connection, getData, response, headers)
{
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
exports.onLoading = onLoading;
exports.subjectExpand = subjectExpand;
exports.classExpand = classExpand;
exports.sectionExpand = sectionExpand;
