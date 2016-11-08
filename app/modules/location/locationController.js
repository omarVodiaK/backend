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
     * @param {locationService} LocationService
     * @param {service} RequestService
     * @param {object} notify
     */
    function locationController($scope, LocationService, notify) {

        var idExist = false;
        $scope.locations = [];
        $scope.fakeLocations = [];

        var data = LocationService.getLocation();

        data.then(function (results) {

            if (results != undefined) {

                if (results.length > 0) {

                    // Translate locations array to new format so it can be displayed on the abn_tree_directive
                    $scope.locations = JSON.parse(JSON.stringify(results), function (k, v) {

                        if (k === "loc_name")
                            this.label = v;
                        else if (k === "loc_description")
                            this.description = v;
                        else if (k === "locations") {

                            this.children = v;
                            this.onSelect = function (branch) {
                                $scope.output = branch;
                            };

                        } else {

                            this.onSelect = function (branch) {
                                $scope.output = branch;
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
                }

                else {
                    notify({
                        message: "You have 0 location!",
                        classes: 'alert-info',
                        position: 'center',
                        duration: 2000
                    });
                }

            } else {

                notify({
                    message: "You have 0 location!",
                    classes: 'alert-info',
                    position: 'center',
                    duration: 2000
                });
            }
        });

        $scope.playersList = LocationService.getPlayers();

        $scope.playersList.then(function (results) {

            $scope.players = results;
        });

    }

    /**
     * @description modal controller
     * @method modalController
     * @param {object} $scope
     * @param {object} $uibModal
     * @param {service} LocationService
     */
    function modalController($scope, $uibModal, LocationService) {

        // enable animation when opening the modal
        $scope.animationsEnabled = true;

        $scope.playersList = LocationService.getPlayers();

        $scope.playersList.then(function (results) {
            $scope.players = results;
        });

        /**
         * @description open modal
         * @method open
         * @param {object} location
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
                    },
                    fakeLocations: function () {
                        return $scope.fakeLocations;
                    },
                    players: function () {
                        return $scope.players;
                    }
                }
            });

        };

    }

    /**
     * @method modalInstanceController
     * @param {object} $scope
     * @param {object} $uibModalInstance
     * @param {object} location
     * @param {object} players
     * @param {session} RequestService
     * @param {object} $rootScope
     * @param {object} session
     * @param {object} notify
     */
    function modalInstanceController($scope, $uibModalInstance, location, players, RequestService, $rootScope, session, notify) {

        $scope.fakeLocations = [];

        var idExist = false;

        if (location != 'lg') {

            $scope.location = location;

            if ($scope.location.plr_cd == null) {
                $scope.location.plr_cd = "0";
            }

            if ($scope.location.loc_parent == null) {
                $scope.location.loc_parent = "0";
            }

        } else {

            $scope.location = {};
            $scope.location.loc_parent = "0";
            $scope.location.plr_cd = "0";
        }

        /**
         * @description save/update model
         * @method ok
         */
        $scope.ok = function () {

            var player = null;
            var player_ip = null;

            //Check if location value
            if (location == 'lg') {

                var parent_cd;

                if (angular.element('#location_label').val() == "" || angular.element('#location_description').val() == "") {

                    notify({
                        message: "all information are required!",
                        classes: 'alert-warning',
                        position: 'center',
                        duration: 2000
                    });

                } else {

                    if (angular.element('#location_player').val() != "0") {

                        player = angular.element('#location_player').val();
                    }

                    if (angular.element('#location_parent').val() == "0") {

                        parent_cd = null;
                    } else {

                        parent_cd = angular.element('#location_parent').val();
                    }

                    var index = isInArray(player, players);

                    if (index != -1) {

                        player_ip = players[index].plr_ip
                    }

                    // create new location object
                    var params = {
                        "loc_name": angular.element('#location_label').val(),
                        "loc_description": angular.element('#location_description').val(),
                        "loc_parent": parent_cd,
                        "plr_cd": player,
                        "plr_ip_address": player_ip,
                        "cmp_cd": session.getUser().user.cmp_cd
                    };

                    // Request to create new location from API
                    RequestService.postJsonRequest('location/createLocation', params).then(function (data) {

                        $scope.location = data;

                        var params = {

                            "cmp_cd": session.getUser().user.cmp_cd
                        };

                        // Request list of locations from API
                        RequestService.postJsonRequest('location/getLocationsByCompanyId', params).then(function (data) {

                            notify({
                                message: "Location created Successfully!",
                                classes: 'alert-success',
                                position: 'center',
                                duration: 2000
                            });

                            // parse result and rebuild it to fit abn_tree_directive
                            var parse = parseLocation(data);

                            // pass parsed result to scope
                            $scope.locations = parse;

                            //post load and broadcast it directive will catch
                            $rootScope.$broadcast("location_created", {locations: $scope.locations});

                        });

                    });

                    $uibModalInstance.close();
                }

            } else { //Update location

                var parent_cd;


                // Check if values are not empty
                if (angular.element('#location_label').val() == "" || angular.element('#location_description').val() == "") {

                    notify({
                        message: "all information are required!",
                        classes: 'alert-warning',
                        position: 'center',
                        duration: 2000
                    });

                } else {

                    if (angular.element('#location_player').val() != "0") {

                        player = angular.element('#location_player').val();
                    }

                    // Check selected value of #location_parent element in DOM
                    if (angular.element('#location_parent').val() == "0") {

                        parent_cd = null;
                    } else {

                        parent_cd = angular.element('#location_parent').val();
                    }

                    var index = isInArray(player, players);

                    if (index != -1) {
                        player_ip = players[index].plr_ip
                    }
                    console.log(player_ip)
                    // Build location to update
                    var params = {
                        "loc_name": angular.element('#location_label').val(),
                        "loc_description": angular.element('#location_description').val(),
                        "loc_parent": parent_cd,
                        "loc_cd": location.loc_cd,
                        "plr_cd": player,
                        "plr_ip_address": player_ip,
                        "cmp_cd": session.getUser().user.cmp_cd
                    };

                    // Send Request for update
                    RequestService.postJsonRequest('location/updateLocation', params).then(function (data) {

                        location.loc_parent = parent_cd;
                        location.loc_name = angular.element('#location_label').val();
                        location.loc_description = angular.element('#location_description').val();
                        $scope.location = location;

                        //Select new response
                        RequestService.postJsonRequest('location/getLocationsByCompanyId', {"cmp_cd": session.getUser().user.cmp_cd}).then(function (res) {

                            notify({
                                message: "location updated!",
                                classes: 'alert-success',
                                position: 'center',
                                duration: 2000
                            });

                            var parse = parseLocation(res);

                            $scope.locations = parse;
                            //post load and broadcast it to directive
                            $rootScope.$broadcast("location_updated", {locations: $scope.locations});

                        });
                    });

                    $uibModalInstance.close();
                }
            }
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

        function isInArray(value, array) {

            var hasMatch = false;
            var arrayIndex = -1;

            for (var index = 0; index < array.length; ++index) {

                var object = array[index];

                if (object.plr_cd == value) {
                    arrayIndex = index;
                    hasMatch = true;
                    break;
                }
            }

            return arrayIndex;
        }
    }

})();