var AWS = require("aws-sdk")
function sqsRequest(callback){
	AWS.config.update({"accessKeyId": process.env.AWS_ACCESS_KEY_ID, "secretAccessKey": process.env.AWS_SECRET_KEY, "region": "us-east-1"});
	var html = "";
	var params = {
		QueueUrl: 'https://sqs.us-east-1.amazonaws.com/121717378798/poc-eh-queue'

	};
	var sqs = new AWS.SQS();
	sqs.receiveMessage(params, function(err, data){
		//html += data['Messages'][0]['Body']['Subject'] + ' : ' + data['Messages'][0]['Body']['Message'];
		html += data['Messages'][0]['Body'];
		console.log(typeof html);
		callback(html);
	});
}
exports.sqsRequest = sqsRequest;
