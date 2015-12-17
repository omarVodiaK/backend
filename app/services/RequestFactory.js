'use strict';

/*
 * Contains a service to communicate with the Backend
 */
angular
    .module('app.services')
    .factory('RequestService', dataService);

function dataService($http, DEFAULT_BACKEND_CONFIG, $log) {
    var data = {
        "postJsonRequest" : makeJsonPostRequest
    };
    function makeJsonPostRequest(url, params) {
        var port = "";
        var postfix = "";
        if (DEFAULT_BACKEND_CONFIG.PORT !== '')
            port = port + ":" + DEFAULT_BACKEND_CONFIG.PORT;
        if (DEFAULT_BACKEND_CONFIG.POSTFIX !== '')
            postfix = postfix + "/" + DEFAULT_BACKEND_CONFIG.POSTFIX;
        var requestUrl = 'http://' + DEFAULT_BACKEND_CONFIG.HOST+ port + postfix + '/' + url;
        var data = params;
        return $http({
            'url': requestUrl,
            'method': 'POST',
            'data': data,
            'headers': {
                'Content-Type': 'application/json'
            },
            'cache': true
        }).then(function(response){
            return response.data;
        }).catch(dataServiceError);
    }

    return data;

    function dataServiceError(errorResponse) {
        $log.error('XHR Failed for RequestService');
        $log.error(errorResponse);
        return errorResponse;
    }
}