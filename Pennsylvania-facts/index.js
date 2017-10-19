'use strict';

const Alexa = require('alexa-sdk');
const APP_ID =  'amzn1.ask.skill.89aa6c81-df5f-4d7a-b9b6-aa6237ea4d52';

const SKILL_NAME = 'Pennsylvania Facts';
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = 'You can say tell me a PA fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const data = [
    'Pennsylvania is the first state of the fifty United States to list their web site URL on a license plate.',
    'In 1909 the first baseball stadium was built in Pittsburgh.',
    'Hershey is considered the Chocolate Capital of the United States.',
    'In Hazleton, there is a law on the books that prohibits a person from sipping a carbonated drink while lecturing students in a school auditorium.',
    'KDKA radio in Pittsburgh produced the first commercial radio broadcast.',
    'Kennett Square is known as the Mushroom Capital of the World.',
    'The town of Franklin became a center for worldwide oil production following Colonel Edwin Drake\'s discovery of oil in nearby Titusville.',
    'The Rockville Bridge in Harrisburg is the longest stone arch bridge in the world.',
    'George G. Blaisdell founded Zippo Manufacturing of Bradford in late 1932. He started with a simple idea: create a product that answers a real need, design it to work, and guarantee it to last.',
    'Little League Baseball\'s first World Series was held in 1946 in Williamsport.',
    'Nazareth is the home of Martin guitars. Finger picking good since 1833.',
    'The State College Area High School was the first school in the country to teach drivers education in 1958.',
    'Punxsutawney citizens are proud to be over shadowed by their town\'s most famous resident the world-renowned weather forecasting groundhog Punxsutawney Phil. Punxsutawney is billed as the weather capital of the world.',
    'Pennsylvania is the only original colony not bordered by the Atlantic Ocean.',
    'Each year on Christmas day the "Crossing of the Delaware" is reenacted at Washington Crossing.',
    'The Liberty Tunnel in Pittsburgh opened in 1924. At that time the 5,700 foot facility was the longest artificially ventilated automobile tunnel in the world.',
    'Actor Jimmy Stewart was born and raised in the town of Indiana. Each year at Christmas the downtown area is decorated in the theme of the film "It\'s a Wonderful Life".'
];

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetNewFactIntent');
    },
    'GetNewFactIntent': function () {
        const factArr = data;
        const factIndex = Math.floor(Math.random() * factArr.length);
        const randomFact = factArr[factIndex];
        const speechOutput = GET_FACT_MESSAGE + randomFact;

        this.response.cardRenderer(SKILL_NAME, randomFact);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};
