//
//  ALError.h
//  Anyline
//
//  Created by Daniel Albertini on 28.10.13.
//  Copyright (c) 2013 9Yards GmbH. All rights reserved.
//


/**
 *  The Error Domain used by the Anyline SDK
 */
static NSString * const ALParserDomain = @"ALParserDomain";
static NSString * const ALRunDomain = @"ALRunDomain";
static NSString * const ALErrorDomain = @"ALErrorDomain";
static NSString * const ALCameraSetupDomain = @"ALCameraSetupDomain";

static NSString * const ALParserErrorLineNumber = @"ALParserErrorLineNumber";
static NSString * const ALParserErrorLineString = @"ALParserErrorLineString";
static NSString * const ALParserErrorParameterName = @"ALParserErrorParameterName";

enum ALErrorCodes {
    //Anyline Exception - this type must be catched within Anyline Core
    ALOperationNotFound = 1001,
    
    //Syntax Exception
    ALSyntaxError = 2001,
    ALTypeError = 2002,
    ALParameterInvalid = 2003,
    
    //License Exception
    ALLicenseKeyInvalid = 3001,
    
    //Argument Exceptions
    ALArgumentIsNull = 4001,
    ALArgumentIsEmpty = 4002,
    ALArgumentNotValid = 4003,
    ALInterpreterNotLoaded =4004,
    
    //Run Failures
    ALNotEnoughContoursFound = 5001,
    ALStackDidNotFoundResult = 5002,
    ALDigitFirstDistanceExceeded = 5003,
    ALDistanceBetweenDigitsExceeded = 5004,
    ALDistanceViolationsNotResolved = 5005,
    ALResultNotValid = 5006,
    ALInvalidDataPointIdentifier = 5007,
    ALRegionOfInterestOutsideImageBounds = 5008,
    ALNotEnoughPointsFound = 5009,

    
    ALNoInformationFound = 6001,
    ALImageColorConvertionProblem = 6002,
    
    //
    ALImageProviderIsNil = 7001,
    ALRunStopError = 7002,
    ALSingleImageRunError = 7003,
    
    ALCameraResolutionNotSupportedByDevice = 8001,
    ALCameraAccessDenied = 8002,
};