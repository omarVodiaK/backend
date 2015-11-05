(function () {


    /**
     * module app.campaign
     * @module app.campaign
     */

    angular
        .module('app.campaign')
        .filter('ZoneFilter', function () {
            return function (listOfBeacons, zoneValue) {
                if (!listOfBeacons || !listOfBeacons.length) {

                } else {

                    if (!zoneValue) {
                        return listOfBeacons;
                    } else if (zoneValue.length == 0) {
                        return listOfBeacons;
                    }

                    var filtered = [];
                    for (var i = 0; i < listOfBeacons.length; i++) {
                        for (var j = 0; j < zoneValue.length; j++) {

                            if (listOfBeacons[i].bcn_zone_id == zoneValue[j]._id) {
                                filtered.push(listOfBeacons[i]);
                            }
                        }
                    }
                    return filtered;
                }
            }
        })
        .filter('CategoryFilter', function () {
            return function (listOfBeacons, categoryValue, zones) {

                if (!listOfBeacons || !listOfBeacons.length) {

                } else {

                    if (!categoryValue) {
                        return listOfBeacons;
                    } else if (categoryValue.length == 0) {
                        return listOfBeacons;
                    }
                    if (zones.length != 0) {
                        var filtered = [];

                        for (var i = 0; i < listOfBeacons.length; i++) {
                            for (var j = 0; j < categoryValue.length; j++) {
                                for (var x = 0; x < zones.length; x++) {
                                    if (zones[x].cat_id == categoryValue[j]._id) {
                                        if (listOfBeacons[i].bcn_zone_id == zones[x]._id) {
                                            filtered.push(listOfBeacons[i]);
                                        }
                                    }
                                }

                            }
                        }
                        return filtered;
                    }


                }
            }
        })


})();