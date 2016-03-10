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
                link: function (scope, element, attrs) {
                    scope.$watch("campaign.trueOwner.camp_state", function (newValue, oldValue) {
                        var replacementElement;
                        if (scope.campaign.trueOwner.camp_state == "pending") {
                            replacementElement = angular.element('<div><span class="glyphicon glyphicon-file" aria-hidden="true"></span> <span class="glyphicon-class  hidden-md hidden-xs">Inactive</span></div>')
                            element.html('');
                            element.append(replacementElement)
                        } else if (scope.campaign.trueOwner.camp_state == "accepted") {
                            replacementElement = angular.element('<div><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> <span class="glyphicon-class hidden-md hidden-xs">Activated</span></div>')
                            element.html('');
                            element.append(replacementElement)
                        } else {
                            replacementElement = angular.element('<div><span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span> <span class="glyphicon-class">Expired</span></div>')
                            element.html('');
                            element.append(replacementElement)
                        }
                    })


                    scope.$watch("campaign.owner.camp_state", function (newValue, oldValue) {
                        var replacementElement;

                        if (scope.campaign.trueOwner.cmp_camp_owner == true) {
                            scope.campaign.owner.camp_state = newValue;

                            if (scope.campaign.owner.camp_state == "inactive") {

                                replacementElement = angular.element('<div><span class="glyphicon glyphicon-file" aria-hidden="true"></span> <span class="glyphicon-class  hidden-md hidden-xs">Inactive</span></div>')
                                element.html('');
                                element.append(replacementElement)

                            } else if (scope.campaign.owner.camp_state == "active") {

                                replacementElement = angular.element('<div><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> <span class="glyphicon-class hidden-md hidden-xs">Activated</span></div>')
                                element.html('');
                                element.append(replacementElement)

                            } else if (scope.campaign.owner.camp_state == "expired") {

                                replacementElement = angular.element('<div><span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span> <span class="glyphicon-class">Expired</span></div>')
                                element.html('');
                                element.append(replacementElement)

                            }
                        } else {
                            if (scope.campaign.trueOwner.camp_state == "pending") {
                                replacementElement = angular.element('<div><span class="glyphicon glyphicon-file" aria-hidden="true"></span> <span class="glyphicon-class  hidden-md hidden-xs">Inactive</span></div>')
                                element.html('');
                                element.append(replacementElement)
                            } else if (scope.campaign.trueOwner.camp_state == "accepted") {
                                replacementElement = angular.element('<div><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> <span class="glyphicon-class hidden-md hidden-xs">Activated</span></div>')
                                element.html('');
                                element.append(replacementElement)
                            } else {
                                replacementElement = angular.element('<div><span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span> <span class="glyphicon-class">Expired</span></div>')
                                element.html('');
                                element.append(replacementElement)
                            }
                        }

                    }, true);


                }
            }
        })

    /**
     * @description replace html element with corresponding html depending in the data retrieved
     * @directive sharedirective
     */
        .directive('sharedirective', function () {

            return {
                template: '<section class="btn-click"><button class="btn btn-default" ng-click="publish(associate, campaign)">{{value}}</button></section>',
                replace: true,
                scope: {
                    campaign: '=campaign', // pass campaign model as attribute to directive
                    associate: '=associate'
                },
                restrict: 'E', // restrict to element
                controller: function ($scope, $element, RequestService) {

                    $scope.value = 'Publish';
                    $scope.campaignOwnerIdentifier = '';

                    $scope.publish = function (associate, campaign) {

                        var allowToPublish = false;
                        if ($scope.value == 'Publish') {

                            if (campaign.beacons != undefined) {
                                campaign.beacons.forEach(function (beacon) {
                                    if (beacon.bcn_used == true) {
                                        allowToPublish = true;
                                    }
                                });

                            }

                            if (allowToPublish) {
                                RequestService.postJsonRequest('companyCampaign/createCampaignOwner', {
                                    cmp_cd: associate.cmp_cd,
                                    camp_cd: campaign.owner.camp_cd,
                                    camp_state: 'pending',
                                    cmp_camp_owner: false
                                }).then(function (publishedCampaign) {

                                })
                            } else {
                                alert('Please configure atleast one beacon before sharing your campaign');
                            }


                        } else if ($scope.value == 'Suppress(Pending)' || $scope.value == 'Suppress') {

                            RequestService.postJsonRequest('companyCampaign/deleteCampaignOwner', {
                                cmp_camp_cd: $scope.campaignOwnerIdentifier
                            }).then(function (publishedCampaign) {
                                if (publishedCampaign.result == 'deleted successfully') {
                                    alert('publication suppressed')
                                }
                            })

                        }

                    };

                    RequestService.postJsonRequest('companyCampaign/findCampaignOwners', {camp_cd: $scope.campaign.owner.camp_cd}).then(function (campaignOwners) {


                        campaignOwners.forEach(function (owner) {

                            if (owner.cmp_cd.cmp_cd == $scope.associate.cmp_cd && owner.camp_state == "accepted") {
                                $scope.value = 'Suppress';
                                $scope.campaignOwnerIdentifier = owner.cmp_camp_cd;

                                return false;

                            } else if (owner.cmp_cd.cmp_cd == $scope.associate.cmp_cd && owner.camp_state == "pending") {
                                $scope.value = 'Suppress(Pending)';
                                $scope.campaignOwnerIdentifier = owner.cmp_camp_cd;

                                return false;

                            } else if (owner.cmp_cd.cmp_cd == $scope.associate.cmp_cd && owner.camp_state == "rejected") {
                                $scope.value = 'Publish';

                                return false;

                            }

                        })


                    })


                }

            }
        });

})();