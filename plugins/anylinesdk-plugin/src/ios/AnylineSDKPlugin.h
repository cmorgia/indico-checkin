
#import <Foundation/Foundation.h>
#import "Cordova/CDVPlugin.h"

@interface AnylineSDKPlugin : CDVPlugin

- (void)scanBarcode:(CDVInvokedUrlCommand *)command;

- (void)scanMRZ:(CDVInvokedUrlCommand *)command;

- (void)scanElectricMeter:(CDVInvokedUrlCommand *)command;

- (void)scanGasMeter:(CDVInvokedUrlCommand *)command;

@end
