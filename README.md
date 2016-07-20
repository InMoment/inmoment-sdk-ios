# InMomentFeedbackKit (iOS) (Beta)

**NOTE: This software is still in beta and is subject to change.**

## System Requirements

- **Xcode 7.3** and **Swift 2.2** (the latest stable versions). Apps that include this framework may not build properly if older versions of Xcode or Swift are used.
- Apps must require **iOS 8.0** or later.

## Usage

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
    
    func surveyView(didPassCompletionPointInSurvey survey: IMSurveyViewController) {
        //Insert your own code here. This method is optional.
    }
  
}
```

### Presenting the survey

```swift
//class InMoment
public static func presentSurveyModally(surveyURL: String, delegate: IMSurveyViewDelegate, presentationStyle: UIModalPresentationStyle = .PageSheet)
```

Calling this method presents a survey modally using the given ```presentationStyle```.

Parameters:<br/>
```surveyURL```: A valid URL pointing to an InMoment web survey. This must contain the ```https://``` prefix.<br/>
```delegate```: A reference to an implementation of ```IMSurveyViewDelegate```. In the above example ```self``` is used.
```presentationStyle```: The desired ```UIModalPresentationStyle```. Defaults to: ```.PageSheet```.


### Recording survey completion

```swift
optional func surveyView(didPassCompletionPointInSurvey survey: IMSurveyViewController)
```
  
This method is called when the user arrives at the page immediately following the survey completion point. Once this happens, the survey response will be available in InMoment reports and in Focus™, (even if the user doesn't continue until the very last page of the survey). Use this method to perform actions such as recording that the user has finished taking the survey or giving the user a reward.

## Installation

### Installation via CocoaPods (Recommended)

Just add the following line to your ```Podfile```:

```ruby
pod 'InMomentFeedbackKit'
```
    
### Manual Installation

1. [Download](https://www.github.com/InMoment/inmoment-sdk/releases/latest) and unzip the latest release.
2. Drag ```InMomentFeedbackKit.framework``` into your Xcode project and choose "Copy if needed".
3. Click the ```+``` in the ```Embedded Binaries``` section of your application's target, and select ```InMomentFeedbackKit.framework```.
3. Add a "Run Script" build phase after "Embed Frameworks". Copy and paste the following script:

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
