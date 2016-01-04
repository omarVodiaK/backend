(function () {
    'use strict';

    /**
     * @description  use app.campaign module created in controller
     * @module app.campaign
     */
    angular
        .module('app.campaign')
        .factory('CampaignService', ['$http', function ($http) {
            return {

                /**
                 * http call for Campaign list
                 * @method getCampaign
                 * @param {} callback
                 */
                getCampaign: function (callback) {
                    $http.get("./modules/campaign/campaign.json").success(function (data) {
                        // prepare data here
                        callback(data);
                    });
                }
            };
        }])

        .service('ShareData', function ($window) {

            var KEY = 'App.Campaign';

            var addData = function (newObj) {

                if ($window.sessionStorage.getItem(KEY) == null) {
                    var mydata = $window.sessionStorage.getItem(KEY);
                    if (mydata) {
                        mydata = JSON.parse(mydata);
                    } else {
                        mydata = [];
                    }
                    mydata.push(newObj);
                    $window.sessionStorage.setItem(KEY, JSON.stringify(mydata));

                } else {

                    clearData();
                    var mydata = $window.sessionStorage.getItem(KEY);
                    if (mydata) {
                        mydata = JSON.parse(mydata);
                    } else {
                        mydata = [];
                    }
                    mydata.push(newObj);
                    $window.sessionStorage.setItem(KEY, JSON.stringify(mydata));

                }


            }

            var clearData = function () {
                $window.sessionStorage.removeItem(KEY);
            }

            var getData = function () {
                var mydata = $window.sessionStorage.getItem(KEY);
                if (mydata) {
                    mydata = JSON.parse(mydata);
                }
                return mydata || [];
            }

            return {
                addData: addData,
                getData: getData,
                clearData: clearData
            }
        });

})();