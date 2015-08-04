//
//  AnylineBarcodeModuleView.h
//  
//
//  Created by Daniel Albertini on 29/06/15.
//
//

#import "AnylineAbstractModuleView.h"

/**
 Theses are the valid code types to supply to setBarcodeFormats:
 */

extern NSString * const kCodeTypeAztec;
extern NSString * const kCodeTypeCodabar;
extern NSString * const kCodeTypeCode39;
extern NSString * const kCodeTypeCode93;
extern NSString * const kCodeTypeCode128;
extern NSString * const kCodeTypeDataMatrix;
extern NSString * const kCodeTypeEAN8;
extern NSString * const kCodeTypeEAN13;
extern NSString * const kCodeTypeITF;
extern NSString * const kCodeTypePDF417;
extern NSString * const kCodeTypeQR;
extern NSString * const kCodeTypeRSS14;
extern NSString * const kCodeTypeRSSExpanded;
extern NSString * const kCodeTypeUPCA;
extern NSString * const kCodeTypeUPCE;
extern NSString * const kCodeTypeUPCEANExtension;

@protocol AnylineBarcodeModuleDelegate;

/**
 * The AnylineBarcodeModuleView class declares the programmatic interface for an object that manages easy access to Anylines barcode scanning mode. All its capablilities are bundlet into this AnylineAbstractModuleView sublclass. Management of the scanning process happens within the view object. It is configurable via interface builder.
 *
 * Communication with the host application is managed with a delegate that conforms to AnylineBarcodeModuleDelegate.
 *
 * AnylineBarcodeModuleView is able to scan the most common 1D and 2D codes. The accepted codes are set with setBarcodeFormats.
 *
 */
@interface AnylineBarcodeModuleView : AnylineAbstractModuleView

/**
 *  Sets the type of code to recognize. Valid values are: kCodeTypeAztec, kCodeTypeCodabar, kCodeTypeCode39, kCodeTypeCode93, kCodeTypeCode128, kCodeTypeDataMatrix, kCodeTypeEAN8, kCodeTypeEAN13, kCodeTypeITF, kCodeTypePDF417, kCodeTypeQR, kCodeTypeRSS14, kCodeTypeRSSExpanded, kCodeTypeUPCA, kCodeTypeUPCE, kCodeTypeUPCEANExtension.
 *  Default are all of the above.
 *
 *  @barcodeFormats delegate The delegate that will receive the Anyline results (hast to conform to <AnylineBarcodeModuleDelegate>)
 *
 */
@property (nonatomic, strong) NSArray * barcodeFormats;

/**
 *  Sets the license key and delegate.
 *
 *  @param licenseKey The Anlyine license key for this application bundle
 *  @param delegate The delegate that will receive the Anyline results (hast to conform to <AnylineBarcodeModuleDelegate>)
 *  @param error The error that occured
 *
 *  @return Boolean indicating the success / failure of the call.
 */
- (BOOL)setupWithLicenseKey:(NSString *)licenseKey
                   delegate:(id<AnylineBarcodeModuleDelegate>)delegate
                      error:(NSError **)error;


@end

@protocol AnylineBarcodeModuleDelegate <NSObject>

/**
 *  Returns the scanned value
 *
 *  @param anylineBarcodeModuleView The view that scanned the result
 *  @param scanResult The scanned value
 *  @param image The image that was used to scan the barcode
 *
 */
- (void)anylineBarcodeModuleView:(AnylineBarcodeModuleView *)anylineBarcodeModuleView
               didFindScanResult:(NSString *)scanResult
                         atImage:(UIImage *)image;

@end