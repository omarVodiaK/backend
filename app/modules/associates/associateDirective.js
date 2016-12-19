'use strict';

angular
    .module('app.associate')
    .directive('modalDirective', associateModalDirective)
    .directive('autoCompleteDirective', autoCompleteDirective);

/**
 * modal content
 * @method modalDirective
 * @return ObjectExpression
 */
function associateModalDirective() {
    return {
        template: '<div class="modal fade">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<i class="glyphicon glyphicon-remove-circle glyphiconLG glyphiconWhiteRemove pull-right" data-dismiss="modal" "></i>' +
        '<h4 class="modal-title">{{ title }}</h4>' +
        '</div>' +
        '<div class="modal-body" ng-transclude></div>' + //  marks the insertion point for the transcluded DOM
        '</div>' +
        '</div>' +
        '</div>',
        restrict: 'C', // restrict option set to 'C' to matche the class name of the nearest parent directive that uses transclusion
        transclude: true,
        replace: true, //replace the current element with the contents of the HTML
        scope: true,
        /**
         * used for showing hiding and watching the changes of the modal
         * @method link
         * @param {object} scope
         * @param {object} element
         * @param {object} attrs
         */
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            /**
             * watch modal changes
             * @method link
             * @param {watchExpression} attrs.visible
             * @param {objectEquality} value
             */
            scope.$watch(attrs.visible, function (value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });


            $(element).on('shown.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
}

/**
 * auto complete for the users email emails
 * @method autoCompleteDirective
 * @param {object} scope
 * @param {input} iElement
 * @param {object} iAttrs
 * @return FunctionExpression append result to defined ui element
 */
function autoCompleteDirective() {
    return function (scope, iElement, iAttrs) {

        $("#emailAutoComplete").autocomplete({
            source: scope[iAttrs.uiItems],
            /**
             * open and append autocomplete result in div inside modal
             * @method open
             */
            open: function () {

                $(this).autocomplete("widget")
                    .appendTo("#result")
                    .css("position", "static");
            }
        });
    };
}