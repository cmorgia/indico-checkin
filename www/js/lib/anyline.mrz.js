if (anyline === undefined) {
    var anyline = {};
}

anyline.mrz = {
    scan: function (onResult, onError) {
        // start the MRZ scanning
        // pass the success and error callbacks, as well as the license key and the config to the plugin
        // see http://documentation.anyline.io/#anyline-config for config details
        // and http://documentation.anyline.io/#barcode for barcode module details

        cordova.exec(onResult, onError, "AnylineSDK", "scanMRZ", [
            "eyJzY29wZSI6WyJBTEwiXSwicGxhdGZvcm0iOlsiaU9TIiwiQW5kcm9pZCIsIldpbmRvd3MiXSwidmFsaWQiOiIyMDE3LTA1LTExIiwibWFqb3JWZXJzaW9uIjoiMyIsImlzQ29tbWVyY2lhbCI6ZmFsc2UsInRvbGVyYW5jZURheXMiOjYwLCJpb3NJZGVudGlmaWVyIjpbImNoLnVub2cuaW5kaWNvLmNoZWNraW4iXSwiYW5kcm9pZElkZW50aWZpZXIiOlsiY2gudW5vZy5pbmRpY28uY2hlY2tpbiJdLCJ3aW5kb3dzSWRlbnRpZmllciI6WyJjaC51bm9nLmluZGljby5jaGVja2luIl19Clg3YkdsMWJwUEt6bE9CUXZyNGlXb2hKM0tNRmYvYjNoQmxoaXNVNG5DaVJOYzhucDhueGtvTnFLWVdqdCtHYWZHS1BwUEVmT0ZJMCtQQzJZRUpDWnVRMlkyZGN6WSt1NzhFUDZrYnBUTDYyUk9UTmFPWTlweEJsUnh6R3RjRmtTUmVxTTJ4U045OXJZb2twWWZKUnhqYlhtRldGMll3YkNjNTNySUJ6WDRVbWF2bmh4K1FZYVhXQ2NMeUl4bVI1c0tjdnZ3SjdSRjdBeEd0WjhPVjBERUtraC9MUTFuY0JQLytKM2hZczZRUDMrTGRnaW82bER6eWZ0ZXQ3SW5ZcjZjb0JOR3ZxRUtTUkhyOVRkamhzZFpmR3owSHV0c0R2UjJuSHFoS0I1elVXU1hwa3k0V3hMV3ZYdnVuNDBGQXQ1RW1ZU01MMGZReGhMSEExRkgwWVJYZz09",
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

anyline.qrcode = {
    scan: function (onResult, onError) {
        cordova.exec(onResult, onError, "AnylineSDK", "BARCODE",
            [
                "eyJzY29wZSI6WyJBTEwiXSwicGxhdGZvcm0iOlsiaU9TIiwiQW5kcm9pZCIsIldpbmRvd3MiXSwidmFsaWQiOiIyMDE3LTA1LTExIiwibWFqb3JWZXJzaW9uIjoiMyIsImlzQ29tbWVyY2lhbCI6ZmFsc2UsInRvbGVyYW5jZURheXMiOjYwLCJpb3NJZGVudGlmaWVyIjpbImNoLnVub2cuaW5kaWNvLmNoZWNraW4iXSwiYW5kcm9pZElkZW50aWZpZXIiOlsiY2gudW5vZy5pbmRpY28uY2hlY2tpbiJdLCJ3aW5kb3dzSWRlbnRpZmllciI6WyJjaC51bm9nLmluZGljby5jaGVja2luIl19Clg3YkdsMWJwUEt6bE9CUXZyNGlXb2hKM0tNRmYvYjNoQmxoaXNVNG5DaVJOYzhucDhueGtvTnFLWVdqdCtHYWZHS1BwUEVmT0ZJMCtQQzJZRUpDWnVRMlkyZGN6WSt1NzhFUDZrYnBUTDYyUk9UTmFPWTlweEJsUnh6R3RjRmtTUmVxTTJ4U045OXJZb2twWWZKUnhqYlhtRldGMll3YkNjNTNySUJ6WDRVbWF2bmh4K1FZYVhXQ2NMeUl4bVI1c0tjdnZ3SjdSRjdBeEd0WjhPVjBERUtraC9MUTFuY0JQLytKM2hZczZRUDMrTGRnaW82bER6eWZ0ZXQ3SW5ZcjZjb0JOR3ZxRUtTUkhyOVRkamhzZFpmR3owSHV0c0R2UjJuSHFoS0I1elVXU1hwa3k0V3hMV3ZYdnVuNDBGQXQ1RW1ZU01MMGZReGhMSEExRkgwWVJYZz09",
                {
                    "captureResolution": "720p",
                    "cutout": {
                        "style": "rect",
                        "maxWidthPercent": "80%",
                        "maxHeightPercent": "80%",
                        "alignment": "center",
                        "ratioFromSize": {
                            "width": 100,
                            "height": 80
                        },
                        "strokeWidth": 4,
                        "cornerRadius": 10,
                        "strokeColor": "FFFFFF",
                        "outerColor": "000000",
                        "outerAlpha": 0.3
                    },
                    "flash": {
                        "mode": "manual",
                        "alignment": "bottom_right"
                    },
                    "beepOnResult": true,
                    "vibrateOnResult": true,
                    "blinkAnimationOnResult": true,
                    "cancelOnResult": true
                }
            ]
        );
    }
};