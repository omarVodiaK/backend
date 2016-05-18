(function () {
    'use strict';

    /**
     * module app.content
     * @module app.content
     */

    angular
        .module('app.content', [])
        .controller('ContentCtrl', contentController)
        .controller('ModalContentCtrl', modalController)
        .controller('ModalContentInstanceCtrl', modalInstanceController)
        .controller('GalleryCtrl', galleryController)
        .controller('ContentAlertCtrl', alertController);

    /**
     *
     * @method contentController
     * @param {object} $scope
     * @param {service} RequestService
     * @param {object} session
     * @param {object} notify
     */
    function contentController($scope, RequestService, session, notify) {

        $scope.contents = [];
        $scope.contentTypes = [];

        RequestService.postJsonRequest('content/findContentByCompanyId', {"cmp_cd": session.getUser().user.cmp_cd}).then(function (data) {

            if (data.result == "this model doesn't exist") {
                notify({
                    message: "You have 0 Content!",
                    classes: 'alert-info',
                    position: 'center',
                    duration: 2000
                });
            } else if (data.result == undefined) {

                data.forEach(function (content) {

                    if (content.cnt_type.lkp_value != 'voucher') {
                        $scope.contents.push(content);
                    }
                });
            }

        });

        RequestService.postJsonRequest('content/getContentType', {"lkp_category": "content_type"}).then(function (data) {
            $scope.contentTypes = data;
        });

        $scope.youtubeThumb = function (url) {
            var video, results;

            if (url === null) {
                return '';
            }

            results = url.match('[\\?&]v=([^&#]*)');
            video = (results === null) ? url : results[1];

            return 'http://img.youtube.com/vi/' + video + '/0.jpg';
        };

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
                        notify({
                            message: "Something gone wrong!",
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
                    $scope.contents.splice(index, 1);

                } else {

                    notify({
                        message: "Something gone wrong!",
                        classes: 'alert-warning',
                        position: 'center',
                        duration: 2000
                    });

                }

            });


        };

    }

    /**
     * modal controller
     * @method modalController
     * @param {object} $scope
     * @param {object} $uibModal
     */
    function modalController($scope, $uibModal) {

        $scope.animationsEnabled = true;

        /**
         * open modal
         * @method open
         * @param {string} size size of modal, leave empty for default size
         * @param {string} tpl name of the template
         * @param {object} content
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
     * @description create/update content
     * @method modalInstanceController
     * @param {object} $scope
     * @param $uibModalInstance
     * @param content
     * @param $rootScope
     * @param RequestService
     * @param contents
     * @param session
     * @param notify
     */
    function modalInstanceController($scope, $uibModalInstance, content, $rootScope, RequestService, contents, session, notify) {

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

                    notify({
                        message: "some information are required!",
                        classes: 'alert-warning',
                        position: 'center',
                        duration: 2000
                    });

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
                        'cmp_cd': session.getUser().user.cmp_cd
                    };

                    RequestService.postJsonRequest('content/createContent', params).then(function (content) {
                        if (content.result != undefined) {
                            notify({
                                message: "Something gone wrong!",
                                classes: 'alert-warning',
                                position: 'center',
                                duration: 2000
                            });
                        } else {

                            notify({
                                message: "Created Successfully!",
                                classes: 'alert-success',
                                position: 'center',
                                duration: 2000
                            });

                            $scope.contents.push(content);
                        }
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
                    'cmp_cd': session.getUser().user.cmp_cd,
                    'cnt_cd': $scope.content.cnt_cd
                };

                RequestService.postJsonRequest('content/updateContent', params).then(function (result) {
                    if (result.result == undefined) {

                        for (var i = 0; i < $scope.contents.length; i++) {

                            if ($scope.contents[i].cnt_cd == result[0].cnt_cd) {
                                $scope.contents[i] = result[0];
                            }

                        }

                        notify({
                            message: "Updated Successfully!",
                            classes: 'alert-success',
                            position: 'center',
                            duration: 2000
                        });

                    } else {

                        notify({
                            message: "Something gone wrong!",
                            classes: 'alert-warning',
                            position: 'center',
                            duration: 2000
                        });
                    }

                });

                $uibModalInstance.close();
            }
        };

        /**
         * @description dismiss modal
         * @method cancel
         */
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    /**
     * @description get Digital Signage content, get items index, open lightboxModal event
     * @method galleryController
     * @param {object} $scope
     * @param {object} Lightbox
     * @param {service} ContentService
     * @param {object} $rootScope
     */
    function galleryController($scope, Lightbox, ContentService, $rootScope) {

        $scope.currentPage = 1;
        $scope.itemsPerPage = 5;
        $scope.checkedItems = [];
        $scope.images = [];
        $scope.checkedValue = -1;

        // TODO integrate with digital signage
        ContentService.getDSContent(function (data) {
            $scope.images = data;
            $scope.totalItems = $scope.images.length;
            $rootScope.images = $scope.images;
        });

        $scope.getIndex = function (index, itemPerPage, currentPage) {

            var match = false;
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
        };

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
        };

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
     * Description display confirmation message for save and cancel actions
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

