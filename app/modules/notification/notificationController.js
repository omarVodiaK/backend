(function () {
    'use strict';

    /**
     * module app.notification
     * @module app.notification
     */

    angular
        .module('app.notification', [])
        .controller('NotificationCtrl', notificationController)
        .controller('ModalNotificationCtrl', modalController)
        .controller('ModalNotificationInstanceCtrl', modalInstanceController)


    function notificationController($scope, NotificationService) {
        NotificationService.getNotification(function (data) {
            $scope.notifications = data;
        });
    }

    /**
     * modal controller
     * @method modalController
     * @param {object} $scope
     * @param {object} $uibModal
     */
    function modalController($scope, $uibModal) {
        $scope.animationsEnabled = true;

        /**
         * open modal
         * @method open
         * @param {string} size size of modal, leave empty for default size
         * @param {string} tpl name of the template
         */
        $scope.open = function (size, tpl, notification) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: tpl,
                controller: 'ModalNotificationInstanceCtrl',
                size: size,
                resolve: {
                    notifications: function () {
                        return $scope.notifications;
                    },
                    notification: function () {
                        return $scope.notification;
                    }
                }
            });
        };
    }

    /**
     * @method modalInstanceController
     * @param {object} $scope
     * @param {object} $modalInstance
     * @param {object} beacon
     */
    function modalInstanceController($scope, $modalInstance) {

        /**
         * press ok in modal
         * @method ok
         */
        $scope.ok = function () {
            $modalInstance.close();
        };

        /**
         * cancel modal
         * @method cancel
         */
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();