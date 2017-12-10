const Alexa = require("alexa-sdk");

const translator = require('./util/translator');
const dictionary = require('./data/dictionary');

let storedTranslation = 'I don\'t have a translation to repeat';

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
    this.emit(':ask', 'Welcome to the Pittsburghese translator. Say translate and the phrase you would like to hear Yinzerized.');
  },
  'TranslateIntent'() {
    this.emit('Translate');
  },
  'Translate'() {
    const phraseToTranslate = this.event.request.intent.slots.Phrase.value;
    const translated = translator(dictionary, phraseToTranslate);

    storedTranslation = translated;

    this.emit(':ask', translated + '<break time="1.5s"/>' + 'is there anything else you would like me to do?');
  },
  'RepeatIntent'() {
    this.emit(':ask', storedTranslation + '<break time="1.5s"/>' + 'is there anything else you would like me to do?');
  },
  'SlowDownIntent'() {
    this.emit(':ask', `<prosody rate='x-slow' volume='loud'>${storedTranslation}</prosody>` + '<break time="1.5s"/>' + 'is there anything else you would like me to do?');
  },
  'AMAZON.HelpIntent'() {
    this.emit('Say translate and the phrase you would like to translate. For example you can try, "translate" I am going downtown');
  },
  'AMAZON.NoIntent'() {
    this.emit('Bye');
  },
  'AMAZON.YesIntent'() {
    this.emit(':ask', 'What can I do for you?');
  },
  'AMAZON.StopIntent'() {
    this.emit('Bye');
  },
  'AMAZON.CancelIntent'() {
    this.emit('Bye');
  },
  'Bye'() {
    this.emit(':tell', 'Catch yinz next time, bye!');
  },
  'Unhandled'() {
    this.emit(':ask', "Sorry, I didn't get that. You can say, 'translate' and the phrase you would like to hear");
  },
  'SessionEndedRequest'() {
    console.log('Session ended with reason: ' + this.event.request.reason);
  }
};
