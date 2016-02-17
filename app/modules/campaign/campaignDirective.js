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
                    scope.$watch("campaign.owner.camp_state", function (newValue, oldValue) {
                        console.log('old ' + oldValue)
                        console.log('new ' + newValue)

                        scope.campaign.owner.camp_state = newValue;


                        if (scope.campaign.owner.camp_state == "inactive") {
                            console.log('its inactive')

                            var replacementElement = angular.element('<div><span class="glyphicon glyphicon-file" aria-hidden="true"></span> <span class="glyphicon-class">Inactive</span></div>')
                            element.html('');
                            element.append(replacementElement)


                        } else if (scope.campaign.owner.camp_state == "active") {
                            console.log('its active')

                            var replacementElement = angular.element('<div><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> <span class="glyphicon-class">Activated</span></div>')
                            element.html('');
                            element.append(replacementElement)

                        } else {
                            console.log('its expired')

                            var replacementElement = angular.element('<div><span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span> <span class="glyphicon-class">Expired</span></div>')
                            element.html('');
                            element.append(replacementElement)


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
                template: '<section class="btn-click"><button class="btn btn-default" ng-click="myFn(associate, campaign)">{{value}}</button></section>',
                replace: true,
                scope: {
                    campaign: '=campaign', // pass campaign model as attribute to directive
                    associate: '=associate'
                },
                restrict: 'E', // restrict to element
                controller: function ($scope, $element, RequestService) {

                    $scope.value = 'Publish';
                    $scope.campaignOwnerIdentifier = '';

                    $scope.myFn = function (associate, campaign) {
                        if ($scope.value == 'Publish') {

                            RequestService.postJsonRequest('companyCampaign/createCampaignOwner', {
                                cmp_cd: associate.cmp_cd,
                                camp_cd: campaign.owner.camp_cd,
                                camp_state: 'pending',
                                cmp_camp_owner: false
                            }).then(function (publishedCampaign) {

                            })

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
        })

})();