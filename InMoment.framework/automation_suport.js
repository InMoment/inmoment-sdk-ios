if(typeof InMomentAutomationSupport === "undefined") {

    InMomentAutomationSupport = true;

    (function() {

        var scope = angular.element(document.body).scope();

        window.findAllPromptsOnPage = function() {
            return scope.currentPage().prompts.map(function(prompt) {
                prompt.getHtmlElement = function() {
                    return document.getElementById("prompt_" + prompt.id).getElementsByClassName("prompt")[0];
                };
                prompt.getText = function() {
                    return prompt.getHtmlElement().getElementsByClassName("text")[0].innerText;
                };
                prompt.setAnswer = function(answer) {
                    prompt.getHtmlElement().scrollIntoView();
                    var answers = scope.currentPage().answers;
                    switch(prompt.type) {
                        case "TEXT":
                        case "COMMENT":
                            answers[prompt.id].value = answer;
                            scope.$apply();
                            break;
                        case "RATING":
                        case "MULTIPLE_CHOICE":
                            var answerIndex = parseInt(answer);
                            answers[prompt.id].value = prompt.choices[answerIndex].choiceId;
                            scope.$apply();
                            break;
                        default:
                            console.error("Undefined control sequence for prompt of type: " + prompt.type);
                            break;
                    }
                };
                return prompt;
            });
        };

        window.findPromptByIndex = function(index) {
            return findAllPromptsOnPage()[index];
        };

        window.findPromptByPromptText = function(promptText) {
            return findAllPromptsOnPage().filter(function(prompt) {
                return prompt.getText() == promptText;
            });
        };

        window.nextPage = function() {
            scope.nextPage();
        };

    })();

}