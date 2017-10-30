'use strict';
var Alexa = require("alexa-sdk");

exports.handler = function(event, context) {
  var alexa = Alexa.handler(event, context);
  // TODO add app id here
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  'LaunchRequest': function () {
    this.emit('MainMenu');
  },
  'MainMenuIntent': function () {
    this.emit('MainMenu');
  },
  'TranslateIntent': function () {
    this.emit('Translate');
  },
  'MainMenu': function () {
    this.emit(':ask', 'Welcome to the Pittsburghese translator. Say translate and the phrase you would like to translate.');
  },
  'Translate': function() {
    var phraseToTranslate = this.event.request.intent.slots.Phrase.value;
    // TODO transform the output to pittsburghese here probably by using a dictionary
    this.response.speak('In the translate:' + phraseToTranslate);
    this.emit(':responseReady');
  },
  'SessionEndedRequest' : function() {
    console.log('Session ended with reason: ' + this.event.request.reason);
  },
  'AMAZON.StopIntent' : function() {
    this.response.speak('Bye');
    this.emit(':responseReady');
  },
  'AMAZON.HelpIntent' : function() {
    // TODO add actual directions
    this.response.speak("You can try: 'enter help intent directions here'");
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent' : function() {
    this.response.speak('Bye');
    this.emit(':responseReady');
  },
  'Unhandled' : function() {
    // TODO add helpful speech here
    this.response.speak("Sorry, I didn't get that. You can try: 'insert unhandled info here'");
  }
};
