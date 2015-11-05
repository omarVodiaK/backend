'use strict';

angular
    .module('app.routes', ['ui.router'])
    .config(config);

function config($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.
        when('/', "/home")
        .otherwise("/dashboard/associate");
    $stateProvider
        .state('dashboard', {
            abstract: true,
            url: '/dashboard',
            templateUrl: 'components/layout/layout.html'
        })


        .state('login',{
            url:'/login',
            templateUrl:'modules/login/login.html',
            controller:'LoginCtrl'
        })
        .state('dashboard.associate',{
            url:'/associate',
            templateUrl:'modules/associates/associate.html',
            controller:'AssociateCtrl'
        })
        .state('dashboard.category',{
            url:'/category',
            templateUrl:'modules/category/category.html',
            controller:'CategoryCtrl'
        })
        .state('dashboard.zone',{
            url:'/zone',
            templateUrl:'modules/zone/zone.html',
            controller:'ZoneCtrl'
        })
        .state('dashboard.beacon', {
            url: '/beacon',
            templateUrl: 'modules/beacon/beacon.html',
            controller: 'BeaconCtrl'
        })
        .state('dashboard.content', {
            url: '/content',
            templateUrl: 'modules/content/content.html',
            controller: 'ContentCtrl'
        })
        .state('dashboard.campaign', {
            url: '/campaign',
            templateUrl: 'modules/campaign/campaign.html',
            controller: 'CampaignCtrl'
        })
        .state('dashboard.new-campaign', {
            url: '/new-campaign',
            templateUrl: 'modules/campaign/newCampaign.html',
            controller: 'CampaignCtrl'
        })
        .state('dashboard.notification', {
            url: '/notification',
            templateUrl: 'modules/notification/notification.html',
            controller: 'NotificationCtrl'
        })
    ;


}