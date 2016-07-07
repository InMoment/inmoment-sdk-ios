# InMomentFeedbackKit (iOS) (Beta)

**NOTE: This software is still in beta and is subject to change.**

## System Requirements

- **Xcode 7.3** and **Swift 2.2** (the latest stable versions). Apps that include this framework may not build properly if older versions of Xcode or Swift are used.
- Apps must require **iOS 8.0** or later.

## Basic Usage

```swift
import InmomentFeedbackKit
```
    
```swift
class ViewController: UIViewController, IMSurveyViewDelegate {

    override func viewDidLoad() {
        super.viewDidLoad()
        InMoment.presentSurveyModally("https://www.inmoment.com/foo", delegate: self)
    }
    
    func surveyView(didRecieveErrorLoadingSurvey survey: IMSurveyViewController, error: NSError) {
        //Insert your own code here. This method is required.
        survey.dismiss()
    }
  
    func surveyView(didArriveAtLastPageOfSurvey survey: IMSurveyViewController) {
        //Insert your own code here. This method is required.
        survey.dismiss()
    }
  
}
```

### Special Note: App Transport Security

All survey data is encrypted via SSL, but there are some elements of the survey which are still not encrypted. We are working on this issue, but until this is resolved you may turn off App Transport Security by adding the following entry to your application's ```Info.plist```:

![Image of Info.plist](https://cloud.githubusercontent.com/assets/15389109/16668212/5c28aea8-444d-11e6-8857-14992f488edd.jpg)

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

## Advanced Usage

The ```IMSurveyViewDelegate``` protocol provides some additional, optional methods for interacting with surveys:

#### Recording survey completion

```swift
func surveyView(didPassCompletionPointInSurvey survey: IMSurveyViewController) {
    //Insert your own code here
}
```
  
This method is called when the user arrives at the page immediately following the survey completion point. Once this happens, the survey response will be available on InMoment reports and in Focus™, (even if the user doesn't continue until the very last page of the survey). Use this method to perform actions such as recording that the user has finished taking the survey and giving the user a reward.

#### Recording Next/Previous page button taps (experimental)

```swift
func surveyView(didClickPreviousPageButtonInSurvey surveyView: IMSurveyViewController) {
    //Insert your own code here
}

func surveyView(didClickNextPageButtonInSurvey survey: IMSurveyViewController) {
    //Insert your own code here
}
```

These methods are called immediately when the user taps the "next" or "previous" page buttons in the survey. These methods can be used to monitor that the user is "still there" or performing other actions. These methods are experimental, and may be deprecated or removed in future versions.

## Installation via CocoaPods (Recommended)

Just add the following line to your ```Podfile```:

```ruby
pod 'InMomentFeedbackKit'
```
    
## Manual Installation

1. [Download](https://www.github.com/InMoment/inmoment-sdk/releases/latest) and unzip the latest release.
2. Drag ```InMomentFeedbackKit.framework``` into your Xcode project and choose "Copy if needed".
3. Click the ```+``` in the ```Embedded Binaries``` section of your application's target, and select ```InMomentFeedbackKit.framework```.
3. Add a Run Script build phase after "Embed Frameworks". Copy and paste the following script:

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
