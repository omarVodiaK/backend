'use strict';

/**
 * @description  use app.content module created in controller
 * @module app.content
 */
angular
    .module('app.content')
    .service('ContentService', ['session', 'notify', 'RequestService', function (session, notify, RequestService) {

        var getDSMedia = function () {

            // Request list of DS media
            return RequestService
                .postJsonRequest('content/findDSMedia', {
                    cmp_cd: session.getUser().user.cmp_cd,
                    token: session.getAccessToken()
                }).then(function (data) {

                    return data;
                });
        };

        var getContentTag = function () {

            // Request list of tags for content
            return RequestService
                .postJsonRequest('tag/findTagByCompanyId', {cmp_cd: session.getUser().user.cmp_cd})
                .then(function (data) {

                    return data;
                });
        };

        return {
            getDSMedia: getDSMedia,
            getContentTag: getContentTag
        }

    }])
    .factory('CDNService', function () {

        var data = '';

        return {
            getCDNResult: function () {
                return data;
            },
            setCDNResult: function (object) {
                data = object;
            }
        }
    });
