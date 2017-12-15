const Alexa = require("alexa-sdk");

const translator = require('./util/translator');
const dictionary = require('./data/dictionary');

exports.handler = function(event, context) {
  const alexa = Alexa.handler(event, context);
  // TODO add app id here
  alexa.registerHandlers(handlers);
  alexa.execute();
};

const handlers = {
  'LaunchRequest'() {
    this.event.session.attributes.lastTranslation = undefined;
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

    this.event.session.attributes.lastTranslation = translated;

    this.emit(':ask', translated + '<break time="1.5s"/>' + 'is there anything else you would like me to do?');
  },
  'RepeatIntent'() {
    const phraseToRepeat = this.event.session.attributes.lastTranslation === undefined ?
      "I don't have a translation to repeat" :
      this.event.session.attributes.lastTranslation;

    this.emit(':ask', phraseToRepeat + '<break time="1.5s"/>' + 'is there anything else you would like me to do?');
  },
  'SlowDownIntent'() {
    const phraseToSlowDown = this.event.session.attributes.lastTranslation === undefined ?
      "I don't have a translation to repeat and slow down" :
      this.event.session.attributes.lastTranslation;

    this.emit(':ask', '<prosody rate="x-slow" volume="loud">' + phraseToSlowDown + '</prosody>' + '<break time="1.5s"/>' + 'is there anything else you would like me to do?');
  },
  'AMAZON.HelpIntent'() {
    this.emit(':ask', 'Say translate and the phrase you would like to translate. For example you can try, "translate" I am going downtown. You can also ask me to repeat or slow down the prior translation. What can I do for you?');
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
    this.event.session.attributes.lastTranslation = undefined;
    this.emit(':tell', 'Catch yinz next time, bye!');
  },
  'Unhandled'() {
    this.emit(':ask', "Sorry, I didn't get that. You can say, 'translate' and the phrase you would like to hear");
  },
  'SessionEndedRequest'() {
    this.event.session.attributes.lastTranslation = undefined;
    console.log('Session ended with reason: ' + this.event.request.reason);
  }
};
