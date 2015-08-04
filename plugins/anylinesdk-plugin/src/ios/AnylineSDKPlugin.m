
#import "AnylineSDKPlugin.h"
#import <Anyline/Anyline.h>
#import "AnylineBarcodeScanViewController.h"
#import "AnylineEnergyScanViewController.h"
#import "AnylineMRZScanViewController.h"

@interface AnylineSDKPlugin()<AnylineBaseScanViewControllerDelegate>

@property (nonatomic, strong) AnylineBaseScanViewController *baseScanViewController;
@property (nonatomic, strong) ALUIConfiguration *conf;

@property (nonatomic, strong) NSString *callbackId;
@property (nonatomic, strong) NSString *appKey;

@end


@implementation AnylineSDKPlugin

- (void)scanBarcode:(CDVInvokedUrlCommand *)command {
    [self processCommandArguments:command];
    
    [self.commandDelegate runInBackground:^{
        self.baseScanViewController = [[AnylineBarcodeScanViewController alloc] initWithKey:self.appKey configuration:self.conf delegate:self];
        
        [self presentViewController];
    }];
}

- (void)scanMRZ:(CDVInvokedUrlCommand *)command {
    [self processCommandArguments:command];
    
    [self.commandDelegate runInBackground:^{
        self.baseScanViewController = [[AnylineMRZScanViewController alloc] initWithKey:self.appKey configuration:self.conf delegate:self];
        
        [self presentViewController];
    }];
}

- (void)scanElectricMeter:(CDVInvokedUrlCommand *)command {
    [self processCommandArguments:command];
    
    [self.commandDelegate runInBackground:^{
        AnylineEnergyScanViewController *energyScanViewController = [[AnylineEnergyScanViewController alloc] initWithKey:self.appKey configuration:self.conf delegate:self];
        
        energyScanViewController.scanMode = ALElectricMeter;
        
        self.baseScanViewController = energyScanViewController;
        
        [self presentViewController];
    }];
}

- (void)scanGasMeter:(CDVInvokedUrlCommand *)command {
    [self processCommandArguments:command];
    
    [self.commandDelegate runInBackground:^{
        AnylineEnergyScanViewController *energyScanViewController = [[AnylineEnergyScanViewController alloc] initWithKey:self.appKey configuration:self.conf delegate:self];
        
        energyScanViewController.scanMode = ALGasMeter;
        
        self.baseScanViewController = energyScanViewController;
        
        [self presentViewController];
    }];
}

- (void)processCommandArguments:(CDVInvokedUrlCommand *)command {
    self.callbackId = command.callbackId;
    self.appKey = [command.arguments objectAtIndex:0];
    
    NSDictionary *options = [command.arguments objectAtIndex:1];
    self.conf = [[ALUIConfiguration alloc] initWithDictionary:options bundlePath:nil];
}

- (void)presentViewController {
    if ([self.viewController respondsToSelector:@selector(presentViewController:animated:completion:)]) {
        [self.viewController presentViewController:self.baseScanViewController animated:YES completion:NULL];
    } else {
        // ignore warning
        [self.viewController presentModalViewController:self.baseScanViewController animated:NO];
    }
}

#pragma mark - AnylineBaseScanViewControllerDelegate

- (void)anylineBaseScanViewController:(AnylineBaseScanViewController *)baseScanViewController didScan:(id)scanResult continueScanning:(BOOL)continueScanning {
    CDVPluginResult *pluginResult;
    if ([scanResult isKindOfClass:[NSString class]]) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:scanResult];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:scanResult];
    }
    if (continueScanning) {
        [pluginResult setKeepCallback:@YES];
    }
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackId];
}

@end
