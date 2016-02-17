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
     * @description call API and populate locations
     * @method locationController
     * @param {object} $scope
     * @param {service} RequestService
     */
    function locationController($scope, RequestService, $rootScope) {

        $scope.location = {};
        $scope.locations = [];
        $scope.fakeLocations = [];

        var idExist = false;

        var params = {
            "cmp_cd": $rootScope.company
        }

        // Request list for locations
        RequestService.postJsonRequest('location/getLocationsByCompanyId', params).then(function (data) {

            // Translate locations array to new format so it can be displyed on the abn_tree_directive
            $scope.locations = JSON.parse(JSON.stringify(data), function (k, v) {

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

                    if (this.loc_cd == $scope.fakeLocations[i].loc_cd) {
                        idExist = true;
                    }

                }
                if (!idExist) {

                    $scope.fakeLocations.push(this);

                }
                idExist = false;

            });


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

        // enable animation when opening the modal
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
    function modalInstanceController($scope, $uibModalInstance, location, RequestService, $rootScope) {

        $scope.fakeLocations = [];

        var idExist = false;

        if (location != 'lg') {
            $scope.location = location;
        }


        /**
         * press ok in modal
         * @method ok
         */
        $scope.ok = function () {

            // Check if location value
            if (location == 'lg') {

                var parent_cd;

                if (angular.element('#location_label').val() == "" || angular.element('#location_description').val() == "") {
                    alert('all information are required');
                } else {

                    if (angular.element('#location_parent').val() == "0") {
                        parent_cd = null;
                    } else {
                        parent_cd = angular.element('#location_parent').val();
                    }

                    // create new location object
                    var params = {
                        "loc_name": angular.element('#location_label').val(),
                        "loc_description": angular.element('#location_description').val(),
                        "loc_parent": parent_cd,
                        "cmp_cd": $rootScope.company
                    };

                    // Request to create new location from API
                    RequestService.postJsonRequest('location/createLocation', params).then(function (data) {
                        $scope.location = data;
                        var params = {
                            "cmp_cd": $rootScope.company
                        };

                        // Request list of locations from API
                        RequestService.postJsonRequest('location/getLocationsByCompanyId', params).then(function (data) {

                            // parse result and rebuild it to fit abn_tree_directive
                            var parse = parseLocation(data);

                            // pass parsed result to scope
                            $scope.locations = parse;

                            //post load and broadcast it directive will catch
                            $rootScope.$broadcast("location_created", {locations: $scope.locations});

                        });

                    });

                }
            }
            else {

                var parent_cd;
                // Check if values are not empty
                if (angular.element('#location_label').val() == "" || angular.element('#location_description').val() == "") {
                    alert('all information are required');
                } else {

                    // Check selected value of #location_parent element in DOM
                    if (angular.element('#location_parent').val() == "0") {
                        parent_cd = null;
                    } else {
                        parent_cd = angular.element('#location_parent').val();
                    }

                    // Build location to update
                    var params = {
                        "loc_name": angular.element('#location_label').val(),
                        "loc_description": angular.element('#location_description').val(),
                        "loc_parent": parent_cd,
                        "loc_cd": location.loc_cd,
                        "cmp_cd": $rootScope.company
                    };

                    // Send Request for update
                    RequestService.postJsonRequest('location/updateLocation', params).then(function (data) {

                        location.loc_parent = parent_cd;
                        location.loc_name = angular.element('#location_label').val();
                        location.loc_description = angular.element('#location_description').val();
                        $scope.location = location;

                        //Select new response
                        RequestService.postJsonRequest('location/getLocationsByCompanyId', {"cmp_cd": $rootScope.company}).then(function (res) {

                            var parse = parseLocation(res);

                            $scope.locations = parse;
                            //post load and broadcast it to directive
                            $rootScope.$broadcast("location_updated", {locations: $scope.locations});

                        });
                    });
                }
            }


            $uibModalInstance.close();
        };

        /**
         * cancel modal
         * @method cancel
         */
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        function parseLocation(data) {
            var parse = JSON.parse(JSON.stringify(data), function (k, v) {
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

                    if (this.loc_cd == $scope.fakeLocations[i].loc_cd) {
                        idExist = true;
                    }

                }
                if (!idExist) {

                    $scope.fakeLocations.push(this);

                }
                idExist = false;

            });

            return parse;
        }

    }


})();


