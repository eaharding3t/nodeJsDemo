var AWS = require("aws-sdk")
function sqsRequest(callback){
	 AWS.config.loadFromPath('/var/www/html/repo/nodeJsDemo/config.json');
	var html = "<p>";
	var params = {
		QueueUrl: 'https://sqs.us-east-1.amazonaws.com/121717378798/poc-eh-queue',
		MessageBody: 'testing',

	};
	var sqs = new AWS.SQS();
	sqs.sendMessage(params, function(err, data){
		sqs.sendMessage(params, function(err, data){});
		params = {
			QueueUrl: 'https://sqs.us-east-1.amazonaws.com/121717378798/poc-eh-queue'
		};
		sqs.receiveMessage(params, function(err,data){
			html += data['Messages'][0]['Body'];
			callback(html);
		});
	});
}
exports.sqsRequest = sqsRequest;
