(function () {
    'use strict';

    /**
     * module app.content
     * @module app.content
     */

    angular
        .module('app.content', ['hSweetAlert', 'bootstrapLightbox'])
        .controller('ContentCtrl', contentController)
        .controller('ModalContentCtrl', modalController)
        .controller('ModalContentInstanceCtrl', modalInstanceController)
        .controller('GalleryCtrl', galleryController)
        .controller('ContentAlertCtrl', alertController)

    /**
     *
     * @method contentController
     * @param {object} $scope
     * @param {service} ContentService
     */
    function contentController($scope, RequestService, $rootScope) {
        $scope.contents = [];
        var params = {
            "cmp_cd": $rootScope.company
        };

        $scope.contentTypes = [];


        RequestService.postJsonRequest('content/findContentByCompanyId', params).then(function (data) {

            if (data.result == "this model doesn't exist") {

            } else if (data.result == undefined) {
                data.forEach(function (content) {

                    if (content.cnt_type.lkp_value != 'voucher') {
                        $scope.contents.push(content);
                    }
                })
            }



        });

        RequestService.postJsonRequest('content/getContentType', {"lkp_category": "content_type"}).then(function (data) {
            $scope.contentTypes = data;
        });


        $scope.removeContentRow = function (id) {

            var identifier = {
                "cnt_cd": id
            };

            RequestService.postJsonRequest('content/deleteContent', identifier).then(function (data) {

                if (data.result == "deleted successfully") {
                    var index = -1;
                    for (var i = 0; i < $scope.contents.length; i++) {
                        if ($scope.contents[i].cnt_cd === id) {
                            index = i;
                            break;
                        }
                    }
                    if (index === -1) {
                        alert("Something gone wrong");
                    }
                    $scope.contents.splice(index, 1);
                } else {

                    alert("Something gone wrong");

                }

            });


        };

    }

    /**
     * modal controller
     * @method modalController
     * @param {object} $scope
     * @param {object} $uibModal
     * @param {service} ZoneService
     */
    function modalController($scope, $uibModal) {

        $scope.animationsEnabled = true;

        /**
         * open modal
         * @method open
         * @param {string} size size of modal, leave empty for default size
         * @param {string} tpl name of the template
         */
        $scope.open = function (size, tpl, content) {
            var uibModalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: tpl,
                controller: 'ModalContentInstanceCtrl',
                size: size,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    contents: function () {
                        return $scope.contents;
                    },
                    content: function () {
                        return content;
                    }
                }
            });
        };
    }

    /**
     * @method modalInstanceController
     * @param {object} $scope
     * @param {object} $modalInstance
     */
    function modalInstanceController($scope, $uibModalInstance, content, $rootScope, RequestService, contents) {

        $scope.content = content;

        $scope.contents = contents;
        var is_ds_content;
        var content_url;

        /**
         * press ok in modal
         * @method ok
         */
        $scope.ok = function () {

            if (content == undefined) {
                if (angular.element('#content_title').val() == '' || angular.element('#content_content').val() == '') {
                    alert('some information are required');
                } else {

                    if ($rootScope.checkedItems == undefined) {
                        is_ds_content = false;
                        content_url = angular.element('#content_url').val();
                    } else {
                        if ($rootScope.checkedItems != -1) {

                            is_ds_content = true;

                            content_url = $rootScope.images[$rootScope.checkedItems].url;
                        } else {
                            is_ds_content = false;
                            content_url = angular.element('#content_url').val();
                        }
                    }

                    var params = {
                        'lkp_cd': angular.element('#content_type').val(),
                        'cnt_title': angular.element('#content_title').val(),
                        'cnt_content': angular.element('#content_content').val(),
                        'cnt_url': content_url,
                        'cnt_type': angular.element('#content_type').val(),
                        'is_ds_content': is_ds_content,
                        'cmp_cd': $rootScope.company
                    };

                    RequestService.postJsonRequest('content/createContent', params).then(function (content) {
                        $scope.contents.push(content);
                    });

                    $uibModalInstance.close();
                }
            } else {

                if ($rootScope.checkedItems == undefined) {

                    is_ds_content = false;
                    content_url = angular.element('#content_url').val();

                } else {

                    if ($rootScope.checkedItems != -1) {

                        is_ds_content = true;

                        content_url = $rootScope.images[$rootScope.checkedItems].url;

                    } else {

                        is_ds_content = false;
                        content_url = angular.element('#content_url').val();

                    }
                }

                var params = {
                    'lkp_cd': angular.element('#content_type').val(),
                    'cnt_title': angular.element('#content_title').val(),
                    'cnt_content': angular.element('#content_content').val(),
                    'cnt_url': content_url,
                    'cnt_type': angular.element('#content_type').val(),
                    'is_ds_content': is_ds_content,
                    'cmp_cd': $rootScope.company,
                    'cnt_cd': $scope.content.cnt_cd
                };

                RequestService.postJsonRequest('content/updateContent', params).then(function (result) {

                    for (var i = 0; i < $scope.contents.length; i++) {
                        if ($scope.contents[i].cnt_cd == result[0].cnt_cd) {
                            $scope.contents[i] = result[0];
                        }
                    }

                });

                $uibModalInstance.close();
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

    function galleryController($scope, Lightbox, ContentService, $rootScope) {

        $scope.currentPage = 1;
        $scope.itemsPerPage = 5;
        $scope.checkedItems = [];
        $scope.images = [];
        $scope.checkedValue = -1;

        ContentService.getDSContent(function (data) {
            $scope.images = data;
            $scope.totalItems = $scope.images.length;
            $rootScope.images = $scope.images;

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
            var paginationIndex;


            if (currentPage == 1) {
                paginationIndex = index;

            } else if (currentPage > 1) {

                paginationIndex = index + ((currentPage - 1) * itemPerPage);

            }

            if ($scope.checkedValue != -1) {

                if (paginationIndex == $scope.checkedValue) {
                    $scope.checkedValue = -1;
                } else {

                    if (currentPage == 1) {
                        paginationIndex = index;
                        $scope.checkedValue = paginationIndex;
                        $scope.checkedItems = paginationIndex;

                    } else if (currentPage > 1) {

                        paginationIndex = index + ((currentPage - 1) * itemPerPage);
                        $scope.checkedValue = paginationIndex;
                        $scope.checkedItems = paginationIndex;

                    }

                }

            } else {
                if (currentPage == 1) {
                    paginationIndex = index;
                    $scope.checkedValue = paginationIndex;
                    $scope.checkedItems = paginationIndex;

                } else if (currentPage > 1) {

                    paginationIndex = index + ((currentPage - 1) * itemPerPage);
                    $scope.checkedValue = paginationIndex;
                    $scope.checkedItems = paginationIndex;

                }

            }


            $rootScope.checkedItems = $scope.checkedValue;
        }

        $scope.openLightboxModal = function (index, itemPerPage, currentPage) {

            if (currentPage == 1) {
                var paginationIndex = index;

            } else if (currentPage > 1) {

                var paginationIndex = index + ((currentPage - 1) * itemPerPage);
            }

            Lightbox.openModal($scope.images, paginationIndex);
        };
    }

    /**
     * Description
     * @method modalInstanceController
     * @param {object} $scope
     * @param {object} sweet
     */
    function alertController($scope, sweet) {

        $scope.confirmCancel = function () {
            sweet.show({
                title: 'Warning',
                text: 'Discard changes',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#D32F2F',
                confirmButtonText: 'Discard',
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    sweet.show('Discarded!', '', 'success');
                    $scope.cancel();
                } else {
                    sweet.show('Cancelled', '', 'error');
                }
            });

        };
    }

})();

