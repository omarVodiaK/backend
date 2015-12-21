(function () {
    'use strict';

    /**
     * @description  use app.content module created in controller
     * @module app.content
     */
    angular
        .module('app.content')
        .factory('ContentService', ['$http', function ($http) {
            return {
                /**
                 * http call for content list
                 * @method getContent
                 * @param {} callback
                 */
                getContent: function (callback) {
                    $http.get("./modules/content/normal/content.json").success(function (data) {
                        // prepare data here
                        callback(data);
                    });
                },
                getContentTypes: function (callback) {
                    $http.get("./modules/content/normal/content_type.json").success(function (data) {
                        callback(data)
                    })
                },
                getDSContent: function (callback) {
                    $http.get("./modules/content/normal/ds.json").success(function (data) {
                        callback(data);
                    });
                }
            };
        }])

})();