var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var googleSpreadsheet = require('./googleSpreadsheet');
var dialogflow = require('./dialogflow');

var members = require('./eschool');
const membersCount = members.length;
app.use(express.static('public'));
app.use(bodyParser.json());

// To give out some informations on the current project
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

// the DialogFlow fulfillment endpoint
app.post('/webhook/', function(request, response) {
    const dialogflowRequest = request.body;
    // An intent's action serves as a mapping mechanism between your intent and a function living in your app.
    const action = dialogflowRequest.queryResult.action;
    const intent = dialogflowRequest.queryResult.intent.displayName

    switch (intent) {
        case "Default Welcome Intent":
            return response.json({ fulfillmentText: `webhook says this is ${intent} intent ` });
            break;
        case "static":
            response.json({ fulfillmentText: `webhook says this is ${intent} intent ` });
            break;
        case "total student count":
            response.json({ fulfillmentText: `webhook says this is ${intent} intent ` });
            break;
    }

    if (action === "totalStudent.action") {
        return response.json({ fulfillmentText: `The total strength is ${membersCount}` });
    }
    return response.json({ fulfillmentText: "This is from webhook recheck" });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});