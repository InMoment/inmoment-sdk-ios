# InMoment SDK (iOS) (Beta)

**NOTE: This software is still in beta and is subject to change.**

## Screenshots

![presentsurvey_fl](https://cloud.githubusercontent.com/assets/15389109/18068072/e5e2c70e-6dfc-11e6-85fa-c7e60301b89b.gif)

## System Requirements

- **Xcode 7.3.1** and **Swift 2.2** (the latest stable versions). Apps that include this framework may not build properly if older versions of Xcode or Swift are used.
- Apps must require **iOS 8.0** or later.

## Usage

```swift
import InMoment
```
    
```swift
class ViewController: UIViewController, InMomentSurveyDelegate {

    override func viewDidAppear(animated: Bool) {
        super.viewDidAppear(animated)
        InMoment.presentSurveyModally(usingGateway: "MySurveyGateway", delegate: self)
    }
    
    func survey(didRecieveErrorWhileLoading survey: InMomentSurvey, error: NSError) {
        //Insert your own code here. This method is required.
        survey.dismiss()
    }
  
    func survey(didArriveAtLastPageOfSurvey survey: InMomentSurvey) {
        //Insert your own code here. This method is required.
        survey.dismiss()
    }
    
    func survey(didPassCompletionPointInSurvey survey: InMomentSurvey) {
        //Insert your own code here. This method is optional.
    }
  
}
```

### Presenting the survey

```swift
//class InMoment
public static func presentSurveyModally(usingGateway gateway: String, 
                                      withParameters parameters: [String:String] = [:],
                                                     delegate: InMomentSurveyDelegate)
```

Calling this method presents a survey modally using the given ```presentationStyle```.
- ```usingGateway``` ```gateway``` (required): A valid InMoment web survey gateway. Ask your CSM or operations specialist for details.
- ```withParameters``` ```parameters``` (optional): A dictionary of strings corresponding to survey URL parameters.
- ```delegate``` (required): A reference to an implementation of ```InMomentSurveyDelegate```.

### Recording survey completion

```swift
//protocol InMomentSurveyDelegate
optional func survey(didPassCompletionPointInSurvey survey: InMomentSurvey)
```
  
This method is called when the user arrives at the page immediately following the survey completion point. Once this happens, the survey response will be available in InMoment reports and in Focus™, (even if the user doesn't continue until the very last page of the survey). Use this method to perform actions such as recording that the user has finished taking the survey or giving the user a reward.

### Customizing survey appearance

The following methods can be implemented to customize the appearance of the survey view controller:

```swift
//protocol InMomentSurveyDelegate
optional func preferredWebSurveyModalPresentationStyle() -> UIModalPresentationStyle
optional func preferredWebSurveyNavigationBarStyle() -> UIBarStyle
optional func preferredWebSurveyNavigationBarTintColor() -> UIColor
optional func preferredWebSurveyProgressBarColor() -> UIColor
optional func preferredWebSurveyLoadingViewStyle() -> LoadingViewStyle
```

## Installation

### Installation via CocoaPods (Recommended)

Just add the following line to your ```Podfile```:

```ruby
pod 'InMoment'
```

### Installation via Carthage

1. Add the following line to your ```Cartfile```:

```ruby
github 'InMoment\inmoment-sdk-ios'
```

2. Run ```carthage bootstrap``` or ```carthage update```.
3. You will be required to add the following frameworks to your Xcode project:
    - ```InMoment.framework```
    - ```Mixpanel.framework```
    
### Manual Installation

1. [Download](https://www.github.com/InMoment/inmoment-sdk/releases/latest) and unzip the latest release.
2. Drag ```InMomentFeedbackKit.framework``` into your Xcode project and choose "Copy if needed".
3. Click the ```+``` in the ```Embedded Binaries``` section of your application's target, and select ```InMomentFeedbackKit.framework```.
4. Do the same for each of the framework's dependencies (listed in the Cartfile or InMoment.podspec).
5. Add a "Run Script" build phase after "Embed Frameworks". Copy and paste the following script:

    ```bash
    APP_PATH="${TARGET_BUILD_DIR}/${WRAPPER_NAME}"

    # This script loops through the frameworks embedded in the application and
    # removes unused architectures.
    find "$APP_PATH" -name '*.framework' -type d | while read -r FRAMEWORK
    do
        FRAMEWORK_EXECUTABLE_NAME=$(defaults read "$FRAMEWORK/Info.plist" CFBundleExecutable)
        FRAMEWORK_EXECUTABLE_PATH="$FRAMEWORK/$FRAMEWORK_EXECUTABLE_NAME"
        echo "Executable is $FRAMEWORK_EXECUTABLE_PATH"
    
        EXTRACTED_ARCHS=()
    
        for ARCH in $ARCHS
        do
            echo "Extracting $ARCH from $FRAMEWORK_EXECUTABLE_NAME"
            lipo -extract "$ARCH" "$FRAMEWORK_EXECUTABLE_PATH" -o "$FRAMEWORK_EXECUTABLE_PATH-$ARCH"
            EXTRACTED_ARCHS+=("$FRAMEWORK_EXECUTABLE_PATH-$ARCH")
        done
    
        echo "Merging extracted architectures: ${ARCHS}"
        lipo -o "$FRAMEWORK_EXECUTABLE_PATH-merged" -create "${EXTRACTED_ARCHS[@]}"
        rm "${EXTRACTED_ARCHS[@]}"
    
        echo "Replacing original executable with thinned version"
        rm "$FRAMEWORK_EXECUTABLE_PATH"
        mv "$FRAMEWORK_EXECUTABLE_PATH-merged" "$FRAMEWORK_EXECUTABLE_PATH"
    
    done
    ```
    Credit: [Daniel Kennett](http://stackoverflow.com/users/29005/ikenndac). This is a workaround for a bug in Xcode 7 that prevents users from uploading apps referencing frameworks that contain simulator slices to iTunes Connect [(click here to learn more)](http://ikennd.ac/blog/2015/02/stripping-unwanted-architectures-from-dynamic-libraries-in-xcode/). We wanted you to still be able to use your app with the simulators, so we intentionally included these slices.
