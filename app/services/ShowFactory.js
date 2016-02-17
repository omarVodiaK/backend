'use strict';

/*
 * Contains a service to communicate with the Backend
 */
angular
    .module('app.services')
    .constant('API_KEY', '')
    .constant('BASE_URL', 'http://')
    .factory('ShowService', dataService);

function dataService($http, API_KEY, BASE_URL, $log) {
    var data = {
        "makeBackupRequest" : makeBackupRequest,
        "makeRequest" : makeRequest
    }
    function makeBackupRequest(url, params) {
        var requestUrl = BASE_URL + '/' + url + '?api_key=' + API_KEY;
        angular.forEach(params, function (value, key) {
            requestUrl = requestUrl + '&' + key + '=' + value;
        });
        return $http({
            'url': requestUrl,
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json'
            },
            'cache': true
        }).then(function (response) {
            return response.data;
        }).catch(dataServiceError);
    }

    function makeRequest(url, params) {
        return $http.get('/modules/' + url + '.json').then(function (response) {
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