'use strict';

/*
 * Contains a service to communicate with the Backend
 */
angular
    .module('app.services')
    .factory('RequestService', dataService);

function dataService($http, DEFAULT_BACKEND_CONFIG, $log, session, $state) {
    var data = {
        "postJsonRequest": makeJsonPostRequest
    };

    function makeJsonPostRequest(url, params) {
        var port = "";
        var postfix = "";
        if (DEFAULT_BACKEND_CONFIG.PORT !== '')
            port = port + ":" + DEFAULT_BACKEND_CONFIG.PORT;
        if (DEFAULT_BACKEND_CONFIG.POSTFIX !== '')
            postfix = postfix + "/" + DEFAULT_BACKEND_CONFIG.POSTFIX;
        var requestUrl = 'http://' + DEFAULT_BACKEND_CONFIG.HOST + port + postfix + '/' + url;
        var data = params;
        var header = {
            'Content-Type': 'application/json'
        };
        if (url != "auth/login" && url != "auth/register" && session.getUser() !== null && session.getUser() !== undefined) {

            header["x-access-token"] = session.getAccessToken();
        }
        return $http({
            'url': requestUrl,
            'method': 'POST',
            'data': data,
            'headers': header,
            'cache': true
        }).then(function (response) {
            if (response.data.success === false) {
                session.destroy();
                $state.go("auth.login");

            } else
                return response.data;
        }).catch(dataServiceError);
    }

    return data;

    function dataServiceError(errorResponse) {

        $log.error('XHR Failed for RequestService');
        $log.error(errorResponse);
        $state.go('auth.login', {message: "XHR Failed for RequestService"});
        return errorResponse;
    }
}