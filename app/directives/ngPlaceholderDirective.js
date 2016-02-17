angular
    .module('app.core')
    .directive('ngPlaceholder', ngPlaceholder);

function ngPlaceholder($interpolate, $parse) {
    var linkFunction = function (scope, element, attributes, ngModel) {
        //Create a copy of the original data that�s passed in
        function init() {
            var formGroup = element.parent();
            if (element.is("select")) {
                var html = '<label for="' + attributes.name + '">' + attributes.ngPlaceholder.split("{}")[0] + '</label>';
                formGroup.prepend(html);
                return;
            }
            /*var html = '<div class="">' + attributes.ngPlaceholder.split("{}")[1] + '</div>';
             element.parent().prepend(html);*/
            var html = '<label for="' + attributes.name + '">' + attributes.ngPlaceholder.split("{}")[0] + '</label>';
            formGroup.prepend(html);
            formGroup.addClass("is-empty");

            // Focus: Show label
            element.focus(function (event) {
                formGroup.addClass("has-focus");
                if (ngModel.$viewValue)
                    formGroup.removeClass("is-empty");
                event.preventDefault();
            });

            // Blur: Hide label if no value was entered (go back to placeholder)
            element.blur(function (event) {
                reset(formGroup);
                transform(formGroup, ngModel);
                event.preventDefault();
            });

            element.on("input", function (event) {
                reset(formGroup);
                transform(formGroup, ngModel);
                if (ngModel.$viewValue)
                    formGroup.removeClass("is-empty");
            });

            if (attributes.compareTo !== undefined) {
                /*var pwdToMatch = $parse(attributes.compareTo);
                 var pwdFn = $interpolate(attributes.compareTo)(scope);
                 console.log(pwdFn);
                 scope.$watch(pwdFn, function(newVal) {
                 ngModel.$setValidity('comparison', ngModel.$viewValue == newVal);
                 })

                 ngModel.$validators.comparison = function(modelValue, viewValue) {
                 var value = modelValue || viewValue;
                 return value == pwdToMatch(scope);
                 };*/

            }
        }

        function transform(formGroup, ngModel) {
            if (ngModel.$valid) {
                formGroup.addClass("has-success");
            } else {
                formGroup.addClass("has-error");
            }
            if (!ngModel.$viewValue) {
                formGroup.addClass("is-empty");
            }
        }

        function reset(formGroup) {
            formGroup.removeClass("is-empty");
            formGroup.removeClass("has-focus");
            formGroup.removeClass("has-error");
            formGroup.removeClass("has-success");
        }

        init();
    };

    return {
        restrict: "A",
        require: '?ngModel',
        link: linkFunction
    };
}