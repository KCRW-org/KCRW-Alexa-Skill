import { ResponseBuilder } from 'ask-sdk-core';

export enum RequestTypes {
  Launch = 'LaunchRequest',
  Intent = 'IntentRequest',
  SessionEnded = 'SessionEndedRequest',
  SystemExceptionEncountered = 'System.ExceptionEncountered',
}

export enum LocaleTypes {
  enUS = 'en-US',
  enAU = 'en-AU',
  enCA = 'en-CA',
  enGB = 'en-GB',
  enIN = 'en-IN',
}

export enum IntentTypes {
  Help = 'AMAZON.HelpIntent',
  Stop = 'AMAZON.StopIntent',
  Cancel = 'AMAZON.CancelIntent',
  Fallback = 'AMAZON.FallbackIntent',
  Pause = 'AMAZON.PauseIntent',
  Resume = 'AMAZON.ResumeIntent',
  Play = 'PlayIntent',
  What = 'WhatIntent',
  CustomStop = 'StopIntent',
}

export enum Strings {
  SKILL_NAME = 'SKILL_NAME',
  MISSING_SONG_MESSAGE = 'MISSING_SONG_MESSAGE',
  MISSING_SHOW_MESSAGE = 'MISSING_SHOW_MESSAGE',
  SONG_BY_MESSAGE = 'SONG_BY_MESSAGE',
  NOW_PLAYING = 'NOW_PLAYING',
  ON_CHANNEL = 'ON_CHANNEL',
  INVALID_SONG_CHANNEL_MESSAGE = 'INVALID_SONG_CHANNEL_MESSAGE',
  SONG_BREAK_MESSAGE = 'SONG_BREAK_MESSAGE',
  GENERIC_ERROR_MESSAGE = 'GENERIC_ERROR_MESSAGE',
  WELCOME_MESSAGE = 'WELCOME_MESSAGE',
  WELCOME_REPROMPT = 'WELCOME_REPROMPT',
  HELP_MESSAGE = 'HELP_MESSAGE',
  HELP_REPROMPT = 'HELP_REPROMPT',
}

export interface IStrings {
  [Strings.SKILL_NAME]: string;
  [Strings.MISSING_SONG_MESSAGE]: string;
  [Strings.MISSING_SHOW_MESSAGE]: string;
  [Strings.SONG_BY_MESSAGE]: string;
  [Strings.NOW_PLAYING]: string;
  [Strings.ON_CHANNEL]: string;
  [Strings.INVALID_SONG_CHANNEL_MESSAGE]: string;
  [Strings.SONG_BREAK_MESSAGE]: string;
  [Strings.GENERIC_ERROR_MESSAGE]: string;
  [Strings.WELCOME_MESSAGE]: string;
  [Strings.WELCOME_REPROMPT]: string;
  [Strings.HELP_MESSAGE]: string;
  [Strings.HELP_REPROMPT]: string;
}

export type ResponseCallback = (responseBuilder:ResponseBuilder) => ResponseBuilder;

export type Host = {
  name: string;
}

export type ShowInfo = {
  title: string;
  show_title: string;
  square_image?: string;
  square_image_retina?: string;
  hosts: Host[];
  description: string;
}

export type SongInfo = {
  title: string;
  album?: string;
  artist?: string;
  albumImage?: string;
  albumImageLarge?: string;
}