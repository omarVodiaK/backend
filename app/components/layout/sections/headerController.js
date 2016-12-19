(function () {
    'use strict';
    angular
        .module('app.core')
        .controller('headerController', ['$scope', 'session', '$state', headerController]);

    function headerController($scope, session, $state) {

        if (session.getUser() != null) {

            $scope.userName = session.getUser().user.first_name;
            $scope.lastName = session.getUser().user.lname
        }

        $scope.logout = function () {

            session.destroy();
            $state.go('auth.login');
        };
    }
})();