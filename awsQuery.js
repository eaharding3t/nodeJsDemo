var AWS = require("aws-sdk");
function awsQuery(getData, htmlString, functionCalledFrom, callback){
	var redun = [];
	AWS.config.loadFromPath('./config.json');
	var db = new AWS.DynamoDB();
	if(functionCalledFrom[0] == 'subject'){
		var params = {
			TableName: 'classTable',
			AttributesToGet: [functionCalledFrom[0]],
		}
		db.scan(params, function(err,data){
			if(err){throw err;}
			else{
				for (var i=0; i < data['Items'].length; i++) {
  					if(redun.indexOf(data['Items'][i]['subject']['S']) == -1)
  					{
   						htmlString += '<option value="'+data['Items'][i]['subject']['S']+'">' 
   						+ String(data['Items'][i]['subject']['S']) + "</option>";
   						redun.push(data['Items'][i]['subject']['S']);
   					}
  				}
  				callback(htmlString);
			}

		});
	}
	else if(functionCalledFrom[0] == 'classID'){
		var params = {
			TableName:'classTable',
			IndexName: functionCalledFrom[1]+"-index",
			AttributesToGet: [functionCalledFrom[0]],
			KeyConditions: {
				"subject":
				{
					"AttributeValueList": [{"S" : getData['subject']}],
					ComparisonOperator: 'EQ'
				}
			}
		}
		db.query(params, function(err,data){
			if(err){throw err;}
			else{
				console.log(data['Items'][0]['classID']['S']);
				for (var i=0; i < data['Items'].length; i++) {
  					if(redun.indexOf(data['Items'][i]['classID']['S']) == -1)
  					{
   						htmlString += '<option value="'+data['Items'][i]['classID']['S']+'">' + String(data['Items'][i]['classID']['S']) + "</option>";
   						redun.push(data['Items'][i]['classID']['S']);
   					}
  				}
  				callback(htmlString);
			}
		});
	}
	else if(functionCalledFrom[0] == 'section'){
		var params = {
			TableName:'classTable',
			IndexName: "classID"+"-index",
			AttributesToGet: ["section"],
			KeyConditions: {
				"classID":
				{
					"AttributeValueList": [{"S" : getData['classID']}],
					ComparisonOperator: 'EQ'
				}
			}
		}
		db.query(params, function(err,data){
			if(err){throw err;}
			else{
				for (var i=0; i < data['Items'].length; i++) {
  					if(redun.indexOf(data['Items'][i]['section']['S']) == -1)
  					{
   						htmlString += '<option value="'+data['Items'][i]['section']['S']+'">' + String(data['Items'][i]['section']['S']) + "</option>";
   						redun.push(data['Items'][i]['section']['S']);
   					}
  				}
  				callback(htmlString);
			}
		});
	}
}
exports.awsQuery = awsQuery;