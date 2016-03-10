angular
    .module('app.core')
    .directive('ngCompare', ngCompare);

function ngCompare() {
    var linkFunction = function (scope, element, attributes, ngModel) {

        ngModel.$validators.compare = function (modelValue) {
            return modelValue == scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function () {
            ngModel.$validate();
        });
    };

    return {
        restrict: "A",
        require: 'ngModel',
        scope: {
            otherModelValue: "=ngCompare"
        },
        link: linkFunction
    };
}