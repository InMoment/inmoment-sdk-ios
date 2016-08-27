
Pod::Spec.new do |s|

    s.name         = "InMoment"
    s.version      = "0.4.0"
    s.summary      = "Lauch and interact with InMoment web surveys."

    s.description  = <<-DESC
    InMoment is a simple framework giving client developers the ability to
    launch and interact with InMoment web surveys.
    NOTE: This software is still in beta and is subject to change.
    DESC
    
    s.homepage     = "https://github.com/InMoment/feedbackkit-ios.git"
    s.license      = { :type => "Apache License, Version 2.0", :file => "LICENSE.md" }
    s.author       = { "InMoment, Inc." => "mobile-development@inmoment.com" }
    s.platform     = :ios, "8.0"
    
    s.source       = { :git => "https://github.com/InMoment/feedbackkit-ios.git", :tag => "v#{s.version}" }
    s.preserve_paths = "*.framework"
    s.vendored_frameworks  = "*.framework"
    s.requires_arc = true
    s.frameworks = "CoreLocation", "UIKit"
    
    s.dependency "mixpanel-swift", "~>1.0"

end
