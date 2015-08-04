//
//  ALCutoutConfiguration.h
//  Anyline
//
//  Created by Matthias Gasser on 28/04/15.
//  Copyright (c) 2015 9Yards GmbH. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ALCutoutView.h"
#import "ALViewConstants.h"

@interface ALUIConfiguration : NSObject

@property (nonatomic,assign) CGFloat cutoutWidthPercent;
@property (nonatomic,assign) CGFloat cutoutMaxPercentWidth;
@property (nonatomic,assign) CGFloat cutoutMaxPercentHeight;
@property (nonatomic,assign) ALCutoutAlignment cutoutAlignment;
@property (nonatomic,assign) ALCaptureViewResolution captureResolution;
@property (nonatomic,assign) ALCaptureViewMode captureMode;
@property (nonatomic,assign) CGPoint cutoutOffset;
@property (nonatomic,copy) UIBezierPath *cutoutPath;
@property (nonatomic,assign) CGSize cutoutCropPadding;
@property (nonatomic,assign) CGPoint cutoutCropOffset;
@property (nonatomic,strong) UIColor *cutoutBackgroundColor;
@property (nonatomic,strong) UIImage *overlayImage;
@property (nonatomic,strong) UIColor *strokeColor;
@property (nonatomic,assign) NSInteger strokeWidth;
@property (nonatomic,assign) NSInteger cornerRadius;

@property (nonatomic, strong) UIColor *backgroundColorWithoutAlpha;
@property (nonatomic, assign) CGFloat backgroundAlpha;

@property (nonatomic, assign) ALFlashMode flashMode;
@property (nonatomic, assign) ALFlashAlignment flashAlignment;
@property (nonatomic, strong) UIImage *flashImage;

@property (nonatomic,assign) BOOL beepOnResult;
@property (nonatomic,assign) BOOL vibrateOnResult;
@property (nonatomic,assign) BOOL blinkAnimationOnResult;
@property (nonatomic,assign) BOOL cancelOnResult;


+ (instancetype)cutoutConfigurationFromJsonFile:(NSString *)jsonFile;

- (instancetype)initWithDictionary:(NSDictionary *)dictionary bundlePath:(NSString *)bundlePath;

- (void)setCutoutPathForWidth:(CGFloat)width height:(CGFloat)height;

- (void)updateCutoutWidth:(CGFloat)width;

@end
