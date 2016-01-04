(function () {


    /**
     * module app.campaign
     * @module app.campaign
     */

    angular
        .module('app.campaign')
        .filter('ZoneFilter', function () {
            return function (listOfBeacons, zoneValue, typeValue) {

                var filtered = [];

                // by default type will display the option "All" here when typeValue is undefined it will take an empty value
                if (typeValue === undefined) {
                    typeValue = "";
                }

                //Check list of beacons
                if (!listOfBeacons || !listOfBeacons.length) {

                } else {


                    if (!zoneValue && typeValue == "") { //check if zone value is undefined and typeValue = ""
                        return listOfBeacons; // no filters detected the initial array will be returned as a result

                    } else if (!zoneValue && typeValue != "") { // check if type value is "internal" or "external"

                        for (var i = 0; i < listOfBeacons.length; i++) {

                            if (listOfBeacons[i].chb_type == typeValue) { // check if chb_type of each beacon in the list is equal to the chosen value
                                filtered.push(listOfBeacons[i]); // push if condition is true
                            }

                        }

                        return filtered; // return new array
                    }

                    if (zoneValue) { // if zone is not undefined
                        if (zoneValue.length > 0) { // if zone contains elements because zone will not be undefined if the user choose a value then delete it

                            for (var i = 0; i < listOfBeacons.length; i++) { // loop through the initial loop

                                for (var j = 0; j < zoneValue.length; j++) { // loop through the selected values

                                    if (listOfBeacons[i].bcn_zone_id == zoneValue[j]._id) { // check if same id

                                        if (typeValue == "") { // check if second filter equal to all

                                            filtered.push(listOfBeacons[i]); // push result if true

                                        } else if (typeValue != "") { // check if second filter is "internal" or "external"

                                            if (listOfBeacons[i].chb_type == typeValue) { // check if same value

                                                filtered.push(listOfBeacons[i]); // push result if true
                                            }
                                        }

                                    }
                                }
                            }

                        } else if (zoneValue.length == 0) { // check if zone is empty

                            if (typeValue == "") { // check if second filter equal to all
                                return listOfBeacons;  // return initial array
                            } else {

                                for (var i = 0; i < listOfBeacons.length; i++) { // loop through initial array

                                    if (listOfBeacons[i].chb_type == typeValue) { // check the type of each beacon and compare with type selected value
                                        filtered.push(listOfBeacons[i]); // push filtered array
                                    }

                                }
                            }
                        }

                    }

                    return filtered;  // return new result

                }
            }
        })


})();