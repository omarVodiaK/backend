angular
    .module('app.core')
    .directive('ngPlaceholder', ngPlaceholder);

function ngPlaceholder() {
    var linkFunction = function (scope, element, attributes, ngModel) {
        //Create a copy of the original data that�s passed in
        function init() {
            var formGroup = element.parent();
            if (attributes.ngPlaceholder.split("{}").length > 0 && element.is("select")) {
                var html = '<label for="' + attributes.name + '">' + attributes.ngPlaceholder.split("{}")[0] + '</label>';
                formGroup.prepend(html);
                return;
            }
            /*var html = '<div class="">' + attributes.ngPlaceholder.split("{}")[1] + '</div>';
             element.parent().prepend(html);*/
            if (attributes.ngPlaceholder.split("{}").length > 0) {
                var html = '<label for="' + attributes.name + '">' + attributes.ngPlaceholder.split("{}")[0] + '</label>';
                formGroup.prepend(html);
            }
            formGroup.addClass("is-empty");

            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function (newValue) {
                if (newValue)
                    formGroup.removeClass("is-empty");
            });

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