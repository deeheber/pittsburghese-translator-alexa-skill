const Alexa = require('ask-sdk-core');
const { DynamoDbPersistenceAdapter } = require('ask-sdk-dynamodb-persistence-adapter');
const persistenceAdapter = new DynamoDbPersistenceAdapter({
  tableName: 'hey-yinz-dev'
});

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
  async handle(handlerInput) {
    const attributes = await handlerInput.attributesManager.getPersistentAttributes();
    const phraseToTranslate = handlerInput.requestEnvelope.request.intent.slots.Phrase.value;
    const translated = translator(dictionary, phraseToTranslate);
    const followUpPrompt = generatePrompt(prompts);

    attributes.lastTranslation = translated;
    handlerInput.attributesManager.setPersistentAttributes(attributes);
    await handlerInput.attributesManager.savePersistentAttributes();

    return handlerInput.responseBuilder
      .speak(translated)
      .reprompt(followUpPrompt)
      .withSimpleCard('Hey Yinz', translated)
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
      .speak(phraseToRepeat)
      .reprompt(followUpPrompt)
      .withSimpleCard('Hey Yinz', phraseToRepeat)
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
      .speak(`<emphasis level="strong">${phraseToSlowDown}</emphasis>`)
      .reprompt(followUpPrompt)
      .withSimpleCard('Hey Yinz', phraseToSlowDown)
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
    console.log(`Error message: ${error.message}`);
    console.log(`Error: ${JSON.stringify(error, null, '\t')}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand that command. Please reopen the skill and try again.')
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
