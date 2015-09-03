/* This file is part of Indico check-in.
 * Copyright (C) 2002 - 2013 European Organization for Nuclear Research (CERN).
 *
 * Indico is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * Indico is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Indico check-in; if not, see <http://www.gnu.org/licenses/>.
 */

var module = angular.module('Checkinapp.services', []);

module.service('Config',function() {
    var simplifiedUI = isSimplifiedUI();
    var confOfficerUI = isConfOfficerUI();
    var airPrint = isAirPrintEnabled();
    var cropAndResize = isCropAndResizeEnabled();

    function reset() {
        fullUI();
        setConfOfficerUI(false);
        disableAirPrint();
        enableCropAndResize();        
    }

    function isSimplifiedUI() {
        simplifiedUI = JSON.parse(localStorage.getItem('simplifiedUI'));
        return simplifiedUI;
    }

    function setSimplifiedUI(val) {
        simplifiedUI = val;
        localStorage.setItem('simplifiedUI',JSON.stringify(simplifiedUI));
    }

    function simplifyUI() {
        setSimplifiedUI(true);
    }

    function fullUI() {
        setSimplifiedUI(false);
    }

    function toggleSimplifiedUI() {
        setSimplifiedUI(!simplifiedUI);
    }

    function isConfOfficerUI() {
        confOfficerUI = JSON.parse(localStorage.getItem('confOfficerUI'));
        return confOfficerUI;
    }

    function setConfOfficerUI(val) {
        confOfficerUI = val;
        localStorage.setItem('confOfficerUI',JSON.stringify(confOfficerUI));
    }

    function toggleConfOfficerUI() {
        setConfOfficerUI(!confOfficerUI);
    }

    function isAirPrintEnabled() {
        airPrint = JSON.parse(localStorage.getItem('airPrint'));
        return airPrint;
    }

    function setAirPrint(val) {
        airPrint = val;
        localStorage.setItem('airPrint',JSON.stringify(airPrint));
    }

    function enableAirPrint() {
        setAirPrint(true);
    }

    function disableAirPrint() {
        setAirPrint(false);
    }

    function toggleAirPrintEnabled() {
        setAirPrint(!airPrint);
    }

    function isCropAndResizeEnabled() {
        cropAndResize = JSON.parse(localStorage.getItem('cropAndResize'));
        return cropAndResize;
    }

    function setCropAndResize(val) {
        cropAndResize = val;
        localStorage.setItem('cropAndResize',JSON.stringify(cropAndResize));
    }

    function enableCropAndResize() {
        setCropAndResize(true);
    }

    function disableCropAndResize() {
        setCropAndResize(false);
    }

    function toggleCropAndResizeEnabled() {
        setCropAndResize(!cropAndResize);
    }

    reset();
    
    return {
        isSimplifiedUI: isSimplifiedUI,
        setSimplifiedUI: setSimplifiedUI,
        simplifyUI: simplifyUI,
        fullUI: fullUI,
        toggleSimplifiedUI: toggleSimplifiedUI,
        isConfOfficerUI: isConfOfficerUI,
        setConfOfficerUI: setConfOfficerUI,
        toggleConfOfficerUI: toggleConfOfficerUI,
        isAirPrintEnabled: isAirPrintEnabled,
        setAirPrint: setAirPrint,
        enableAirPrint: enableAirPrint,
        disableAirPrint: disableAirPrint,
        toggleAirPrintEnabled: toggleAirPrintEnabled,
        isCropAndResizeEnabled: isCropAndResizeEnabled,
        setCropAndResize: setCropAndResize,
        enableCropAndResize: enableCropAndResize,
        disableCropAndResize: disableCropAndResize,
        toggleCropAndResizeEnabled: toggleCropAndResizeEnabled,
        reset: reset
    }
});

module.service('OAuth', function () {

    var user = null;
    var OAuthClients = {};
    var oauthWindow;

    function _generateOAuthClient(server) {
        var oauthClient = OAuth(server);
        oauthClient.accessTokenKey = server.accessTokenKey;
        oauthClient.accessTokenSecret = server.accessTokenSecret;
        OAuthClients[server.baseUrl.hashCode()] = oauthClient;
    }

    function getOAuthClient(server_id) {
        if(OAuthClients[server_id] === undefined) {
            _generateOAuthClient(getServer(server_id));
        }
        return OAuthClients[server_id];
    }

    function addOAuthToken(server_id, tokenData) {
        var servers = getServers();
        var server = servers[server_id];
        server.accessTokenKey = tokenData.oauth_token;
        server.accessTokenSecret = tokenData.oauth_token_secret;
        servers[server.baseUrl.hashCode()] = server;
        localStorage.setItem('servers', JSON.stringify(servers));
        _generateOAuthClient(server);
    }

    function authenticate(server_id, onSuccess) {
        var oauthClient = getOAuthClient(server_id);
        oauthClient.fetchRequestToken(
        // Success
        function (url) {
            // The timeout has to be set for IOS because will not work properly
            setTimeout(function () {
                oauthWindow = window.open(url, '_blank', 'location=no');
                oauthWindow.addEventListener('loadstart', function (event) {
                    oauthLocationChanged(event.url, oauthClient, server_id, onSuccess);
                });
                oauthWindow.addEventListener('loaderror', function(event) {
                    showAlert('Error', event.message, function () {
                        _deleteServer(server_id);
                        oauthWindow.close();
                        oauthWindow = null;
                    });
                });
            }, 500);
        },
        failure
        );
    }

    // This function is triggered when the oauth window changes location.
    // If the new location is the callback url extract verifier from it and
    // get the access token.
    function oauthLocationChanged(url, oauthClient, server_id, onSuccess) {
        if (url.indexOf(getServer(server_id)['callbackUrl'] + '/?') >= 0) {
            oauthWindow.close();
            // Extract oauth_verifier from the callback call
            verifier = (/[?|&]oauth_verifier=([^&;]+?)(&|#|;|$)/g).exec(url)[1];
            oauthClient.setVerifier(verifier);
            oauthClient.fetchAccessToken(
                // Success
                function (data) {
                    setAccessToken(server_id, data.text);
                    onSuccess();
                },
                failure
            );
        }
    }

    function setAccessToken(server_id, response) {
        // Extract access token/key from response
        var qvars = response.split('&');
        var accessParams = {};
        for (var i = 0; i < qvars.length; i++) {
            var y = qvars[i].split('=');
            accessParams[y[0]] = decodeURIComponent(y[1]);
        }
        addOAuthToken(server_id, accessParams);
    }

    function getEvents() {
        return JSON.parse(localStorage.getItem('events') || "{}");
    }


    function addServer(server_data, callback) {
        var servers = getServers();
        var server = server_data;
        var server_id = server.baseUrl.hashCode();
        server.callbackUrl = 'http://callback.check';
        server.requestTokenUrl = server.baseUrl + '/oauth/request_token';
        server.authorizationUrl = server.baseUrl + '/oauth/authorize';
        server.accessTokenUrl = server.baseUrl + '/oauth/access_token';
        servers[server_id] = server;
        localStorage.setItem('servers', JSON.stringify(servers));
        authenticate(server_id, callback);
    }

    function _deleteServer(server_id) {
        var servers = getServers();
        delete servers[server_id];
        localStorage.setItem('servers', JSON.stringify(servers));
        return true;
    }

    function _updateServer(server_data) {
        var servers = getServers();
        var server_id = server_data.baseUrl.hashCode();
        servers[server_id].consumerKey =  server_data.consumerKey;
        servers[server_id].consumerSecret = server_data.consumerSecret;
        localStorage.setItem('servers', JSON.stringify(servers));
        return true;
    }

    function getServers() {
        return JSON.parse(localStorage.getItem('servers') || "{}");
    }

    function getServer(server_id) {
        return getServers()[server_id];
    }

    function getEventKey(server_id, event_id) {
        return server_id + "_" + event_id;
    }

    function getEvent(server_id, event_id) {
        return getEvents()[getEventKey(server_id, event_id)];
    }

    function _saveEvent(event) {
        var events = getEvents();
        var event_to_store = {};
        var server_id = event.server.baseUrl.hashCode();
        event_to_store.event_id = event.event_id;
        event_to_store.title = event.title;
        event_to_store.date = event.date;
        event_to_store.server_id = server_id;
        if (event.hasOwnProperty('session_id')) {
            event_to_store.session_id = event.session_id;
        }
        events[getEventKey(server_id, event.event_id)] = event_to_store;
        localStorage.setItem('events', JSON.stringify(events));
    }

    function addEvent(event, callback) {
        if(getServer(event.server.baseUrl.hashCode()) === undefined) {
            addServer(event.server, function() {
                _saveEvent(event);
                callback();
            });
        } else {
            _updateServer(event.server);
            _saveEvent(event);
            callback();
        }
    }

    function deleteEvent(server_id, event_id) {
        var events = getEvents();
        delete events[getEventKey(server_id, event_id)];
        localStorage.setItem('events', JSON.stringify(events));
        return true;
    }

    function getRegistrantsForEvent(server_id, event_id, callback) {
        var event = getEvent(server_id,event_id);
        var postfix = '/registrants.json';
        if (event.hasOwnProperty('session_id')) {
            postfix = '/session/'+event.session_id+postfix;
        }
        
        getOAuthClient(server_id).getJSON(getServer(server_id).baseUrl +
                      '/export/event/' +
                      event_id + postfix,
            function (data) {
                callback(data.results);
            },
            function (data) {
                checkOAuthError(data, function () {
                    authenticate(server_id, function () {
                        getRegistrantsForEvent(server_id, event_id, callback);
                    });
                });
            }
        );
    }

    function getTodaysEvents(server_id, callback) {
        getOAuthClient(server_id).getJSON(getServer(server_id).baseUrl +
                      '/export/categ/0.json?from=today&to=today&detail=mobile&nc=yes',
            function (data) {
                callback(data.results);
            },
            function (data) {
                checkOAuthError(data, function () {
                    authenticate(server_id, function () {
                        getTodaysEvents(server_id, callback);
                    });
                });
            }
        );
    }


    function getRegistrant(server_id, event_id, registrant_id, callback) {
        var event = getEvent(server_id,event_id);
        var postfix = '/registrant/';
        if (event.hasOwnProperty('session_id')) {
            postfix = '/session/'+event.session_id+postfix;
        }
        getOAuthClient(server_id).getJSON(getServer(server_id).baseUrl +
                      '/export/event/' + event_id +
                      postfix + registrant_id + '.json',
            function (data) {
                callback(data.results);
            },
            function (data) {
                checkOAuthError(data, function () {
                    authenticate(server_id, function () {
                        getRegistrant(server_id, event_id, registrant_id, callback);
                    });
                });
            }
        );
    }

    function checkIn(data, newValue, callback) {
        var server_id=data.server_id;
        var event_id = data.event_id;
        var event_obj = getEvent(server_id,event_id);
        var registrant_id = data.registrant_id;
        var checkin_secret = data.checkin_secret;
        var session_part = "";
        if (event_obj.hasOwnProperty('session_id')) {
            session_part = "/session/"+event_obj.session_id;
        }

        getOAuthClient(server_id).post(getServer(server_id).baseUrl +
                      '/api/event/' + event_id +
                      session_part +
                      '/registrant/' + registrant_id + '/checkin.json',
            {
                "secret": checkin_secret,
                "checked_in": (newValue? "yes": "no"),
            },
            function (data) {
                if (data.text=="") {
                    showAlert("Error", "Unable to perform the check-in service", function() {});
                } else {
                    var data = JSON.parse(data.text || "{}");
                    callback(data.results);
                }
            },
            function (data) {
                checkOAuthError(data, function () {
                    authenticate(server_id, function () {
                        checkIn(data, newValue, callback);
                    });
                });
            }
        );
    }

    function updatePicture(server_id, event_id, registrant_id, checkin_secret, picture_uri, callback) {
        getOAuthClient(server_id).post(getServer(server_id).baseUrl +
                      '/api/event/' + event_id +
                      '/registrant/' + registrant_id + '/updatepicture.json',
            {
                "secret": checkin_secret,
                "picture_uri": picture_uri,
            },
            function (data) {
                if (data.text=="") {
                    showAlert("Error", "Unable to perform the update picture service", function() {});
                } else {
                    var data = JSON.parse(data.text || "{}");
                    callback(data.results);
                }
            },
            function (data) {
                checkOAuthError(data, function () {
                    authenticate(server_id, function () {
                        updatePicture(server_id, event_id, registrant_id, secret, picture_uri, callback);
                    });
                });
            }
        );
    }

    function updatePassport(server_id, event_id, registrant_id, checkin_secret, passport_info, callback) {
        getOAuthClient(server_id).post(getServer(server_id).baseUrl +
                      '/api/event/' + event_id +
                      '/registrant/' + registrant_id + '/updatepassport.json',
            {
                "secret": checkin_secret,
                "passport_info":  JSON.stringify(passport_info),
            },
            function (data) {
                if (data.text=="") {
                    showAlert("Error", "Unable to perform the update passport service", function() {});
                } else {
                    var data = JSON.parse(data.text || "{}");
                    callback(data.results);
                }
            },
            function (data) {
                checkOAuthError(data, function () {
                    authenticate(server_id, function () {
                        updatePassport(server_id, event_id, registrant_id, secret, passport_info, callback);
                    });
                });
            }
        );
    }

    function remotePrintBadge(server_id, event_id, registrant_id, callback) {
        getOAuthClient(server_id).post(getServer(server_id).baseUrl +
                      '/event/' + event_id +
                      '/manage/registration/users/' + registrant_id + '/printbadge?base64=true',
            {
                "confId": event_id,
                "registrantId": registrant_id,
            },
            function (msg) {
                callback(msg);
            },
            function (data) {
                checkOAuthError(data, function () {
                    authenticate(server_id, function () {
                        remotePrintBadge(server_id, event_id, registrant_id, callback);
                    });
                });
            }
        );
    }

    function getBadge(server_id, event_id, registrant_id, callback) {
        getOAuthClient(server_id).get(getServer(server_id).baseUrl +
                      '/event/' + event_id +
                      '/manage/registration/users/' + registrant_id + '/mobilePrintBadge',
            function (data) {
                if (data.text=="") {
                    showAlert("Error", "Unable to retrieve the badge", function() {});
                } else {
                    callback(data.text);
                }
            },
            function (data) {
                checkOAuthError(data, function () {
                    authenticate(server_id, function () {
                        getBadge(server_id, event_id, registrant_id, callback);
                    });
                });
            }
        );
    }

    function checkOAuthError(data, callback) {
        var parsedData = JSON.parse(data.text);
        if(parsedData._type == "OAuthError" && parsedData.code == 401) {
            callback();
        } else {
            showAlert("Error", parsedData.message, function() {});
        }
    }

    // In case of failure print error message
    function failure(data) {
        parsedData = JSON.parse(data.text);
        showAlert("Error", parsedData.message, function() {});
    }

    return {
        authenticate: authenticate,
        addEvent: addEvent,
        addServer: addServer,
        deleteEvent: deleteEvent,
        getEvents: getEvents,
        getEvent: getEvent,
        getRegistrantsForEvent: getRegistrantsForEvent,
        getRegistrant: getRegistrant,
        checkIn: checkIn,
        updatePicture: updatePicture,
        getTodaysEvents: getTodaysEvents,
        getBadge: getBadge,
        remotePrintBadge: remotePrintBadge,
        updatePassport: updatePassport,
        getUser: function () {
            return user;
        }
    };
});
