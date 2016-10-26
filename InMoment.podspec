
Pod::Spec.new do |s|

    s.name         = "InMoment"
    s.version      = "0.5.9"
    s.summary      = "Lauch and interact with InMoment web surveys."

    s.description  = <<-DESC
    InMoment is a simple framework giving client developers the ability to
    launch and interact with InMoment web surveys.
    NOTE: This software is still in beta and is subject to change.
    DESC
    
    s.homepage     = "https://github.com/InMoment/inmoment-sdk-ios"
    s.license      = { :type => "Apache License, Version 2.0", :file => "LICENSE.md" }
    s.author       = { "InMoment, Inc." => "mobile-development@inmoment.com" }
    s.platform     = :ios, "8.0"
    
    s.source       = { :git => s.homepage, :tag => "v#{s.version}" }
    s.documentation_url = s.homepage
    s.preserve_paths = "*.framework"
    s.vendored_frameworks  = "*.framework"
    s.requires_arc = true
    s.frameworks = "CoreLocation", "UIKit"
    
    s.dependency "Mixpanel", "~>1.0"

end
