'use strict';
angular
    .module('app.config', ['pascalprecht.translate', 'ngSanitize'])
    .config(configs)
    .config(translateConfigs)
    .config(function (toastrConfig) {
        // Display toastr in the bottom right corner
        angular.extend(toastrConfig, {

            positionClass: 'toast-bottom-right'

        });
    })
    .constant("DEFAULT_BACKEND_CONFIG", {"HOST": "localhost", "PORT": "8283", "POSTFIX": "api", "API_KEY": ""})
    .constant("APP_VERSION", "1.0.0")
    .constant("PROJECT_NAME", "BACKEND CORE")
    .run(function ($rootScope) {
        $rootScope.company = 'cmp_1';
        runs;
    });

function configs($httpProvider) {
    var interceptor = function ($location, $log, $q) {
        function error(response) {
            if (response.status === 401) {
                $log.error('You are unauthorised to access the requested resource (401)');
            } else if (response.status === 404) {
                $log.error('The requested resource could not be found (404)');
            } else if (response.status === 500) {
                $log.error('Internal server error (500)');
            }
            return $q.reject(response);
        }

        function success(response) {
            //Request completed successfully
            return response;
        }

        return function (promise) {
            return promise.then(success, error);
        }
    };
    $httpProvider.interceptors.push(interceptor);
}


function runs($rootScope, PageValues) {
    $rootScope.$on('$routeChangeStart', function () {

        PageValues.loading = true;
    });
    $rootScope.$on('$routeChangeSuccess', function () {
        PageValues.loading = false;
    });
}

function translateConfigs($translateProvider) {


    $translateProvider.useStaticFilesLoader({
        prefix: '/languages/', // file url
        suffix: '.json' // file extention
    });

    var userLang = navigator.language || navigator.userLanguage;

    if (userLang.indexOf('en') > -1) {
        $translateProvider.preferredLanguage('en');
    } else {
        $translateProvider.preferredLanguage('fr');
    }

    $translateProvider.useSanitizeValueStrategy('sanitize');
}
