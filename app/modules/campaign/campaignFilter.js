(function () {
    'use strict';

    /**
     * module app.campaign
     * @module app.campaign
     */

    angular
        .module('app.campaign')
        .filter('ZoneFilter', zoneFilter)


    function zoneFilter(items, zone) {
        console.log('here')
        //var filtered = [];
        //console.log(items +" "+zone);
        //for (var i = 0; i < items.length; i++) {
        //    var item = items[i];
        //
        //    if (zone == item.name) {
        //
        //        filtered.push(item);
        //        break;
        //    }
        //}
        //return filtered;
    }

})();