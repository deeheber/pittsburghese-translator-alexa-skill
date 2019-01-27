const Alexa = require('ask-sdk-core');

const dictionary = require('./data/dictionary');
const generatePrompt = require('./util/generatePrompt');
const prompts = require('./data/prompts');
const translator = require('./util/translator');

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

const TranslateHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TranslateIntent';
  },
  handle(handlerInput) {
    const phraseToTranslate = handlerInput.requestEnvelope.request.intent.slots.Phrase.value;
    const translated = translator(dictionary, phraseToTranslate);
    const followUpPrompt = generatePrompt(prompts);

    return handlerInput.responseBuilder
      .speak(translated)
      .reprompt(followUpPrompt)
      .withSimpleCard('Hey Yinz', translated)
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
    TranslateHandler,
    HelpIntentHandler,
    CancelStopAndNoIntentHandler,
    YesIntentHandler,
    SessionEndedRequestHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda();
