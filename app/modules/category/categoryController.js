(function () {
    'use strict';

    /**
     * module app.category
     * @module app.category
     * @inject {} angularUtils.directives.dirPagination
     * @inject {} ui.bootstrap
     * @inject {module} app.zone
     */

    angular
        .module('app.category', ['angularUtils.directives.dirPagination', 'ui.bootstrap', 'app.zone'])

        .controller('CategoryCtrl', categoryController)

        .controller('ModalCategoryCtrl', modalController)

        .controller('CategoryModalInstanceCtrl', modalInstanceController);

    /**
     *
     * @method categoryController
     * @param {object} $scope
     * @param {service} ZoneService called form app.zone module
     * @param {service} CategoryService
     */
    function categoryController($scope, ZoneService, CategoryService) {


        $scope.categories = [];
        $scope.zones = [];
        var arrZones = [];


        ZoneService.getZone(function (data) {
            arrZones = data;
        });

        CategoryService.getCategory(function (data) {
            $scope.categories = data;
        })


        /**
         * remove category row
         * @method removeAssociate
         * @param {int} id
         */
        $scope.removeCategoryRow = function (id) {
            var index = -1;
            var arrCategories = $scope.categories;
            for (var i = 0; i < arrCategories.length; i++) {
                if (arrCategories[i]._id === id) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                alert("Something gone wrong");
            }

            $scope.categories.splice(index, 1);
        };

        /**
         * populate zones in $scope.zones
         * @method getZones
         * @param {int} id
         */
        $scope.getZones = function (id) {
            $scope.zones = [];
            for (var i = 0; i < arrZones.length; i++) {
                if (arrZones[i].cat_id === id) {
                    $scope.zones.push(arrZones[i]);
                }
            }
        }

    }

    /**
     * modal controller
     * @method modalController
     * @param {object} $scope
     * @param {object} $uibModal
     * @param {service} ZoneService
     */
    function modalController($scope, $uibModal, ZoneService) {

        $scope.animationsEnabled = true;

        ZoneService.getZone(function (data) {
            $scope.zones = data;
        })

        /**
         * open modal
         * @method open
         * @param {string} size size of modal, leave empty for default size
         * @param {string} tpl name of the template
         */
        $scope.open = function (size, tpl) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: tpl,
                controller: 'CategoryModalInstanceCtrl',
                size: size,
                resolve: {
                    zones: function () {
                        return $scope.zones;
                    }
                }
            });
        };
    }

    /**
     * Description
     * @method modalInstanceController
     * @param {object} $scope
     * @param {object} $modalInstance
     * @param {object} zones
     */
    function modalInstanceController($scope, $modalInstance, zones) {
        // populate zones
        $scope.zones = zones;

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
