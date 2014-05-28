var mysql = require("mysql");
//var AWS = require("aws-skd");
function queryDB(getData, htmlString, dataType, fuctionCalledFrom)
{
	var queryString ="";
	return function(callback, errback){
		if(dataType == 0){
			if(fuctionCalledFrom.length == 0)
			{
				queryString = 'SELECT subject FROM classDB';
			}
			var redun = [];
			var rows = [];
			rows[0] = {subject:'math',classID:'algebra',section:'001',time:130,room:'001',
			waitList:0,slotsTotal:50,slotsOpen:25,teacher: 'mathTeacher'};
			rows[1]={'subject':'math','classID':'linear','section':'500','time':730,
				'room': '320','waitList':5,'slotsTotal':60,'slotsOpen':0,'teacher': 'Jim'};
			rows[2]={'subject':'math','classID':'calculus','section':'201','time':730,
				'room': '320','waitList':5,'slotsTotal':60,'slotsOpen':0,'teacher': 'Bob'};
			rows[3]={'subject':'math','classID':'geometry','section':'101','time':830,
				'room': '320','waitList':5,'slotsTotal':60,'slotsOpen':0,'teacher': 'John'};
			rows[4]={'subject':'english','classID':'modern lit','section':'400','time':1230,
				'room': '301','waitList':0,'slotsTotal':60,'slotsOpen':15,'teacher': 'englishTeacher'};
			rows[5] = {'subject':'computerScience','classID':'data structures','section':'430','time':530,
				'room': '305','waitList':20,'slotsTotal':60,'slotsOpen':0,'teacher': 'computerScienceTeacher'};
			rows[6]={'subject':'computerEngineering','classID':'data','section':'432','time':230,
				'room': '305','waitList':20,'slotsTotal':60,'slotsOpen':12,'teacher': 'computerEngineeringTeacher'};
			rows[7]={'subject':'electrical','classID':'wiring','section':'436','time':235,
				'room': '325','waitList':10,'slotsTotal':60,'slotsOpen':12,'teacher': 'electricalTeacher'};
			for (var i=0; i < rows.length; i++) {
				var select = true;
				for(var k = 1; k<fuctionCalledFrom.length;k++)
				{
					if(rows[i][fuctionCalledFrom[k]] == getData[functionCalledFrom[k]]){
					}
					else
					{
						select = false;
						break;
					}
				}
				if(select){
  					if(redun.indexOf(rows[i][fuctionCalledFrom[0]]) == -1)
  					{
   						htmlString += '<option value="'+rows[i][fuctionCalledFrom[0]]+'">' + String(rows[i][fuctionCalledFrom[0]]) + "</option>";
   						redun.push(rows[i][fuctionCalledFrom[0]]);
   					}
   				}
			}
  					callback(htmlString);
		}
		else if (dataType == 1)
		{
			if(fuctionCalledFrom.length == 1)
			{
				queryString = 'SELECT subject FROM classDB';
			}
			else
			{
				queryString = "SELECT "+fuctionCalledFrom[0]+" FROM classDB where ";
				for(var i =1;i<fuctionCalledFrom.length;i++){
					if(i>1)
					{
						queryString+=" AND ";
					}
					queryString +=fuctionCalledFrom[i]+"="+'"'+getData[fuctionCalledFrom[i]]+'"';
				}
			}
			var redun =[];
			var connection = mysql.createConnection({
			host : '127.0.0.1',
			database: 'test',
			user : 'root',
			password: 'He18272752!'
			});
			connection.query(queryString, function(error, rows, feilds){
				if(error)
				{
					throw error;
				}
  				for (var i=0; i < rows.length; i++) {
  					if(redun.indexOf(rows[i][fuctionCalledFrom[0]]) == -1)
  					{
   						htmlString += '<option value="'+rows[i][fuctionCalledFrom[0]]+'">' + String(rows[i][fuctionCalledFrom[0]]) + "</option>";
   						redun.push(rows[i][fuctionCalledFrom[0]]);
   					}
  				}
  				callback(htmlString);
			});
		}
		else if(dataType == 2)
		{
			/*
			var attributes
			var params = {
				TableName:'classTable',
				IndexName: fuctionCalledFrom[0],
				AttributesToGet:[fuctionCalledFrom[0]],
				KeyConditions: {
					findIt:
					{
						AttributeValueList: []
						ComparisonOperator: 'EQ'
					}
				}
			}
			*/
		}
		else if (dataType == 3)
		{

		}
	}
}
exports.queryDB = queryDB;