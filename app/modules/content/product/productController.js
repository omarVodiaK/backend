(function () {
    'use strict';

    /**
     * module app.product
     * @module app.product
     */

    angular
        .module('app.product', [])
        .controller('ProductCtrl', productController)
        .controller('ModalProductCtrl', modalController)
        .controller('ModalProductInstanceCtrl', modalInstanceController)
        .controller('RatingCtrl', ratingController)
        .controller('SubProductCtrl', subProductController)
        .controller('CategoryCtrl', categoryController)
        .controller('ProductDetailCtrl', productDetailController)
        .controller('dropletCtrl', dropletController)
        .controller('ProductGalleryCtrl', productGalleryController)

    /**
     * @description controller to get json response for product and remove a product
     * @method productController
     * @param {object} $scope
     * @param {service} ContentService
     */
    function productController($scope, ProductService) {

        ProductService.getProduct(function (data) {
            $scope.products = data;
        });

        $scope.removeProductRow = function (id) {
            var index = -1;
            for (var i = 0; i < $scope.products.length; i++) {
                if ($scope.products[i]._id === id) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                alert("Something gone wrong");
            }
            $scope.products.splice(index, 1);
        };

    }

    /**
     * @description controller will handle delete and adding operations for different objects in sub-product, and listen to $broadcast($dropletSuccess)
     * @method productDetailController
     * @param {object} $scope
     * @param {service} ContentService
     */
    function productDetailController($scope) {

        $scope.deleteSubProduct = function (product) {
            $scope.product.subproducts.splice($scope.product.subproducts.indexOf(product), 1);
        }

        $scope.addSubProduct = function () {
            if ($scope.product !== undefined) {
                if ($scope.product.subproducts !== undefined) {
                    $scope.product.subproducts.push
                    ({
                        "sbp_description": '',
                        "sbp_discount": '',
                        "sbp_initial_quantity": '',
                        "transactions": []
                    });

                } else {
                    $scope.product.subproducts = [];
                    $scope.product.subproducts.push
                    ({
                        "sbp_description": '',
                        "sbp_discount": '',
                        "sbp_initial_quantity": '',
                        "transactions": []
                    });
                }

            } else {
                $scope.product = [];
                $scope.product.subproducts = [];
                $scope.product.subproducts.push
                ({
                    "sbp_description": '',
                    "sbp_discount": '',
                    "sbp_initial_quantity": '',
                    "transactions": []
                });
            }


        }

        $scope.addFinePrint = function () {
            if ($scope.product !== undefined) {
                if ($scope.product.fineprints !== undefined) {
                    $scope.product.fineprints.push({fnp_description: ''});
                } else {
                    $scope.product.fineprints = [];
                    $scope.product.fineprints.push({fnp_description: ''});
                }

            } else {
                $scope.product = [];
                $scope.product.fineprints = [];
                $scope.product.fineprints.push({fnp_description: ''});
            }

        }

        $scope.deleteFinePrint = function (product) {

            $scope.product.fineprints.splice($scope.product.fineprints.indexOf(product), 1);
        }

        $scope.addHighLight = function () {
            if ($scope.product !== undefined) {
                if ($scope.product.highlights !== undefined) {
                    $scope.product.highlights.push({hlt_description: ''});
                } else {
                    $scope.product.highlights = [];
                    $scope.product.highlights.push({hlt_description: ''});
                }
            } else {
                $scope.product = [];
                $scope.product.highlights = [];
                $scope.product.highlights.push({hlt_description: ''});
            }

        }

        $scope.deleteHighlight = function (product) {

            $scope.product.highlights.splice($scope.product.highlights.indexOf(product), 1);
        }

        $scope.deleteImage = function (image) {

            $scope.product.images.splice($scope.product.images.indexOf(image), 1);
        }

        /**
         * @description ProductDetailCtrl listening for event that will be $broadcast in ng-droplet when the image is successfully uploaded to server
         */
        $scope.$on('$dropletSuccess', function () {

            if ($scope.product === undefined) {
                $scope.product = [];
                $scope.product.images = [];

            }

        });

    }

    /**
     * @description controller of subProduct
     * @method subProductController
     * @param {object} $scope
     * */
    function subProductController($scope) {

        /**
         * @description Calculate the available quantity
         * @method getAvailableProductQuantity
         * @param {object} sub
         * @param {object} product
         * @return number
         * */
        $scope.getAvailableProductQuantity = function (sub, product) {

            if (product.prd_new_price != 0) {
                return product.prd_new_price - (product.prd_new_price * (parseFloat(sub.sbp_discount) / 100.0));
            } else {
                return product.prd_original_price - (product.prd_original_price * (parseFloat(sub.sbp_discount) / 100.0));
            }

        }
    }

    function modalController($scope, $uibModal) {
        $scope.animationsEnabled = true;

        /**
         * open modal
         * @method open
         * @param {string} size size of modal, leave empty for default size
         * @param {string} tpl name of the template
         */
        $scope.open = function (size, tpl, product) {
            var uibModalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: tpl,
                controller: 'ModalProductInstanceCtrl',
                backdrop: 'static',
                keyboard: false,
                size: size,
                resolve: {
                    products: function () {
                        return $scope.products;
                    },
                    product: function () {
                        return product;
                    }
                }
            });
        };

        /**
         * @description Check if product object have details
         * @method hasInformations
         * @param {Object} product
         */
        $scope.hasInformations = function (product) {

            if (product.highlights.length == 0 && product.fineprints.length == 0 && product.subproducts.length == 0) {
                return false;
            } else {
                return true;
            }

        }
    }

    function modalInstanceController($scope, $uibModalInstance, product) {

        $scope.product = product;

        /**
         * press ok in modal
         * @method ok
         */
        $scope.ok = function () {
            $uibModalInstance.close();
        };

        /**
         * cancel modal
         * @method cancel
         */
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    /**
     * @description controller for managing ratings in product module
     * @method ratingController
     * @param {object} $scope
     * */
    function ratingController($scope) {

        /**
         * @description function to calculate total ratings for each product
         * @method getTotal
         * @param {number} id
         * @return {number} $scope.total
         * */
        $scope.getTotal = function (id) {
            $scope.total = 0;
            var rateOccurrence = 0;

            for (var i = 0; i < $scope.products.length; i++) {
                if ($scope.products[i]._id === id) {

                    if ($scope.products[i].rates !== undefined) {
                        for (var j = 0; j < $scope.products[i].rates.length; j++) {
                            $scope.total += $scope.products[i].rates[j].rte_rate;
                            rateOccurrence++;
                        }
                    } else {
                        $scope.total = 0;
                    }
                }
            }
            if ($scope.total == 0) {
                $scope.total = 0;
            } else {
                $scope.total = $scope.total / rateOccurrence;
            }

            return $scope.total;
        }
    }

    /**
     * @description controller to handle categories for each product
     * @method categoryController
     * @param {object} $scope
     * @param {object} CategoryService
     * */
    function categoryController($scope, CategoryService) {
        // retrieve all categories from api
        CategoryService.getCategories(function (data) {
            $scope.categories = data;

            // watch changes in product.categories model
            $scope.$watch('product.categories', function () {

                if ($scope.categories !== undefined) {
                    if ($scope.product !== undefined) {
                        if ($scope.product.categories !== undefined) {
                            for (var i = 0; i < $scope.categories.length; i++) {
                                for (var j = 0; j < $scope.product.categories.length; j++) {
                                    if ($scope.product.categories[j].cat_id == $scope.categories[i]._id) {
                                        $scope.product.categories[j].cat_name = $scope.categories[i].cat_name;
                                        $scope.product.categories[j].cat_group = $scope.categories[i].cat_group;
                                    }
                                }
                            }
                        }
                    }
                }
            });
        });


    }

    /**
     * @description controller to handle image upload in ng-droplet
     * @method dropletController
     * @param {object} $scope
     * @param {object} $timeout
     * */
    function dropletController($scope, $timeout) {

        /**
         * @property interface
         * @type {Object}
         */
        $scope.interface = {};

        /**
         * @property uploadCount
         * @type {Number}
         */
        $scope.uploadCount = 0;

        /**
         * @property success
         * @type {Boolean}
         */
        $scope.success = false;

        /**
         * @property error
         * @type {Boolean}
         */
        $scope.error = false;

        // Listen for when the interface has been configured.
        $scope.$on('$dropletReady', function whenDropletReady() {

            $scope.interface.allowedExtensions(['png', 'jpg', 'bmp']);
            $scope.interface.setRequestUrl('http://localhost:3507/upload.html');
            $scope.interface.defineHTTPSuccess([/2.{2}/]);
            $scope.interface.useArray(false);


        });

        // Listen for when the files have been successfully uploaded.
        $scope.$on('$dropletSuccess', function onDropletSuccess(event, response, files) {

            $scope.uploadCount = files.length;
            $scope.success = true;

            if (response.files.file.length !== undefined) {

                for (var i = 0; i < response.files.file.length; i++) {
                    $scope.product.images.push({img_url: "http://localhost:3507/server/uploads/" + response.files.file[i].name});
                }

            } else {

                if ($scope.product !== undefined) {
                    $scope.product.images.push({img_url: "http://localhost:3507/server/uploads/" + response.files.file.name});
                }
            }

            $timeout(function timeout() {
                $scope.success = false;
            }, 3000);

        });

        // Listen for when the files have failed to upload.
        $scope.$on('$dropletError', function onDropletError(event, response) {

            $scope.error = true;

            $timeout(function timeout() {
                $scope.error = false;
            }, 3000);

        });
    }


    function productGalleryController($scope, Lightbox, ProductService) {

        $scope.currentPage = 1;
        $scope.itemsPerPage = 5;
        $scope.checkedItems = [];
        $scope.images = [];

        ProductService.getProduct(function (data) {
            $scope.products = data;
            $scope.totalItems = $scope.images.length;
        });

        $scope.getIndex = function (index, itemPerPage, currentPage) {

            var match = false
            if (currentPage == 1) {
                var paginationIndex = index;

            } else if (currentPage > 1) {

                var paginationIndex = index + ((currentPage - 1) * itemPerPage);
            }

            for (var i = 0; i < $scope.checkedItems.length; i++) {

                if (paginationIndex == $scope.checkedItems[i]) {

                    match = true;
                    break;
                }
            }
            return match;
        }

        $scope.saveChecked = function (index, itemPerPage, currentPage) {
            if (currentPage == 1) {
                var paginationIndex = index;

            } else if (currentPage > 1) {

                var paginationIndex = index + ((currentPage - 1) * itemPerPage);
            }

            $scope.checkedItems.push(paginationIndex);
        }
    }


})();

