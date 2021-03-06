'use strict';
angular
    .module('app.config', ['pascalprecht.translate', 'ngSanitize'])
    .config(['$httpProvider', configs])
    .config(['$translateProvider', translateConfigs])
    .config(toastrConfig)
    .constant("APPLICATION_NAME", "SANTA Dashboard")
    .constant("DEFAULT_BACKEND_CONFIG", {"HOST": "localhost", "PORT": "8283", "POSTFIX": "api", "API_KEY": ""})
    .constant("SIGNAGE_CONFIG", {"HOST": "http://128.199.125.79", "PORT": "3020"})
    .constant("CDN_CONFIG", {"HOST": "http://128.199.125.79", "PORT": "3008"})
    .constant("APPLICATION_ID", 3)
    .constant("APP_VERSION", "1.0.0")
    .constant("PROJECT_NAME", "BACKEND CORE")
    .constant("PROJECT_CODE", "unique_code")
    .run(['$rootScope', '$location', '$state', 'session', 'APPLICATION_NAME', function ($rootScope, $location, $state, session, APPLICATION_NAME) {

        runs($rootScope, $state, session, APPLICATION_NAME);
    }]);

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

function runs($rootScope, $state, session, APPLICATION_NAME) {

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

        if (toState.title) {
            $rootScope.pageTitle = APPLICATION_NAME + " > " + toState.title;
        }

        var isLogin = toState.name === "auth.login";
        var authorizationRequired = toState.auth;

        if (isLogin && (session.getUser() !== null && session.getUser() !== undefined)) {

            event.preventDefault();
            $state.go('dashboard.associate');
        }

        if (isLogin || (authorizationRequired !== undefined && !authorizationRequired)) {
            return;
        }

        // if route requires auth and user is not logged in
        if (session.getUser() === null || session.getUser() === undefined) {

            // redirect back to login
            event.preventDefault();
            $state.go('auth.login');
        }

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

function toastrConfig(toastrConfig) {
    // Display toastr in the bottom right corner
    angular.extend(toastrConfig, {positionClass: 'toast-bottom-right'});
}