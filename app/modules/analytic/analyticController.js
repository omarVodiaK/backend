(function () {
    'use strict';

    /**
     * module app.analytic
     * @module app.analytic
     */
    angular
        .module('app.analytic', ['chart.js', 'countTo'])
        .controller('AnalyticCtrl', analyticController);

    /**
     * @description app.analytic module controller for selecting respective information from RequestService.
     * @method analyticController
     * @param {object} $scope
     * @param {Service} RequestService
     * @param {object} session
     * @param {object} notify
     */
    function analyticController($scope, RequestService, session, notify) {
        $scope.data = [];

        $scope.validateUserByCompany = false;
        $scope.validatePercentageUsers = false;
        $scope.validateInteraction = false;
        $scope.validateVouchers = false;

        $scope.numberUsers = 0;

        // gender variables
        $scope.genderLabels = ["Male", "Female"];
        $scope.maleUsers = 0;
        $scope.femaleUsers = 0;

        // race variables
        $scope.raceLabels = ["malay", "indian", "chinese", "expatriate"];
        $scope.malay = 0;
        $scope.indian = 0;
        $scope.chinese = 0;
        $scope.expatriate = 0;

        // age group variables
        $scope.ageLabels = ["16-25", "26-35", "36-50", "51-69", "70+"];
        $scope.ageGroup1 = 0;
        $scope.ageGroup2 = 0;
        $scope.ageGroup3 = 0;
        $scope.ageGroup4 = 0;
        $scope.ageGroup5 = 0;
        var age;

        // beacon interaction variables
        $scope.interactionLabels = [];
        $scope.interactionData = [];

        RequestService.postJsonRequest('user/findUserByCompany', {cmp_cd: session.getUser().user.cmp_cd}).then(function (users) {

            if (users.length > 0) {

                $scope.numberUsers = users.length;

                users.forEach(function (user) {

                    // Calculate user age
                    age = _calculateAge(user.usr_dob);

                    // Check and accumulate users by gender
                    if (user.usr_gender == 'male') {
                        $scope.maleUsers++;
                    } else {
                        $scope.femaleUsers++;
                    }

                    // Check and accumulate users by race
                    if (user.usr_race == 'malay') {
                        $scope.malay++;
                    } else if (user.usr_race == 'indian') {
                        $scope.indian++;
                    } else if (user.usr_race == 'chinese') {
                        $scope.chinese++;
                    } else if (user.usr_race == 'expatriate') {
                        $scope.expatriate++;
                    }

                    // Calculate age groups
                    if (age >= 16 && age <= 25) {
                        $scope.ageGroup1++;
                    } else if (age >= 26 && age <= 35) {
                        $scope.ageGroup2++;
                    } else if (age >= 36 && age <= 50) {
                        $scope.ageGroup3++;
                    } else if (age >= 51 && age <= 69) {
                        $scope.ageGroup4++;
                    } else if (age >= 70) {
                        $scope.ageGroup5++;
                    }

                });

                $scope.raceData = [$scope.malay, $scope.indian, $scope.chinese, $scope.expatriate];

                $scope.ageData = [[$scope.ageGroup1, $scope.ageGroup2, $scope.ageGroup3, $scope.ageGroup4, $scope.ageGroup5]];

                $scope.genderData = [$scope.maleUsers, $scope.femaleUsers];

                $scope.validateUserByCompany = true;

            } else {

                notify({
                    message: "You don't have registered users!",
                    classes: 'alert-info',
                    position: 'center',
                    duration: 2000
                });
            }

        });

        RequestService.postJsonRequest('userAction/findInteractionUsers', {cmp_cd: session.getUser().user.cmp_cd}).then(function (user_action) {

            if (user_action.actions !== 0) {

                var users = user_action.inactive_users + user_action.active_users;
                $scope.percActiveUsersData = [percentage(user_action.active_users, users), percentage(user_action.inactive_users, users)];
                $scope.percActiveUsersLabels = ["active", "inactive"];
                $scope.validatePercentageUsers = true;
            }
        });

        RequestService.postJsonRequest('userAction/findCompanyVouchers', {cmp_cd: session.getUser().user.cmp_cd}).then(function (vouchers) {

            if (vouchers.vouchers != 0) {

                var expiredVouchers = vouchers.vouchers - vouchers.redeemedVoucher;
                $scope.voucherData = [vouchers.vouchers, vouchers.redeemedVoucher, expiredVouchers];
                $scope.voucherLabels = ["vouchers", "Redeemed", "Expired"];
                $scope.validateVouchers = true;
            }
        });

        RequestService.postJsonRequest('userAction/findBeacons', {cmp_cd: session.getUser().user.cmp_cd}).then(function (results) {

            if (results.length > 0) {

                results.forEach(function (result) {

                    $scope.interactionLabels.push(result.beacon.bcn_name);
                    $scope.interactionData.push(result.occurrence);
                });

                $scope.validateInteraction = true;
            }
        });

        // onClick event for chart values
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };

    }

    // Calculate age
    function _calculateAge(dob) { // birthday is a date

        var ageDifMs = Date.now() - new Date(dob).getTime();

        var ageDate = new Date(ageDifMs); // miliseconds from epoch

        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    // Calculate percentage
    function percentage(num, amount) {
        return ((num / amount) * 100).toFixed(2);
    }

})();