const Alexa = require("alexa-sdk");

exports.handler = function(event, context) {
  const alexa = Alexa.handler(event, context);
  // TODO add app id here
  alexa.registerHandlers(handlers);
  alexa.execute();
};

const handlers = {
  'LaunchRequest': function() {
    this.emit('MainMenu');
  },
  'MainMenuIntent': function() {
    this.emit('MainMenu');
  },
  'MainMenu': function() {
    this.emit(':ask', 'Welcome to the Pittsburghese translator. Say translate and the phrase you would like to translate.');
  },
  'TranslateIntent': function() {
    this.emit('Translate');
  },
  'Translate': function() {
    const phraseToTranslate = this.event.request.intent.slots.Phrase.value;
    // TODO transform the output to pittsburghese here probably by using a dictionary
    this.response.speak(phraseToTranslate);
    this.emit(':responseReady');
  },
  'AMAZON.HelpIntent': function() {
    this.emit('Say translate and the phrase you would like to translate. For example you can try, "translate" I am going downtown');
  },
  'AMAZON.StopIntent': function() {
    this.emit('Bye');
  },
  'AMAZON.CancelIntent': function() {
    this.emit('Bye');
  },
  'Bye': function() {
    this.response.speak('Thanks for stopping by. Catch you next time.');
    this.emit(':responseReady');
  },
  'Unhandled': function() {
    this.emit(':ask', "Sorry, I didn't get that. You can say, 'translate' and the phrase you would like to hear");
  },
  'SessionEndedRequest': function() {
    console.log('Session ended with reason: ' + this.event.request.reason);
  }
};
