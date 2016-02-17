(function () {
    'use strict';

    /**
     * module app.associate
     * @module app.associate
     * @inject {} angularUtils.directives.dirPagination
     * @inject {module} app.login
     * @inject {} toastr
     */
    angular.module('app.associate', ['toastr'])

    /**
     * Controller for associate module
     * @controller AssociateCtrl
     * @param {function} associateController
     */
        .controller('AssociateCtrl', associateController)
        .controller('BadgeCtrl', badgeController)

    /**
     * @description app.associate module controller for controlling modal and selecting respective information from RequestService.
     * @method associateController
     * @param {object} $scope
     * @param {Service} RequestService service
     * @param {object} $rootScope
     * @param {object} $filter
     */
    function associateController($scope, RequestService, $rootScope, $filter) {

        $scope.associates = [];
        $scope.emails = [];
        $scope.users = [];

        /**
         * false is default value so the modal will not popup when the page is loaded
         * @type {boolean}
         */
        $scope.showModal = false;

        /**
         * Open/Close modal
         * @method toggleModal
         */
        $scope.toggleModal = function () {
            $scope.showModal = !$scope.showModal;
        };

        $scope.ok = function () {
            $scope.showModal = false;
        };

        $scope.accept = function (id) {
            RequestService.postJsonRequest('company/action',
                {
                    'asc_cd': id,
                    'action': 'accept'
                }
            ).then(function (result) {

                    if (result.length == 1) {

                        for (var i = 0; i < $scope.associates.length; i++) {

                            if ($scope.associates[i].asc_cd == result[0].asc_cd) {

                                $scope.associates[i] = result[0];

                            }
                        }
                    }
                });
        }


        /**
         * remove associate row
         * @method removeAssociate
         * @param {int} id
         */
        $scope.removeAssociateRow = function (id) {

            RequestService.postJsonRequest('company/deleteAssociate', {'asc_cd': id}).then(function (res) {
                if (res.result == 'deleted successfully') {
                    var index = -1;
                    var arrAssociates = $scope.associates;
                    for (var i = 0; i < arrAssociates.length; i++) {
                        if (arrAssociates[i].asc_cd === id) {
                            index = i;
                            break;
                        }
                    }
                    if (index === -1) {
                        alert("Something gone wrong");
                    }

                    $scope.associates.splice(index, 1);
                }
            })


            /**
             *  === is to check if the value and the type are equal
             */


        };

        /**
         * select associate name
         * @method getAssociateName
         * @param {object} company
         */
        $scope.getAssociateName = function (company) {

            if (company.owner == $rootScope.company) {
                return company.asc_cmp_receiver_id.cmp_name;
            } else {
                return company.asc_cmp_sender_id.cmp_name;
            }


        }

        /**
         * call RequestService
         * @method postJsonRequest
         */
        RequestService.postJsonRequest('company/findAssociates', {'cmp_cd': $rootScope.company}).then(function (data) {
            if (data.result == "this model doesn't exist" || data.result == 'error') {

            } else if (data.result == undefined) {
                $scope.associates = data;
            }

        })

        RequestService.postJsonRequest('company/getCompanies', {'cmp_cd': $rootScope.company}).then(function (data) {
            if (data.result == 'no companies found' || data.result != undefined) {

            } else {
                data.forEach(function (result) {
                    result.val = false;
                    $scope.users.push(result)
                })
            }


        })


        $scope.sendRequest = function () {

            var checked;
            var unchecked;

            $scope.$watch('users', function (newObj, oldObj) {

                checked = $filter('filter')(newObj, {'val': true});

                checked.forEach(function (check) {
                    RequestService.postJsonRequest('company/invite', {
                        'sender_id': $rootScope.company,
                        'receiver_id': check.cmp_cd
                    }).then(function (result) {
                        if (result.result == "already invited") {
                            alert('already invited');
                            $scope.showModal = false;
                        } else {
                            RequestService.postJsonRequest('company/findAssociates', {'cmp_cd': $rootScope.company}).then(function (data) {
                                if (data.result == "this model doesn't exist" || data.result == 'error') {

                                } else if (data.result == undefined) {
                                    $scope.associates = data;
                                }

                            })
                            $scope.showModal = false;
                        }
                    })
                });

                unchecked = $filter('filter')(newObj, {'val': false});
                $scope.showModal = false;
            }, true);

        }
    }

    /**
     * @description app.associate module controller, it handles the notification part using toastr.
     * @method badgeController
     * @param {object} $scope
     * @param {service} RequestService service
     * @param {object} toastr
     */
    function badgeController($scope, $rootScope, RequestService, toastr) {

        RequestService.postJsonRequest('company/findAssociates', {'cmp_cd': $rootScope.company}).then(function (result) {

            $scope.associates = [];
            $scope.requestNumber = 0;

            /**
             * fill $scope.associate with service result
             */
            $scope.associates = result;

            for (var i = 0; i < $scope.associates.length; i++) {
                // check if the request state is pending
                if ($scope.associates[i].asc_state == 'pending') {
                    $scope.requestNumber++;
                }
            }

            if ($scope.requestNumber > 0) {
                // trigger toastr
                if ($scope.requestNumber == 1) {
                    toastr.info('You have ' + $scope.requestNumber + ' pending request', 'Information');
                } else {
                    toastr.info('You have ' + $scope.requestNumber + ' pending requests', 'Information');
                }
            }
        })

    }

})();