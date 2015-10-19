'use strict';

angular
    .module('app.routes', ['ui.router'])
    .config(config);

function config ($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.
        when('/', "dashboard/home")
        .otherwise("dashboard/home");
    $stateProvider
        .state('dashboard', {
            abstract: true,
            url: '/dashboard',
            templateUrl: 'components/layout/layout.html'
        })
        .state('dashboard.home', {
            url: '/home',
            templateUrl: 'modules/home/homeTpl.html',
            controller: 'HomeController as home'
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

    ;
}