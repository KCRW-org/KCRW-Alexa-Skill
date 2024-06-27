import { RequestHandler, HandlerInput } from 'ask-sdk-core';
import { IsType } from '../utilities/helpers';
import { RequestTypes } from '../types';

export const SessionEnded: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return IsType(handlerInput, RequestTypes.SessionEnded);
  },
  handle(handlerInput: HandlerInput) {
    console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  },
};
