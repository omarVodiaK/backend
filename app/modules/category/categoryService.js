(function () {
    'use strict';

    /**
     * @description  use app.category module created in controller
     * @module app.category
     */
    angular
        .module('app.category')
        .factory('CategoryService', ['$http', function($http){
            return{
                /**
                 * http call for category list
                 * @method getCategory
                 * @param {} callback
                 */
                getCategory: function(callback){
                    $http.get("./modules/category/category.json").success(function(data) {
                        // prepare data here
                        callback(data);
                    });
                }
            };
        }]);
})();