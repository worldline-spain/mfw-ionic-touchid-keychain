# MFW Ionic TouchID and Keychain v1.0.0

This AngularJS module provides a way to use TouchID and Keychain features as part of **Mobile FrameWork (MFW)** for **Ionic** applications.

This module relies on [`cordova-plugin-keychain-touch-id`](https://github.com/jordiescudero/cordova-plugin-keychain-touch-id) plugin.


## Features

This library combines TouchID and Keychain letting you:

* Check for TouchID capability of current device.
* Save, update and remove `String` values in Keychain protected by user's fingerprint.
* Recover previously stored values if user's fingerprint is validated.



## Installation

### Plugins

This module requires the following Cordova plugins:

* [cordova-plugin-keychain-touch-id](https://github.com/jordiescudero/cordova-plugin-keychain-touch-id)


### Via Bower

Get module from Bower registry.

```shell
$ bower install --save mfw-touchid-keychain-ionic
```


### Other

Download source files and include them into your project sources.



### Dependency

Once dependency has been downloaded, configure your application module(s) to require:

* `mfw-ionic.inapp-browser` module: provider and service to register for push notifications.

```js
angular
    .module('your-module', [
        // Your other dependencies
        'mfw-ionic.touchid-keychain'
    ]);
```

Now you can inject `$mfwiTouchID` service.


> For further documentation, please read the generated `ngDocs` documentation inside `docs/` folder.




## Usage

**Imperative configuration**

Use `$mfwiLinksProvider.config(options)` and `$mfwiLinksProvider.addRoute(routeDef, callback)` methods.

```js
angular
    .module('your-module')
    .controller('LoginController', LoginController);

var KEYCHAIN_KEY_PASSWORD_TOUCHID = '__scTouchIdPwdKey';

LoginController.$inject = ['$scope', '$mfwiTouchID'];
function LoginController($scope, $mfwiTouchID) {
    var vm = $scope;
    
    vm.doLogin = doLogin;
    vm.doLoginWithTouchId = doLoginWithTouchId;
    vm.doForgetCredentials = doForgetCredentials;
  
    // Check for TouchID capability
    $mfwiTouchID.isAvailable().then(function () {
        vm.isTouchIDAvailable = true;
    
        // Check if a previous login stored credentials in Keychain protected by fingerprint
        $mfwiTouchID.hasKey(KEYCHAIN_KEY_PASSWORD_TOUCHID).then(function () {
            // Enables TouchID button in screen
            vm.isTouchIdCredentialsSaved = true;
        });
    });
  
    // Handler for regular user-entered password login
    vm.doLogin = function (enteredPassword) {
        // Your login logic
        // ...
        // If successful login, store credentials
        if (vm.isTouchIDAvailable) {
            // Save or update
            $mfwiTouchID.saveValue(KEYCHAIN_KEY_PASSWORD_TOUCHID, enteredPassword).then(function () {
                // Enables TouchID button in screen
                vm.isTouchIdCredentialsSaved = true;
            });
        }
    };
  
    // Handler for TouchID login button
    vm.doLoginWithTouchId = function () {
        // Retrieve credentials by fingerprint
        $mfwiTouchID.verify(YOUR_MESSAGE, KEYCHAIN_KEY_PASSWORD_TOUCHID).then(function (savedPassword) {
            // Regular login with saved password
            doLogin(savedPassword);
        }, function (error) {
            $log.error('Fingerprint not validated');
        });
    };
  
    vm.doForgetCredentials = function () {
        $mfwiTouchID.removeKey(KEYCHAIN_KEY_PASSWORD_TOUCHID).then(function () {
            // Disables TouchID button in screen
            vm.isTouchIdCredentialsSaved = false;
        });
    };
}
```

> For further documentation, please read the generated `ngDocs` documentation inside `docs/` folder.




## Development

* Use Gitflow
* Update package.json version
* Tag Git with same version numbers as NPM
* Check for valid `ngDocs` output inside `docs/` folder

> **Important**: Run `npm install` before anything. This will install NPM and Bower dependencies.

> **Important**: Run `npm run deliver` before committing anything. This will build documentation and distribution files.
> It's a shortcut for running both `build` and `docs` scripts.


### NPM commands

* Bower: install Bower dependencies in `bower_components/` folder:

```shell
$ npm run bower
```

* Build: build distributable binaries in `dist/` folder:

```shell
$ npm run build
```

* Documentation: generate user documentation (using `ngDocs`):

```shell
$ npm run docs
```

* Linting: run *linter* (currently JSHint):

```shell
$ npm run lint
```

* Deliver: **run it before committing to Git**. It's a shortcut for `build` and `docs` scripts:

```shell
$ npm run deliver
```
