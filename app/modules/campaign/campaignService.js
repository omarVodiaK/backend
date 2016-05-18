(function () {
    'use strict';

    /**
     * @description  use app.campaign module created in controller
     * @module app.campaign
     */
    angular
        .module('app.campaign')

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
        })

        .service('DetailedCampaign', function (RequestService, session) {
            var detailedCampaignServiceScope = this;
            var detailedCampaignServicePromise = false;

            detailedCampaignServiceScope.getCampaignByCompanyId = function () {

                if (!detailedCampaignServicePromise) {

                    detailedCampaignServicePromise = RequestService.postJsonRequest('campaign/findCampaignByCompanyId', {'cmp_cd': session.getUser().user.cmp_cd});
                }

                return detailedCampaignServicePromise;


            }
        })

        .service('RefreshCampaign', function (RequestService, session) {

            var changesDetected = false;

            var detailedCampaignServiceScope = this;

            detailedCampaignServiceScope.getChanges = function () {
                return changesDetected;
            }

            detailedCampaignServiceScope.setChanges = function (val) {
                changesDetected = val;
            }

            detailedCampaignServiceScope.refreshCampaign = function () {

                return RequestService.postJsonRequest('campaign/findCampaignByCompanyId', {'cmp_cd': session.getUser().user.cmp_cd});

            }
        })

})();