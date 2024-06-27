import { HandlerInput } from 'ask-sdk-core';
import { Slot } from "ask-sdk-model";
import { RequestTypes } from '../types';

/**
 * Checks if the request matches any of the given intents.
 *
 * @param handlerInput
 * @param intents
 */
export function IsIntent(handlerInput: HandlerInput, ...intents: string[]): boolean {
  if (handlerInput.requestEnvelope.request.type === RequestTypes.Intent) {
    for (let i = 0; i < intents.length; i++) {
      if (handlerInput.requestEnvelope.request.intent.name === intents[i]) {
        return true;
      }
    }
  }
  return false;
}

export function IsType(handlerInput: HandlerInput, ...types: string[]): boolean {
  for (let i = 0; i < types.length; i++) {
    if (handlerInput.requestEnvelope.request.type === types[i]) {
      return true;
    }
  }
  return false;
}

export const entityReplace = (str: string | undefined) : string => {
  return str ? str.replace('<', '&lt;').replace('>', '&gt;') : '';
}

export const resolveSlotValue = (slot: Slot, default_val: string) => {
  let matches, resolved_value;
  let slot_val =  (slot && slot.value) || default_val;
  const resolutions = (slot.resolutions && slot.resolutions.resolutionsPerAuthority) || [];
  for (let i = 0; i < resolutions.length; i++){
      matches = resolutions[i].values || [];
      for (let j = 0; j < matches.length; j++) {
          resolved_value = matches[j].value.name;
          if (resolved_value) {
              slot_val = resolved_value;
              return slot_val;
          }
      }
  }
  return slot_val;
}
