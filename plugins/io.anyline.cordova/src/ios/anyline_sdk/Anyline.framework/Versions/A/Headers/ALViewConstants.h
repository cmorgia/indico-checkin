//
//  ALViewConstants.h
//  Anyline
//
//  Created by Matthias Gasser on 04/05/15.
//  Copyright (c) 2015 9Yards GmbH. All rights reserved.
//

#ifndef Anyline_ALViewConstants_h
#define Anyline_ALViewConstants_h

typedef NS_ENUM(NSUInteger, ALCutoutAlignment) {
    ALCutoutAlignmentTop=0,         // Align to the TOP
    ALCutoutAlignmentTopHalf=1,     // Align in the middle between TOP and MIDDLE
    ALCutoutAlignmentMiddle=2,      // Align MIDDLE
    ALCutoutAlignmentBottomHalf=3,  // Align in the middle between MIDDLE and BOTTOM
    ALCutoutAlignmentBottom=4       // Align BOTTOM
};

typedef NS_ENUM(NSUInteger, ALCaptureViewResolution) {
    ALCaptureViewResolution1080p=0,
    ALCaptureViewResolution720p=1,
    ALCaptureViewResolution480p=2,
};

typedef NS_ENUM(NSUInteger, ALCaptureViewMode) {
    ALCaptureViewModeBGRA=0,
    ALCaptureViewModeYUV=1
};

typedef NS_ENUM(NSUInteger, ALFlashMode) {
    ALFlashModeManual=0,
    ALFlashModeNone=1,
    ALFlashModeAuto=2
};

typedef NS_ENUM(NSUInteger, ALFlashAlignment) {
    ALFlashAlignmentTop=0,
    ALFlashAlignmentTopLeft=1,
    ALFlashAlignmentTopRight=2,
    ALFlashAlignmentBottom=3,
    ALFlashAlignmentBottomLeft=4,
    ALFlashAlignmentBottomRigth=5
};

#endif
