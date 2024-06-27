import {
  HandlerInput,
  RequestHandler,
} from 'ask-sdk-core';
import { PlayHandler }  from "./Play";

export const LaunchRequestHandler : RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  async handle(handlerInput : HandlerInput) {
    return await PlayHandler.handle(handlerInput);
  }
};
