'use strict';

angular
    .module('app',
        [
            'vcRecaptcha',
            'ngMessages',
            'ui.router',
            'ngRoute',
            'angular-loading-bar',
            'cgNotify',
            'ngAnimate',
            'ngSanitize',
            'angularMoment',
            'bootstrapLightbox',
            'angular-preload-image',
            'truncate',
            'oi.select', // multi select dropdown
            'hSweetAlert',
            'ngWizard',
            'ngDroplet', // File upload
            'me-lazyload',
            'pascalprecht.translate',
            'angularBootstrapNavTree',
            'app.routes',
            'app.core',
            'app.services',
            'app.config'
        ]);