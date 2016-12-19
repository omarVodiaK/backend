'use strict';

angular
    .module('app.associate')
    .service('DetailedAssociateService', ['RequestService', 'session', function (RequestService, session) {
        var detailedAssociateServiceScope = this;
        var detailedAssociateServicePromise = false;

        detailedAssociateServiceScope.getAssociates = function () {

            if (!detailedAssociateServicePromise) {
                detailedAssociateServicePromise = RequestService.postJsonRequest('company/findAssociates', {'cmp_cd': session.getUser().user.cmp_cd});
            }

            return detailedAssociateServicePromise;
        }
    }]);