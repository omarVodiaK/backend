'use strict';

angular
    .module('app.routes', ['ui.router'])
    .config(config);

function config ($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.
        when('/', "/home")
        .otherwise("/login");
    $stateProvider
        .state('auth', {
            abstract: true,
            url: '/auth',
            templateUrl: 'components/layout/auth.html'
        })
        .state('auth.login', {
            url: '^/login',
            templateUrl: 'modules/user/loginTemplate.html',
            controller: 'LoginController as login'
        })
        .state('auth.register', {
            url: '^/register',
            templateUrl: 'modules/user/registerTemplate.html',
            controller: 'RegisterController as register'
        })
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