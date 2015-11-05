(function () {
    'use strict';

    /**
     * @description  use app.campaign module created in controller
     * @module app.campaign
     */
    angular
        .module('app.campaign')

    /**
     * @description replace html element with corresponding icon depending in the data retrieved
     * @directive statedirective
     */
        .directive('statedirective', function () {
            return {
                template: '',
                replace: true,
                scope: {
                    campaign: '=data'
                },
                restrict: 'E',
                controller: function ($scope, $element) {
                    if ($scope.campaign.camp_state == "archive") {
                        $element.replaceWith('<span class="glyphicon glyphicon-file" aria-hidden="true"></span> <span class="glyphicon-class">Archived</span>')
                    } else if ($scope.campaign.camp_state == "activated") {
                        $element.replaceWith('<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> <span class="glyphicon-class">Activated</span>')
                    } else if ($scope.campaign.camp_state == "coming") {
                        $element.replaceWith('<span class="glyphicon glyphicon-time" aria-hidden="true"></span> <span class="glyphicon-class">Coming</span>')
                    } else {
                        $element.replaceWith('<span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span> <span class="glyphicon-class">Finished</span>')
                    }

                }
            }
        })
    /**
     * @description replace html element with corresponding html depending in the data retrieved
     * @directive prioritydirective
     */
        .directive('prioritydirective', function () {
            return {
                template: '',
                replace: true,
                scope: {
                    campaign: '=data'
                },
                restrict: 'E',
                controller: function ($scope, $element) {
                    if ($scope.campaign.camp_priority == "high") {
                        $element.replaceWith('<span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span>');
                    } else if ($scope.campaign.camp_priority == "medium") {
                        $element.replaceWith('<span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>');
                    } else if ($scope.campaign.camp_priority == "low") {
                        $element.replaceWith('<span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span>');
                    }
                }
            }
        })

})();