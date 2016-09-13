# InMoment SDK (iOS) (Beta)
InMoment is a simple framework giving client developers the ability to
launch and interact with InMoment web surveys.
**NOTE: This software is still in beta and is subject to change.**

## Screenshots

![presentsurvey_fl](https://cloud.githubusercontent.com/assets/15389109/18068072/e5e2c70e-6dfc-11e6-85fa-c7e60301b89b.gif)
![completionpoint_fl](https://cloud.githubusercontent.com/assets/15389109/18071937/d83ad6c2-6e16-11e6-8a3d-c49935905410.gif)
![lastpage_fl](https://cloud.githubusercontent.com/assets/15389109/18071939/dac98abe-6e16-11e6-909b-b976b6a84864.gif)

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
        InMoment.presentSurvey(usingGateway: "MySurveyGateway", delegate: self)
    }
    
    func didRecieveErrorWhileLoadingSurvey(survey: InMomentSurvey, error: NSError) {
        //Insert your own code here. This method is required.
        survey.dismiss()
    }
  
    func didArriveAtLastPageOfSurvey(survey: InMomentSurvey) {
        //Insert your own code here. This method is required.
        survey.dismiss()
    }
    
    func didPassCompletionPointInSurvey(survey: InMomentSurvey) {
        //Insert your own code here. This method is optional.
    }
  
}
```

### Presenting the survey

```swift
//class InMoment
public static func presentSurvey(usingGateway gateway: String, 
                               withParameters parameters: [String:String] = [:],
                                              delegate: InMomentSurveyDelegate)
```

Calling this method presents a survey modally using the given ```presentationStyle```.
- ```gateway``` (required): A valid InMoment web survey gateway. Ask your CSM or operations specialist for details.
- ```parameters``` (optional): A dictionary of strings corresponding to survey URL parameters.
- ```delegate``` (required): A reference to an implementation of ```InMomentSurveyDelegate```.

### Recording survey completion

```swift
//protocol InMomentSurveyDelegate
optional func didPassCompletionPointInSurvey(survey: InMomentSurvey)
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
github 'InMoment/inmoment-sdk-ios'
```

2. Run ```carthage bootstrap``` or ```carthage update```.
3. You will be required to add the following frameworks to your Xcode project:
    - ```InMoment.framework```
    - ```Mixpanel.framework```
    
### Manual Installation

See our [manual installation guide](/Manual Installation.md).
