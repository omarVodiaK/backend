'use strict';

/**
 * module app.notification
 * @module app.notification
 */

angular
    .module('app.notification', [])
    .controller('NotificationCtrl', ['$scope', 'NotificationService', notificationController])
    .controller('ModalNotificationCtrl', ['$scope', '$uibModal', notificationModalController])
    .controller('ModalNotificationInstanceCtrl', ['$scope', '$uibModalInstance', notificationModalInstanceController]);

function notificationController($scope, NotificationService) {
    NotificationService.getNotification(function (data) {
        $scope.notifications = data;
    });
}

/**
 * modal controller
 * @method notificationModalController
 * @param {object} $scope
 * @param {object} $uibModal
 */
function notificationModalController($scope, $uibModal) {
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
            backdrop: 'static',
            keyboard: false,
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
 * @method notificationModalInstanceController
 * @param {object} $scope
 * @param {object} $modalInstance
 * @param {object} beacon
 */
function notificationModalInstanceController($scope, $uibModalInstance) {

    /**
     * press ok in modal
     * @method ok
     */
    $scope.ok = function () {
        $uibModalInstance.close();
    };

    /**
     * cancel modal
     * @method cancel
     */
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}