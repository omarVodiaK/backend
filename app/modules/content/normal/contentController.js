(function () {
    'use strict';

    /**
     * module app.content
     * @module app.content
     */

    angular
        .module('app.content', ['app.config'])
        .controller('ContentCtrl', contentController)
        .controller('ModalContentCtrl', modalController)
        .controller('ModalContentInstanceCtrl', modalInstanceController)
        .controller('GalleryCtrl', galleryController)
        .controller('ContentAlertCtrl', alertController)
        .controller('contentDropletCtrl', dropletController);

    /**
     * @description load content and content type from beacon API, delete content and display youtube thumbnails
     * @method contentController
     * @param {object} $scope
     * @param {service} RequestService
     * @param {object} session
     * @param {object} notify
     * @param {service} ContentService
     */
    function contentController($scope, RequestService, session, notify, ContentService) {

        $scope.contents = [];
        $scope.contentTypes = [];
        $scope.tag = [];

        var contentTag = ContentService.getContentTag();

        contentTag.then(function (data) {

            if (data.result == undefined) {

                if (data.length > 0) {
                    data.forEach(function (d) {
                        $scope.tag.push(d);
                    });
                }
            }

        });

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

                    RequestService.postJsonRequest('contentTag/deleteContentTagByContentId', identifier).then(function (deleteResult) {
                    });

                    var index = -1;

                    for (var i = 0; i < $scope.contents.length; i++) {

                        if ($scope.contents[i].cnt_cd === id) {
                            index = i;
                            break;
                        }

                    }

                    if (index === -1) {

                        notify({
                            message: "Something went wrong!",
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
                        message: "Something went wrong!",
                        classes: 'alert-warning',
                        position: 'center',
                        duration: 2000
                    });
                }

            });
        };

    }

    /**
     * @description modal controller
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
        $scope.open = function (size, tpl, content, tags) {

            if (content != undefined) {

                if (tags != undefined) {

                    tags.forEach(function (tag) {

                        if (content.tag != undefined) {

                            if (content.tag.length > 0) {

                                content.tag.forEach(function (c) {
                                    if (c.tag_cd == tag.tag_cd) {
                                        c.tag_name = tag.tag_name;
                                    }
                                });

                            }

                        }

                    });
                }

            }

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
                    },
                    tags: function () {
                        return tags;
                    }
                }
            });
        };
    }

    /**
     * @description create/update content
     * @method modalInstanceController
     * @param {object} $scope
     * @param {object} $uibModalInstance
     * @param {object} content
     * @param {object} $rootScope
     * @param {service} RequestService
     * @param {array} contents
     * @param {object} session
     * @param {object} notify
     * @param {object} $sce
     * @param {service} CDNService
     * @param {CONSTANT} CDN_CONFIG
     */
    function modalInstanceController($scope, $uibModalInstance, content, $rootScope, RequestService, contents, session, notify, $sce, CDNService, CDN_CONFIG) {

        if (content != undefined) {
            $scope.content = content;
        }

        $scope.contents = contents;
        var is_ds_content;
        var content_url;

        /**
         * press ok in modal
         * @method ok
         */
        $scope.ok = function () {

            var med_cd = null;
            // save a content
            if (content == undefined) {

                if (angular.element('#content_title').val() == '' || angular.element('#content_content').val() == '') {

                    notify({
                        message: "some information are required!",
                        classes: 'alert-warning',
                        position: 'center',
                        duration: 2000
                    });

                } else {

                    //Check if any item is selected from the DS Media list
                    if ($rootScope.checkedItems == undefined) {

                        is_ds_content = false;

                        if (CDNService.getCDNResult() == '') {

                            if (angular.element('#content_url').val() != '') {

                                content_url = angular.element('#content_url').val();
                            }

                        } else if (CDNService.getCDNResult() != '') {

                            content_url = CDN_CONFIG.HOST + ":" + CDN_CONFIG.PORT + "/cdn" + CDNService.getCDNResult()[0].med_url + "?token=" + session.getAccessToken();
                        }

                    } else {

                        if ($rootScope.checkedItems != -1) {

                            is_ds_content = true;
                            content_url = $sce.valueOf($rootScope.images[$rootScope.checkedItems].med_url);
                            med_cd = $rootScope.images[$rootScope.checkedItems].med_cd;

                        } else {

                            is_ds_content = false;

                            if (CDNService.getCDNResult() == '') {

                                if (angular.element('#content_url').val() != '') {

                                    content_url = angular.element('#content_url').val();
                                }

                            } else if (CDNService.getCDNResult() != '') {

                                content_url = CDN_CONFIG.HOST + ":" + CDN_CONFIG.PORT + "/cdn" + CDNService.getCDNResult()[0].med_url + "?token=" + session.getAccessToken();
                            }
                        }
                    }

                    var params = {
                        'lkp_cd': angular.element('#content_type').val(),
                        'cnt_title': angular.element('#content_title').val(),
                        'cnt_content': angular.element('#content_content').val(),
                        'cnt_url': content_url,
                        'cnt_type': angular.element('#content_type').val(),
                        'is_ds_content': is_ds_content,
                        'med_cd': med_cd,
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
                            if ($scope.content.tag != undefined) {
                                $scope.content.tag.forEach(function (t) {
                                    RequestService.postJsonRequest('contentTag/createContentTag', {
                                        cnt_cd: content.cnt_cd,
                                        tag_cd: t.tag_cd
                                    }).then(function (contentTag) {
                                    })
                                })
                            }


                            notify({
                                message: "Created Successfully!",
                                classes: 'alert-success',
                                position: 'center',
                                duration: 2000
                            });

                            $scope.contents.push(content);

                            $uibModalInstance.close();
                        }

                    });

                    CDNService.setCDNResult('');
                    $uibModalInstance.close();
                }
            }
            // update a content
            else {
                if ($rootScope.checkedItems == undefined) {

                    is_ds_content = false;

                    if (CDNService.getCDNResult() == '') {

                        if (angular.element('#content_url').val() != '') {

                            content_url = angular.element('#content_url').val();
                        }

                    } else if (CDNService.getCDNResult() != '') {

                        content_url = CDN_CONFIG.HOST + ":" + CDN_CONFIG.PORT + "/cdn" + CDNService.getCDNResult()[0].med_url + "?token=" + session.getAccessToken();

                    }

                } else {

                    if ($rootScope.checkedItems != -1) {

                        is_ds_content = true;

                        content_url = $sce.valueOf($rootScope.images[$rootScope.checkedItems].med_url);
                        med_cd = $rootScope.images[$rootScope.checkedItems].med_cd;

                    } else {

                        is_ds_content = false;

                        if (CDNService.getCDNResult() == '') {

                            if (angular.element('#content_url').val() != '') {

                                content_url = angular.element('#content_url').val();
                            }

                        } else if (CDNService.getCDNResult() != '') {

                            content_url = CDN_CONFIG.HOST + ":" + CDN_CONFIG.PORT + "/cdn" + CDNService.getCDNResult()[0].med_url + "?token=" + session.getAccessToken();
                        }
                    }
                }

                var params = {
                    'lkp_cd': angular.element('#content_type').val(),
                    'cnt_title': angular.element('#content_title').val(),
                    'cnt_content': angular.element('#content_content').val(),
                    'cnt_url': content_url,
                    'cnt_type': angular.element('#content_type').val(),
                    'is_ds_content': is_ds_content,
                    'med_cd': med_cd,
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

                        if ($scope.content.tag != undefined) {

                            if ($scope.content.tag.length == 0) {

                                RequestService.postJsonRequest('contentTag/deleteContentTagByContentId', {cnt_cd: $scope.content.cnt_cd}).then(function (contentTag) {

                                });

                            } else {

                                RequestService.postJsonRequest('contentTag/deleteContentTagByContentId', {cnt_cd: $scope.content.cnt_cd}).then(function (contentTag) {

                                    $scope.content.tag.forEach(function (t) {

                                        RequestService.postJsonRequest('contentTag/createContentTag', {
                                            cnt_cd: content.cnt_cd,
                                            tag_cd: t.tag_cd
                                        }).then(function (contentTag) {
                                        });

                                    });

                                });


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

                CDNService.setCDNResult('');
                $uibModalInstance.close();
            }
        };

        /**
         * @description dismiss modal
         * @method cancel
         */
        $scope.cancel = function () {
            CDNService.setCDNResult('');
            $uibModalInstance.dismiss('cancel');
        };
    }

    /**
     * @description get Digital Signage content, get items index, open lightboxModal event
     * @method galleryController
     * @param {object} $scope
     * @param {object} Lightbox
     * @param {object} $rootScope
     * @param {object} session
     * @param {service} ContentService
     */
    function galleryController($scope, Lightbox, $rootScope, session, ContentService, $sce, CDN_CONFIG) {

        $scope.currentPage = 1;
        $scope.itemsPerPage = 5;
        $scope.checkedItems = [];
        $scope.images = [];
        $scope.checkedValue = -1;

        // TODO resolve DS Media list display
        var dsMedia = ContentService.getDSMedia();

        var token = '?token=' + session.getAccessToken();

        dsMedia.then(function (data) {
            if (data !== undefined) {
                if (data.response !== undefined) {
                    if (data.response.length != undefined) {

                        data.response.forEach(function (d) {

                            d.checked = false;
                            d.med_url = $sce.trustAsResourceUrl(CDN_CONFIG.HOST + ":" + CDN_CONFIG.PORT + "/cdn" + d.med_url + token);
                            d.url = $sce.valueOf(d.med_url);
                            $scope.images.push(d);

                        });

                        $scope.totalItems = $scope.images.length;
                        $rootScope.images = $scope.images;
                    } else {
                        if (data.status == -1) {
                            notify({
                                message: "You have 0 DS Content!",
                                classes: 'alert-info',
                                position: 'center',
                                duration: 2000
                            });
                        }
                    }
                }

            }
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

        $scope.saveChecked = function (index, itemPerPage, currentPage, images) {

            var paginationIndex;

            if (currentPage == 1) {

                paginationIndex = index;

            } else if (currentPage > 1) {

                paginationIndex = index + ((currentPage - 1) * itemPerPage);

            }

            angular.forEach(images, function (image, i) {
                if (paginationIndex != i)
                    image.checked = false;
            });

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
     * @description controller to handle image upload in ng-droplet
     * @method dropletController
     * @param {object} $scope
     * @param {object} $timeout
     * @param {object} session
     * @param {CONSTANT} APPLICATION_ID
     * @param {service} CDNService
     * */
    function dropletController($scope, $timeout, session, APPLICATION_ID, CDNService) {

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

            $scope.interface.allowedExtensions([/.+/]);
            $scope.interface.useArray(false);
            $scope.interface.setRequestUrl("/cdn/upload/alternative");
            $scope.interface.setRequestHeaders({
                "x-access-token": session.getUser().token,
                "application_id": APPLICATION_ID
            });
            $scope.interface.defineHTTPSuccess([/2.{2}/]);

        });

        // Listen for when the files have been successfully uploaded.
        $scope.$on('$dropletSuccess', function onDropletSuccess(event, response, files) {

            $scope.uploadCount = files.length;
            $scope.success = true;

            $scope.$watch('interface', function () {

                CDNService.setCDNResult(response);
            });

            $timeout(function timeout() {

                console.log(response);
                $scope.success = false;
            }, 3000);

        });

        // Listen for when the files have failed to upload.
        $scope.$on('$dropletError', function onDropletError(event, response) {

            $scope.error = true;
            console.log(response);
            console.log(event);

            $timeout(function timeout() {
                $scope.error = false;
            }, 3000);

        });
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