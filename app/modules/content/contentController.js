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
    function contentController($scope, ContentService) {

        $scope.contentTypes = [];

        ContentService.getContent(function (data) {
            $scope.contents = data;
        });

        ContentService.getContentTypes(function (data) {
            $scope.contentTypes = data;
        });

        $scope.removeContentRow = function (id) {
            var index = -1;
            for (var i = 0; i < $scope.contents.length; i++) {
                if ($scope.contents[i]._id === id) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                alert("Something gone wrong");
            }
            $scope.contents.splice(index, 1);
        };
        $scope.getContentTypeName = function (id) {
            var data = $scope.contentTypes;
            for (var i = 0; i < data.length; i++) {
                if (data[i]._id == id) {
                    var result = data[i].cht_category + " " + data[i].cht_name + " " + data[i].cht_value;
                    return result;
                }
            }
        }

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
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: tpl,
                controller: 'ModalContentInstanceCtrl',
                size: size,
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
    function modalInstanceController($scope, $modalInstance, content) {

        $scope.content = content;

        /**
         * press ok in modal
         * @method ok
         */
        $scope.ok = function () {
            $modalInstance.close();
        };

        /**
         * cancel modal
         * @method cancel
         */
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }


    function galleryController($scope, Lightbox, ContentService) {

        $scope.currentPage = 1;
        $scope.itemsPerPage = 5;
        $scope.checkedItems = [];
        $scope.images = [];


        ContentService.getDSContent(function (data) {
            $scope.images = data;
            $scope.totalItems = $scope.images.length;
        });

        $scope.getIndex = function (index, i, c) {
            var match = false
            if (c == 1) {
                var paginationIndex = index;

            } else if (c > 1) {

                var paginationIndex = index + ((c - 1) * i);
            }

            for (var i = 0; i < $scope.checkedItems.length; i++) {
                if (paginationIndex == $scope.checkedItems[i]) {

                    match = true;
                    break;
                }
            }
            return match;
        }

        $scope.saveChecked = function (index, i, c) {
            if (c == 1) {
                var paginationIndex = index;

            } else if (c > 1) {

                var paginationIndex = index + ((c - 1) * i);
            }

            $scope.checkedItems.push(paginationIndex);
        }

        $scope.openLightboxModal = function (index, i, c) {

            if (c == 1) {
                var paginationIndex = index;

            } else if (c > 1) {

                var paginationIndex = index + ((c - 1) * i);
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
            console.log('here')
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

