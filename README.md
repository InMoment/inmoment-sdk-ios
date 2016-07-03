# InMomentFeedbackKit (iOS) (Beta)

# This software is still in beta. Use at your own risk.

## System Requirements

- **Xcode 7.3** and **Swift 2.2** (latest stable versions). Apps that include this framework may not build properly if older versions are used.
- Apps must require **iOS 8.0** or later.

## Installation

### Installation via CocoaPods (Recommended)

Coming soon...

### Manual Installation (Discouraged)

1. [Download](../../releases/latest) the latest release and unzip it.
2. Drag ```InMomentFeedbackKit.framework``` into your Xcode project and choose "Copy if needed".
3. Click the ```+``` in the ```Embedded Binaries``` section of your application's target, and select ```InMomentFeedbackKit.framework```.
3. Add a Run Script build phase after "Embed Frameworks". Copy and paste the following script [(here's why)](http://ikennd.ac/blog/2015/02/stripping-unwanted-architectures-from-dynamic-libraries-in-xcode/):

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
    Credit: Daniel Kennett
    
4. Add the following entry to your application's ```Info.plist```:

    ![Image of Info.plist](https://cloud.githubusercontent.com/assets/15389109/16543850/baedac32-40aa-11e6-824e-1c20a85c7c9a.png)

    ```xml
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSExceptionDomains</key>
        <dict>
            <key>www.inmoment.com</key>
            <dict>
                <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
                <true/>
                <key>NSTemporaryExceptionRequiresForwardSecrecy</key>
                <false/>
            </dict>
        </dict>
    </dict>
    ```

## Basic Usage
    
```swift
import InmomentFeedbackKit
```
    
```swift
class ViewController: UIViewController, IMSurveyViewDelegate {
  
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

```swift
InMoment.presentSurveyModally("https://www.inmoment.com/foo", delegate: self)
```

NOTE: This will only work for an InMoment survey. An error will occur if any other URL is given.

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
