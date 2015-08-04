
#import <UIKit/UIKit.h>

#import <Anyline/Anyline.h>

@protocol AnylineBaseScanViewControllerDelegate;

@interface AnylineBaseScanViewController : UIViewController

@property (nonatomic,strong) UILabel *scannedLabel;

@property (nonatomic, strong) ALUIConfiguration *conf;
@property (nonatomic, strong) AnylineAbstractModuleView *moduleView;
@property (nonatomic, weak) id<AnylineBaseScanViewControllerDelegate> delegate;
@property (nonatomic, strong) NSString *key;

-(instancetype)initWithKey:(NSString*)key configuration:(ALUIConfiguration *)conf delegate:(id<AnylineBaseScanViewControllerDelegate>)delegate;

- (NSString *)saveImageToFileSystem:(UIImage *)image;

@end

@protocol AnylineBaseScanViewControllerDelegate <NSObject>

@required

- (void)anylineBaseScanViewController:(AnylineBaseScanViewController *)baseScanViewController
                              didScan:(id)scanResult
                     continueScanning:(BOOL)continueScanning;

@end