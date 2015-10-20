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
          "eyJzY29wZSI6Ik1SWiIsInBsYXRmb3JtIjpbImlPUyIsIkFuZHJvaWQiXSwidmFsaWQiOiIyMDE2LTEwLTIwIiwibWFqb3JWZXJzaW9uIjoiMyIsImlzQ29tbWVyY2lhbCI6dHJ1ZSwidG9sZXJhbmNlRGF5cyI6NjAsImlvc0lkZW50aWZpZXIiOlsiY2gudW5vZy5pbmRpY28uY2hlY2tpbiJdLCJhbmRyb2lkSWRlbnRpZmllciI6WyJjaC51bm9nLmluZGljby5jaGVja2luIl19CnpvT1BoQlJmcEhnU3VRUWVLRXVmK203N3FtTjZuendZM0k4SGhlUFRwbDlWQ0FqZEhSRlBnbld3bmJTYlloRmwzSDV2NHovS1Y0c0tvdDFpWm8rUlRlcm5kRmZ5ZEpTK29KMHVuRXl0akh5U3o0alhsRE9yNmVBNWFldGxwS0lNZzUrQVorWUJzcyttZkFkK2ZYcTNidVZjcnVSNi9SOXN0VHR0YmJ0dUF1S21LK2ZBQ3lZbHppcDlxa3FIOWtJVzlwWGd3cnYxNThWQnljbzFSUW5UR1dURWRqbGpXQjdJREtZdDdSdGtGV1VjdG1GMmRiWUpkTi9wVXUxMm5oY0dsYmhxMTdhbGRZTmZWRkVqZHMwUDJidEhHYWFpVlhnWXFQMjl0VmlFREVndlJMQzU1ZFBrbWhQUXFUODR4VGlTMlNxNkZGSXQ1UE1aVnlYVWlNTEdDUT09", {
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