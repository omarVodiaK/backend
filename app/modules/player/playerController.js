'use strict';
angular
    .module('app.core')
    .controller('PlayerController', function($scope, PageValues, ShowService) {
        //Setup view model object
        var vm = this;
        vm.title = "Player Management";
        vm.description = "These was created for demo purpose only!!!";

        //vm.data = getFromFile.makeRequest("../modules/player/data/players");
        //console.log(vm.data);
        ShowService.makeRequest("player/data/players").then(function(result){
            vm.players = result;
        });
    });
