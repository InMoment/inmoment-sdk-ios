# InMoment iOS SDK
[![CocoaPods](https://img.shields.io/cocoapods/p/InMoment.svg)](https://cocoapods.org/pods/InMoment)
[![CocoaPods](https://img.shields.io/cocoapods/v/InMoment.svg)](https://cocoapods.org/pods/InMoment)
[![Carthage compatible](https://img.shields.io/badge/Carthage-compatible-4BC51D.svg?style=flat)](https://github.com/Carthage/Carthage)
[![CocoaPods](https://img.shields.io/cocoapods/l/InMoment.svg)](https://cocoapods.org/pods/InMoment)

`InMoment` is a simple framework giving client developers the ability to launch and interact with InMoment web surveys.

## Screenshots

![presentsurvey_fl](https://cloud.githubusercontent.com/assets/15389109/18068072/e5e2c70e-6dfc-11e6-85fa-c7e60301b89b.gif)
![completionpoint_fl](https://cloud.githubusercontent.com/assets/15389109/18071937/d83ad6c2-6e16-11e6-8a3d-c49935905410.gif)
![lastpage_fl](https://cloud.githubusercontent.com/assets/15389109/18071939/dac98abe-6e16-11e6-909b-b976b6a84864.gif)

## System Requirements

- **Xcode 8.2.1** and **Swift 3.0.2**. Apps that include this framework may not build properly if newer or older versions of Xcode or Swift are used. If you need to target Swift 2.2, please use one of our **0.4.x** releases.
- Apps must require **iOS 8.0** or later.

## Usage

To use this library, a valid survey gateway must first be obtained from your InMoment Client Success Manager (CSM) or Technical Success Manager (TSM). The following sections provide instructions to initialize the SDK and to present surveys. Useful tools for recording survey completion and error handling will also be discussed.

### Initializing the SDK

Before any surveys may be presented, the SDK must be initialized with an instance of `SurveyListener`. Typically this is done by the `AppDelegate`, but can be done anywhere as long as it takes place before any calls to `presentSurvey`.

To initialize the SDK, make the following modifications to your application's `AppDelegate`:

```swift
import InMoment

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, SurveyListener {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        InMoment.initialize(surveyListener: self)
        return true
    }

    func onReceivedError(_ survey: Survey, error: NSError) {
        //Insert your own code here. This method is required.
    }

    func onArrivedAtLastPage(_ survey: Survey) {
        //Insert your own code here. This method is required.
    }

    func onPassedCompletionPoint(_ survey: Survey) {
        //Insert your own code here. This method is optional.
    }

}
```

### Presenting a Survey

The following method of the `InMoment` class will present a survey.

```swift
//class InMoment
public static func presentSurvey(context: UIViewController,
                                 gateway: String,
                                 parameters: [String:String] = [:],
                                 style: SurveyStyle = SurveyStyle())
```

Calling this method presents a survey modally using the given `style`.
- `context` (required): An instance of `UIViewController`. This view controller will act as a host for the survey view controller.
- `gateway` (required): A valid InMoment web survey gateway. Ask your CSM or TSM for details.
- `parameters` (optional): A dictionary of strings corresponding to any survey URL parameters.
- `style` (optional): An object of type `SurveyStyle`.

### Useful Tools

The following sections discuss some useful tools for manipulating and gleaning information from surveys.

#### Recording Survey Completion

There are two ways to record survey completion: once the user passes the **completion point** of the survey, and once the user arrives on the **last page** of the survey. The former is appropriate for determining when the survey response is considered "complete" according to the InMoment platform and will be available in reports. The latter is more appropriate for determining when no other survey pages exist, and for recording information like the survey's **redemption code**.

###### First Method, Completion Point:

```swift
//protocol SurveyListener
optional func onPassedCompletionPoint(_ survey: Survey)
```

This method is called when the user arrives at the page immediately following the survey completion point. Once this happens, the survey response will be available in InMoment reports and in Hub 2.0™, (even if the user doesn't continue until the very last page of the survey). Implement this method in your application's `SurveyListener` to perform actions such as recording that the user has finished taking the survey or giving the user a reward.

Example usage:

```swift
func onPassedCompletionPoint(_ survey: Survey) {

    myUsersAwesomeRewardPoints.increment(by: 100)

}
```

###### Second Method, Last Page:

```swift
//protocol SurveyListener
optional func onArrivedAtLastPage(_ survey: Survey)
```

This method is called when the user arrives at the last page of the survey. Implement this method in your application's `SurveyListener` to perform actions such as recording the redemption and finally dismissing the survey.

Example usage:

```swift
func onArrivedAtLastPage(_ survey: Survey) {

    var redemptionCode = survey.getRedemptionCode()
    myUsersSavedRedemptionCodes.save(code: redemptionCode)

    survey.createAlertDialog()
        .setTitle("Thank you!")
        .setMessage("Your feedback has been recorded")
        .addButton("OK", preferred: true, onClick: { survey.dismiss() })
        .show()

}
```

#### Error Handling

```swift
//protocol SurveyListener
func onReceivedError(_ survey: Survey, error: NSError)
```

This method is called when an error occurs while loading or during the survey. Implement this method in your application's `SurveyListener` to perform actions such as attempting to restart the survey or logging the error and finally dismissing the survey.

Example usage:

```swift
func onReceivedError(_ survey: Survey, error: NSError) {
    
    NSLog(error.localizedDescription)
    NSLog(error.localizedFailureReason ?? "")
    NSLog(error.localizedRecoverySuggestion ?? "")

    survey.createAlertDialog()
        .setTitle("Oops!")
        .setMessage("Something went wrong!")
        .addButton("Try again", onClick: { survey.startOver() })
        .addButton("Cancel", style: .destructive, preferred: true, onClick: { survey.dismiss() })
        .show()

}
```

#### Customizing Survey Appearance

Passing an instance of `SurveyStyle` to `InMoment.presentSurvey()` will apply the desired stylistic effects to the survey view controller's navigation bar and progress bar.

```swift
public class SurveyStyle {
    public var modalPresentationStyle: UIModalPresentationStyle = .pageSheet
    public var navigationBarStyle: UIBarStyle = .default
    public var navigationBarTintColor: UIColor? = nil
    public var navigationBarTextColor: UIColor? = UIColor.darkText
    public var progressBarColor: UIColor? = InMomentGreenColor
    public var loadingViewStyle: LoadingViewStyle = .lightGray
}
```

## Privacy

If a survey has a video feedback prompt, the survey will attempt to access the device's camera, microphone, and/or photo library. The SDK does not know if a survey has a video feedback prompt at compile-time; therefore, the following entries must be added to the application's `Info.plist`:

- `NSCameraUsageDescription` (Privacy - Camera Usage Description)
- `NSMicrophoneUsageDescription` (Privacy - Microphone Usage Description)
- `NSPhotoLibraryUsageDescription` (Privacy - Photo Library Usage Description)

Failure to add these entries to the application's `Info.plist` will result in the app being rejected during App Store submission.

## Installation

### CocoaPods (Recommended)

1. Add the following to your ```Podfile```:

    ```ruby
    platform :ios, '8.0'
    use_frameworks!
    pod 'InMoment', '~> 0.8.2'
    ```

2. Run `pod install` or `pod update`.
3. Don't forget to add the appropriate entries to your Info.plist (see "Privacy").

### Carthage

1. Add the following to your ```Cartfile```:

    ```ruby
    github 'InMoment/inmoment-sdk-ios' ~> 0.8.2
    ```

2. Run `carthage bootstrap` or `carthage update`.
3. On your app target's `General` settings tab, drag `InMoment.framework` from the `Carthage/Build` folder into the `Embedded binaries` section.
4. On your app target's `Build Phases` settings tab, click the `+` icon and choose `New Run Script Phase`. Create a Run Script in which your specify your shell (ex: `bin/sh`), and add the following contents to the script area below the shell:

    ```bash
    /usr/local/bin/carthage copy-frameworks
    ```

    and add the following line under `Input Files`:

    ```bash
    $(SRCROOT)/Carthage/Build/iOS/InMoment.framework
    ```

    This script works around an App Store submission bug triggered by universal binaries and ensures that necessary bitcode-related files and dSYMs are copied when archiving.

5. Don't forget to add the appropriate entries to your Info.plist (see "Privacy").

### Manual Installation

See our [manual installation guide](/Manual Installation.md).
