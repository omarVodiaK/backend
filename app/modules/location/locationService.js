'use strict';
/**
 * @module app.location
 * @description module app.location
 */
angular
    .module('app.location')
    .service('LocationService', ['session', 'notify', 'RequestService', function (session, notify, RequestService) {

        var params = {
            "cmp_cd": session.getUser().user.cmp_cd,
            "token": session.getAccessToken()
        };

        var getLocation = function () {

            // Request list of locations
            return RequestService.postJsonRequest('location/getLocationsByCompanyId', params).then(function (data) {

                return data;
            });
        };

        var getPlayers = function () {

            return RequestService.postJsonRequest('location/getPlayers', params).then(function (data) {

                return data;
            });
        };

        return {
            getLocation: getLocation,
            getPlayers: getPlayers
        }

    }]);