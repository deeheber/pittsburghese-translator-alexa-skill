const moment = require('moment');
const Alexa = require('ask-sdk-core');
const { DynamoDbPersistenceAdapter } = require('ask-sdk-dynamodb-persistence-adapter');
const persistenceAdapter = new DynamoDbPersistenceAdapter({
  tableName: process.env.TABLE_NAME
});

const CARD_TITLE = 'Hey Yinz';
const dictionary = require('./data/dictionary');
const generatePrompt = require('./util/generatePrompt');
const prompts = require('./data/prompts');
const translator = require('./util/translator');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    const attributes = await handlerInput.attributesManager.getPersistentAttributes();
    const { lastTimestamp } = attributes;
    const now = moment().utc();
    const then = moment(lastTimestamp).utc();

    let speechText = `Welcome to Hey Yinz! To translate a phrase into Pittsburghese, you can say "translate" and the phrase you would like to hear in Pittsburghese. <break time="0.5s"/> After I reply, you can say "repeat" and I will repeat the translation. <break time="0.25s"/> You can also say "slow down" if you want to hear the translation again slower.  <break time="0.25s"/> What would you like to translate?`;

    if (lastTimestamp && now.diff(then, 'days') < 7) {
      speechText = 'Welcome back to Hey Yinz! What would you like to translate into Pittsburghese?';
    }

    // TODO figure out why this assignment doesn't work with the destructured var
    attributes.lastTimestamp = now.toString();
    handlerInput.attributesManager.setPersistentAttributes(attributes);
    await handlerInput.attributesManager.savePersistentAttributes();

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt('What would you like to translate into Pittsburghese?')
      .withSimpleCard(CARD_TITLE, 'Welcome to Hey Yinz! What would you like to translate into Pittsburghese?')
      .getResponse();
  }
};

const TranslateHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TranslateIntent';
  },
  async handle(handlerInput) {
    const attributes = await handlerInput.attributesManager.getPersistentAttributes();
    const phraseToTranslate = handlerInput.requestEnvelope.request.intent.slots.Phrase.value;
    const translated = translator(dictionary, phraseToTranslate);
    const followUpPrompt = generatePrompt(prompts);

    attributes.lastTranslation = translated;
    handlerInput.attributesManager.setPersistentAttributes(attributes);
    await handlerInput.attributesManager.savePersistentAttributes();

    return handlerInput.responseBuilder
      .speak(`${translated} <break time="1.5s"/> ${followUpPrompt}`)
      .reprompt(followUpPrompt)
      .withSimpleCard(CARD_TITLE, translated)
      .getResponse();
  }
};

const RepeatHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'RepeatIntent';
  },
  async handle(handlerInput) {
    const attributes = await handlerInput.attributesManager.getPersistentAttributes();
    const { lastTranslation } = attributes;
    const phraseToRepeat = lastTranslation ? lastTranslation : 'I don\'t have a translation to repeat';
    const followUpPrompt = generatePrompt(prompts);

    return handlerInput.responseBuilder
      .speak(`${phraseToRepeat} <break time="1.5s"/> ${followUpPrompt}`)
      .reprompt(followUpPrompt)
      .withSimpleCard(CARD_TITLE, phraseToRepeat)
      .getResponse();
  }
};

const SlowDownHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SlowDownIntent'
  },
  async handle(handlerInput) {
    const attributes = await handlerInput.attributesManager.getPersistentAttributes();
    const { lastTranslation } = attributes;
    const phraseToSlowDown = lastTranslation ? lastTranslation : 'I don\'t have a translation to slow down';
    const followUpPrompt = generatePrompt(prompts);

    return handlerInput.responseBuilder
      .speak(`<prosody pitch="low"><emphasis level="strong">${phraseToSlowDown}</emphasis></prosody> <break time="1.5s"/> ${followUpPrompt}`)
      .reprompt(followUpPrompt)
      .withSimpleCard(CARD_TITLE, phraseToSlowDown)
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
      .withSimpleCard(CARD_TITLE, speechText)
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
    const speechText = 'Okay, hope to catch yinz again soon!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(CARD_TITLE, speechText)
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
      .withSimpleCard(CARD_TITLE, speechText)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.error(JSON.stringify(error, null, 2));

    const speechText = 'I\’m sorry, Hey Yinz can\’t help with that yet. Hey Yinz can translate a phrase into Pittsburghese and can also repeat or slow down the prior translation. Which would you like to do?'

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt('Which would you like to do?')
      .withSimpleCard(CARD_TITLE, speechText)
      .getResponse();
  },
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    TranslateHandler,
    RepeatHandler,
    HelpIntentHandler,
    SlowDownHandler,
    CancelStopAndNoIntentHandler,
    YesIntentHandler,
    SessionEndedRequestHandler)
  .withPersistenceAdapter(persistenceAdapter)
  .addErrorHandlers(ErrorHandler)
  .lambda();
