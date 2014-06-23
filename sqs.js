var AWS = require("aws-sdk")
function sqsRequest(callback){
	AWS.config.update({"accessKeyId": process.env.AWS_ACCESS_KEY_ID, "secretAccessKey": process.env.AWS_SECRET_KEY, "region": "us-east-1"});
	var html = "";
	var temp1 = "";
	var temp2;
	var params = {
		QueueUrl: 'https://sqs.us-east-1.amazonaws.com/121717378798/poc-eh-queue'

	};
	var sqs = new AWS.SQS();
	sqs.receiveMessage(params, function(err, data){
		//html += data['Messages'][0]['Body']['Subject'] + ' : ' + data['Messages'][0]['Body']['Message'];
		temp1 += data['Messages'][0]['Body'];
		temp2 = JSON.parse(temp1);
		html = temp2['Subject'] + ' : ' + temp2['Message'];
		callback(html);
	});
}
exports.sqsRequest = sqsRequest;
