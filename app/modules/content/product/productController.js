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
    function productController($scope, RequestService, session, notify) {

        $scope.products = [];
        var params = {
            'cmp_cd': session.getUser().user.cmp_cd
        };

        RequestService.postJsonRequest('product/findProductByCompanyId', params).then(function (result) {
            if (result.result == "this model doesn't exist") {
                notify({
                    message: "You have 0 product!",
                    classes: 'alert-info',
                    position: 'center',
                    duration: 2000
                });
            } else if (result.result == undefined) {
                result.forEach(function (res) {

                    var highlights = [];
                    var fineprints = [];

                    if (res.details.length > 0) {
                        res.details.forEach(function (detail) {

                            if (detail.prd_dtl_type == 'fineprint') {
                                fineprints.push(detail)

                            } else if (detail.prd_dtl_type == 'highlight') {
                                highlights.push(detail);
                            }

                        });

                        res.details.fineprint = fineprints;
                        res.details.highlight = highlights;

                    }
                });

                $scope.products = result;


                console.log($scope.products)
            }


        });

        $scope.removeProductRow = function (id) {
            var identifier = {
                "prd_cd": id
            };

            RequestService.postJsonRequest('product/deleteProduct', identifier).then(function (result) {

                if (result.result == "deleted successfully") {
                    var index = -1;
                    for (var i = 0; i < $scope.products.length; i++) {
                        if ($scope.products[i].prd_cd === id) {
                            index = i;
                            break;
                        }
                    }
                    if (index === -1) {

                        notify({
                            message: "Something Gone Wrong!",
                            classes: 'alert-warning',
                            position: 'center',
                            duration: 2000
                        });

                    } else {

                        notify({
                            message: "Deleted Successfully!",
                            classes: 'alert-success',
                            position: 'center',
                            duration: 2000
                        });

                    }
                    $scope.products.splice(index, 1);
                } else {

                    notify({
                        message: "Something Gone Wrong!",
                        classes: 'alert-warning',
                        position: 'center',
                        duration: 2000
                    });


                }
            })

        };

    }

    /**
     * @description controller will handle delete and adding operations for different objects in sub-product, and listen to $broadcast($dropletSuccess)
     * @method productDetailController
     * @param {object} $scope
     * @param {service} ContentService
     */
    function productDetailController($scope, RequestService, notify) {

        $scope.deleteSubProduct = function (product) {

            if (product.sub_prd_cd == undefined) {
                $scope.product.sub_products.splice($scope.product.sub_products.indexOf(product), 1);
            } else {
                RequestService.postJsonRequest('product/deleteSubProduct', {'sub_prd_cd': product.sub_prd_cd}).then(function (result) {

                    if (result.result == 'deleted successfully') {

                        notify({
                            message: "Deleted Successfully!",
                            classes: 'alert-success',
                            position: 'center',
                            duration: 2000
                        });

                        $scope.product.sub_products.splice($scope.product.sub_products.indexOf(product), 1);

                    }

                });
            }


        };

        $scope.addSubProduct = function () {
            if ($scope.product !== undefined) {
                if ($scope.product.sub_products !== undefined) {
                    $scope.product.sub_products.push
                    ({
                        "sub_prd_description": '',
                        "sub_prd_discount": '',
                        "sub_prd_initial_qte": '',
                        "transactions": []
                    });

                } else {
                    $scope.product.sub_products = [];
                    $scope.product.sub_products.push
                    ({
                        "sub_prd_description": '',
                        "sub_prd_discount": '',
                        "sub_prd_initial_qte": '',
                        "transactions": []
                    });
                }

            } else {
                $scope.product = [];
                $scope.product.sub_products = [];
                $scope.product.sub_products.push
                ({
                    "sub_prd_description": '',
                    "sub_prd_discount": '',
                    "sub_prd_initial_qte": '',
                    "transactions": []
                });
            }


        };

        $scope.addFinePrint = function () {

            if ($scope.product !== undefined) {

                if ($scope.product.details.fineprint !== undefined) {

                    $scope.product.details.fineprint.push({prd_dtl_description: ''});

                } else {

                    $scope.product.details.fineprint = [];
                    $scope.product.details.fineprint.push({prd_dtl_description: ''});

                }

            } else {

                $scope.product = [];
                $scope.product.details = [];
                $scope.product.details.fineprint = [];
                $scope.product.details.fineprint.push({prd_dtl_description: ''});

            }

        };

        $scope.deleteFinePrint = function (product) {


            if (product.prd_dtl_cd == undefined) {
                $scope.product.details.fineprint.splice($scope.product.details.fineprint.indexOf(product), 1);
            } else {
                RequestService.postJsonRequest('product/deleteProductDetails', {'prd_dtl_cd': product.prd_dtl_cd}).then(function (result) {
                    if (result.result == 'deleted successfully') {
                        notify({
                            message: "Deleted Successfully!",
                            classes: 'alert-success',
                            position: 'center',
                            duration: 2000
                        });
                        $scope.product.details.fineprint.splice($scope.product.details.fineprint.indexOf(product), 1);
                        RequestService.postJsonRequest('product/findProductById', {'prd_cd': product.prd_cd}).then(function (res) {

                            for (var i = 0; i < $scope.products.length; i++) {
                                if ($scope.products[i].prd_cd == res.prd_cd) {
                                    $scope.products[i] = res;
                                }
                            }


                        })
                    }
                })
            }


        };

        $scope.addHighLight = function () {

            if ($scope.product !== undefined) {

                if ($scope.product.details.highlight !== undefined) {

                    $scope.product.details.highlight.push({prd_dtl_description: ''});

                } else {

                    $scope.product.details.highlight = [];
                    $scope.product.details.highlight.push({prd_dtl_description: ''});

                }

            } else {

                $scope.product = [];
                $scope.product.details.highlight = [];
                $scope.product.details.highlight.push({prd_dtl_description: ''});

            }

        };

        $scope.deleteHighlight = function (product) {

            if (product.prd_dtl_cd == undefined) {
                $scope.product.details.highlight.splice($scope.product.details.highlight.indexOf(product), 1);
            } else {
                RequestService.postJsonRequest('product/deleteProductDetails', {'prd_dtl_cd': product.prd_dtl_cd}).then(function (result) {
                    if (result.result == 'deleted successfully') {

                        notify({
                            message: "Deleted Successfully!",
                            classes: 'alert-success',
                            position: 'center',
                            duration: 2000
                        });

                        $scope.product.details.highlight.splice($scope.product.details.highlight.indexOf(product), 1);
                    }
                });
            }


        };

        $scope.deleteImage = function (image) {

            RequestService.postJsonRequest('product/deleteProductImage', {'prd_img_cd': image.prd_img_cd}).then(function (result) {
                if (result.result == 'deleted successfully') {

                    notify({
                        message: "Deleted Successfully!",
                        classes: 'alert-success',
                        position: 'center',
                        duration: 2000
                    });

                    $scope.product.product_image.splice($scope.product.product_image.indexOf(image), 1);
                }
            });

        };

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
                return product.prd_new_price - (product.prd_new_price * (parseFloat(sub.sub_prd_discount) / 100.0));
            } else {
                return product.prd_original_price - (product.prd_original_price * (parseFloat(sub.sub_prd_discount) / 100.0));
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

            if (product.details.length == 0 && product.sub_products.length == 0 && product.product_image.length == 0) {
                return false;
            } else {
                return true;
            }

        }

    }

    function modalInstanceController($scope, $uibModalInstance, product, $rootScope, RequestService, products, $q, session, notify) {
        $scope.products = products;
        $scope.product = product;
        $scope.selectedCategories = [];

        var defer = $q.defer();
        var promises = [];
        var clearPromises = [];
        var categoryNames;
        var i = 0;
        var arraySubProducts = [];
        var description = '';
        var discount = '';
        var quantity = '';

        /**
         * press ok in modal
         * @method ok
         */
        $scope.ok = function () {

            if (product == undefined) {


                if (angular.element('#product_title').val() == '' ||
                    angular.element('#product_original_price').val() == '' ||
                    angular.element('#product_new_price').val() == '' ||
                    angular.element('#product_measure_unit').val() == '' ||
                    angular.element('#product_description').val() == '' ||
                    angular.element('#product_category')[0].textContent == '') {
                    notify({
                        message: "Some information are required!",
                        classes: 'alert-info',
                        position: 'center',
                        duration: 2000
                    });


                } else {

                    var textContent = angular.element('#product_category')[0].textContent.split("×");
                    textContent.forEach(function (result) {
                        categoryNames = result.split("/");
                        $rootScope.categories.forEach(function (category) {
                            if ((category.cat_group == categoryNames[0]) && (category.cat_name == categoryNames[1])) {
                                $scope.selectedCategories.push(category);
                            }
                        });
                    });

                    var params = {
                        'cmp_cd': session.getUser().user.cmp_cd,
                        'prd_title': angular.element('#product_title').val(),
                        'prd_description': angular.element('#product_description').val(),
                        'prd_original_price': angular.element('#product_original_price').val(),
                        'prd_new_price': angular.element('#product_new_price').val(),
                        'prd_availability': angular.element('#product_availability').val(),
                        'prd_measure_unit': angular.element('#product_measure_unit').val()
                    };

                    RequestService.postJsonRequest('product/createProduct', params).then(function (prd) {

                        if (prd.result == undefined) {

                            notify({
                                message: "Product Created Successfully!",
                                classes: 'alert-success',
                                position: 'center',
                                duration: 2000
                            });

                            RequestService.postJsonRequest('product/findProductById', {'prd_cd': prd.prd_cd}).then(function (product) {


                                if (product.result == undefined) {

                                    $scope.selectedCategories.forEach(function (category) {
                                        promises.push(assignCategoryToProduct(category, product, RequestService, defer));

                                    });

                                    var fineprint_parent = $(".fineprint_parent");
                                    $(fineprint_parent).find("input").each(function () {

                                        promises.push(createFineprint(product, $(this).val(), RequestService, defer));

                                    });

                                    var highlight_parent = $(".highlight_parent");
                                    $(highlight_parent).find("input").each(function () {

                                        promises.push(createHighlight(product, $(this).val(), RequestService, defer));

                                    });

                                    var sub_product_parent = $(".sub_product_parent");
                                    $(sub_product_parent).find("input").each(function () {

                                        switch (i) {
                                            case 0:

                                                description = $(this).val();
                                                break;
                                            case 1:

                                                discount = $(this).val();
                                                break;
                                            case 2:

                                                quantity = $(this).val();
                                                arraySubProducts.push({
                                                    'prd_description': description,
                                                    'prd_discount': discount,
                                                    'quantity': quantity
                                                });
                                                break;

                                        }
                                        if (i == 2) {
                                            i = 0;
                                        } else {
                                            i++;
                                        }

                                    });


                                    if (arraySubProducts.length > 0) {

                                        if (product.sub_products.length > 0) {

                                            product.sub_products.forEach(function (subProduct) {
                                                if (subProduct.sub_prd_cd == undefined) {
                                                    promises.push(RequestService.postJsonRequest('product/createSubProduct', {
                                                        'sub_prd_description': subProduct.sub_prd_description,
                                                        'sub_prd_discount': subProduct.sub_prd_discount,
                                                        'sub_prd_initial_qte': subProduct.sub_prd_initial_qte,
                                                        prd_cd: product.prd_cd
                                                    }).then(function () {
                                                        defer.resolve();
                                                    }))
                                                }

                                            });
                                        } else {

                                            arraySubProducts.forEach(function (sub) {
                                                promises.push(RequestService.postJsonRequest('product/createSubProduct', {
                                                    'sub_prd_description': sub.prd_description,
                                                    'sub_prd_discount': sub.prd_discount,
                                                    'sub_prd_initial_qte': sub.quantity,
                                                    prd_cd: product.prd_cd
                                                }).then(function (res) {

                                                    defer.resolve();
                                                }));
                                            });
                                        }
                                    }


                                    $q.all(promises).then(function () {
                                        RequestService.postJsonRequest('product/findProductById', {'prd_cd': product.prd_cd}).then(function (res) {
                                            var highlights = [];
                                            var fineprints = [];

                                            if (res.details.length > 0) {
                                                res.details.forEach(function (detail) {

                                                    if (detail.prd_dtl_type == 'fineprint') {
                                                        fineprints.push(detail)

                                                    } else if (detail.prd_dtl_type == 'highlight') {
                                                        highlights.push(detail);
                                                    }

                                                });

                                                res.details.fineprint = fineprints;
                                                res.details.highlight = highlights;

                                            }

                                            $scope.products.push(res);

                                        });
                                    });

                                }
                            })
                        }

                    });

                    $uibModalInstance.close();
                }

            } else {


                var params = {
                    'cmp_cd': $scope.product.company.cmp_cd,
                    'prd_title': $scope.product.prd_title,
                    'prd_description': $scope.product.prd_description,
                    'prd_original_price': $scope.product.prd_original_price,
                    'prd_new_price': $scope.product.prd_new_price,
                    'prd_availability': $scope.product.prd_availability,
                    'prd_measure_unit': $scope.product.prd_measure_unit,
                    'prd_cd': $scope.product.prd_cd
                }

                RequestService.postJsonRequest('product/updateProduct', params).then(function (product) {


                    if (product[0].result == undefined) {

                        notify({
                            message: "Product Updated Successfully!",
                            classes: 'alert-success',
                            position: 'center',
                            duration: 2000
                        });


                        var textContent = angular.element('#product_category')[0].textContent.split("×");
                        textContent.forEach(function (result) {
                            categoryNames = result.split("/");
                            $rootScope.categories.forEach(function (category) {
                                if ((category.cat_group == categoryNames[0]) && (category.cat_name == categoryNames[1])) {
                                    $scope.selectedCategories.push(category);
                                }
                            });
                        });

                        clearPromises.push(RequestService.postJsonRequest('productCategory/deleteAllProductCategories', {'prd_cd': product[0].prd_cd}).then(function (res) {
                            defer.resolve();
                        }));

                        $scope.product.details.forEach(function (fp) {
                            if (fp.prd_dtl_cd != undefined) {
                                clearPromises.push(RequestService.postJsonRequest('product/deleteProductDetails', {'prd_dtl_cd': fp.prd_dtl_cd}).then(function (res) {
                                    defer.resolve();
                                }));
                            }
                        });

                        var sub_product_parent = $(".sub_product_parent");
                        $(sub_product_parent).find("input").each(function () {

                            switch (i) {
                                case 0:
                                    description = $(this).val();
                                    break;
                                case 1:
                                    discount = $(this).val();
                                    break;
                                case 2:
                                    quantity = $(this).val();
                                    arraySubProducts.push({
                                        'prd_description': description,
                                        'prd_discount': discount,
                                        'quantity': quantity
                                    });
                                    break;

                            }
                            if (i == 2) {
                                i = 0;
                            } else {
                                i++;
                            }

                        });


                        if (arraySubProducts.length > 0) {

                            if ($scope.product.sub_products.length > 0) {

                                $scope.product.sub_products.forEach(function (subProduct) {
                                    if (subProduct.sub_prd_cd == undefined) {
                                        promises.push(RequestService.postJsonRequest('product/createSubProduct', {
                                            'sub_prd_description': subProduct.sub_prd_description,
                                            'sub_prd_discount': subProduct.sub_prd_discount,
                                            'sub_prd_initial_qte': subProduct.sub_prd_initial_qte,
                                            prd_cd: $scope.product.prd_cd
                                        }).then(function () {
                                            defer.resolve();
                                        }))
                                    }

                                });
                            } else {

                                arraySubProducts.forEach(function (sub) {
                                    promises.push(RequestService.postJsonRequest('product/createSubProduct', {
                                        'sub_prd_description': sub.prd_description,
                                        'sub_prd_discount': sub.prd_discount,
                                        'sub_prd_initial_qte': sub.quantity,
                                        prd_cd: $scope.product.prd_cd
                                    }).then(function (res) {

                                        defer.resolve();
                                    }));
                                });
                            }
                        }


                        $q.all(clearPromises).then(function () {

                            $scope.selectedCategories.forEach(function (category) {
                                promises.push(assignCategoryToProduct(category, product[0], RequestService, defer));

                            });

                            var fineprint_parent = $(".fineprint_parent");
                            $(fineprint_parent).find("input").each(function () {
                                promises.push(createFineprint(product[0], $(this).val(), RequestService, defer));
                            });

                            var highlight_parent = $(".highlight_parent");
                            $(highlight_parent).find("input").each(function () {

                                promises.push(createHighlight(product[0], $(this).val(), RequestService, defer));

                            });

                            $q.all(promises).then(function () {

                                RequestService.postJsonRequest('product/findProductById', {'prd_cd': product[0].prd_cd}).then(function (res) {
                                    var highlights = [];
                                    var fineprints = [];

                                    if (res.details.length > 0) {
                                        res.details.forEach(function (detail) {

                                            if (detail.prd_dtl_type == 'fineprint') {
                                                fineprints.push(detail)

                                            } else if (detail.prd_dtl_type == 'highlight') {
                                                highlights.push(detail);
                                            }

                                        });

                                        res.details.fineprint = fineprints;
                                        res.details.highlight = highlights;

                                    }


                                    for (var i = 0; i < $scope.products.length; i++) {

                                        if ($scope.products[i].prd_cd == res.prd_cd) {
                                            $scope.products[i] = res;
                                        }

                                    }
                                    $uibModalInstance.close();

                                });
                            });

                        })


                    } else {
                        notify({
                            message: "an Error occurred!",
                            classes: 'alert-warning',
                            position: 'center',
                            duration: 2000
                        });

                    }
                });


            }


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
                if ($scope.products[i].prd_cd === id) {

                    if ($scope.products[i].rates !== undefined) {
                        for (var j = 0; j < $scope.products[i].rates.length; j++) {
                            $scope.total += $scope.products[i].rates[j].prd_rte_rate;
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
    function categoryController($scope, RequestService, $rootScope, session) {


        var params = {
            'cmp_cd': session.getUser().user.cmp_cd
        };

        // retrieve all categories from api
        RequestService.postJsonRequest('category/findCategoryByCompanyId', params).then(function (result) {
            $scope.categories = result;
            $rootScope.categories = $scope.categories

            // watch changes in product.product_category model
            $scope.$watch('product.product_category', function () {

                if ($scope.categories !== undefined) {
                    if ($scope.product !== undefined) {

                        if ($scope.product.product_category !== undefined) {
                            for (var i = 0; i < $scope.categories.length; i++) {
                                for (var j = 0; j < $scope.product.product_category.length; j++) {
                                    if ($scope.product.product_category[j].category == $scope.categories[i].cat_cd) {
                                        $scope.product.product_category[j].cat_name = $scope.categories[i].cat_name;
                                        $scope.product.product_category[j].cat_group = $scope.categories[i].cat_group;
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
    function dropletController($scope, $timeout, RequestService) {

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
                    RequestService.postJsonRequest('product/createProductImage', {
                        'prd_cd': $scope.product.prd_cd,
                        'prd_img_url': "http://localhost:3507/server/uploads/" + response.files.file[i].name
                    }).then(function (result) {
                        if (result.prd_img_url == "http://localhost:3507/server/uploads/" + response.files.file[i].name) {
                            $scope.product.product_image.push({prd_img_url: "http://localhost:3507/server/uploads/" + response.files.file[i].name});
                        }
                    });

                }

            } else {

                if ($scope.product !== undefined) {

                    RequestService.postJsonRequest('product/createProductImage', {
                        'prd_cd': $scope.product.prd_cd,
                        'prd_img_url': "http://localhost:3507/server/uploads/" + response.files.file.name
                    }).then(function (result) {
                        if (result.prd_img_url == "http://localhost:3507/server/uploads/" + response.files.file.name) {
                            $scope.product.product_image.push({prd_img_url: "http://localhost:3507/server/uploads/" + response.files.file.name});
                        }
                    });
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

    function productGalleryController($scope) {

        $scope.currentPage = 1;
        $scope.itemsPerPage = 5;
        $scope.checkedItems = [];
        $scope.images = [];

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

    function createFineprint(product, val, RequestService, defer) {
        RequestService.postJsonRequest('product/createProductDetails', {

            'prd_cd': product.prd_cd,
            'prd_dtl_description': val,
            'prd_dtl_type': 'fineprint'

        }).then(function (result) {
            defer.resolve();

        })
    }

    function createHighlight(product, val, RequestService, defer) {
        RequestService.postJsonRequest('product/createProductDetails', {

            'prd_cd': product.prd_cd,
            'prd_dtl_description': val,
            'prd_dtl_type': 'highlight'

        }).then(function (result) {

            defer.resolve();

        })
    }

    function assignCategoryToProduct(category, product, RequestService, defer) {
        RequestService.postJsonRequest('productCategory/AssignCategoryToProduct', {
            'cat_cd': category.cat_cd,
            'prd_cd': product.prd_cd
        })
            .then(function (result) {
                defer.resolve();
            })
    }
})();

