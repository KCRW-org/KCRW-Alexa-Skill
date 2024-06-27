import {
  HandlerInput,
  RequestHandler,
} from 'ask-sdk-core';
import i18n from 'i18next';
import { IsIntent, resolveSlotValue } from "../utilities/helpers"
import { IntentTypes, RequestTypes, Strings } from "../types"
import { songDataForChannel } from "../utilities/SongData"
import { showDataForChannel } from "../utilities/ShowData"


export const WhatHandler : RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    return IsIntent(handlerInput, IntentTypes.What);
  },
  async handle(handlerInput : HandlerInput) {
    let suffix, what_slot, what_type, persistentAttributes;
    let responseBuilder = handlerInput.responseBuilder;
    const attributesManager = handlerInput.attributesManager;
    try {
      persistentAttributes = await attributesManager.getPersistentAttributes();
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error getting attributes: ${err.message}:\n\n ${err.stack}`);
      }
      persistentAttributes = {};
    }
    const channel_id = persistentAttributes.channelId || 'live';
    what_type = 'show';
    if (handlerInput.requestEnvelope.request.type === RequestTypes.Intent && handlerInput.requestEnvelope.request.intent && handlerInput.requestEnvelope.request.intent.slots) {
      what_slot = handlerInput.requestEnvelope.request.intent.slots.what;
      what_type = resolveSlotValue(what_slot, what_type);
    }

    if (what_type != 'show' && what_type != 'song') {
      console.log('Unknown what slot, using default: ' + JSON.stringify(handlerInput.requestEnvelope.request));
    }

    if (what_type == 'song' || channel_id == 'music') {
      if (what_type == 'show') {
        suffix = '<emphasis level="strong">' + i18n.t(Strings.ON_CHANNEL) + "</emphasis> Eclectic Twenty Four";
      }
      responseBuilder = await songDataForChannel(responseBuilder, channel_id, undefined, false, suffix);
    } else {
      responseBuilder = await showDataForChannel(responseBuilder, channel_id);
    }
    return responseBuilder.getResponse();
  }
};