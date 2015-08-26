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
    function scanQRCode(callback) {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    // The timeout has to be set for IOS because will not work properly
                    callback(JSON.parse(result.text));
                }
            },
            function (error) {
                showAlert("Error scanning", error, function () {});
            }
        );
    };

    $scope.fetchTodaysEvents = function () {
        OAuth.getTodaysEvents($scope.server.baseUrl.hashCode(),function(events) {
            for (var i=0; i<events.length; i++) {
                var event = events[i];
                event.server=$scope.server;
                OAuth.addEvent(event, function () {
                    console.log("Event "+event.id+" successfully added");
                });
            }
            $location.path('events');
            $scope.$apply();
        });
    };

    $scope.allEvents = function () {
        $location.path('events');
    };

    $scope.scan = function () {
        scanQRCode(function (data) {
            // removed the check for an existing event (UNOG Security use case)
            $location.path('registrant').search({"registrant_id": data.registrant_id,
                                                 "event_id": data.event_id,
                                                 "server_id": data.server_url.hashCode(),
                                                 "checkin_secret": data.checkin_secret,
                                                 "ts": Math.random()
                                             });
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
        window.history.back();
    };

    $scope.config = function() {
        $location.path('config');
    };

    $scope.$on('changeTitle', function (event, title) {
        $scope.title = title;
    });

}

function ConfigController($scope, $location, Config) {
    $scope.simplifiedUI = Config.isSimplifiedUI();
    $scope.confOfficerUI = Config.isConfOfficerUI();
    $scope.airPrint = Config.isAirPrintEnabled();
    $scope.performCropAndResize = Config.isCropAndResizeEnabled();

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

    $scope.reset = function() {
        Config.reset();
        $scope.simplifiedUI = Config.isSimplifiedUI();
        $scope.confOfficerUI = Config.isConfOfficerUI();
        $scope.airPrint = Config.isAirPrintEnabled();
        $scope.performCropAndResize = Config.isCropAndResizeEnabled();
        localStorage.removeItem('servers');
        localStorage.removeItem('events');
        $location.path('events');
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

function RegistrantController($scope, $location, OAuth, Config) {

    var data = $location.search();
    
    var resetPrinter = false;
    $scope.confOfficerUI=Config.isConfOfficerUI();
    
    OAuth.getRegistrant(data.server_id, data.event_id, data.registrant_id, function (registrant) {
        if ((registrant === undefined) || (registrant=="")) {
            showAlert('Error', "The registrant cannot be found or it's not approved for the session", function () {});
            $location.path('events');
        } else {
            var evt = OAuth.getEvent(data.server_id, data.event_id)
            if (evt.hasOwnProperty("session_id")) {
                $scope.confOfficerUI = true
            }
            registrant.personal_data.picture = registrant.personal_data.picture+"?ts="+ new Date().getTime();
            $scope.registrant = registrant;
        }
        $scope.$apply();
    });

    $scope.checkin_registrant = function($event) {
        var toggled =  angular.element($event.currentTarget).hasClass("toggled");
        OAuth.checkIn(data, !toggled, function (result) {
            $scope.registrant.checkin_date = result.checkin_date;
            $scope.registrant.checked_in = result.checked_in;
            $scope.$apply();
        });
    };

    function cropAndResize(image,options,callback) {
        if (Config.isCropAndResizeEnabled()) {
            var zoomFactor = 1;
            var sourceX = -180;
            var sourceY = -30;
            var sourceWidth = options.targetWidth;
            var sourceHeight = options.targetHeight;
            var destWidth = 225*zoomFactor;
            var destHeight = 300*zoomFactor;
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
                targetWidth: 225,
                targetHeight: 300
            };
        }
        
        navigator.customCamera.getPicture("temp.jpg", function success(fileUri) {
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
        if (!Config.isAirPrintEnabled()) {
            OAuth.remotePrintBadge(data.server_id, data.event_id, data.registrant_id, function (result) {
                alert(result);
            });
        } else {
            OAuth.getBadge(data.server_id, data.event_id, data.registrant_id, function (pdf) {
                window.plugins.PrintPDF.print({
                    type: 'base64',
                    data: pdf,
                    title: 'Badge',
                    success: function(){
                        console.log('success');
                    },
                    error: function(data){
                        console.log('failed: ' + data.error);
                    }
                });
            });
        }
    };

    $scope.scanmrz = function($event) {
        anyline.mrz.scan(
            function(passport_info){
                console.log(passport_info);
                OAuth.updatePassport(data.server_id, data.event_id, data.registrant_id, data.checkin_secret, passport_info, function (result) {
                    if (result.status=="false") {
                        alert("Unable to update passport info");
                    } else {
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
