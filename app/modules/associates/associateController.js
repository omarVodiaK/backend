(function () {
    'use strict';

    /**
     * module app.associate
     * @module app.associate
     * @inject {} angularUtils.directives.dirPagination
     * @inject {module} app.login
     */
    angular.module('app.associate', ['angularUtils.directives.dirPagination', 'app.login'])

    /**
     * Controller for associate module
     * @controller AssociateCtrl
     * @param {function} associateController
     */
        .controller('AssociateCtrl', associateController);

    /**
     * Description
     * @description The method description.
     * @method associateController
     * @param {object} $scope
     * @param {} AssociateService service from app.associate module
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

        $scope.getAssociateName = function (id) {
            for (var i = 0; i < $scope.users.length; i++) {
                if (id == $scope.users[i]._id) {
                    return $scope.users[i].name;
                }
            }

        }

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
})();