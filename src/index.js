/*jslint node: true */
/**
 
 Copyright 2017 Antonio Licon and Alec Mitchell.
 
*/
'use strict';

var Alexa = require('alexa-sdk');
var APP_ID = "amzn1.ask.skill.20fd9b6b-2754-40e7-a485-";
var request = require('request');


exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.dynamoDBTableName = 'KCRW_PLAY_STATE';
    alexa.registerHandlers(handlers);
    alexa.execute();
};


var handlers = {
    'LaunchRequest': function () {
        this.emit('PlayIntent');
    },

    'PlayIntent': function () {
        var channel_id, channel_slot, surl;
        channel_slot = this.event.request.intent.slots.channel;
        channel_id = this.attributes['channelId'] = channel_slot.value || 'live';
        this.emit(':saveState');
        switch (channel_id) {
            case "music":
                surl = 'https://kcrw.streamguys1.com/kcrw_128k_aac_e24';
                break;
            case "news":
                surl = 'https://kcrw.streamguys1.com/kcrw_128k_aac_news';
                break;
            default:
                surl = 'https://kcrw.streamguys1.com/kcrw_128k_aac_on_air';
                break;
        }
        this.response.audioPlayerPlay("REPLACE_ALL", surl, "8442", null, 0);
        this.emit(':responseReady');
    },

    'WhatIntent': function () {
        var channel_id, what_slot, what_type;
        channel_id = this.attributes['channelId'] || 'live';
        what_slot = this.event.request.intent.slots.what;
        what_type = what_slot.value || channel_id == 'music' ? 'song' : 'show';
        if (what_slot == 'song' || channel_id == 'music') {
            song_data_for_channel(this, channel_id);
        } else {
            show_data_for_channel(this, channel_id);
        }
    },

    'AMAZON.StopIntent': function () {
        this.response.audioPlayerStop();
        this.emit(':responseReady');
    },

    'AMAZON.PauseIntent': function () {
        this.emit('AMAZON.StopIntent');
    },

    'AMAZON.ResumeIntent': function () {
        this.emit('PlayIntent');
    },

    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },

   'Unhandled': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    }
};

// ------- Helper functions -------

function show_data_for_channel(base, channel_id) {
    var surl, shouldEndSession;
    shouldEndSession = !!channel_id;
    switch (channel_id) {
        case "news":
            surl = 'https://www.kcrw.com/now_playing.json?channel_id=kcrwnews';
            break;
        case "music":
            return song_data_for_channel(channel_id);
        default:
            surl = 'https://www.kcrw.com/now_playing.json';
            break;
    }
    request(surl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var showText;
            var imageObj = null;
            var content = '';
            var sresponse = JSON.parse(body);
            if (!sresponse.title) {
                showText = base.t('MISSING_SHOW_MESSAGE');
            } else if (sresponse.title == sresponse.show_title) {
                showText = " " + sresponse.title;
            } else {
                showText = " " + sresponse.show_title + " - " + sresponse.title;
            }
            if (sresponse.square_image_retina) {
                imageObj = {smallImageUrl: sresponse.square_image + '/mini', largeImageUrl: sresponse.square_image_retina};
            }
            if (sresponse.hosts) {
                for (var i=0; i < sresponse.hosts.length; i++) {
                    var host = sresponse.hosts[i];
                    content += host.name;
                }
            }
            if (!content || content == sresponse.show_title) {
                content = sresponse.description;
            } else {
                content += '\n\n' + sresponse.description;
            }
            if (!content) {
                content = null;
            }
            base.emit(':tellWithCard', base.t('NOW_PLAYING') + showText, showText, content, imageObj);
        } else {
            base.emit(':tell', base.t('GENERIC_ERROR_MESSAGE'));
        }
    });
}

function song_data_for_channel(base, channel_id) {
    var surl, shouldEndSession;
    shouldEndSession = !!channel_id;
    switch (channel_id) {
        case "music":
            surl = 'https://tracklist-api.kcrw.com/Music';
            break;
        case "news":
            base.emit(':tell', base.t('INVALID_SONG_CHANNEL_MESSAGE'));
            return;
        default:
            surl = 'https://tracklist-api.kcrw.com/Simulcast';
            break;
    }
    request(surl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var songText;
            var imageObj = null;
            var sresponse = JSON.parse(body);
            if (!sresponse.title) {
                songText = base.t('MISSING_SONG_MESSAGE');
            } else if (sresponse.title.toLowerCase() == '[break]') {
                songText = base.t('SONG_BREAK_MESSAGE');
            } else {
                songText = " " + sresponse.title + " " + base.t('SONG_BY_MESSAGE') + " " + sresponse.artist;
            }
            if (sresponse.albumImage) {
                imageObj = {smallImageUrl: sresponse.albumImage, largeImageUrl: sresponse.albumImageLarge};
            }
            base.emit(':tellWithCard', base.t('NOW_PLAYING') + songText, songText,
                      sresponse.album, imageObj);
        } else {
            base.emit(':tell', base.t('GENERIC_ERROR_MESSAGE'));
        }
    });
}

var languageStrings = {
    "en": {
        "translation": {
            "MISSING_SONG_MESSAGE": "I'm sorry, but no song information is currently available.",
            "MISSING_SHOW_MESSAGE": "I'm sorry, but no program information is currently available.",
            "SONG_BY_MESSAGE": "by",
            "NOW_PLAYING": "Now Playing:",
            "INVALID_SONG_CHANNEL_MESSAGE": "Sorry, there is no music information for this stream.",
            "SONG_BREAK_MESSAGE": "No song is currently playing.",
            "GENERIC_ERROR_MESSAGE": "There was an error, please try again later",
            "SKILL_NAME": "K. C. R. W. Radio",
            "WELCOME_MESSAGE": "Welcome to %s. You can ask a question like, what\'s the recipe for a chest? ... Now, what can I help you with.",
            "WELCOME_REPROMPT": "For instructions on what you can say, please say help me.",
            "HELP_MESSAGE": "You can say things like: Play. Play music. Play news. What\'s playing? What song is this? or you can say stop.",
            "HELP_REPROMPT": "You can say things like: Play. Play music. Play news. What\'s playing? What song is this? or you can say stop....Now, what can I help you with?",
        }
    }
};
