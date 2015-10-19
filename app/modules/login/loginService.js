
(function () {
    'use strict';
    /**
     * @module app.login
     * @description using app.login module
     */
    angular
        .module('app.login')
        .factory('LoginService', loginService);

    /**
     * @method loginService
     * @description service to make async http calls and promises
     * @param {object} $q
     * @param {object} $http
     * @return ObjectExpression
     */
    function loginService($q, $http){
        return {
            /**
             * @method loginUser
             * @description check email and password asynchronously
             * @param {string} email
             * @param {string} password
             * @return promise
             */
            loginUser: function (email, password) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var result = false;

                $http.get('./modules/login/company.json')
                    .then(function (data) {
                        var arrayAccounts = data.data;

                        for (var index in arrayAccounts) {
                            if (arrayAccounts[index].email == email && arrayAccounts[index].password == password) {
                                result = true;
                                deferred.resolve('redirecting!'); // resolve promise
                                break;
                            }
                        }
                    })
                    .then(function () {
                        if (!result) {
                            deferred.reject('Wrong credentials.'); // reject promise
                        }
                    });

                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }

                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }

                return promise;
            },
            /**
             * @method getUsers
             * @description get data from json file
             * @param {} callback
             */
            getUsers:function(callback){

                $http.get("./modules/login/company.json").success(function(data) {
                    // prepare data here
                    callback(data);
                });

            }
        }
    }
})();
