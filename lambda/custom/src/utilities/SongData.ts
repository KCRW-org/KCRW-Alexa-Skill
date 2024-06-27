import { ResponseCallback } from "../types";
import { ResponseBuilder } from 'ask-sdk-core';
import i18n from 'i18next';
import { Strings, SongInfo } from "../types";
import { entityReplace } from "./helpers";
import { fetch } from '@netly/node-fetch';

export const songDataForChannel = async (responseBuilder: ResponseBuilder, channel_id?: string, callback?: ResponseCallback, hide_card?: boolean, spoken_suffix?: string) : Promise<ResponseBuilder> => {
  let surl;
  switch (channel_id) {
    case "music":
      surl = 'https://tracklist-api.kcrw.com/Music';
      break;
    case "news":
      responseBuilder.speak(i18n.t(Strings.INVALID_SONG_CHANNEL_MESSAGE));
      break;
    case "bent":
      responseBuilder.speak(i18n.t(Strings.INVALID_SONG_CHANNEL_MESSAGE));
      break;
    default:
      surl = 'https://tracklist-api.kcrw.com/Simulcast';
      break;
  }
  if (surl) {
    const response = await fetch(surl);
    if (response.status === 200) {
      const sresponse = await response.json() as SongInfo;
      let songText;
      let smallImageUrl;
      let largeImageUrl;
      if (!sresponse.title) {
        songText = i18n.t(Strings.MISSING_SONG_MESSAGE);
      } else if (sresponse.title.toLowerCase() == '[break]') {
        songText = i18n.t(Strings.SONG_BREAK_MESSAGE);
      } else {
        songText = i18n.t(Strings.NOW_PLAYING) + " " + sresponse.title + ' <emphasis level="strong">' + i18n.t(Strings.SONG_BY_MESSAGE) + '</emphasis> ' + sresponse.artist;
      }
      if (spoken_suffix) {
        songText += ", " + spoken_suffix;
      }
      responseBuilder.speak(songText.replace('&', 'and').replace('+', 'and'));
      if (!hide_card) {
        if (sresponse.albumImage) {
            smallImageUrl = sresponse.albumImage.replace('http:', 'https:');
        }
        if (sresponse.albumImageLarge) {
          largeImageUrl = sresponse.albumImageLarge.replace('http:', 'https:')
        }
        responseBuilder.withStandardCard(
          entityReplace(sresponse.title) + " " + i18n.t(Strings.SONG_BY_MESSAGE) + " " + entityReplace(sresponse.artist),
          entityReplace(sresponse.album),
          smallImageUrl, largeImageUrl

        )
      }
    } else {
      responseBuilder.speak(i18n.t(Strings.GENERIC_ERROR_MESSAGE));
    }
  }
  if (callback) callback(responseBuilder);
  return responseBuilder;
}
