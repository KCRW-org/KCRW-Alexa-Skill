import {
    HandlerInput,
    RequestHandler,
    ResponseBuilder,
} from 'ask-sdk-core';
import {
    Response,
} from 'ask-sdk-model';
import i18n from 'i18next';
import { IsIntent, resolveSlotValue } from "../utilities/helpers"
import { IntentTypes } from "../types"
import { songDataForChannel } from "../utilities/SongData"
import { showDataForChannel } from "../utilities/ShowData"
import { Strings, RequestTypes } from "../types";

export const PlayHandler : RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    return IsIntent(handlerInput, IntentTypes.Play, IntentTypes.Resume);
  },
  async handle(handlerInput : HandlerInput) : Promise<Response> {
    let channel_id = 'live';
    let surl = 'https://streams.kcrw.com/kcrw_aac?aw_0_1st.playerid=ALEXA_SKILL';
    let responseBuilder = handlerInput.responseBuilder;
    const resume = handlerInput.requestEnvelope.request.type === RequestTypes.Intent && handlerInput.requestEnvelope.request.intent.name === IntentTypes.Resume;
    const attributesManager = handlerInput.attributesManager;
    let hasAttributes = true;
    let persistentAttributes;
    try {
      persistentAttributes = await attributesManager.getPersistentAttributes();
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error getting attributes: ${err.message}:\n\n ${err.stack}`);
      }
      persistentAttributes = {};
      hasAttributes = false;
    }
    if (handlerInput.requestEnvelope.request.type === RequestTypes.Intent && handlerInput.requestEnvelope.request.intent && handlerInput.requestEnvelope.request.intent.slots) {
        channel_id = resolveSlotValue(handlerInput.requestEnvelope.request.intent.slots.channel, channel_id);
    }
    switch (channel_id) {
      case "music":
        persistentAttributes.channelId = "music";
        surl = 'https://streams.kcrw.com/e24_aac?aw_0_1st.playerid=ALEXA_SKILL';
        break;
      case "news":
        persistentAttributes.channelId = "news";
        surl = 'https://streams.kcrw.com/news24_aac?aw_0_1st.playerid=ALEXA_SKILL';
        break;
      case "dance":
        persistentAttributes.channelId = "dance";
        surl = 'https://streams.kcrw.com/dance24_aac?aw_0_1st.playerid=ALEXA_SKILL';
        break;
      case "vintage":
        persistentAttributes.channelId = "vintage";
        surl = 'https://streams.kcrw.com/bent24_aac?aw_0_1st.playerid=ALEXA_SKILL';
        break;
      default:
        if (channel_id != 'live') {
          console.log('Unknown channel, playing live: ' + JSON.stringify(handlerInput.requestEnvelope.request));
        }
        channel_id = 'live';
        persistentAttributes.channelId = "live";
        break;
    }
    if (hasAttributes) {
      attributesManager.setPersistentAttributes(persistentAttributes);
      attributesManager.savePersistentAttributes();
    }

    if (resume) {
      return responseBuilder.addAudioPlayerPlayDirective("REPLACE_ALL", surl, channel_id, 0).getResponse();
    }

    // Update attributes
    const currentChannel = channel_id;
    const startPlay = (responseBuilder: ResponseBuilder) => {
      if (currentChannel == "music") {
        responseBuilder = responseBuilder.withStandardCard(
          "KCRW's Eclectic 24", '',
          'https://www.kcrw.com/shows/eclectic24/squareImageSmall.jpg',
          'https://www.kcrw.com/shows/eclectic24/squareImage.jpg'
        );
      } else if (currentChannel == 'vintage') {
        responseBuilder = responseBuilder.withStandardCard(
          "KCRW's Vintage 24", '',
          'https://www.kcrw.com/shows/vintage24/squareImageSmall.jpg',
          'https://www.kcrw.com/shows/vintage24/squareImage.jpg',
        );
      } else if (currentChannel == 'dance') {
        responseBuilder = responseBuilder.withStandardCard(
          "KCRW's Dance 24", '',
          'https://www.kcrw.com/shows/dance24/squareImageSmall.jpg',
          'https://www.kcrw.com/shows/dance24/squareImage.jpg',
        );
      }
      responseBuilder = responseBuilder.addAudioPlayerPlayDirective("REPLACE_ALL", surl, channel_id, 0);
      return responseBuilder;
    };
    if (channel_id == "music") {
      responseBuilder = await songDataForChannel(
        responseBuilder, channel_id, startPlay, true,
        '<emphasis level="strong">' + i18n.t(Strings.ON_CHANNEL) + "</emphasis> Eclectic Twenty Four"
      );
    } else {
      responseBuilder = await showDataForChannel(responseBuilder, channel_id || 'live', startPlay);
    }
    return responseBuilder.getResponse();
  }
}