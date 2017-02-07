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

function NavigationController($rootScope, $scope, $location, OAuth, Config) {

    function scanAnyline(callback) {
        anyline.qrcode.scan(
            function (result) {
                if (!result.cancelled) {
                    // The timeout has to be set for IOS because will not work properly
                    console.log("ANYLINE SCAN RESULT="+result.value);
                    callback(JSON.parse(result.value));
                }
            },
            function (error) {
                showAlert("Error scanning", error, function () {});
            }
        );
    };

    function scanCordova(callback) {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    // The timeout has to be set for IOS because will not work properly
                    console.log(result.text);
                    callback(JSON.parse(result.text));

                }
            },
            function (error) {
                showAlert("Error scanning", error, function () {});
            },
            {
              "preferFrontCamera" : false, // iOS and Android
              "showFlipCameraButton" : false, // iOS and Android
              "prompt" : "Place a barcode inside the scan area", // supported on Android only
              "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
              "orientation" : "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
            }
       );
    };

    // FOR TESTING
    function scanQRCode_FakeServer(callback) {
        //text = '{"consumerKey": "EvnJtKEn9FsuwbzZvBBz0mjwnhxeM2E9gWrc36CV", "baseUrl": "http://reg.unog.ch", "consumerSecret": "NjQKTQcMVGI3wb8pKGDNbcHFPifI3Tx42tND8UQn"}'
        text = '{"consumerKey": "EvnJtKEn9FsuwbzZvBBz0mjwnhxeM2E9gWrc36CV", "baseUrl": "http://10.0.16.88", "consumerSecret": "NjQKTQcMVGI3wb8pKGDNbcHFPifI3Tx42tND8UQn"}'
        callback(JSON.parse(text));
    }

    // FOR TESTING
    function scanQRCode_FakeRegistrant(callback) {
        text = '{"r": "0", "e": "17563"}'
        callback(JSON.parse(text));
    };


    function scanQRCode(callback) {
        //scanAnyline(callback);
        scanCordova(callback);
    };

    $rootScope.prettyDates = function(startdate, enddate){
        var sdate = new Date(startdate.replace(/-/g,"/")), locale = "en-us", smonth = sdate.toLocaleString(locale, { month: "short" });
        var edate = new Date(enddate.replace(/-/g,"/")), locale = "en-us", emonth = edate.toLocaleString(locale, { month: "short" });
        var ret = sdate.getDate() + ' ' + smonth;
        if (startdate != enddate) {
          ret+= ' - ' + edate.getDate() + ' ' + emonth;
        }
        return ret;
    };

    $scope.fetchTodaysEvents = function () {
        OAuth.getTodaysEvents($scope.server.baseUrl.hashCode(),function(events) {
            for (var i=0; i<events.length; i++) {
                var event = events[i];
                event.server=$scope.server;
                OAuth.addEvent(event, function () {
                    console.log("Event "+event.event_id+" successfully added");
                });
            }
            $location.path('events');
            $scope.$apply();
        });
    };

    $scope.platform = cordova.platformId;

    $scope.allEvents = function () {
        $location.path('events').replace();
    };

    $scope.scan = function () {
        //scanQRCode_FakeRegistrant(function (data) {
        scanQRCode(function (data) {
            console.log("SCANNING");
            console.log("SERVER="+JSON.stringify($scope.server));

            // If there is no SERVER selected, get the first in getServers
            if ($scope.server == undefined) {
                var servers = OAuth.getServers();
                if (!angular.equals(servers, {})) {
                    $scope.server = servers[Object.keys(servers)[0]];
                }
                else {
                    return alert("No server selected. Please Scan server QRcode.")
                }
            }
            // removed the check for an existing event (UNOG Security use case)
            $location.path('/registrant').search({"registrant_id": data.r,
                                                 "event_id": data.e,
                                                 "server_id": $scope.server.baseUrl.hashCode(),
                                                 "ts": Math.random()
                                             }).replace();
            $scope.$apply();
        });
    };

    $scope.addServer = function () {
        scanQRCode(function (data) {
            OAuth.addServer(data, function () {
                $scope.server=data;
                Config.simplifyUI();
                $rootScope.simplifiedUI=Config.isSimplifiedUI();
                $scope.fetchTodaysEvents();  
            });
        });
    };

    $scope.addEvent = function () {
        scanQRCode(function (data) {
            console.log("ADD EVENT SCAN");
            if(OAuth.getEvent(data.server.baseUrl.hashCode(), data.event_id)) {
                showAlert('Already added', "This event has been already added to the system", function () {});
                $location.path('events');
                $scope.$apply();
            } else {
                OAuth.addEvent(data, function () {
                    $location.path('events');
                    $scope.$apply();
                });
            }
        });
    };

    $scope.isCurrentLocation = function(location) {
        return location == $location.path();
    };

    $scope.back = function() {
        if (window.history.length > 0) { window.history.back(); }
        else { $location.path('events').replace(); }

    };

    $scope.exitFromApp = function() {
        navigator.app.exitApp();
    };



    $scope.config = function() {
        $location.path('config');
    };

    $scope.$on('changeTitle', function (event, title) {
        $scope.title = title;
    });

}

function ConfigController($scope, $location, Config, OAuth) {
    $scope.simplifiedUI = Config.isSimplifiedUI();
    $scope.confOfficerUI = Config.isConfOfficerUI();
    $scope.airPrint = Config.isAirPrintEnabled();
    $scope.performCropAndResize = Config.isCropAndResizeEnabled();
    $scope.printerSelected = 'server';
    $scope.printers = ['server'];

    $scope.refreshListPrinters = function() {
        var servers = OAuth.getServers();
        var server_id = Object.keys(servers)[0];
        if (server_id==undefined) {
            alert('Please configure with server before');
        } else {
            OAuth.listPrinters(server_id,function(data){
                data.push('server');
                $scope.printers = data;
                $scope.$apply();
            });
        }
    };

    $scope.toggleSimplifiedUI = function() {
        Config.toggleSimplifiedUI();
        $scope.simplifiedUI = Config.isSimplifiedUI();
    };

    $scope.toggleConfOfficerUI = function() {
        Config.toggleConfOfficerUI();
        $scope.confOfficerUI = Config.isConfOfficerUI();
    };

    $scope.toggleAirPrint = function() {
        Config.toggleAirPrintEnabled();
        $scope.airPrint = Config.isAirPrintEnabled();
    };

    $scope.toggleCropAndResize = function() {
        Config.toggleCropAndResizeEnabled();
        $scope.performCropAndResize = Config.isCropAndResizeEnabled();
    };

    $scope.togglePrinter = function() {
        Config.setDefaultPrinter($scope.printerSelected);
    };

    $scope.reset = function() {
        Config.reset();
        $scope.simplifiedUI = Config.isSimplifiedUI();
        $scope.confOfficerUI = Config.isConfOfficerUI();
        $scope.airPrint = Config.isAirPrintEnabled();
        $scope.performCropAndResize = Config.isCropAndResizeEnabled();
        localStorage.removeItem('servers');
        localStorage.removeItem('events');
        $location.path('events').replace();
    };
}

function EventsController($rootScope, $scope, $location, OAuth,Config) {

    $scope.events = OAuth.getEvents();
    $scope.$emit('changeTitle', "UNOG check-in");
    $rootScope.simplifiedUI = Config.isSimplifiedUI();

    $scope.go_to_registrants = function (event_id, server_id) {
        $location.path('server/' + server_id + "/event/" + event_id);
    };

    $scope.delete_event = function ($event, event_id, server_id) {
        $event.stopPropagation();
        showConfirm("Delete event", "Are you sure you want to delete the selected event?", ["Delete", "Cancel"],
                    function(buttonIndex) {
                        if(buttonIndex == 1) {
                            if(OAuth.deleteEvent(server_id, event_id)) {
                                $location.path('events');
                            }
                            $scope.editMode = false;
                            $scope.$apply();
                        }
                    }
        );
    };

    $scope.isEventListEmpty = function () {
       return angular.equals({}, $scope.events);
    };
}

function RegistrantsController($routeParams, $scope, $location, OAuth) {

    $scope.event_id = $routeParams.event;
    $scope.server_id = $routeParams.server.toString();

    OAuth.getRegistrantsForEvent($scope.server_id, $scope.event_id, function (result) {
        if(result === undefined || result.registrants === undefined){
            showAlert('Error', "It seems there has been a problem retrieving the attendee list", function () {});
            $location.path('events');
        } else {
            $scope.registrants = result.registrants;
            $scope.$emit("changeTitle", OAuth.getEvent($scope.server_id, $scope.event_id).title);
        }
        $scope.$apply();
    });

    $scope.go_to_registrant = function (registrant) {
        $location.path('registrant').search({"registrant_id": registrant.registrant_id,
                                             "event_id": $scope.event_id,
                                             "server_id": $scope.server_id,
                                             "checkin_secret": registrant.checkin_secret
                                            });
    };

    $scope.isRegistrantListEmpty = function () {
       return angular.equals([], $scope.registrants);
    };
}

function RegistrantController($scope, $rootScope, $location, OAuth, Config) {

    $scope.registrantFound = false;
    var data = $location.search();
    
    var resetPrinter = false;
    $scope.confOfficerUI=Config.isConfOfficerUI();

    var physicalScreenWidth = window.screen.width * window.devicePixelRatio;
    var physicalScreenHeight = window.screen.height * window.devicePixelRatio;

    $scope.pictureWidth = window.screen.width/2;

    // Force picture width for FZ-x1 devices
    if (device.model == "FZ-X1") {
        $scope.pictureWidth = 200;
    }


    $scope.getRegistrant = function(data) {
        OAuth.getRegistrant(data.server_id, data.event_id, data.registrant_id, function (registrant) {
            console.log("REGISTRANT RETRIVED="+JSON.stringify(registrant));
            if ((registrant === undefined) || (registrant=="")) {
                showAlert('Not found', "Registrant not found or not approved for the session", function () {});
                //$location.path('events').replace();
            } else {
                var evt = OAuth.getEvent(data.server_id, data.event_id)
                if (evt.hasOwnProperty("session_id")) {
                    $scope.confOfficerUI = true;
                }
                console.log("EVENT="+JSON.stringify(evt));
                registrant.personal_data.picture = registrant.personal_data.picture+"?ts="+ new Date().getTime();

                $scope.event = evt;
                $scope.childevents = evt.childevents;
                $scope.parentevent = evt.parentevent;
                $scope.registrant = registrant;
                $scope.sessions = registrant.sessions;
                data.checkin_secret = registrant.checkin_secret;
                $scope.registrantFound = true;
                $scope.$apply();
            }
            //$scope.$apply();
        });

    };


    // First check if event is downladed. If not, do it!
    var event = OAuth.getEvent(data.server_id, data.event_id);

    if (typeof event === "undefined") {
        OAuth.getEventById(data.server_id, data.event_id, function(results) {
            var event_retrived = results[0];
            event_retrived.server = $scope.server;
            event_retrived.event_id = data.event_id;

            // I add the event to today's events ONLY if one child is valid for today
            var children = [];
            var child_running = false;
            for (var key in event_retrived.childLinks) {
                var child = event_retrived.childLinks[key];
                var startdate = new Date(child.startDate.date);
                var enddate = new Date(child.endDate.date);
                var today = new Date();
                // Add the MAIN event only if at least 1 child is running TODAY
                console.log(" child TITLE: " + child.title + " ----- child startdate: "+ startdate);

                if((startdate <= today && enddate >= today)) {
                    console.log("--------  RUNNING TODAY !!!!! ------");
                    children.push(child);
                    child_running = true;
                }
            }
            if (child_running == true) {
                event_retrived.childLinks = children;
                OAuth.addEvent(event_retrived, function(){
                    $scope.getRegistrant(data);
                })
            } else {
                $scope.getRegistrant({});
            }

        });
    } else {
        console.log(" EVENT IS IN TODAY LIST!!!!!! ")
        $scope.getRegistrant(data);
    }



    $scope.checkin_registrant = function($event) {
        var toggled =  angular.element($event.currentTarget).hasClass("toggled");

        showConfirm("Toggle Check-in", "Are you sure you want to toggle check-in state?", ["Confirm", "Cancel"],
            function(buttonIndex) {
                if(buttonIndex == 1) {
                    OAuth.checkIn(data, !toggled, function (result) {
                        $scope.registrant.checkin_date = result.checkin_date;
                        $scope.registrant.checked_in = result.checked_in;
                        $scope.$apply();
                    });
                }
            }
        );


    };

    function cropAndResize(image,options,callback) {
        if (Config.isCropAndResizeEnabled()) {
            var zoomFactor = 1;
            var sourceX = -240;
            var sourceY = -120;
            var sourceWidth = options.targetWidth;
            var sourceHeight = options.targetHeight;
            var destWidth = 300*zoomFactor;
            var destHeight = 360*zoomFactor;
            var destX = 150;
            var destY = 300;

            var canvas = document.createElement("CANVAS");
            var context = canvas.getContext('2d');
            canvas.width = sourceWidth;
            canvas.height = sourceHeight;

            var imageObj = new Image();
            imageObj.onload = function() {
                context.drawImage(imageObj, sourceX, sourceY);
                var croppedCanvas = ImageMethods.crop(canvas,destX,destY,sourceWidth/2-destX,sourceHeight/2-destY);
                var resizedCanvas = ImageMethods.resize(croppedCanvas, destWidth, destHeight);
                var dataURL = resizedCanvas.toDataURL();
                callback(dataURL);
              };
            imageObj.src = image;
        } else {
            callback(image);
        }
    };

    $scope.showStatus = function($event) {
        console.log($scope.registrant.canEnterMessage);
        alert($scope.registrant.canEnterMessage);
    };
    
    $scope.takePicture = function($event) {
        if (Config.isCropAndResizeEnabled()) {
            var options = {
                quality: 85,
                targetWidth: 1224,
                targetHeight: 1632
            };
        } else {
            var options = {
                quality: 85,
                //targetWidth: 225,
                //targetHeight: 300
                allowEdit: true,
                targetWidth: 450,
                targetHeight: 600
            };
        }

        navigator.camera.getPicture(function success(fileUri) {
            window.resolveLocalFileSystemURL(fileUri,function(fileEntry){
                fileEntry.file(function(file) {
                    
                    var reader = new FileReader();
                    reader.onloadend = function(e) {
                        
                        cropAndResize(this.result, options, function(dataURL) {
                            
                            OAuth.updatePicture(data.server_id, data.event_id, data.registrant_id, data.checkin_secret, dataURL, function (result) {
                                
                                if (result.status=="false") {
                                    alert("Unable to upload new picture");
                                } else {
                                    var url = new Url($scope.registrant.personal_data.picture);
                                    url.query.ts = new Date().getTime();
                                    $scope.registrant.personal_data.picture = url.toString();
                                    $scope.$apply();
                                
                                }
                            });
                        });
                    };
                    reader.readAsDataURL(file);
                });                    
            },function(e){
                console.log("FileSystem Error");
                console.dir(e);
            });
        }, function failure(error) {
            alert(error);
        }, options);
    };

    $scope.printBadge = function($event) {
        // REMOTE server printing
        if (!Config.isAirPrintEnabled()) {
            OAuth.remotePrintBadge(data.server_id, data.event_id, data.registrant_id, function (result) {
                showAlert("",result,function(){
                    if (result == "Badge printed.") {
                        $scope.registrant.checked_in = true;
                        $scope.$apply();
                    }


                });
                console.log("RESULT FROM PRINTING:" + result);
            });
        } else {
            // LOCAL air printing
            OAuth.getBadge(data.server_id, data.event_id, data.registrant_id, function (pdf) {
                window.plugins.PrintPDF.print({
                    type: 'base64',
                    data: pdf,
                    title: 'Badge',
                    success: function(){
                        console.log('success');
                        $scope.registrant.checked_in = true;
                        $scope.$apply();
                    },
                    error: function(data){
                        console.log('failed: ' + data.error);
                    }
                });
            });
        }
    };

    function formatDate(shortDate,adjust) {
        var year = parseInt(shortDate.substring(0,2));
        var month = shortDate.substring(2,4);
        var day = shortDate.substring(4,6);
        if (adjust && year>=16) {
            year += 1900;
        } else {
            year += 2000;
        }

        return ""+day+"/"+month+"/"+year;
    }

    $scope.scanmrz = function($event) {
        anyline.mrz.scan(
            function(passport_info){
                console.log(passport_info);
                delete passport_info["allCheckDigitsValid"];
                OAuth.updatePassport(data.server_id, data.event_id, data.registrant_id, data.checkin_secret, passport_info, function (result) {
                    if (result.status=="false") {
                        alert("Unable to update passport info");
                    } else {
                        passport_info.dayOfBirth = formatDate(passport_info.dayOfBirth,true);
                        passport_info.expirationDate = formatDate(passport_info.expirationDate,false);

                        $scope.registrant.personal_data.passportId = passport_info.documentNumber;
                        $scope.registrant.personal_data.passportExpire = passport_info.expirationDate;
                        $scope.registrant.personal_data.passportOrigin = passport_info.countryCode;
                        $scope.registrant.personal_data.birthDate = passport_info.dayOfBirth;
                        $scope.registrant.personal_data.firstName = passport_info.givenNames;
                        $scope.registrant.personal_data.surname = passport_info.surNames;
                        $scope.registrant.full_name = $scope.registrant.personal_data.title+" "+passport_info.givenNames+" "+passport_info.surNames;
                        $scope.$apply();
                                
                    }
                });
            },
            function(error){
                //called if an error occurred or the user canceled the scanning
                if (error == "Canceled") {
                    //do stuff when user has canceled
                    // this can be used as an indicator that the user finished the scanning if canclelOnResult is false
                    console.log("MRZ scanning canceled");
                    return;
                }

                alert(error);
            }
        );
    };
}
