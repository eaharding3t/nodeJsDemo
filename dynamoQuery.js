var AWS = require("aws-sdk");
function dynamoQuery(getData, htmlString, functionCalledFrom, callback){
	var redun = [];
	//To change which dynamoDB you are connecting to change the config.json file
	AWS.config.update({"accessKeyId": process.env.AWS_ACCESS_KEY_ID, "secretAccessKey": process.env.AWS_SECRET_KEY, "region": "us-east-1"});
	var db = new AWS.DynamoDB();
	//Based on which function called queryDB perform a different action on the dynamoDB
	//Select all the subjects and remove duplicates and use this list to build options for display
	if(functionCalledFrom[0] == 'subject'){
		//Generate paramaters for the scan. equivelent sql statment is
		// SELECT subject FROM classTable
		var params = {
			TableName: 'subject',
			AttributesToGet: [functionCalledFrom[0]],
		}
		try{
		db.scan(params, function(err,data){
			if(err){console.log(err);}
			else{
				for (var i=0; i < data['Items'].length; i++) {
   						htmlString += '<option value="'+data['Items'][i]['subject']['S']+'">' 
   						+ String(data['Items'][i]['subject']['S']) + "</option>";
  				}
  				callback(htmlString);
			}

		});
		}
		catch(err){}
	}
	//Select all courseIDs with a subject matching the above select box
	else if(functionCalledFrom[0] == 'courseID'){
		//Generate paramaters for the query. Equivelent sql statment is
		// SELECT classID FROM classTable WHERE subject = getData['subject']
		var params = {
			TableName:'course',
			IndexName: 'subject'+"-index",
			AttributesToGet: ['course'],
			KeyConditions: {
				"subject":
				{
					"AttributeValueList": [{"S" : getData['subject']}],
					ComparisonOperator: 'EQ'
				}
			}
		}
		try{
		db.query(params, function(err,data){
			if(err){console.log(err);}
			else{
				for (var i=0; i < data['Items'].length; i++) {
  					if(redun.indexOf(data['Items'][i]['course']['S']) == -1)
  					{
   						htmlString += '<option value="'+data['Items'][i]['course']['S']+'">' + String(data['Items'][i]['course']['S']) + "</option>";
   						redun.push(data['Items'][i]['course']['S']);
   					}
  				}
  				callback(htmlString);
			}
		});
		}
		catch(err)
		{}
	}
	//Select all sections with a courseID matching the above select box
	else if(functionCalledFrom[0] == 'section'){
		//Generate paramaters for the query. Equivelent sql statment is
		// SELECT section FROM classTable WHERE course = getData['course']
		var params = {
			TableName:'course',
			IndexName: "course"+"-index",
			AttributesToGet: ["section"],
			KeyConditions: {
				"course":
				{
					"AttributeValueList": [{"S" : getData['courseID']}],
					ComparisonOperator: 'EQ'
				}
			}
		}
		try{
		db.query(params, function(err,data){
			if(err){console.log(err);}
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
		catch(err){}
	}
}
exports.dynamoQuery = dynamoQuery;
