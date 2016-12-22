if(typeof InMomentSDKSurveyListener === 'undefined') {

    InMomentSDKSurveyListener = true;
    document.documentElement.style.webkitUserSelect='none';
    document.documentElement.style.webkitTouchCallout='none';

    (function() {
        document.documentElement.style.webkitUserSelect='none';
        document.documentElement.style.webkitTouchCallout='none';
        console.log("Web page is set up.");

        var scope = angular.element(document.body).scope();

        function getOutputValues() {
            var result = new Array();
            try {
                var prompts = scope.currentPage().prompts;
                for(var i = 0; i < prompts.length; i++) {
                    var output = prompts[i].outputValueText;
                    if(output && output.length > 0) {
                        result.push(output);
                    }
                }
            }
            catch(err) {
                console.err(err);
            }
            return result;
        }

        function generateStatusMessage() {
            var pg = scope.currentPageIndex;
            return {
               "surveyOver": scope.surveyOver,
               "percentComplete": scope.percentComplete,
               "currentPageIndex": scope.currentPageIndex,
               "outputValues" : getOutputValues(),
               "currentPageIsCompletionPoint" : pg >= 0 ? scope.pages[pg].complete : false,
               "previousPageWasCompletionPoint" : pg > 0 ? scope.pages[pg - 1].complete : false
            };
        }

        function postStatusMessage() {
            var msg = generateStatusMessage();
            window.webkit.messageHandlers.iOS.postMessage(msg);
        }

        function startListeningForPageIndexChanges() {
            var currPageIndex = scope.currentPageIndex;
            setInterval(function() {
                var newPageIndex = scope.currentPageIndex;
                if(currPageIndex !== newPageIndex) {
                    postStatusMessage();
                    currPageIndex = newPageIndex;
                }
            }, 100);
        }

        startListeningForPageIndexChanges();
        postStatusMessage();

    })();

}
