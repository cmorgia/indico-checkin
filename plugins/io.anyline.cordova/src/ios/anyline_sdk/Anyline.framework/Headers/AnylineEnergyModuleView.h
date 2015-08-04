//
//  AnylineModuleView.h
//  Anyline
//
//  Created by Daniel Albertini on 25/06/15.
//  Copyright (c) 2015 9Yards GmbH. All rights reserved.
//

#import "AnylineAbstractModuleView.h"

typedef NS_ENUM(NSInteger, ALScanMode) {
    ALElectricMeter,
    ALGasMeter,
    ALBarcode,
//    ALSerialNumber,
};

@protocol AnylineEnergyModuleDelegate;

/**
 * The AnylineEnergyModuleView class declares the programmatic interface for an object that manages easy access to Anylines energy meter scanning mode. All its capablilities are bundlet into this AnylineAbstractModuleView sublclass. Management of the scanning process happens within the view object. It is configurable via interface builder.
 *
 * Communication with the host application is managed with a delegate that conforms to AnylineEnergyModuleDelegate. 
 *
 * AnylineBarcodeModuleView is able to scan the most common energy meters. The scan mode is set with setScanMode.
 */
@interface AnylineEnergyModuleView : AnylineAbstractModuleView

/**
 *  Sets the scan mode. 
 *  It has to be ALElectricMeter, ALGasMeter, ALBarcode or ALSerialNumber
 *
 */
@property (nonatomic) ALScanMode scanMode;

/**
 *  Sets the license key and delegate.
 *
 *  @param licenseKey The Anlyine license key for this application bundle
 *  @param delegate The delegate that will receive the Anyline results (hast to conform to <AnylineEnergyModuleDelegate>)
 *  @param error The error that occured
 *
 *  @return Boolean indicating the success / failure of the call.
 */
- (BOOL)setupWithLicenseKey:(NSString *)licenseKey
                   delegate:(id<AnylineEnergyModuleDelegate>)delegate
                      error:(NSError **)error;

@end

@protocol AnylineEnergyModuleDelegate <NSObject>

/**
 *  Returns the scanned value
 *
 *  @param AnylineEnergyModuleView The view that scanned the result
 *  @param scanResult The scanned value
 *  @param image The cropped version of the image that contains the scanned number
 *  @param fullImage The whole image used to scan the number
 *  @param scanMode The mode the scanner was in at the time of scanning. Has to be ALElectricMeter, ALGasMeter, ALBarcode or ALSerialNumber
 *
 */
- (void)anylineEnergyModuleView:(AnylineEnergyModuleView *)anylineEnergyModuleView
              didFindScanResult:(NSString *)scanResult
                      cropImage:(UIImage *)image
                      fullImage:(UIImage *)fullImage
                         inMode:(ALScanMode)scanMode;

@end