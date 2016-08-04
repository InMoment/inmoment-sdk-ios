
Pod::Spec.new do |s|

    s.name         = "InMoment"
    s.version      = "0.3.7"#<<AUTOVERSION
    s.summary      = "Lauch and interact with InMoment web surveys."

    s.description  = <<-DESC
    InMomentFeedbackKit is a simple framework giving client developers the ability to
    launch and interact with InMoment web surveys.
    NOTE: This software is still in beta and is subject to change.
    DESC
    
    s.homepage     = "https://github.com/InMoment/feedbackkit-ios.git"
    s.license      = { :type => "Apache License, Version 2.0", :file => "LICENSE.md" }
    s.author       = { "InMoment, Inc." => "kjensen@inmoment.com" }
    s.platform     = :ios, "8.0"
    
    s.source       = { :git => "https://github.com/InMoment/feedbackkit-ios.git", :tag => "v#{s.version}" }
    s.preserve_paths = "*.framework"
    s.vendored_frameworks  = "*.framework"
    s.frameworks = "CoreLocation", "UIKit"
    s.requires_arc = true
    
    s.frameworks = "UIKit"

end
