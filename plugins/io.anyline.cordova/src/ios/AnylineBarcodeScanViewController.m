
#import "AnylineBarcodeScanViewController.h"
#import <Anyline/Anyline.h>

@interface AnylineBarcodeScanViewController ()<AnylineBarcodeModuleDelegate>

@end

@implementation AnylineBarcodeScanViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    dispatch_async(dispatch_get_main_queue(), ^{
        AnylineBarcodeModuleView *barcodeModuleView = [[AnylineBarcodeModuleView alloc] initWithFrame:self.view.bounds];
        barcodeModuleView.currentConfiguration = self.conf;
        
        NSError *error = nil;
        BOOL success = [barcodeModuleView setupWithLicenseKey:self.key delegate:self error:&error];
        NSAssert(success, @"Setup failed: %@",error.debugDescription);
        
        self.moduleView = barcodeModuleView;
        
        [self.view addSubview:self.moduleView];
        
        [self.view sendSubviewToBack:self.moduleView];
    });
}

#pragma mark - AnylineBarcodeModuleDelegate method

- (void)anylineBarcodeModuleView:(AnylineBarcodeModuleView *)anylineBarcodeModuleView
               didFindScanResult:(NSString *)scanResult
                         atImage:(UIImage *)image {
    self.scannedLabel.text = scanResult;
    
    NSMutableDictionary *dictResult = [NSMutableDictionary dictionaryWithCapacity:2];
    
    [dictResult setObject:scanResult forKey:@"value"];
    
    NSString *imagePath = [self saveImageToFileSystem:image];
    
    [dictResult setValue:imagePath forKey:@"imagePath"];
    
    [self.delegate anylineBaseScanViewController:self
                                         didScan:dictResult
                                continueScanning:!self.moduleView.cancelOnResult];
    if (self.moduleView.cancelOnResult) {
        [self dismissViewControllerAnimated:YES completion:NULL];
    }
}

@end
