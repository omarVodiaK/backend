'use strict';

angular
    .module('app.routes', ['ui.router'])
    .config(config);

function config($stateProvider, $urlRouterProvider, $locationProvider) {


    $urlRouterProvider.
        when('/', "/dashboard/associate")
        .otherwise("/dashboard/associate");
    $stateProvider
        .state('auth', {
            abstract: true,
            url: '/auth',
            templateUrl: 'components/layout/auth.html'
        })
        .state('auth.login', {
            url: '^/login',
            templateUrl: 'modules/user/loginTemplate.html',
            controller: 'LoginController as login',
            params: {
                message: null
            },
            auth: false
        })
        .state('auth.register', {
            url: '^/register',
            templateUrl: 'modules/user/registerTemplate.html',
            controller: 'RegisterController as register',
            auth: false
        })
        .state('dashboard', {
            abstract: true,
            url: '/dashboard',
            templateUrl: 'components/layout/layout.html'
        })
        .state('dashboard.associate', {
            url: '/associate',
            templateUrl: 'modules/associates/associate.html',
            controller: 'AssociateCtrl'
        })
        .state('dashboard.location', {
            url: '/location',
            templateUrl: 'modules/location/location.html',
            controller: 'LocationCtrl'
        })
        .state('dashboard.zone', {
            url: '/zone',
            templateUrl: 'modules/zone/zone.html',
            controller: 'ZoneCtrl'
        })
        .state('dashboard.beacon', {
            url: '/beacon',
            templateUrl: 'modules/beacon/beacon.html',
            controller: 'BeaconCtrl'
        })
        .state('dashboard.content', {
            url: '/content/normal',
            templateUrl: 'modules/content/normal/content.html',
            controller: 'ContentCtrl'
        })
        .state('dashboard.product', {
            url: '/content/product',
            templateUrl: 'modules/content/product/product.html',
            controller: 'ProductCtrl'
        })
        .state('dashboard.campaign', {
            url: '/campaign',
            templateUrl: 'modules/campaign/campaign.html',
            controller: 'CampaignCtrl'
        })
        .state('dashboard.new-campaign', {
            url: '/new-campaign',
            templateUrl: 'modules/campaign/createCampaign.html',
            controller: 'UpdateCampaignCtrl'
        })
        .state('dashboard.notification', {
            url: '/notification',
            templateUrl: 'modules/notification/notification.html',
            controller: 'NotificationCtrl'
        });
}