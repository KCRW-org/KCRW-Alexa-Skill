/*jslint node: true */
/*jslint sub:true*/
/*jslint esversion: 6*/
/**
 
 Copyright 2017 Antonio Licon and Alec Mitchell.
 
*/
'use strict';

const Alexa = require('alexa-sdk');
const request = require('request');
const config = require('./config');

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context, callback);
    alexa.appId = config.APP_ID;
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
        var channel_id, surl, resume;
        var base = this;
        channel_id = 'live';
        if (this.event.request.intent && this.event.request.intent.slots) {
            channel_id = resolve_slot_value(this.event.request.intent.slots.channel,
                                            channel_id);
        }
        if (this.attributes['resume']) {
            resume = true;
            channel_id = this.attributes['channelId'] || channel_id;
            delete this.attributes['resume'];
        }
        switch (channel_id) {
            case "music":
                this.attributes['channelId'] = "music";
                surl = 'https://kcrw.streamguys1.com/kcrw_128k_aac_e24-alexa';
                break;
            case "news":
                this.attributes['channelId'] = "news";
                surl = 'https://kcrw.streamguys1.com/kcrw_128k_aac_news-alexa';
                break;
            default:
                if (channel_id != 'live') {
                    console.log('Unknown channel, playing live: ' + JSON.stringify(this.event.request.intent));
                }
                this.attributes['channelId'] = "live";
                surl = 'https://kcrw.streamguys1.com/kcrw_128k_aac_on_air-alexa';
                break;
        }
        this.emit(':saveState');

        if (resume) {
            base.response.audioPlayer("play", "REPLACE_ALL", surl, "8442", null, 0);
            base.emit(':responseReady');
            return;
        }

        var is_music = this.attributes['channelId'] == 'music';
        function start_play() {
            if (is_music) {
                base.response.cardRenderer(
                    "KCRW's Eclectic 24", null,
                    {smallImageUrl: 'https://www.kcrw.com/music/shows/eclectic24/@@images/square_image/mini?file.png',
                     largeImageUrl: 'https://www.kcrw.com/music/shows/eclecticsa24/@@images/square_image/full-2x?file.png'}
                );
            }
            base.response.audioPlayer("play", "REPLACE_ALL", surl, "8442", null, 0);
        }
        if (is_music) {
            song_data_for_channel(base, this.attributes['channelId'] || 'live', start_play, true,
                                  '<say-as interpret-as="interjection">' + base.t("ON_CHANNEL") + "</say-as> Eclectic Twenty Four");
        } else {
            show_data_for_channel(base, this.attributes['channelId'] || 'live', start_play);
        }
    },

    'WhatIntent': function () {
        var channel_id, suffix, what_slot, what_type;
        channel_id = this.attributes['channelId'] || 'live';
        what_type = 'show';
        if (this.event.request.intent && this.event.request.intent.slots) {
            what_slot = this.event.request.intent.slots.what;
            what_type = resolve_slot_value(this.event.request.intent.slots.what,
                                            what_slot);
        }

        if (what_type != 'show' && what_type != 'song') {
            console.log('Unknown what slot, using default: ' + JSON.stringify(this.event.request.intent));
        }

        if (what_type == 'song' || channel_id == 'music') {
            if (what_type == 'show') {
                suffix = '<say-as interpret-as="interjection">' + this.t("ON_CHANNEL") + "</say-as> Eclectic Twenty Four";
            }
            song_data_for_channel(this, channel_id, null, false, suffix);
        } else {
            show_data_for_channel(this, channel_id);
        }
    },

    'StopIntent': function () {
        this.response.audioPlayerStop();
        this.emit(':responseReady');
    },

    'AMAZON.StopIntent': function () {
        this.emit('StopIntent');
    },

    'AMAZON.PauseIntent': function () {
        this.emit('StopIntent');
    },

    'AMAZON.CancelIntent': function () {
        this.emit('StopIntent');
    },

    'AMAZON.ResumeIntent': function () {
        this.attributes['resume'] = true;
        this.emit('PlayIntent');
    },

    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },

    'SessionEndedRequest': function () {
        console.log('session ended.');
        this.emit(':saveState', true);
    },

    'Unhandled': function () {
        // Ignore AudioPlayer.* events for now
        if (this.event.request.type.indexOf('AudioPlayer.') < 0) {
            console.log('Unrecoginzed request: ' + JSON.stringify(this.event.request));
            this.emit('AMAZON.HelpIntent');
        } else {
            this.emit(':responseReady');
        }
    }
};

// ------- Helper functions -------

function show_data_for_channel(base, channel_id, callback, hide_card) {
    var surl;
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
            var hosts = [];
            var imageObj = null;
            var content = '';
            var sresponse = JSON.parse(body);
            if (!sresponse.title) {
                showText = base.t('MISSING_SHOW_MESSAGE');
            } else if (sresponse.title == sresponse.show_title) {
                showText = sresponse.title;
            } else {
                showText = sresponse.show_title + " - " + sresponse.title;
            }
            if (sresponse.square_image_retina) {
                imageObj = {smallImageUrl: sresponse.square_image + '/mini?file.jpg', largeImageUrl: sresponse.square_image_retina + '?file.jpg'};
            }
            if (sresponse.hosts) {
                for (var i=0; i < sresponse.hosts.length; i++) {
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
                content = null;
            }
            base.response.speak(base.t('NOW_PLAYING') + " " + showText.replace('&', 'and').replace('+', 'and'));
            if (!hide_card) {
                base.response.cardRenderer(entity_replace(showText), entity_replace(content), imageObj);
            }
        } else {
            base.reponse.speak(base.t('GENERIC_ERROR_MESSAGE'));
        }
        if (callback) callback();
        base.emit(':responseReady');
    });
}

function resolve_slot_value(slot, default_val) {
    var slot_val, matches, resolutions, resolved_value;
    slot_val =  (slot && slot.value) || default_val;
    resolutions = (slot.resolutions && slot.resolutions.resolutionsPerAuthority) || [];
    for (var i = 0; i < resolutions.length; i++){
        matches = resolutions[i].values || [];
        for (var j = 0; j < matches.length; j++) {
            resolved_value = matches[j].value.name;
            if (resolved_value) {
                slot_val = resolved_value;
                return slot_val;
            }
        }
    }
    return slot_val;
}

function song_data_for_channel(base, channel_id, callback, hide_card, spoken_suffix) {
    var surl;
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
                songText = base.t('NOW_PLAYING') + " " + sresponse.title + ' <say-as interpret-as="interjection">' + base.t('SONG_BY_MESSAGE') + '</say-as> ' + sresponse.artist;
            }
            if (spoken_suffix) {
                songText += ", " + spoken_suffix;
            }
            base.response.speak(songText.replace('&', 'and').replace('+', 'and'));
            if (!hide_card) {
                if (sresponse.albumImage) {
                    imageObj = {smallImageUrl: sresponse.albumImage.replace('http:', 'https:'),
                                largeImageUrl: sresponse.albumImageLarge.replace('http:', 'https:')};
                }
                base.response.cardRenderer(entity_replace(sresponse.title) + " " + base.t('SONG_BY_MESSAGE') + " " + entity_replace(sresponse.artist),
                                           entity_replace(sresponse.album), imageObj);
            }
        } else {
            base.reponse.speak(base.t('GENERIC_ERROR_MESSAGE'));
        }
        if (callback) callback();
        base.emit(':responseReady');
    });
}

function entity_replace(str) {
    return str && str.replace('<', '&lt;').replace('>', '&gt;');
}

var languageStrings = {
    "en": {
        "translation": {
            "MISSING_SONG_MESSAGE": "I'm sorry, but no song information is currently available.",
            "MISSING_SHOW_MESSAGE": "I'm sorry, but no program information is currently available.",
            "SONG_BY_MESSAGE": "by",
            "NOW_PLAYING": "Now Playing:",
            "ON_CHANNEL": "on",
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
