(function () {
    'use strict';

    angular
        .module('app.associate')
        .factory('AssociateService', ['$http', function ($http) {
            return {
                /**
                 * Description
                 * @method getAssociate
                 * @param {} callback
                 */
                getAssociate: function (callback) {


                    $http.get("./modules/associates/associate.json").success(function (data) {
                        // prepare data here
                        callback(data);
                    });
                }
            };
        }])
})();