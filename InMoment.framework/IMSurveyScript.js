
(function() {
 
    document.documentElement.style.webkitUserSelect='none';
    document.documentElement.style.webkitTouchCallout='none';
 
    var postMessage = function(messageToPost) {
        window.webkit.messageHandlers.InMoment.postMessage(messageToPost);
    }
    
    var postErrorMessage = function(failureReason, recoverySuggestion) {
        var messageToPost = {
            'error':{
                'failureReason' : failureReason,
                'recoverySuggestion' : recoverySuggestion
            }
        }
        postMessage(messageToPost);
    }
 
    var postStatusMessage = function() {
        var pg = scope.currentPageIndex;
        var messageToPost = {
            'surveyStatus' : {
                'surveyOver' : scope.surveyOver,
                'percentComplete' : scope.percentComplete,
                'currentPageIndex' : scope.currentPageIndex,
                'currentPageIsCompletionPoint' : pg >= 0 ? scope.pages[pg].complete : false,
                'previousPageWasCompletionPoint' : pg > 0 ? scope.pages[pg - 1].complete : false,
                'pageHeight' : window.getComputedStyle(document.documentElement, null).height
            }
        }
        postMessage(messageToPost);
    }
 
    var postStatusMessageWhenPageIndexChanges = function() {
        var pageIndex = scope.currentPageIndex;
        var pollingAction = function() {
            if(scope.currentPageIndex !== pageIndex) {
                clearInterval(interval);
                postStatusMessage();
            }
        }
        var interval = setInterval(pollingAction, 10);
    }
    
    var postButtonClickedMessage = function(buttonId) {
        var messageToPost = {
            'buttonClicked' : {
                'buttonId' : buttonId
            }
        }
        postMessage(messageToPost);
        postStatusMessageWhenPageIndexChanges();
    }
 
    var scope;
 
	if(document.body.getAttribute("ng-controller") !== "surveyAppController") {
        postErrorMessage("This page does not appear to contain an InMoment survey.", "Please ensure that the survey URL you have provided points to an InMoment survey using Websurvey 2.0.");
		return;
	}
	if(typeof angular === "undefined" || !angular) {
		postErrorMessage("AngularJS is not defined.");
		return;
	}
	scope = angular.element(document.body).scope();
	if(!scope) {
		postErrorMessage("Could not initialize scope.");
		return;
	}
	else if(typeof scope.surveyOver === "undefined") {
		postErrorMessage("Could not determine if survey is over.");
		return;
	}
	else if(typeof scope.currentPageIndex === "undefined") {
		postErrorMessage("Could not determine current page index.");
		return;
	}
    else {
        var oldNextPageButtonClick = scope.nextPageButtonClick;
        scope.nextPageButtonClick = function(a) {
            oldNextPageButtonClick(a);
            postButtonClickedMessage('nextPageLink');
        }
        var oldPrevPageButtonClick = scope.prevPageButtonClick;
        scope.prevPageButtonClick = function(a) {
            oldPrevPageButtonClick(a);
            postButtonClickedMessage('prevPageLink');
        }
    }
    postStatusMessageWhenPageIndexChanges();

 })();
