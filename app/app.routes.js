'use strict';

angular
    .module('app.routes', ['ui.router'])
    .config(config);

function config ($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.
        when('/', "/home")
        .otherwise("/home");
    $stateProvider
        .state('dashboard', {
            abstract: true,
            url: '/dashboard',
            templateUrl: 'components/layout/layout.html'
        })
        .state('dashboard.home', {
            url: '^/home',
            templateUrl: 'modules/home/homeTemplate.html',
            controller: 'HomeController as home'
        })
        .state('dashboard.player', {
            url: '^/players',
            templateUrl: 'modules/player/playerTemplate.html',
            controller: 'PlayerController as player'
        });
}