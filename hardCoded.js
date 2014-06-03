function hardCoded(getData, htmlString, functionCalledFrom, callback)
{
	//Generate the database to perform "queries" on
	var redun = [];
	var rows = [];
	rows[0] = {'subject':'math','courseID':'algebra','section':'001','time':130,'room':'001',
		'waitList':0,'slotsTotal':50,'slotsOpen':25,'teacher': 'mathTeacher'};
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
		//Loop until you find the position of the desired table element and then add it as an option
	for (var i=0; i < rows.length; i++) {
		var select = true;
		for(var k = 1; k<functionCalledFrom.length;k++)
			{
				if(rows[i][functionCalledFrom[k]] == getData[functionCalledFrom[k]]){
				}
				else
				{
					select = false;
					break;
				}
			}
			if(select){
  				if(redun.indexOf(rows[i][functionCalledFrom[0]]) == -1)
  				{
   					htmlString += '<option value="'+rows[i][functionCalledFrom[0]]+'">' + String(rows[i][functionCalledFrom[0]]) + "</option>";
   					redun.push(rows[i][functionCalledFrom[0]]);
   				}
   			}
	}
  	callback(htmlString);
}
exports.hardCoded = hardCoded;