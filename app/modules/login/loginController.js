
(function(){
    'use strict';
    /**
     * @module app.login
     * @description module used to check if user exists and redirect
     */
    angular
        .module('app.login', [])
        .controller('LoginCtrl',loginController);

    /**
     * @method loginController
     * @description function for authentication
     * @param {object} $scope
     * @param {object} $location
     * @param {service} LoginService
     */
    function loginController ($scope, $location, LoginService) {
        /**
         * @description check if email and password match
         * @method login
         */
        $scope.login = function () {

            LoginService.loginUser($scope.login.email, $scope.login.password).success(function (data) {
                 // if success redirect to dashboard
                alert(data);
                $location.path('/associate'); // redirect

            }).error(function (data) {
                // if false alert
                alert('Invalid email or password!');
            });
        }
    }

})();




