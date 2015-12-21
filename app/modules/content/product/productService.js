(function () {
    'use strict';

    /**
     * @description  use app.product module created in controller
     * @module app.product
     */
    angular
        .module('app.product')
        .factory('ProductService', ['$http', function ($http) {
            return {
                /**
                 * http call for content list
                 * @method getProduct
                 * @param {} callback
                 */
                getProduct: function (callback) {
                    $http.get("./modules/content/product/product.json").success(function (data) {
                        // prepare data here
                        callback(data);
                    });
                }
            };
        }])
        .factory('CategoryService', ['$http', function ($http) {
            return {
                getCategories: function (callback) {
                    $http.get("./modules/content/product/categories.json").success(function (data) {
                        callback(data);
                    })
                }
            }
        }])

})();