# InMomentFeedbackKit (iOS) (Beta)

# This software is still in beta. Use at your own risk.

## System Requirements

- **Xcode 7.3** and **Swift 2.2** (The latest stable versions): This framework may not compile on older versions of Xcode or Swift.
- Apps must require **iOS 8.0** or later: The framework's methods will not be accessible to you if your ```Deployment Target``` is set to anything lower than 8.0.

## Installation

### Installation via CocoaPods (Recommended)

Coming soon...

### Manual Installation (Discouraged)

1. [Download](../../releases/latest) the latest release and unzip it.
2. Drag ```InMomentFeedbackKit.framework``` into your Xcode project and choose "Copy if needed".
3. Click the ```+``` in the ```Embedded Binaries``` section of your application's target, and select ```InMomentFeedbackKit.framework```.
3. Copy and paste the following script as an Archive post-action [(here's why)]():

    ```bash
    Coming soon...
    ```
    
4. Add the following entries to your application's ```Info.plist```:

    ```xml
    Coming soon...
    ```

## Basic Usage

1. Import the framework:

    ```swift
    import InmomentFeedbackKit
    ```

2. Implement the ```IMSurveyViewDelegate``` protocol:

    ```swift
    class ViewController: UIViewController, IMSurveyViewDelegate {
      
      //This method is required
      func surveyView(didRecieveErrorLoadingSurvey survey: IMSurveyViewController, error: NSError) {
        //Insert your own code here, such as presenting an alert or logging the error
        survey.dismiss()
      }
      
      //This method is required
      func surveyView(didArriveAtLastPageOfSurvey survey: IMSurveyViewController) {
        //Insert your own code here
        survey.dismiss()
      }
      
    }
   ```

3. Present the survey using the URL provided to you by InMoment. Pass in an instance of ```IMSurveyViewDelegate```, (in this case ```self```), for the parameter ```delegate```:

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
  
This method is called when the user arrives at the page immediately following the survey completion point. Once this happens, the survey response will be available on InMoment reports and in Focus(tm), (even if the user doesn't continue until the very last page of the survey). Use this method to perform actions such as recording that the user has finished taking the survey and giving the user a reward.

#### Recording Next/Previous page button taps (experimental)

```swift
func surveyView(didClickPreviousPageButtonInSurvey survey: IMSurveyViewController) {
    //Insert your own code here
}

func surveyView(didClickNextPageButtonInSurvey survey: IMSurveyViewController) {
    //Insert your own code here
}
```

These methods are called immediately when the user taps the "next" or "previous" page buttons in the survey. These methods can be used to monitor that the user is "still there" or performing other actions. These methods are experimental, and may be deprecated or removed in future versions.
