(function () {
    'use strict';

    /**
     * @description  service for app.location module created in controller
     * @module app.location
     */
    angular
        .module('app.location')
        .factory('LocationService', ['$http', function ($http) {
            return {
                /**
                 * http call for location list
                 * @method getLocation
                 * @param {} callback
                 */
                getLocation: function (callback) {
                    $http.get("./modules/location/location.json").success(function (data) {
                        // prepare data here
                        callback(data);
                    });
                }
            };
        }]);
})();