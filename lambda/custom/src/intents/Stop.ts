import {
    HandlerInput,
    RequestHandler,
} from 'ask-sdk-core';
import {
    Response,
} from 'ask-sdk-model';
import { IsIntent } from "../utilities/helpers";
import { IntentTypes } from "../types";

export const CancelAndStopHandler : RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      return IsIntent(
        handlerInput,
        IntentTypes.Stop,
        IntentTypes.Cancel,
        IntentTypes.CustomStop,
        IntentTypes.Pause,
        IntentTypes.AudioStop
      );
    },
    handle(handlerInput : HandlerInput) : Response {
      return handlerInput.responseBuilder.addAudioPlayerStopDirective().getResponse();
    },
};
