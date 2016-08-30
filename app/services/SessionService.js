'use strict';

/*
 * Contains a service to communicate with the Backend
 */
angular
    .module('app.services')
    .service('session', sessionManagement);

function sessionManagement(PROJECT_CODE, $log) {
    // Instantiate data when service
    // is loaded
    this._user = JSON.parse(localStorage.getItem('session.' + PROJECT_CODE + '.user'));
    this._customObject = JSON.parse(localStorage.getItem('session.' + PROJECT_CODE + '.customObject'));

    this.getUser = function () {

        return this._user;
    };

    this.setUser = function (user) {
        this._user = user;
        localStorage.setItem('session.' + PROJECT_CODE + '.user', JSON.stringify(user));
        return this;
    };

    this.getAccessToken = function () {
        return this._user.token;
    };

    this.setAccessToken = function (token) {
        this._user.token = token;
        localStorage.setItem('session.' + PROJECT_CODE + '.user', JSON.stringify(this._user));
        return this;
    };

    this.getCustomObject = function () {
        return this._customObject;
    };

    this.setCustomObject = function (customObject) {
        this._customObject = customObject;
        localStorage.setItem('session.' + PROJECT_CODE + '.customObject', customObject);
        return this;
    };

    /**
     * Destroy session
     */
    this.destroy = function destroy() {

        this.setUser(null);
        this.setCustomObject(null);
    };

}