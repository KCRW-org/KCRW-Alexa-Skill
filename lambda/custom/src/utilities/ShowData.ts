import { ResponseCallback } from "../types";
import { ResponseBuilder } from 'ask-sdk-core';
import i18n from 'i18next';
import { Strings, ShowInfo } from "../types";
import { entityReplace } from "./helpers";
import { songDataForChannel } from "./SongData";
import { fetch } from '@netly/node-fetch';


export const showDataForChannel = async (responseBuilder: ResponseBuilder, channel_id: string, callback?: ResponseCallback, hide_card?: boolean) : Promise<ResponseBuilder> => {
  let surl;
  switch (channel_id) {
    case "news":
      surl = 'https://contentful-frontend.kcrw.com/now_playing.json?channel_id=kcrwnews';
      break;
    case "music":
      return songDataForChannel(responseBuilder, channel_id, callback, hide_card);
    case "vintage":
      surl = 'https://contentful-frontend.kcrw.com/now_playing.json?channel_id=bent24';
      break;
    case "dance":
      surl = 'https://contentful-frontend.kcrw.com/now_playing.json?channel_id=52n171gqYltPrfqZvWm2NG';
      break;
    default:
      surl = 'https://contentful-frontend.kcrw.com/now_playing.json';
      break;
  }
  const response = await fetch(surl);
  if (response.status === 200) {
    const sresponse = await response.json() as ShowInfo;
    let showText;
    const hosts = [];
    let content = '';
    let smallImageUrl;
    let largeImageUrl;
    if (!sresponse.title) {
      showText = i18n.t(Strings.MISSING_SHOW_MESSAGE);
    } else if (sresponse.title == sresponse.show_title) {
      showText = sresponse.title;
    } else {
      showText = sresponse.show_title + " - " + sresponse.title;
    }
    if (sresponse.square_image_retina) {
      smallImageUrl = sresponse.square_image;
      largeImageUrl = sresponse.square_image_retina;
    }
    if (sresponse.hosts) {
      for (let i=0; i < sresponse.hosts.length; i++) {
        hosts.push(sresponse.hosts[i].name);
      }
    }
    if (hosts.length) {
        content += hosts.join(', ');
    }
    if (sresponse.description) {
        if (content) {
            content += '\n\n';
        }
        content += sresponse.description;
    }
    if (!content) {
        content = '';
    }
    responseBuilder.speak(i18n.t(Strings.NOW_PLAYING) + " " + showText.replace('&', 'and').replace('+', 'and'));
    if (!hide_card) {
      responseBuilder.withStandardCard(
        entityReplace(showText), entityReplace(content),
        smallImageUrl, largeImageUrl

      )
    }
  } else {
    responseBuilder.speak(i18n.t(Strings.GENERIC_ERROR_MESSAGE));
  }
  if (callback) callback(responseBuilder);
  return responseBuilder;
}
