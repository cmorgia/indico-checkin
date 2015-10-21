if (anyline === undefined) {
    var anyline = {};
}

anyline.mrz = {
    scan: function(onResult,onError) {
        // start the MRZ scanning
        // pass the success and error callbacks, as well as the license key and the config to the plugin
        // see http://documentation.anyline.io/#anyline-config for config details
        // and http://documentation.anyline.io/#barcode for barcode module details

        cordova.exec(onResult,onError, "AnylineSDK", "scanMRZ", [
          "eyJzY29wZSI6WyJNUloiXSwicGxhdGZvcm0iOlsiaU9TIl0sInZhbGlkIjoiMjAxNi0xMC0zMSIsIm1ham9yVmVyc2lvbiI6IjMiLCJpc0NvbW1lcmNpYWwiOnRydWUsImlvc0lkZW50aWZpZXIiOlsiY2gudW5vZy5pbmRpY28uY2hlY2tpbiJdLCAidG9sZXJhbmNlRGF5cyI6OTB9CkpKNFhNSkVOQS9YQ2pTaGl5ZlkyNnJjU2tNeU1ER3hwYy9xaytqMDlZWmZudDdDTFdPYU0yQXRadXFkUmYxR1ZMZFN5b1grbWtKbUlqMFZsY2l6MUllYit6S25JNitQVm02Ujl4TGwzY2ZqSFBPT3BaNnlycENnYWZQRGJLdFU1czkxTFdCaEZ1RWZKcFEyZzd6NzFHbWpaM3M1NUJIUFhXTDF3bTdIMEtRaEJFZFpkOElHQk9heWpLQjRaaStUblVpTkdVcUkwKzQvRDM3UTJPN3VpZlphNVM2MlJWb3NVU2RRcFFMK0x1WW5Xc3R2emRHOUJQUkJsMlphSndlTU9TaU5XeXpUczFrUE55S1QxaEUwYjBHVjlWd3MzNVlZM05jbFRXWkQ4NnNVSW5hU0VVc3YyM2FySXlnRFZ1NHdySXdrMW5BRytuLzEyVm1jS2pIQjhEUT09",
          {
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