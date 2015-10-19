(function () {
    'use strict';
    /**
     * @module app.zone
     * @description module app.zone
     * @inject {object} $http
     */
    angular
        .module('app.zone')
        .factory('ZoneService', ['$http', function ($http) {
            return {
                /**
                 * Description
                 * @method getZone
                 * @param {} callback
                 */
                getZone: function (callback) {
                    $http.get("./modules/zone/zone.json").success(function (data) {

                        /**
                         * prepare data here
                         */

                        callback(data);
                    });
                }
            };
        }])
})();