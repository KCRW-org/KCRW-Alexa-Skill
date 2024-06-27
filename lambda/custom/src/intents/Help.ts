import {
    HandlerInput,
    RequestHandler,
} from 'ask-sdk-core';
import {
    Response,
} from 'ask-sdk-model';
import i18n from 'i18next';
import { IsIntent } from "../utilities/helpers"
import { IntentTypes } from "../types"
import { Strings } from "../types";

export const HelpIntentHandler : RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    return IsIntent(handlerInput, IntentTypes.Play, IntentTypes.Help);
  },
  handle(handlerInput : HandlerInput) : Response {
    const speechText = i18n.t(Strings.HELP_MESSAGE);
    const repromptText = i18n.t(Strings.HELP_REPROMPT);
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .getResponse();
  },
};
