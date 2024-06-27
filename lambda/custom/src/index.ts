import * as Alexa from 'ask-sdk-core';
import { LaunchRequestHandler } from "./intents/Launch";
import { PlayHandler } from "./intents/Play";
import { WhatHandler } from "./intents/What";
import { CancelAndStopHandler } from "./intents/Stop";
import { HelpIntentHandler } from "./intents/Help";
import { ErrorProcessor } from "./intents/Error";
import { SessionEnded } from "./intents/End";
import { LocalizationRequestInterceptor } from "./interceptors/LocalizationRequestInterceptor";
import { dynamoDbPersistenceAdapter } from "./utilities/persistence";

export const handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    PlayHandler,
    WhatHandler,
    CancelAndStopHandler,
    HelpIntentHandler,
    SessionEnded,
  )
  .addErrorHandlers(ErrorProcessor)
  .addRequestInterceptors(LocalizationRequestInterceptor)
  .withPersistenceAdapter(dynamoDbPersistenceAdapter)
  .lambda();

console.log("Test test");