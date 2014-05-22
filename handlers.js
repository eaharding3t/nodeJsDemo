var sql = require("mysql");
// Called on page load to populate subject list
function onLoading(connection, getData, response)
{
	connection.query('SELECT subject FROM classDB', function(error, rows, feilds){
		if(error)
		{
			throw error;
		}		

		var list = '<form action="">'+ 
  					'<select name="subjects" onchange="classExpand(this.value)">'+
  					'<option value="">Select a subject</option>';
		for (var i=0; i < rows.length; i++) {
			list += '<option value="'+ rows[i]['subject'] +'">' + String(rows[i]['subject']) + "</option>";
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
//Called when the user first selects a subject
function subjectExpand(connection, getData, response)
{
	connection.query('SELECT classID FROM classDB WHERE subject == ?', [getData["subject"]], function(error, rows, feilds){
		if(error)
		{
			throw error;
		}

		var list = '<form action="">'+ 
  					'<select name="subjects" onchange="classExpand(this.value)">'+
  					'<option value="">Select a subject</option>';
		for (var i=0; i < rows.length; i++) {
			list += '<option value="' + rows[i]['classID'] + '">' + String(rows[i]['classID']) + "</option>";
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
function classExpand(connection, getData, response)
{
	connection.query('SELECT section FROM classDB WHERE subject == ? AND classID == ?', [getData["subject"], getData["classID"]], function(error, rows, feilds){
		if(error)
		{
			throw error;
		}

		var list = '<form action="">'+ 
  					'<select name="subjects" onchange="classExpand(this.value)">'+
  					'<option value="">Select a subject</option>';
		for (var i=0; i < rows.length; i++) {
			list += '<option value="' + rows[i]['section'] + '">' + String(rows[i]["getData["subjects"], getData["classID"]"]) + "</option>";
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
function sectionExpand(connection, getData, response)
{
	connection.query('SELECT slotsOpen, slotsTotal, teacher, time, room, waitlist FROM classDB WHERE subject == ? AND classID == ? AND section == ?',[getData["subject"], getData["classID"], getData["section"]],function(error, rows, feilds){
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
						'<td>' + String(rows[0]['slotsOpen']) + '</td>';
						'<td>' + String(rows[0]['slotsTotal']) + '</td>';
						'<td>' + String(rows[0]['teacher']) + '</td>';
						'<td>' + String(rows[0]['time']) + '</td>';
						'<td>' + String(rows[0]['room']) + '</td>';
						'<td>' + String(rows[0]['waitlist']) + '</td>';
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
