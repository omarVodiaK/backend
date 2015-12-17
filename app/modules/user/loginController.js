'use strict';
angular
    .module('user')
    .controller('LoginController', function($scope, PageValues, RequestService) {
        //Set page title and description
        PageValues.title = "Login";
        PageValues.description = "";
        //Setup view model object
        var vm = this;
        vm.title = "Login";
        vm.description = "";
        $scope.text = 'hello';
        $scope.formData = {};
        $scope.submit = function() {
            RequestService.postJsonRequest("users/login", {
                "email" : $scope.formData.email,
                "password" : $scope.formData.password
            }).then(function(result){
                console.log(result);
            });
        };
    });
