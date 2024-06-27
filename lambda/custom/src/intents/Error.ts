import { ErrorHandler, HandlerInput } from 'ask-sdk-core';
import { Strings } from '../types';
import i18n from 'i18next';

/**
 * Handles ErrorTypes.Unexpected errors which should be thrown when something
 * unexpected happens.
 */
export const ErrorProcessor: ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput: HandlerInput, error: Error) {
    console.log(`Error handled: ${error.message}. \n\n ${error.stack} \n\n ${JSON.stringify(handlerInput.requestEnvelope.request)}`);

    return handlerInput.responseBuilder
      .speak(i18n.t(Strings.GENERIC_ERROR_MESSAGE))
      .getResponse();
  },
};