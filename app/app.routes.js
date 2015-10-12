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
        });
}