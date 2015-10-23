(function () {
    'use strict';

    /**
     * @description  use app.beacon module created in controller
     * @module app.beacon
     */
    angular
        .module('app.beacon')
        .factory('BeaconService', ['$http', function ($http) {
            return {
                /**
                 * http call for beacon list
                 * @method getBeacon
                 * @param {} callback
                 */
                getBeacon: function (callback) {
                    $http.get("./modules/beacon/beacon.json").success(function (data) {
                        // prepare data here
                        callback(data);
                    });
                }
            };
        }])

})();