(function () {
    'use strict';
    /**
     * @module app.location
     * @description module app.location
     */
    angular
        .module('app.location')
        .service('LocationService', function (session, notify, RequestService) {

            //session.setAccessToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7InVuaXF1ZV9pZCI6ImVjYzY1NTA2MWQ5NDY2OTE1OTc2Njk2ZGJjMzFjNzdhIiwiZm5hbWUiOiJjaW5lYWQiLCJsbmFtZSI6ImNpbmVhZCIsImVtYWlsIjoiY2luZWFkQGNpbmVhZC5jb20ubXkiLCJ0ZWxlcGhvbmUiOm51bGwsImNlbGxwaG9uZSI6IjAxMTI1NjQ4Nzk4IiwicGljdHVyZSI6bnVsbCwiYWRkcmVzcyI6bnVsbCwiYmlydGhkYXkiOm51bGwsInNlc3Npb25fdG9rZW4iOm51bGwsInJvbGUiOnsiaW50ZXJuYWxfbmFtZSI6ImFkbWluIn0sImxpY2Vuc2VzIjpbeyJrZXkiOiI1Nmd0NjJiMi1jY2I1LTQ3OTItYWRzMC01ZHdlZGI1OW9tYXIifSx7ImtleSI6Ik9NQVI2MmIyLUxJQzUtNDY5Mi1iOGIwLTVmcWVkYjU5Y2NzbyJ9XX0sImlhdCI6MTQ2NjA1NjM3NiwiZXhwIjoxNDY3NDk2Mzc2LCJhdWQiOiJ0ZXN0aW5nLmNvbS5teSIsImlzcyI6IkRlbmlzIn0.tBw0-zKn3kdboiedjJlqbkM6UZTBolkm58-2bXpNqi4');

            var params = {
                "cmp_cd": session.getUser().user.cmp_cd,
                "token": session.getAccessToken()
                //,
                //"token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7InVuaXF1ZV9pZCI6ImVjYzY1NTA2MWQ5NDY2OTE1OTc2Njk2ZGJjMzFjNzdhIiwiZm5hbWUiOiJjaW5lYWQiLCJsbmFtZSI6ImNpbmVhZCIsImVtYWlsIjoiY2luZWFkQGNpbmVhZC5jb20ubXkiLCJ0ZWxlcGhvbmUiOm51bGwsImNlbGxwaG9uZSI6IjAxMTI1NjQ4Nzk4IiwicGljdHVyZSI6bnVsbCwiYWRkcmVzcyI6bnVsbCwiYmlydGhkYXkiOm51bGwsInNlc3Npb25fdG9rZW4iOm51bGwsInJvbGUiOnsiaW50ZXJuYWxfbmFtZSI6ImFkbWluIn0sImxpY2Vuc2VzIjpbeyJrZXkiOiI1Nmd0NjJiMi1jY2I1LTQ3OTItYWRzMC01ZHdlZGI1OW9tYXIifSx7ImtleSI6Ik9NQVI2MmIyLUxJQzUtNDY5Mi1iOGIwLTVmcWVkYjU5Y2NzbyJ9XX0sImlhdCI6MTQ2NjA1NjM3NiwiZXhwIjoxNDY3NDk2Mzc2LCJhdWQiOiJ0ZXN0aW5nLmNvbS5teSIsImlzcyI6IkRlbmlzIn0.tBw0-zKn3kdboiedjJlqbkM6UZTBolkm58-2bXpNqi4'
            };

            var getLocation = function () {

                // Request list of locations
                return RequestService.postJsonRequest('location/getLocationsByCompanyId', params).then(function (data) {
                    return data;
                });

            };

            var getPlayers = function () {

                return RequestService.postJsonRequest('location/getPlayers', params).then(function (data) {
                    console.log(data);
                    return data;
                });

            };

            return {
                getLocation: getLocation,
                getPlayers: getPlayers
            }

        });
})();