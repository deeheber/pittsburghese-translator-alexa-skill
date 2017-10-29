'use strict';
var Alexa = require("alexa-sdk");

exports.handler = function(event, context) {
  var alexa = Alexa.handler(event, context);
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
    this.response.speak('you are at the main menu');
    this.emit(':responseReady');
  },
  'Translate': function() {
    var phraseToTranslate = this.event.request.intent.slots.Phrase.value;
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
    this.response.speak("You can try: 'enter help intent directions here'");
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent' : function() {
    this.response.speak('Bye');
    this.emit(':responseReady');
  },
  'Unhandled' : function() {
    this.response.speak("Sorry, I didn't get that. You can try: 'insert unhandled info here'");
  }
};
