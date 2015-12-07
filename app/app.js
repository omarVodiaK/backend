'use strict';

angular
    .module('app',
    [
        'ui.router',
        'ngRoute',
        'ngAnimate',
        'ngSanitize',
        'angularMoment',
        'bootstrapLightbox',
        'angular-preload-image',
        'truncate',
        'oi.select', // multi select dropdown
        'hSweetAlert',
        'angularFileUpload', // file upload used in app.beacon
        'pascalprecht.translate',
        'angularBootstrapNavTree',
        'app.routes',
        'app.core',
        'app.services',
        'app.config'
    ]);


