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
                    campaign: '=data' // pass campaign model as attribute to directive
                },
                restrict: 'E', // restrict to element
                controller: function ($scope, $element) {
                    if ($scope.campaign.camp_state == "draft") {
                        $element.replaceWith('<span class="glyphicon glyphicon-file" aria-hidden="true"></span> <span class="glyphicon-class">Draft</span>')
                    } else if ($scope.campaign.camp_state == "activated") {
                        $element.replaceWith('<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> <span class="glyphicon-class">Activated</span>')
                    } else if ($scope.campaign.camp_state == "coming") {
                        $element.replaceWith('<span class="glyphicon glyphicon-time" aria-hidden="true"></span> <span class="glyphicon-class">Coming Soon</span>')
                    } else {
                        $element.replaceWith('<span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span> <span class="glyphicon-class">Finished</span>')
                    }

                }
            }
        })
    /**
     * @description replace html element with corresponding html depending in the data retrieved
     * @directive sharedirective
     */
        .directive('sharedirective', function () {
            return {
                template: '',
                replace: true,
                scope: {
                    campaign: '=campaign', // pass campaign model as attribute to directive
                    company: '=company' // pass company model as attribute to directive
                },
                restrict: 'E', // restrict to element
                controller: function ($scope, $element) {

                    var template = 'no';

                    for (var i = 0; i < $scope.campaign.published_to.length; i++) {

                        if ($scope.company._id == $scope.campaign.published_to[i].cmp_id) {

                            if ($scope.campaign.published_to[i].cmp_state === "pending") {

                                template = 'pending';

                            } else if ($scope.campaign.published_to[i].cmp_state === "accepted") {

                                template = 'accepted'

                            }
                        }
                    }

                    if (template == 'no') {
                        $element.replaceWith('<section class="btn-click"><button class="btns btn-7 btn-7a icon-truck">Publish</button></section>');
                    } else if (template == 'pending') {
                        $element.replaceWith('<section class="btn-click"><button class="btns btn-7-reverse btn-7a icon-truck">Suppress(Pending)</button></section>');
                    } else {
                        $element.replaceWith('<section class="btn-click"><button class="btns btn-7-reverse btn-7a icon-truck">Suppress</button></section>');
                    }


                    var buttons7Click = Array.prototype.slice.call(document.querySelectorAll('.btns'));


                    buttons7Click.forEach(function (el, i) {
                        el.addEventListener('click', activate, false);
                    });

                    function activate() {
                        var self = this, activatedClass = 'btn-activated';

                        if (!classie.has(this, activatedClass)) {
                            classie.add(this, activatedClass);
                            setTimeout(function () {
                                classie.remove(self, activatedClass)
                            }, 1000);
                        }
                    }
                }
            }
        })

})();