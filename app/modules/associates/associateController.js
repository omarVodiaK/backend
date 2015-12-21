(function () {
    'use strict';

    /**
     * module app.associate
     * @module app.associate
     * @inject {} angularUtils.directives.dirPagination
     * @inject {module} app.login
     * @inject {} toastr
     */
    angular.module('app.associate', ['angularUtils.directives.dirPagination', 'app.login', 'toastr'])

    /**
     * Controller for associate module
     * @controller AssociateCtrl
     * @param {function} associateController
     */
        .controller('AssociateCtrl', associateController)
        .controller('BadgeCtrl', badgeController)

    /**
     * @description app.associate module controller for controlling modal and selecting respective information from AssociateService and LoginService using id.
     * @method associateController
     * @param {object} $scope
     * @param {Service} AssociateService service from app.associate module
     * @param {service} LoginService service from app.login module
     */
    function associateController($scope, AssociateService, LoginService) {

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


        /**
         * remove associate row
         * @method removeAssociate
         * @param {int} id
         */
        $scope.removeAssociateRow = function (id) {
            var index = -1;
            var arrAssociates = $scope.associates;
            for (var i = 0; i < arrAssociates.length; i++) {
                if (arrAssociates[i].id === id) {
                    index = i;
                    break;
                }
            }

            /**
             *  === is to check if the value and the type are equal
             */
            if (index === -1) {
                alert("Something gone wrong");
            }

            $scope.associates.splice(index, 1);
        };

        /**
         * select associate name
         * @method getAssociateName
         * @param {int} id
         */
        $scope.getAssociateName = function (id) {
            for (var i = 0; i < $scope.users.length; i++) {
                if (id == $scope.users[i]._id) {
                    return $scope.users[i].name;
                }
            }

        }

        /**
         * call AssociateService
         * @method getAssociate
         */
        AssociateService.getAssociate(function (data) {
            /**
             * fill $scope.associate with service result
             */
            $scope.associates = data;

        });

        /**
         * getUsers is service in app.login module
         */
        LoginService.getUsers(function (data) {

            /**
             * fill $scope.emails with emails retrieved from service service
             * fill $scope.users with data retrieved from service
             */

            for (var i = 0; i < data.length; i++) {
                $scope.emails.push(data[i].email);
                $scope.users.push(data[i]);
            }
        });

    }

    /**
     * @description app.associate module controller, it handles the notification part using toastr.
     * @method badgeController
     * @param {object} $scope
     * @param {service} AssociateService service from app.associate module
     * @param {object} toastr
     */
    function badgeController($scope, AssociateService, toastr) {

        AssociateService.getAssociate(function (data) {

            $scope.associates = [];
            $scope.requestNumber = 0;

            /**
             * fill $scope.associate with service result
             */
            $scope.associates = data;

            for (var i = 0; i < data.length; i++) {
                // check if the request state is pending
                if (data[i].state == 'pending') {
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

        });
    }

})();