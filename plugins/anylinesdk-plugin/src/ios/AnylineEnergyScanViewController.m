
#import "AnylineEnergyScanViewController.h"
#import <Anyline/Anyline.h>

@interface AnylineEnergyScanViewController ()<AnylineEnergyModuleDelegate>

@end

@implementation AnylineEnergyScanViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    dispatch_async(dispatch_get_main_queue(), ^{
        AnylineEnergyModuleView *energyModuleView = [[AnylineEnergyModuleView alloc] initWithFrame:self.view.bounds];
        energyModuleView.currentConfiguration = self.conf;
        
        energyModuleView.scanMode = self.scanMode;
        NSError *error = nil;
        BOOL success = [energyModuleView setupWithLicenseKey:self.key delegate:self error:&error];
        NSAssert(success, @"Setup failed: %@",error.debugDescription);
        
        self.moduleView = energyModuleView;
        
        [self.view addSubview:self.moduleView];
        
        [self.view sendSubviewToBack:self.moduleView];
    });
}

#pragma mark - AnylineEnergyModuleDelegate method

- (void)anylineEnergyModuleView:(AnylineEnergyModuleView *)anylineEnergyModuleView
              didFindScanResult:(NSString *)scanResult
                      cropImage:(UIImage *)image
                      fullImage:(UIImage *)fullImage
                         inMode:(ALScanMode)scanMode {
    self.scannedLabel.text = scanResult;
    
    NSMutableDictionary *dictResult = [NSMutableDictionary dictionaryWithCapacity:4];
    
    if (scanMode == ALGasMeter) {
        [dictResult setObject:@"Gas Meter" forKey:@"meterType"];
    } else {
        [dictResult setObject:@"Electric Meter" forKey:@"meterType"];
    }
        
    [dictResult setObject:scanResult forKey:@"reading"];
    
    NSString *imagePath = [self saveImageToFileSystem:image];
    
    [dictResult setValue:imagePath forKey:@"imagePath"];
    
    NSString *fullImagePath = [self saveImageToFileSystem:fullImage];
    
    [dictResult setValue:fullImagePath forKey:@"fullImagePath"];
    
    [self.delegate anylineBaseScanViewController:self didScan:dictResult continueScanning:!self.moduleView.cancelOnResult];
    
    if (self.moduleView.cancelOnResult) {
        [self dismissViewControllerAnimated:YES completion:NULL];
    }
}

@end
