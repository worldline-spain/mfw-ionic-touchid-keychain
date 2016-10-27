(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @module mfw-ionic.touchid-keychain
   * @name mfw-ionic.touchid-keychain
   *
   * @requires ionic
   *
   * @description
   * # Description
   *
   * This module provides access to TouchID features when running on devices supporting it.
   *
   * # Plugins
   *
   * This module requires the following Cordova plugins:
   *
   * * {@link https://github.com/jordiescudero/cordova-plugin-keychain-touch-id cordova-plugin-keychain-touch-id}:
   *    Supports TouchID and Keychain for iOS and Android.
   *
   * # Features
   *
   * The following features are covered:
   *
   * * Check for TouchID capability of current device.
   * * Save, update and remove `String` values in Keychain protected by user's fingerprint.
   * * Recover previously stored values if user's fingerprint is validated.
   */
  var TouchIDKeychainModule = angular.module('mfw-ionic.touchid-keychain', [
    'ionic'
  ]);

  /**
   * @ngdoc service
   * @name mfw-ionic.touchid-keychain.$mfwiTouchIDProvider
   *
   * @description
   * Provider of {@link mfw-ionic.touchid-keychain.service:$mfwiTouchID `$mfwiTouchID`} service.
   */
  TouchIDKeychainModule.provider('$mfwiTouchID', TouchIDProvider);
  function TouchIDProvider() {
    this.$get = ['$q', '$window', '$ionicPlatform', function ($q, $window, $ionicPlatform) {
      /*jshint validthis:true */
      /**
       * @ngdoc service
       * @name mfw-ionic.touchid-keychain.service:$mfwiTouchID
       *
       * @description
       *
       * Service providing an API to request for user's fingerprint validation to store values in Keychain.
       *
       * ## Fingerprint
       *
       * TouchID capabilities can be used to implement useful features like login, fingerprint-protected data, etc.
       *
       *
       * ## Keychain
       *
       * You can save, update and remove `String` values protected by user's fingerprint into OS' Keychain.
       */
      var service = {
        isAvailable: isAvailable,
        verifyFingerprintKey: verify,
        saveKeyValue: saveValue,
        hasKey: hasKey,
        removeKey: removeKey
      };

      return service;

      ///////////////////////////

      /**
       * @ngdoc method
       * @name mfw-ionic.touchid-keychain.service:$mfwiTouchID#isAvailable
       * @methodOf mfw-ionic.touchid-keychain.service:$mfwiTouchID
       *
       * @description
       * Check for availability of TouchID in current device.
       *
       * Returned promise:
       *
       * * Will **resolve** if it's available.
       * * Will **reject** if it's not available.
       *
       * @returns {Promise} Promise.
       */
      function isAvailable() {
        var defer = $q.defer();
        $ionicPlatform.ready(function () {
          if ($window.cordova) {
            $window.plugins.touchid.isAvailable(defer.resolve, defer.reject);
          } else {
            defer.reject();
          }
        });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name mfw-ionic.touchid-keychain.service:$mfwiTouchID#verify
       * @methodOf mfw-ionic.touchid-keychain.service:$mfwiTouchID
       *
       * @description
       * Request for an stored value in Keychain presenting a fingerprint validation dialog.
       *
       * Returned promise:
       *
       * * Will **resolve with stored value** if fingerprint is validated.
       * * Will **reject** if TouchID is not available or fingerprint is not validated.
       *
       * @param {string} message Message to be presented to the user describing why his/her fingerprint is being requested.
       * @param {string} key Key of the stored value in Keychain.
       *
       * @returns {Promise.<String>} Promise with saved value if resolved.
       */
      function verify(message, key) {
        var defer = $q.defer();
        this.isAvailable().then(function () {
          $window.plugins.touchid.verify(key, message, function (value) {
            // Protect Cancel, value is undefined
            if (angular.isDefined(value)) {
              defer.resolve(value);
            } else {
              defer.reject();
            }
          }, defer.reject);
        }, defer.reject);
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name mfw-ionic.touchid-keychain.service:$mfwiTouchID#hasKey
       * @methodOf mfw-ionic.touchid-keychain.service:$mfwiTouchID
       *
       * @description
       * Check if Keychain contains an stored key with the given name.
       *
       * Returned promise:
       *
       * * Will **resolve** if Keychain contains a key with the given name.
       * * Will **reject** if TouchID is not available or no entry is found in Keychain with that key name.
       *
       * @param {string} key Key of the stored value in Keychain.
       *
       * @returns {Promise} Promise.
       */
      function hasKey(key) {
        var defer = $q.defer();
        this.isAvailable().then(function () {
          $window.plugins.touchid.has(key, defer.resolve, defer.reject);
        }, defer.reject);
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name mfw-ionic.touchid-keychain.service:$mfwiTouchID#saveValue
       * @methodOf mfw-ionic.touchid-keychain.service:$mfwiTouchID
       *
       * @description
       * Save a key-value pair in Keychain protected by fingerprint.
       *
       * Returned promise:
       *
       * * Will **resolve** if key was successfully saved.
       * * Will **reject with error message** if TouchID is not available or an error occurred saving the key.
       *
       * @param {string} key Key name to be used in Keychain.
       * @param {string} value Value to be stored.
       *
       * @returns {Promise.<String=>} Promise.
       */
      function saveValue(key, value) {
        var defer = $q.defer();
        this.isAvailable().then(function () {
          $window.plugins.touchid.save(key, value, defer.resolve, defer.reject);
        }, defer.reject);
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name mfw-ionic.touchid-keychain.service:$mfwiTouchID#removeKey
       * @methodOf mfw-ionic.touchid-keychain.service:$mfwiTouchID
       *
       * @description
       * Returns whether the network is considered offline or not.
       *
       * Returned promise:
       *
       * * Will **resolve** if key was successfully removed.
       * * Will **reject with error message** if TouchID is not available or an error occurred removing the key.
       *
       * @param {string} key Key name to be used in Keychain.
       *
       * @returns {Promise.<String=>} Promise.
       */
      function removeKey(key) {
        var defer = $q.defer();
        this.isAvailable().then(function () {
          $window.plugins.touchid.delete(key, defer.resolve, defer.reject);
        }, defer.reject);
        return defer.promise;
      }
    }];
  }
})();
