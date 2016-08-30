(function () {
    'use strict';

    /**
     * module app.associate
     * @module app.associate
     * @inject {} angularUtils.directives.dirPagination
     * @inject {module} app.login
     * @inject {} toastr
     */
    angular.module('app.associate', ['toastr'])

    /**
     * Controller for associate module
     * @controller AssociateCtrl
     * @param {function} associateController
     */
        .controller('AssociateCtrl', associateController)
        .controller('BadgeCtrl', badgeController)

    /**
     * @description app.associate module controller for controlling modal and selecting respective information from RequestService.
     * @method associateController
     * @param {object} $scope
     * @param {Service} RequestService
     * @param {object} session
     * @param {object} $filter
     * @param {service} DetailedAssociateService
     * @param {object} notify
     */
    function associateController($scope, RequestService, session, $filter, DetailedAssociateService, notify) {

        $scope.associates = [];
        $scope.emails = [];
        $scope.users = [];

        /**
         * @description populate associates
         * @method postJsonRequest
         */
        DetailedAssociateService.getAssociates().then(function (data) {

            if (data.result == "this model doesn't exist" || data.result == 'error' || data.length == 0) {
                notify({
                    message: "You have 0 associate!",
                    classes: 'alert-info',
                    position: 'center',
                    duration: 2000
                });
            } else if (data.result == undefined) {
                $scope.associates = data;
            }
        });

        /**
         * false is default value so the modal will not popup when the page is loaded
         * @type {boolean}
         */
        $scope.showModal = false;

        /**
         * Open/Close modal
         * @method toggleModal
         */
        $scope.toggleModal = function () {
            $scope.showModal = !$scope.showModal;
        };

        $scope.ok = function () {
            $scope.showModal = false;
        };

        $scope.accept = function (id) {
            RequestService.postJsonRequest('company/action',
                {
                    'asc_cd': id,
                    'action': 'accept'
                }
            ).then(function (result) {

                if (result.length == 1) {

                    for (var i = 0; i < $scope.associates.length; i++) {

                        if ($scope.associates[i].asc_cd == result[0].asc_cd) {

                            $scope.associates[i] = result[0];

                        }
                    }
                    notify({
                        message: "Associate Accepted!",
                        classes: 'alert-info',
                        position: 'center',
                        duration: 2000
                    });
                }
            });
        };

        /**
         * @description remove associate object from scope and database
         * @method removeAssociateRow
         * @param {integer} id
         */
        $scope.removeAssociateRow = function (id) {

            RequestService.postJsonRequest('company/deleteAllAssociateCompanyCampaign', {
                'asc_cd': id,
                'cmp_cd': session.getUser().user.cmp_cd
            }).then(function (removeResults) {

                if (removeResults.result == undefined) {
                    removeResults.forEach(function (removeResult) {
                        if (removeResult.state == 'fulfilled' && removeResult.value != undefined) {

                            RequestService.postJsonRequest('companyCampaign/deleteCampaignOwner', {cmp_camp_cd: removeResult.value.cmp_camp_cd}).then(function (result) {

                                if (result.result == 'deleted successfully') {

                                    RequestService.postJsonRequest('company/deleteAssociate', {asc_cd: id}).then(function (deletedAssociate) {

                                        if (deletedAssociate.result == 'deleted successfully') {

                                            var index = -1;
                                            var arrAssociates = $scope.associates;
                                            for (var i = 0; i < arrAssociates.length; i++) {
                                                if (arrAssociates[i].asc_cd === id) {
                                                    index = i;
                                                    break;
                                                }
                                            }
                                            if (index === -1) {


                                            } else {

                                                notify({
                                                    message: "deleted successfully!",
                                                    classes: 'alert-success',
                                                    position: 'center',
                                                    duration: 2000
                                                });

                                            }

                                            $scope.associates.splice(index, 1);

                                        }
                                    });
                                }
                            });
                        } else {
                            RequestService.postJsonRequest('company/deleteAssociate', {asc_cd: id}).then(function (deletedAssociate) {

                                if (deletedAssociate.result == 'deleted successfully') {

                                    var index = -1;
                                    var arrAssociates = $scope.associates;
                                    for (var i = 0; i < arrAssociates.length; i++) {
                                        if (arrAssociates[i].asc_cd === id) {
                                            index = i;
                                            break;
                                        }
                                    }
                                    if (index === -1) {


                                    } else {

                                        notify({
                                            message: "deleted successfully!",
                                            classes: 'alert-success',
                                            position: 'center',
                                            duration: 2000
                                        });

                                    }

                                    $scope.associates.splice(index, 1);

                                }
                            });
                        }
                    });
                } else {

                    RequestService.postJsonRequest('company/deleteAssociate', {asc_cd: id}).then(function (deletedAssociate) {

                        if (deletedAssociate.result == 'deleted successfully') {

                            var index = -1;
                            var arrAssociates = $scope.associates;
                            for (var i = 0; i < arrAssociates.length; i++) {
                                if (arrAssociates[i].asc_cd === id) {
                                    index = i;
                                    break;
                                }
                            }
                            if (index === -1) {
                                notify({
                                    message: "Something gone wrong!",
                                    classes: 'alert-danger',
                                    position: 'center',
                                    duration: 2000
                                });
                                alert("Something gone wrong");
                            } else {
                                notify({
                                    message: "deleted successfully!",
                                    classes: 'alert-success',
                                    position: 'center',
                                    duration: 2000
                                });
                            }

                            $scope.associates.splice(index, 1);
                        }
                    });
                }


            });
        };

        /**
         * select associate name
         * @method getAssociateName
         * @param {object} company
         */
        $scope.getAssociateName = function (company) {
            if (session.getUser() != null) {
                if (company.owner == session.getUser().user.cmp_cd) {
                    return company.asc_cmp_receiver_id.cmp_name;
                } else {
                    return company.asc_cmp_sender_id.cmp_name;
                }
            }
        };

        // get companies registered in the dashboard
        RequestService.postJsonRequest('company/getCompanies', {'cmp_cd': session.getUser().user.cmp_cd}).then(function (data) {

            if (data.result == 'no companies found' || data.result != undefined) {
            } else {
                data.forEach(function (result) {
                    result.val = false;
                    $scope.users.push(result)
                })
            }
        });

        // send request to users of the dashboard by toggling on the switch box
        $scope.sendRequest = function () {

            var checked;
            var unchecked;

            $scope.$watch('users', function (newObj, oldObj) {

                checked = $filter('filter')(newObj, {'val': true});

                checked.forEach(function (check) {
                    RequestService.postJsonRequest('company/invite', {
                        'sender_id': session.getUser().user.cmp_cd,
                        'receiver_id': check.cmp_cd
                    }).then(function (result) {

                        if (result.result == "already invited") {

                            notify({
                                message: "already invited!",
                                classes: 'alert-warning',
                                position: 'center',
                                duration: 2000
                            });

                            $scope.showModal = false;

                        } else {

                            DetailedAssociateService.getAssociates().then(function (data) {

                                if (data.result == "this model doesn't exist" || data.result == 'error') {

                                    notify({
                                        message: "this user doesn't exist!",
                                        classes: 'alert-warning',
                                        position: 'center',
                                        duration: 2000
                                    });

                                } else if (data.result == undefined) {

                                    notify({
                                        message: "Invitation Sent!",
                                        classes: 'alert-warning',
                                        position: 'center',
                                        duration: 2000
                                    });

                                    $scope.associates = data;
                                }
                            });
                            $scope.showModal = false;
                        }
                    });
                });

                unchecked = $filter('filter')(newObj, {'val': false});
                $scope.showModal = false;
            }, true);
        }
    }

    /**
     * @description app.associate module controller, it handles the notification part using toastr.
     * @method badgeController
     * @param {object} $scope
     * @param {object} toastr
     * @param {object} session
     * @param {service} DetailedAssociateService
     */
    function badgeController($scope, toastr, session, DetailedAssociateService) {

        if (session.getUser() != null) {

            DetailedAssociateService.getAssociates().then(function (result) {
                $scope.associates = [];
                $scope.requestNumber = 0;
                $scope.associateNotification = [];
                /**
                 * fill $scope.associate with service result
                 */
                $scope.associates = result;

                for (var i = 0; i < $scope.associates.length; i++) {
                    // check if the request state is pending
                    if ($scope.associates[i].asc_state == 'pending') {
                        $scope.requestNumber++;
                        $scope.associateNotification.push($scope.associates[i]);
                    }
                }

                if ($scope.requestNumber > 0) {
                    // trigger toastr
                    if ($scope.requestNumber == 1) {
                        toastr.info('You have ' + $scope.requestNumber + ' pending request', 'Information');
                    } else {
                        toastr.info('You have ' + $scope.requestNumber + ' pending requests', 'Information');
                    }
                }
            });
        }

    }

})();