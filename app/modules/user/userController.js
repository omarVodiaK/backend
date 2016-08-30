(function () {
    'use strict';
    angular
        .module('user', [])
        .controller('LoginController', loginController)
        .controller('RegisterController', registerController);

    /**
     * @description
     * @method loginController
     * @param {object} $scope
     * @param {array} PageValues
     * @param {service} RequestService
     * @param {object} session
     * @param {object} $state
     * @param {object} $stateParams
     * @param {constant} APPLICATION_ID
     * @param {object} notify
     */
    function loginController($scope, PageValues, RequestService, session, $state, $stateParams, APPLICATION_ID, notify) {

        //Set page title and description
        PageValues.title = "Login";
        PageValues.description = "";

        //Setup view model object
        var vm = this;
        vm.title = "Login";
        vm.description = "";
        $scope.text = 'hello';
        $scope.formData = {};

        if ($stateParams.message !== null && $stateParams.message !== undefined) {

            alert($stateParams.message);
        }

        $scope.submit = function () {

            RequestService.postJsonRequest("auth/login", {

                "email": $scope.formData.email,
                "password": $scope.formData.password,
                "application_id": APPLICATION_ID
            }).then(function (result) {

                console.log(result);

                if (result.result === undefined) {

                    alert('Wrong email or password');

                } else {

                    if (result.result.success !== true) {

                        if (result.code == "ECONNREFUSED") {

                            alert('TIPS is not accessible please contact us!');

                        } else {

                            if (result.result.messages != undefined) {

                                var combinedMessage = "";

                                $.each(result.result.messages, function (key, value) {

                                    combinedMessage += value;
                                });

                                notify({
                                    message: combinedMessage,
                                    classes: 'alert-warning',
                                    position: 'center',
                                    duration: 2000
                                });
                            }

                        }

                    } else if (result.result.success === true) {

                        if (result.result.user.roles.length > 0) {

                            session.setUser(result.result);
                            $state.go('dashboard.associate');

                        } else {

                            notify({
                                message: "seems that you don't have a license!",
                                classes: 'alert-warning',
                                position: 'center',
                                duration: 2000
                            });

                        }

                    }
                }
            });
        };
    }

    function registerController($scope, PageValues, RequestService, $state) {

        //Set page title and description
        PageValues.title = "Register";
        PageValues.description = "";

        //Setup view model object
        var vm = this;
        vm.title = "Register";
        vm.description = "";
        $scope.text = 'hello';
        $scope.data = {};

        $scope.submit = function (isValid) {

            if (isValid) {

                RequestService.postJsonRequest("auth/register", {

                    "fname": this.data.firstName,
                    "lname": this.data.lastName,
                    "email": this.data.userEmail,
                    "password": this.data.password,
                    "confirm_password": this.data.confirmPassword,
                    "cellphone": this.data.phone,
                    "role_id": 2
                }).then(function (result) {

                    if (result.success === true) {

                        $state.go('auth.login', {message: "You have been registered. Please, login in order to use web application."});
                    } else if (!result.success) {

                    }
                });
            }

        };
    }

})();