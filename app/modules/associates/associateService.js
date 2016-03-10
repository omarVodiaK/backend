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

        .service('DetailedAssociateService', function (RequestService, session) {
            var detailedAssociateServiceScope = this;
            var detailedAssociateServicePromise = false;

            detailedAssociateServiceScope.getAssociates = function () {
                if (!detailedAssociateServicePromise) {

                    detailedAssociateServicePromise = RequestService.postJsonRequest('company/findAssociates', {'cmp_cd': session.getUser().user.cmp_cd});
                }
                return detailedAssociateServicePromise;


            }
        })
})();