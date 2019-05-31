var express = require('express');
var bodyParser = require('body-parser');
// import students list file
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
        case "get details":
            getDetails(parameters);
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

    function getDetails(parameters) {
        if (parameters.admission != "") {
            for (i = 0; i < members.length; i++) {
                if (members[i]["Admission No"] == parameters.admission) {
                    return response.json({
                        fulfillmentMessages: [{
                                text: {
                                    text: [`Admission No: ${members[i]["Admission No"]}`, `Admission Date: ${members[i]["Admission Date"]}`, `First Name: ${members[i]["First Name"]}`, `Middle Name: ${members[i]["Middle Name"]}`, `Last Name:${members[i]["Last Name"]}`, `National Student ID: ${members[i]["National Student ID"]}`, `Cohort: ${members[i]["Cohort"]}`, `Date Of Birth: ${members[i]["Date Of Birth"]}`, `Gender:${members[i]["Gender"]} `, `Nationality: ${members[i]["Nationality"]}`, `Second Language: ${members[i]["Second Language"]}`, `Religion: ${members[i]["Religion"]}`, `Student Category:${members[i]["Student Category"]}`, `Student Address Line 1:${members[i]["Student Address Line 1"]}`, `Student Address Line 2: ${members[i]["Student Address Line 2"]}`, `City: ${members[i]["City"]}`, `State: ${members[i]["State"]}`, `Pin Code:${members[i]["Pin Code"]}`, `Email:${members[i]["Email"]}`]
                                },
                                platform: "FACEBOOK"
                            },
                            {
                                text: {
                                    text: [`Admission No: ${members[i]["Admission No"]}`, `Admission Date: ${members[i]["Admission Date"]}`, `First Name: ${members[i]["First Name"]}`, `Middle Name: ${members[i]["Middle Name"]}`, `Last Name:${members[i]["Last Name"]}`, `National Student ID: ${members[i]["National Student ID"]}`, `Cohort: ${members[i]["Cohort"]}`, `Date Of Birth: ${members[i]["Date Of Birth"]}`, `Gender:${members[i]["Gender"]} `, `Nationality: ${members[i]["Nationality"]}`, `Second Language: ${members[i]["Second Language"]}`, `Religion: ${members[i]["Religion"]}`, `Student Category:${members[i]["Student Category"]}`, `Student Address Line 1:${members[i]["Student Address Line 1"]}`, `Student Address Line 2: ${members[i]["Student Address Line 2"]}`, `City: ${members[i]["City"]}`, `State: ${members[i]["State"]}`, `Pin Code:${members[i]["Pin Code"]}`, `Email:${members[i]["Email"]}`]

                                }
                            }
                        ],
                    });
                }
            } {
                return response.json({
                    fulfillmentMessages: [{
                            text: {
                                text: [
                                    `admission number ${parameters.admission} is not found`
                                ]
                            },
                            platform: "FACEBOOK"
                        },
                        {
                            text: {
                                text: [
                                    `admission number ${parameters.admission} is not found`
                                ]
                            }
                        }
                    ],
                });
            }
        } else {
            return response.json({
                fulfillmentMessages: [{
                        text: {
                            text: [
                                "please enter the admission number"
                            ]
                        },
                        platform: "FACEBOOK"
                    },
                    {
                        text: {
                            text: [
                                "please enter the admission number"
                            ]
                        }
                    }
                ],
            });
        }


    }

});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});