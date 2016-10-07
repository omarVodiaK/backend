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
                link: function (scope, element) {
                    scope.$watch("campaign.trueOwner.camp_state", function () {
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
                    });


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
                                alert('Please configure at least one beacon before sharing your campaign');
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

                        });
                    });
                }

            }
        })

        /**
         * @description replace html element with corresponding html depending in the data retrieved
         * @directive thumbnaildirective
         */
        .directive('thumbnaildirective', function () {
            return {
                template: '',
                replace: true,
                scope: {
                    content: '=' // pass content model as attribute to thumbnail directive
                },
                restrict: 'E', // restrict to element
                link: function (scope, element) {
                    console.log(scope.content);
                    scope.$watch("content.content", function () {

                        var replacementElement;

                        if (scope.content.content == undefined && scope.content.cnt_url != '' && scope.content.cnt_type == 'lkp_2') {

                            replacementElement = angular.element('<img src="' + scope.content.cnt_url + '" class="img-circle col-md-9"><label class="col-md-3 text-center">"' + scope.content.cnt_title + '"</label>');
                            element.html('');
                            element.append(replacementElement);

                        } else if (scope.content.content == undefined && scope.content.cnt_url != '' && scope.content.cnt_type == 'lkp_5') {

                            if (validateYouTubeUrl(scope.content.cnt_url)) {
                                replacementElement = angular.element('<img src="' + youtubeThumb(scope.content.cnt_url) + '" class="img-circle col-md-9"><label class="col-md-3 text-center">"' + scope.content.cnt_title + '"</label>');
                                element.html('');
                                element.append(replacementElement);
                            } else {
                                console.log(scope.content)
                                replacementElement = angular.element('<video width="250" src="' + scope.content.cnt_url + '" controls></video> <label class="col-md-3 text-center">"' + scope.content.cnt_title + '"</label>');
                                element.html('');
                                element.append(replacementElement);
                            }

                        } else if (scope.content.content != undefined && scope.content.content.cnt_url != '' && scope.content.content.cnt_type == 'lkp_5') {

                            if (validateYouTubeUrl(scope.content.content.cnt_url)) {
                                replacementElement = angular.element('<img src="' + youtubeThumb(scope.content.content.cnt_url) + '" class="img-circle col-md-9"><label class="col-md-3 text-center">"' + scope.content.content.cnt_title + '"</label>');
                                element.html('');
                                element.append(replacementElement);
                            } else {

                                replacementElement = angular.element('<video width="250"  src="' + scope.content.content.cnt_url + '" controls></video> <label class="col-md-3 text-center">"' + scope.content.content.cnt_title + '"</label>');
                                element.html('');
                                element.append(replacementElement);
                            }

                        } else if (scope.content.content != undefined && scope.content.content.cnt_url != '' && scope.content.content.cnt_type == 'lkp_2') {

                            replacementElement = angular.element('<img src="' + scope.content.content.cnt_url + '" class="img-circle col-md-9"><label class="col-md-3 text-center">"' + scope.content.content.cnt_title + '"</label>');
                            element.html('');
                            element.append(replacementElement);

                        } else if (scope.content.content == undefined && scope.content.cnt_url == '') {

                            replacementElement = angular.element('<img src="assets/images/no-image.png" class="img-circle col-md-9"><label class="col-md-3 text-center">"' + scope.content.cnt_title + '"</label>');
                            element.html('');
                            element.append(replacementElement);

                        } else if (scope.content.content != undefined && scope.content.content.cnt_url == '') {

                            replacementElement = angular.element('<img src="assets/images/no-image.png" class="img-circle col-md-9"><label class="col-md-3 text-center">"' + scope.content.content.cnt_title + '"</label>');
                            element.html('');
                            element.append(replacementElement);
                        }

                    });


                    function youtubeThumb(url) {
                        var video, results;

                        if (url === null) {
                            return '';
                        }

                        if (validateYouTubeUrl(url) == true) {
                            results = url.match('[\\?&]v=([^&#]*)');
                            video = (results === null) ? url : results[1];

                            return 'http://img.youtube.com/vi/' + video + '/0.jpg';
                        } else {
                            return url;
                        }
                    }

                    function validateYouTubeUrl(url) {

                        if (url != undefined || url !== '') {

                            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
                            var match = url.match(regExp);

                            if (match && match[2].length == 11) {

                                // Do anything for being valid
                                return true;
                            } else {

                                // Do anything for not being valid
                                return false;
                            }
                        } else {
                            return '';
                        }
                    };

                }
            }
        })

        .directive('beaconuseddirective', function () {
            return {
                template: '',
                replace: true,
                scope: {
                    beacon: '='
                },
                restrict: 'E',
                link: function (scope, element) {
                    scope.$watch('beacon', function () {
                        var replacementElement;
                        if (scope.beacon.bcn_used) {
                            replacementElement = angular.element('<span class="glyphicon glyphicon-ok" style="color:forestgreen;" aria-hidden="true"></span>');
                            element.html('');
                            element.append(replacementElement);
                        } else {
                            replacementElement = angular.element('<span class="glyphicon glyphicon-remove" style="color:red;" aria-hidden="true"></span>');
                            element.html('');
                            element.append(replacementElement);
                        }
                    })
                }
            }
        })

        .directive('campaignaction', function () {
            return {
                template: '',
                controller: 'CampaignAlertCtrl',
                replace: true,
                scope: {
                    campaign: '='
                },
                restrict: 'E',
                transclude: true,
                link: function (scope, element) {
                    scope.$watch("", function () {
                        var replacementElement;

                        if (scope.campaign.trueOwner.cmp_camp_owner == true && scope.campaign.owner.camp_state == 'active') {
                            // htmlButton('btn btn-default', 'Deactivate')
                            replacementElement = angular.element('<button ng-click="' + scope.confirmCancel(scope.campaign) + '" class="btn btn-default"><i class="glyphicon glyphicon-share-alt visible-xs-inline-block"></i><span class="hidden-xs hidden-md">Deactivate</span></button>');
                            element.html('');
                            element.append(replacementElement);

                        } else if (scope.campaign.trueOwner.cmp_camp_owner == true && scope.campaign.owner.camp_state == 'inactive') {

                            replacementElement = angular.element('<button ng-click="' + scope.confirmCancel(scope.campaign) + '" class="btn btn-success"><i class="glyphicon glyphicon-share-alt visible-xs-inline-block"></i> <span class="hidden-xs hidden-md">activate</span></button>');
                            element.html('');
                            element.append(replacementElement);

                        } else if (scope.campaign.trueOwner.cmp_camp_owner == true && scope.campaign.owner.camp_state == 'expired') {

                            replacementElement = angular.element('<button ng-click="' + scope.confirmCancel(scope.campaign) + '" class="btn btn-success"><i class="glyphicon glyphicon-share-alt visible-xs-inline-block"></i><span class="hidden-xs hidden-md">Reactivate</span></button>');
                            element.html('');
                            element.append(replacementElement);

                        } else if (scope.campaign.trueOwner.cmp_camp_owner == false && scope.campaign.trueOwner.camp_state == 'accepted') {

                            replacementElement = angular.element('<button ng-click="' + scope.confirmCancel(scope.campaign) + '" class="btn btn-default"><i class="glyphicon glyphicon-share-alt visible-xs-inline-block"></i><span class="hidden-xs hidden-md">Deactivate</span></button>');
                            element.html('');
                            element.append(replacementElement);

                        } else if (scope.campaign.trueOwner.cmp_camp_owner == false && scope.campaign.trueOwner.camp_state == 'pending') {

                            replacementElement = angular.element('<button ng-click="' + scope.confirmCancel(scope.campaign) + '" class="btn btn-success"><i class="glyphicon glyphicon-share-alt visible-xs-inline-block"></i> <span class="hidden-xs hidden-md">activate</span></button>');
                            element.html('');
                            element.append(replacementElement);
                        }
                    });

                    function htmlButton(buttonClass, buttonName ){

                        return '<button ng-click="' + scope.confirmCancel(scope.campaign) + '" class="' + buttonClass + '"><i class="glyphicon glyphicon-share-alt visible-xs-inline-block"></i><span class="hidden-xs hidden-md">buttonName</span></button>';
                    }
                }


            }
        });

})();