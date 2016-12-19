(function () {
    'use strict';
    angular
        .module('app.core')
        .controller('sidemenuController', ['$scope', '$location', sidemenuController]);

    function sidemenuController($scope, $location) {

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    }
})();