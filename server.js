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


   if ( action === "totalStudent.action") {
    return response.json({fulfillmentText:`The total strength is ${membersCount}`});
   }
  console.log(action);
  // these 3 variables could come from your intent's parameters !
  // const tabName = 'schoolDemo1';
  // const startCell = 'A2';
  // const endCell = 'A3';
  
  // return googleSpreadsheet.getDataFromSpreadsheet(tabName, startCell, endCell)
  //   .then((results) => {
  //     response.json(
  //       dialogflow.convertFormat(results)
  //     );
  //   }).catch((error) => {
  //     throw new Error(error);
  //   });
  // speech = "Hello there, this reply is from the webhook !! "
  //   string = "You are awesome !!"
  //   Message ="this is the message"

  //   my_result =  {

  //   "fulfillmentText": string,
  //    "source": string
  //   }

  //   res = json.dumps(my_result, indent=4)

  //   r = make_response(res)

  //   r.headers['Content-Type'] = 'application/json'
  //   return r
  return response.json({fulfillmentText:"This is from webhook recheck"});
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
