var express = require('express');
var bodyParser = require('body-parser');
var googleSpreadsheet = require('./googleSpreadsheet');
// import students list file
// var studentsData = require('"csvjson (1).json"')
// console.log(studentsData.length)
var members = require('./eschool');

var app = express();
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
    const intent = dialogflowRequest.queryResult.intent.displayName;
    const parameters = dialogflowRequest.queryResult.parameters;
    // intent handling
    switch (intent) {
        case "Default Welcome Intent":
            return response.json({ fulfillmentText: `webhook says this is ${intent} intent ` });
        case "count":
            getCount(parameters);
            break;
        case "total student count":
            totCount();
            break;
        case "total Male student count":
            totmaleCount();
            break;
        case "total female student count":
            totfemaleCount();
            break;
        default:
            return response.json({ fulfillmentText: `The webhook recheck` });
    }

    function getCount(parameters) {
        switch (parameters.typeOf) {
            case 'male':
                totmaleCount();
                break;
            case 'female':
                totfemaleCount();
                break;
            case 'both':
                totCount();
                break;
            default:
                return response.json({
                    fulfillmentMessages: [{
                            quickReplies: {
                                title: "whom do you want to count",
                                quickReplies: [
                                    "Girls",
                                    "Boys",
                                    "Both"
                                ]
                            },
                            platform: "FACEBOOK"
                        },
                        {
                            text: {
                                text: [
                                    `whom do you want to count boys, girls or both`
                                ]
                            }
                        }
                    ],
                });
        }
    }

    function totCount() {
        var membersCount = members.length;
        return response.json({
            fulfillmentMessages: [{
                    text: {
                        text: [
                            `Total students are ${membersCount}`
                        ]
                    },
                    platform: "FACEBOOK"
                },
                {
                    text: {
                        text: [
                            `Total students are ${membersCount}`
                        ]
                    }
                }
            ],
        });
    }

    function totmaleCount() {
        var malecount = 0;
        for (i = 0; i < members.length; i++) {
            if (members[i].Gender == "Male") {
                malecount++
            }
        }
        return response.json({
            fulfillmentMessages: [{
                    text: {
                        text: [
                            `Total male students are ${malecount}`
                        ]
                    },
                    platform: "FACEBOOK"
                },
                {
                    text: {
                        text: [
                            `Total male students are ${malecount}`
                        ]
                    }
                }
            ],
        });
    }

    function totfemaleCount() {
        var femalecount = 0;
        for (i = 0; i < members.length; i++) {
            if (members[i].Gender == "Female") {
                femalecount++
            }
        }
        return response.json({
            fulfillmentMessages: [{
                    text: {
                        text: [
                            `Total female students are ${femalecount}`
                        ]
                    },
                    platform: "FACEBOOK"
                },
                {
                    text: {
                        text: [
                            `Total male students are ${femalecount}`
                        ]
                    }
                }
            ],
        });
    }

});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});