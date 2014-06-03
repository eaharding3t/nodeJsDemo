var AWS = require("aws-sdk");
function dynamoQuery(getData, htmlString, functionCalledFrom, callback){
	var redun = [];
	//To change which dynamoDB you are connecting to change the config.json file
	AWS.config.loadFromPath('./config.json');
	var db = new AWS.DynamoDB();
	//Based on which function called queryDB perform a different action on the dynamoDB
	//Select all the subjects and remove duplicates and use this list to build options for display
	if(functionCalledFrom[0] == 'subject'){
		//Generate paramaters for the scan equivelent sql statment is
		// SELECT subject FROM classTable
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
	//Select all courseIDs with a subject matching the above select box
	else if(functionCalledFrom[0] == 'courseID'){
		//Generate paramaters for the query. Equivelent sql statment is
		// SELECT classID FROM classTable WHERE subject = getData['subject']
		var params = {
			TableName:'classTable',
			IndexName: 'subject'+"-index",
			AttributesToGet: ['classID'],
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
	//Select all sections with a courseID matching the above select box
	else if(functionCalledFrom[0] == 'section'){
		//Generate paramaters for the query. Equivelent sql statment is
		// SELECT section FROM classTable WHERE classID = getData['classID']
		var params = {
			TableName:'classTable',
			IndexName: "classID"+"-index",
			AttributesToGet: ["section"],
			KeyConditions: {
				"classID":
				{
					"AttributeValueList": [{"S" : getData['courseID']}],
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
exports.dynamoQuery = dynamoQuery;