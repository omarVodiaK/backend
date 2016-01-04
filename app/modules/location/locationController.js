(function () {
    'use strict';

    /**
     *
     * @module app.location
     * @description module location
     * @inject {} angularUtils.directives.dirPagination
     * @inject {} ui.bootstrap
     */

    angular
        .module('app.location', ['angularUtils.directives.dirPagination', 'angularBootstrapNavTree'])
        .controller('LocationCtrl', locationController)
        .controller('ModalLocationCtrl', modalController)
        .controller('ModalLocationInstanceCtrl', modalInstanceController)

    /**
     * @description TODO
     * @method locationController
     * @param {object} $scope
     * @param {service} LocationService
     */
    function locationController($scope, LocationService) {
        $scope.location = {};
        $scope.locations = [];
        $scope.fakeLocations = [];
        var idExist = false;

        LocationService.getLocation(function (data) {

            var parsed = JSON.parse(JSON.stringify(data), function (k, v) {
                if (k === "loc_name")
                    this.label = v;
                else if (k === "loc_description")
                    this.description = v;
                else if (k === "locations") {
                    this.children = v;
                    this.onSelect = function (branch) {
                        $scope.output = branch
                    };
                } else {
                    this.onSelect = function (branch) {
                        $scope.output = branch
                    };
                    return v;
                }
                for (var i = 0; i < $scope.fakeLocations.length; i++) {
                    if (this._id == $scope.fakeLocations[i]._id) {
                        idExist = true;
                    }
                }
                if (!idExist) {
                    $scope.fakeLocations.push(this);
                }
                idExist = false;

            });
            $scope.locations = parsed;
        });

    }

    /**
     * modal controller
     * @method modalController
     * @param {object} $scope
     * @param {object} $uibModal
     * @param {service} ZoneService
     */
    function modalController($scope, $uibModal) {

        $scope.animationsEnabled = true;

        /**
         * open modal
         * @method open
         * @param {string} size size of modal, leave empty for default size
         * @param {string} tpl name of the template
         */
        $scope.open = function (location) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'locationModalTpl',
                controller: 'ModalLocationInstanceCtrl',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    locations: function () {
                        return $scope.locations;
                    },
                    location: function () {
                        return location;
                    }
                }
            });
        };

    }

    /**
     * @method modalInstanceController
     * @param {object} $scope
     * @param {object} $uibModalInstance
     */
    function modalInstanceController($scope, $uibModalInstance, location) {

        $scope.location = location;

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

})();
