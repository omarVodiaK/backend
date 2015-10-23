(function () {
    'use strict';

    /**
     * module app.content
     * @module app.content
     */

    angular
        .module('app.content', ['bootstrapLightbox'])
        .controller('ContentCtrl', contentController)
        .controller('ModalContentCtrl', modalController)
        .controller('ModalContentInstanceCtrl', modalInstanceController)
        .controller('GalleryCtrl', galleryController)


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


    function galleryController($scope, Lightbox) {

        $scope.currentPage = 1;
        $scope.itemsPerPage = 5;


        $scope.images = [
            {
                'type': 'video',
                'url': 'https://www.youtube.com/watch?v=N7TkK2joi4I',
                'thumbUrl': 'https://i.ytimg.com/vi/N7TkK2joi4I/1.jpg'
            },
            {
                'url': 'https://farm8.staticflickr.com/7300/12807911134_ff56d1fb3b_b.jpg',
                'thumbUrl': 'https://farm8.staticflickr.com/7300/12807911134_ff56d1fb3b_s.jpg'
            },
            {
                'url': 'https://farm1.staticflickr.com/400/20228789791_52fb84917f_b.jpg',
                'thumbUrl': 'https://farm1.staticflickr.com/400/20228789791_52fb84917f_s.jpg',
                'caption': 'The left and right arrow keys are binded for navigation. The escape key for closing the modal is binded by AngularUI Bootstrap.'
            },
            {
                'url': 'https://farm1.staticflickr.com/260/20185156095_912c2714ef_b.jpg',
                'thumbUrl': 'https://farm1.staticflickr.com/260/20185156095_912c2714ef_s.jpg'
            },
            {
                'url': 'https://farm6.staticflickr.com/5757/20359334789_57316968ed_m.jpg',
                'thumbUrl': 'https://farm6.staticflickr.com/5757/20359334789_57316968ed_s.jpg',
                'caption': 'Default minimum modal dimensions (400x200) apply for this image (240x95).'
            },
            {
                'url': 'https://farm1.staticflickr.com/359/18741723375_28c89372d7_c.jpg',
                'thumbUrl': 'https://farm1.staticflickr.com/359/18741723375_28c89372d7_s.jpg'
            },
            {
                'url': 'https://farm6.staticflickr.com/5606/15425945368_6f6ae945fc.jpg',
                'thumbUrl': 'https://farm6.staticflickr.com/5606/15425945368_6f6ae945fc_s.jpg'
            },
            {
                'url': 'https://farm9.staticflickr.com/8033/8010849891_3f029d68b3_c.jpg',
                'thumbUrl': 'https://farm9.staticflickr.com/8033/8010849891_3f029d68b3_s.jpg'
            },
            {
                'url': 'https://farm1.staticflickr.com/553/18990336631_4856e7e02c_h.jpg',
                'thumbUrl': 'https://farm1.staticflickr.com/553/18990336631_0186ac9e3e_s.jpg'
            },
            {
                'url': 'https://farm9.staticflickr.com/8736/16599799789_458891e47f_h.jpg',
                'thumbUrl': 'https://farm9.staticflickr.com/8736/16599799789_2fe489b6df_s.jpg',
                'caption': 'The next image does not exist and shows how loading errors are handled by default.'
            },
            {
                'url': 'https://farm9.staticflickr.com/8573/16800210195_a8af2ba1bb_h.jpg',
                'thumbUrl': 'https://farm9.staticflickr.com/8573/16800210195_85ab79b777_s.jpg',
                'caption': 'The previous image does not exist and shows how loading errors are handled by default.'
            },
            {
                'type': 'video',
                'url': 'https://www.youtube.com/watch?v=N7TkK2joi4I',
                'thumbUrl': 'https://i.ytimg.com/vi/N7TkK2joi4I/1.jpg'
            }
        ];

        $scope.totalItems = $scope.images.length;

        $scope.openLightboxModal = function (index, i, c) {

            if (c == 1) {
                var paginationIndex = index;

            } else if (c > 1) {

                var paginationIndex = index + ((c - 1) * i);
            }

            Lightbox.openModal($scope.images, paginationIndex);
        };
    }

})();

