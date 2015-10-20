
#import "AnylineBaseScanViewController.h"
#import <Anyline/Anyline.h>

@interface AnylineBaseScanViewController ()

@property (nonatomic,strong) UIButton *doneButton;

@end

@implementation AnylineBaseScanViewController

-(instancetype)initWithKey:(NSString*)key configuration:(ALUIConfiguration *)conf delegate:(id<AnylineBaseScanViewControllerDelegate>)delegate {
    self = [super init];
    if(self) {
        _key = key;
        _delegate = delegate;
        _conf = conf;
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    dispatch_async(dispatch_get_main_queue(), ^{
        
        self.doneButton = [UIButton buttonWithType:UIButtonTypeCustom];
        [self.doneButton setTitle:NSLocalizedString(@"done", @"scanning done")
                         forState:UIControlStateNormal];
        self.doneButton.frame = CGRectMake(0, 0, 100,44);
        self.doneButton.center = CGPointMake(self.view.frame.size.width/2, self.view.frame.size.height-44);
        [self.doneButton addTarget:self action:@selector(doneButtonPressed:) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:self.doneButton];
        
        self.scannedLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, 44)];
        self.scannedLabel.center = CGPointMake(self.view.center.x, self.view.center.y+100);
        
        self.scannedLabel.alpha = 0.0;
        self.scannedLabel.font = [UIFont fontWithName:@"HelveticaNeue" size:39];
        self.scannedLabel.textColor = [UIColor whiteColor];
        self.scannedLabel.textAlignment = NSTextAlignmentCenter;
        
        //[self.view addSubview:self.scannedLabel];
    });
    
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    
    [UIApplication sharedApplication].idleTimerDisabled = YES;
    
    NSError *error;
    BOOL success = [self.moduleView startScanningAndReturnError:&error];
    NSAssert(success, @"Start Scanning failed: %@",error.debugDescription);
}

- (void)viewDidDisappear:(BOOL)animated {
    [UIApplication sharedApplication].idleTimerDisabled = NO;
}

- (BOOL)shouldAutorotate {
    return NO;
}

- (void)doneButtonPressed:(id)sender {
    [self.moduleView cancelScanningAndReturnError:nil];
    [self dismissViewControllerAnimated:YES completion:^{
        
    }];
}

- (NSString *)saveImageToFileSystem:(UIImage *)image {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
    NSString *basePath = ([paths count] > 0) ? [paths objectAtIndex:0] : nil;
    
    NSData *binaryImageData = UIImageJPEGRepresentation(image, 0.9);
    NSString *uuid = [NSUUID UUID].UUIDString;
    NSString *imagePath = [NSString stringWithFormat:@"%@.jpg",uuid];
    
    NSString *fullPath = [basePath stringByAppendingPathComponent:imagePath];
    [binaryImageData writeToFile:fullPath atomically:YES];
    
    return fullPath;
}

@end
