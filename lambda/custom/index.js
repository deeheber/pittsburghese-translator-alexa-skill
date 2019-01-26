const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to Hey Yinz...what can I do for you?';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hey Yinz', speechText)
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'Say translate and the phrase you would like to translate. For example you can try, "translate" I am going downtown. You can also ask me to repeat or slow down the prior translation. What can I do for you?';
    const speechRepromptText = 'What can I do for you?';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechRepromptText)
      .withSimpleCard('Hey Yinz', speechText)
      .getResponse();
  }
};

const CancelStopAndNoIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent'
        );
  },
  handle(handlerInput) {
    const speechText = 'Catch yinz next time, bye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hey Yinz', speechText)
      .getResponse();
  }
};

const YesIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent';
  },
  handle(handlerInput) {
    const speechText = 'What can I do for you?';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hey Yinz', speechText)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    //TODO: add cleanup and console logs
    // console.log(`Session ended with reason: ${this.event.request.reason}`); ???
    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand that command. Please reopen the skill and try again.')
      .getResponse();
  },
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    HelpIntentHandler,
    CancelStopAndNoIntentHandler,
    YesIntentHandler,
    SessionEndedRequestHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda();

// const Alexa = require('alexa-sdk');
// const moment = require('moment');

// const dictionary = require('./data/dictionary');
// const generatePrompt = require('./util/generatePrompt');
// const prompts = require('./data/prompts');
// const translator = require('./util/translator');

// exports.handler = function(event, context) {
//   const alexa = Alexa.handler(event, context);

//   alexa.registerHandlers(handlers);
//   alexa.dynamoDBTableName = 'hey-yinz-dev';
//   alexa.execute();
// };

// const handlers = {
//   'LaunchRequest'() {
//     this.emit('MainMenu');
//   },
//   'MainMenuIntent'() {
//     this.emit('MainMenu');
//   },
//   'MainMenu'() {
//     const now = moment().utc();
//     const lastTimestamp = this.attributes['timestamp'];
//     const then = moment(lastTimestamp).utc();

//     let reply = `Welcome to Hey Yinz! To translate a phrase, you can say "translate" and the phrase you would like to hear in Pittsburghese. <break time="0.5s"/> After I reply, you can say "repeat" and I will repeat the translation. <break time="0.25s"/> You can also say "slow down" if you want to hear the translation again slower.  <break time="0.25s"/> What would you like to translate?`;

//     if (lastTimestamp) {
//       if (now.diff(then, 'days') < 7) {
//         reply = 'Welcome back to Hey Yinz! What would you like me to translate into Pittsburghese?';
//       }
//     }

//     this.attributes['timestamp'] = this.event.request.timestamp;

//     this.emit(':ask', reply);
//   },
//   'TranslateIntent'() {
//     this.emit('Translate');
//   },
//   'Translate'() {
//     const phraseToTranslate = this.event.request.intent.slots.Phrase.value;
//     const translated = translator(dictionary, phraseToTranslate);
//     const reply = generatePrompt(prompts);

//     this.attributes['lastTranslation'] = translated;

//     this.emit(':ask', `${translated} <break time="1.5s"/> ${reply}`);
//   },
//   'RepeatIntent'() {
//     const reply = generatePrompt(prompts);
//     const phraseToRepeat = this.attributes.lastTranslation ?
//       this.attributes.lastTranslation:
//       "I don't have a translation to repeat";

//     this.emit(':ask', `${phraseToRepeat} <break time="1.5s"/> ${reply}`);
//   },
//   'SlowDownIntent'() {
//     const reply = generatePrompt(prompts);
//     const phraseToSlowDown = this.attributes.lastTranslation ?
//       this.attributes.lastTranslation:
//       "I don't have a translation to repeat and slow down";

//     this.emit(':ask', `<prosody rate="x-slow" volume="loud"> ${phraseToSlowDown} </prosody> <break time="1.5s"/> ${reply}`);
//   }
// };
