'use strict';
angular
    .module('app.core')
    .controller('HomeController', function($scope, PageValues) {
        //Set page title and description
        PageValues.title = "Dashboard";
        PageValues.description = "";
        //Setup view model object
        var vm = this;
        vm.title = "Dashboard";
        vm.description = "Babak this is just testing";
        vm.dashboardSumary = {newComments: "26", newTasks: "12", newOrders: "124", supportTickets: "13"};
        vm.tasks = [
            {taskName: "Calendar updated", when: "just now"},
            {taskName: "Commented on a post", when: "4 minutes ago"},
            {taskName: "Order 329 shipped", when: "23 minutes ago"},
            {taskName: "Invoice 653 has been paid", when: "46 minutes ago"},
            {taskName: "A new user has been added", when: "1 hour ago"},
            {taskName: 'Completed task:"pick up dry cleaning"', when: "2 hours ago"},
            {taskName: "Saved the world", when: "yesterday"},
            {taskName: 'Completed task:"fix error on sales page"', when: "two days ago"}
        ];
        vm.transactions = [
            {orderId:"3326", orderDate:"10/21/2013", orderTime:"3:29 PM", amount:"$321.33"},
            {orderId:"3325", orderDate:"10/21/2013", orderTime:"3:29 PM", amount:"$321.33"},
            {orderId:"3324", orderDate:"10/21/2013", orderTime:"3:29 PM", amount:"$321.33"},
            {orderId:"3323", orderDate:"10/21/2013", orderTime:"3:29 PM", amount:"$321.33"},
            {orderId:"3322", orderDate:"10/21/2013", orderTime:"3:29 PM", amount:"$321.33"},
            {orderId:"3321", orderDate:"10/21/2013", orderTime:"3:29 PM", amount:"$321.33"},
            {orderId:"3320", orderDate:"10/21/2013", orderTime:"3:29 PM", amount:"$321.33"},
            {orderId:"3319", orderDate:"10/21/2013", orderTime:"3:29 PM", amount:"$321.33"}
        ];
    });
