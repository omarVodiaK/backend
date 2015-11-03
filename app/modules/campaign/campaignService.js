(function () {
    'use strict';

    /**
     * @description  use app.campaign module created in controller
     * @module app.campaign
     */
    angular
        .module('app.campaign')
        .factory('CampaignService', ['$http', function ($http) {
            return {
                /**
                 * http call for Campaign list
                 * @method getCampaign
                 * @param {} callback
                 */
                getCampaign: function (callback) {
                    $http.get("./modules/campaign/campaign.json").success(function (data) {
                        // prepare data here
                        callback(data);
                    });
                },
                getBeaconsInCampaign: function (callback) {
                    $http.get("./modules/campaign/campaign_has_beacons.json").success(function (data) {
                        // prepare data here
                        callback(data);
                    });
                },
                getContentInBeacon: function (callback) {
                    $http.get("./modules/campaign/campaign_has_beacon_contents.json").success(function (data) {
                        callback(data);
                    });
                }
            };
        }])


})();