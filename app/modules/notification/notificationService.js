(function () {
    'use strict';

    /**
     * @description  use app.notification module created in controller
     * @module app.notification
     */
    angular
        .module('app.notification')
        .factory('NotificationService', ['$http', function ($http) {
            return {
                /**
                 * http call for notification list
                 * @method getNotification
                 * @param {} callback
                 */
                getNotification: function (callback) {
                    $http.get("./modules/notification/notification.json").success(function (data) {
                        // prepare data here
                        callback(data);
                    });
                }
            };
        }])

})();