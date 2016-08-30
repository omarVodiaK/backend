(function () {
    'use strict';

    /**
     * @description use app.content module created in content controller
     * @module app.content
     */
    angular
        .module('app.content')

        /**
         * @description replace html element with corresponding html depending in the data retrieved
         * @directive previewdirective
         */
        .directive('previewdirective', function () {
            return {
                template: '',
                replace: true,
                scope: {content: '='},  // pass content model as attribute to preview directive
                restrict: 'E', // restrict to element
                link: function (scope, element) {

                    scope.$watch('content', function () {

                        var replacementElement;

                        if (scope.content.cnt_url != '' && scope.content.cnt_type.lkp_value == 'image') {

                            replacementElement = angular.element('<img class="img-circle" src="' + scope.content.cnt_url + '"/>');
                            element.html('');
                            element.append(replacementElement);

                        } else if (scope.content.cnt_url == '' && scope.content.cnt_type.lkp_value == 'notification') {

                            replacementElement = angular.element('<img class="img-circle" src="assets/images/notification.png"/>');
                            element.html('');
                            element.append(replacementElement);

                        } else if (scope.content.cnt_url != '' && scope.content.cnt_type.lkp_value == 'video') {

                            if (validateYouTubeUrl(scope.content.cnt_url)) {

                                replacementElement = angular.element('<img class="img-circle" src="' + youtubeThumb(scope.content.cnt_url) + '"/>');
                                element.html('');
                                element.append(replacementElement);

                            } else {

                                replacementElement = angular.element('<img class="img-circle" src="assets/images/video-icon.png"/>');
                                element.html('');
                                element.append(replacementElement);
                            }

                        } else if (scope.content.cnt_url != '' && scope.content.cnt_type == 'audio') {

                            replacementElement = angular.element('<img class="img-circle" src="assets/images/audio-icon.png" />');
                            element.html('');
                            element.append(replacementElement);
                        }

                    });

                    // Draw image thumbnail from youtube url
                    function youtubeThumb(url) {
                        var video, results;

                        if (url === null) {
                            return '';
                        }

                        results = url.match('[\\?&]v=([^&#]*)');
                        video = (results === null) ? url : results[1];

                        return 'http://img.youtube.com/vi/' + video + '/0.jpg';
                    }

                    // Check if url is valid youtube link
                    function validateYouTubeUrl(url) {

                        if (url != undefined || url !== '') {

                            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
                            var match = url.match(regExp);

                            if (match && match[2].length == 11) {

                                // Do anything for being valid
                                return true;
                            } else {

                                // Do anything for not being valid
                                return false;
                            }
                        } else {
                            return '';
                        }
                    }
                }

            }
        })

        .directive('dsdirective', function () {
            return{
                template: '',
                replace: true,
                scope: {
                    image: '=',
                    content: '='
                },
                restrict:'E',
                link: function (scope, element) {
                    scope.$watch('image', function () {
                        var replacementElement;

                        if(scope.image.med_mimetype.indexOf('video') > -1){

                            replacementElement = angular.element('<div class="col-md-9 col-xs-9"><video width="300" controls="controls"><source src="' + scope.image.med_url + '" type="' + scope.image.med_mimetype + '"></video></div>');
                            element.html('');
                            element.append(replacementElement);

                        }else if(scope.image.med_mimetype.indexOf('audio') > -1){

                            replacementElement = angular.element('<div class="col-md-9 col-xs-9"><audio width="300" controls="controls"><source src="'+ scope.image.med_url +'" type="'+ scope.image.med_mimetype +'"></audio></div>');
                            element.html('');
                            element.append(replacementElement);

                        }else if(scope.image.med_mimetype.indexOf('image') > -1){

                            replacementElement = angular.element('<div class="col-md-9 col-xs-9"><img width="300" src="' + scope.image.med_url + '"></div>');
                            element.html('');
                            element.append(replacementElement);

                        }
                    })
                }
            }
        })
})();