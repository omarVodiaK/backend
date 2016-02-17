'use strict';
angular
    .module('user')
    .controller('RegisterController', function ($scope, PageValues, RequestService) {
        //Set page title and description
        PageValues.title = "Register";
        PageValues.description = "";
        //Setup view model object
        var vm = this;
        vm.title = "Register";
        vm.description = "";
        $scope.text = 'hello';
        $scope.formData = {};
        $scope.submit = function () {
            alert("hahaha");
            /*RequestService.postJsonRequest("users/register", {
             "fname" : "Denis",
             "lname" : "Ninja",
             "email" : "denis@tractive.com.my",
             "password" : "Qwerty123!@#",
             "confirm_password" : "Qwerty123!@#",
             "cellphone": "0144567894"
             }).then(function(result){
             console.log(result);
             });*/
        };
    });
