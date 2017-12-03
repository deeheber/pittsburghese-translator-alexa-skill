const Alexa = require("alexa-sdk");

const translator = require('./util/translator');
const continuePhrase = require('./util/continue');
const dictionary = require('./data/dictionary');

exports.handler = function(event, context) {
  const alexa = Alexa.handler(event, context);
  // TODO add app id here
  alexa.registerHandlers(handlers);
  alexa.execute();
};

const handlers = {
  'LaunchRequest'() {
    this.emit('MainMenu');
  },
  'MainMenuIntent'() {
    this.emit('MainMenu');
  },
  'MainMenu'() {
    this.emit(':ask', 'Welcome to the Pittsburghese translator. Say translate and the phrase you would like to translate.');
  },
  'TranslateIntent'() {
    this.emit('Translate');
  },
  'Translate'() {
    const phraseToTranslate = this.event.request.intent.slots.Phrase.value;
    const translated = translator(dictionary, phraseToTranslate);
    const i = Math.floor(Math.random() * ((continuePhrase.length - 1) + 1));

    this.emit(':ask', translated + '<break time="1.5s"/>' + continuePhrase[i]);
  },
  'AMAZON.HelpIntent'() {
    this.emit('Say translate and the phrase you would like to translate. For example you can try, "translate" I am going downtown');
  },
  'AMAZON.NoIntent'() {
    this.emit('Bye');
  },
  'AMAZON.YesIntent'() {
    this.emit(':ask', 'What would you like to hear?');
  },
  'AMAZON.StopIntent'() {
    this.emit('Bye');
  },
  'AMAZON.CancelIntent'() {
    this.emit('Bye');
  },
  'Bye'() {
    this.emit(':tell', 'Thanks for stopping by. Catch you next time.');
  },
  'Unhandled'() {
    this.emit(':ask', "Sorry, I didn't get that. You can say, 'translate' and the phrase you would like to hear");
  },
  'SessionEndedRequest'() {
    console.log('Session ended with reason: ' + this.event.request.reason);
  }
};
