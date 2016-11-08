(function () {
    'use strict';
    angular
        .module('app.core')
        .controller('headerController', headerController)

    function headerController($scope, session, $state) {
        //Setup view model object
        var vm = this;
        vm.title = "";
        vm.description = "";

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