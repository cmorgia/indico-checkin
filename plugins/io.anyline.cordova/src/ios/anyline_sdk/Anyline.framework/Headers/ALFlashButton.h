//
//  ALFlashButtonDelegate.h
//  rb-code-scanner
//
//  Created by David Dengg on 17.10.14.
//  Copyright (c) 2014 David Dengg. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, ALFlashStatus) {
    ALFlashStatusOn,
    ALFlashStatusOff,
    ALFlashStatusAuto
};

@protocol ALFlashButtonDelegate;

@interface ALFlashButton : UIControl

@property (nonatomic, assign) BOOL expanded;

@property (nonatomic, assign) BOOL expandLeft;

@property (nonatomic, strong) UIImageView *flashImage;

@property (nonatomic, assign) ALFlashStatus flashStatus;

@property (nonatomic, weak) id<ALFlashButtonDelegate> delegate;

- (void)setExpanded:(BOOL)expanded animated:(BOOL)animated;

- (id)initWithFrame:(CGRect)frame flashImage:(UIImage *)flashImage;

@end

@protocol ALFlashButtonDelegate <NSObject>

- (void)flashButton:(ALFlashButton *)flashButton statusChanged:(ALFlashStatus)flashStatus;

@optional

- (void)flashButton:(ALFlashButton *)flashButton expanded:(BOOL)expanded;

@end
