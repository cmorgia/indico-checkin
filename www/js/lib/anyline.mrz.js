if (anyline === undefined) {
    var anyline = {};
}

anyline.mrz = {
    scan: function(onResult,onError) {
        // start the MRZ scanning
        // pass the success and error callbacks, as well as the license key and the config to the plugin
        // see http://documentation.anyline.io/#anyline-config for config details
        // and http://documentation.anyline.io/#barcode for barcode module details

        cordova.exec(onResult,onError, "AnylineSDK", "scanMRZ", ["01R1H8l0m8abV8F2A0B1G4l1jaA918Ze73e5GdJ8U1VbA22fbb75752", {
          "captureResolution": "1080p",

          "cutout": {
            "style": "rect",
            "maxWidthPercent": "90%",
            "maxHeightPercent": "90%",
            "alignment": "top_half",
            "strokeWidth": 2,
            "cornerRadius": 4,
            "strokeColor": "FFFFFF",
            "outerColor": "000000",
            "outerAlpha": 0.3
          },
          "flash": {
            "mode": "auto",
            "alignment": "bottom_right"
          },
          "beepOnResult": true,
          "vibrateOnResult": true,
          "blinkAnimationOnResult": true,
          "cancelOnResult": true
        }]);
    }
};