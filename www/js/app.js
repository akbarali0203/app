'use strict';
angular.module('underscore', []) .factory('_', function() { return window._; });
var app;
app = angular.module('starter', ['ionic', 'ngCordova', 'ngStorage', 'underscore', 'ngPassword', 'ionic-cache-src', 'ui.swiper', 'ionic.rating', 'io-barcode', 'ionic-modal-select'])

.run(function($rootScope, $ionicPlatform, $http, $state, $ionicPopup, config, strings) {
  $ionicPlatform.ready(function() {

    //$ionicConfigProvider.platform.android.scrolling.jsScrolling(false);
   
    if (typeof analytics !== 'undefined'){
      window.ga.startTrackerWithId('UA-46777350-7');
    }
    else
    {
      console.log("Google Analytics plugin could not be loaded.")
    }
    
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(false);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
 
    var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };

  //alert("Here!");
  //window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
   // alert("Here2 !");   

  window.plugins.OneSignal
    .startInit(config.onesignalId)
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
    document.addEventListener("backbutton",CallbackFunction, false);
    }
    function CallbackFunction() {
   
    }
 //alert("Here3!");
    var defaultHTTPHeaders = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Accept': 'application/json'
    };

    $http.defaults.headers.post = defaultHTTPHeaders;

});
    
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $sceDelegateProvider){

$ionicConfigProvider.tabs.position("bottom");
$ionicConfigProvider.navBar.alignTitel("center");

$stateProvider

      .state('intro', {
        url: '/intro',
        templateUrl: 'intro.html',
        controller: 'IntroCtrl'
      
      })

     .state('tab', {
      url: '/tab',
      abstract: true,
      cache: true,
      templateUrl: 'tab.html',
      controller: 'TabCtrl'
    })

     .state('tab.nointernet', {
        url: '/nointernet',
        cache: false,
        views: {
          'tab-nointernet': {
            templateUrl: 'nointernet.html',
            controller: 'NoInternetCtrl'
          }
        }
      })

     .state('tab.login', {
        url: '/login',
        cache: false,
        views: {
          'tab-login': {
            templateUrl: 'login.html',
            controller: 'LoginCtrl'
          }
        }
      })

     .state('tab.signup', {
        url: '/signup',
        cache: false,
        views: {
          'tab-signup': {
            templateUrl: 'signup.html',
            controller: 'SignupCtrl'
          }
        }
      })

     .state('tab.forget', {
        url: '/forget',
        cache: false,
        views: {
          'tab-forget': {
            templateUrl: 'forget.html',
            controller: 'ForgetCtrl'
          }
        }
      })

     .state('tab.home', {
        url: '/home',
        cache: false,
        views: {
          'tab-home': {
            templateUrl: 'home.html',
            controller: 'HomeCtrl'
          }
        }
      })

     .state('tab.categories', {
        url: '/categories',
        cache: false,
        views: {
          'tab-categories': {
            templateUrl: 'categories.html',
            controller: 'CategoriesCtrl'
          }
        }
      })

     .state('tab.filterPlacesByCategory', {
        url: '/filterPlacesByCategory/:id',
        cache: false,
        views: {
          'tab-filterPlacesByCategory': {
            templateUrl: 'filterPlacesByCategory.html',
            controller: 'filterPlacesByCategoryCtrl'
          }
        }
      })
      .state('tab.types', {
        url: '/types/:id/:cityName',
        cache: false,
        views: {
          'tab-types': {
            templateUrl: 'types.html',
            controller: 'TypesCtrl'
          }
        }
      })
     .state('tab.ncategories', {
        url: '/ncategories',
        cache: false,
        views: {
          'tab-ncategories': {
            templateUrl: 'ncategories.html',
            controller: 'NCategoriesCtrl'
          }
        }
      })
     
      .state('tab.uniid', {
        url: '/uniid',
        cache: false,
        views: {
        'tab-uniId': {
		  templateUrl: 'uniid.html',
			controller: 'UniIdCtrl'
          }
        }
      })
      .state('tab.verify', {
        url: '/verify',
        cache: false,
        views: {
        'tab-verify': {
		  templateUrl: 'verify.html',
			controller: 'VerifyCtrl'
          }
        }
      })
      .state('tab.completeRest', {
        url: '/completeRest',
        cache: false,
        views: {
        'tab-completeRest': {
		  templateUrl: 'completeRest.html',
			controller: 'completeRestCtrl'
          }
        }
      })
      .state('tab.maps', {
        url: '/maps',
        cache: false,
        views: {
        'tab-maps': {
		  templateUrl: 'maps.html',
			controller: 'MapsCtrl'
          }
        }
      })
/*
      .state('tab.filterCity', {
        url: '/filterCity',
        cache: false,
        views: {
        'tab-maps': {
		  templateUrl: 'filterCity.html',
			controller: 'filterCityCtrl'
          }
        }
      })
*/
     .state('tab.ocategories', {
        url: '/ocategories',
        cache: false,
        views: {
          'tab-ocategories': {
            templateUrl: 'ocategories.html',
            controller: 'OCategoriesCtrl'
          }
        }
      })

     .state('tab.search', {
        url: '/search',
        cache: false,
        views: {
          'tab-search': {
            templateUrl: 'search.html',
            controller: 'SearchCtrl'
          }
        }
      })

     .state('tab.osearch', {
        url: '/osearch',
        cache: false,
        views: {
          'tab-osearch': {
            templateUrl: 'osearch.html',
            controller: 'OSearchCtrl'
          }
        }
      })

     .state('tab.nsearch', {
        url: '/nsearch',
        cache: false,
        views: {
          'tab-nsearch': {
            templateUrl: 'nsearch.html',
            controller: 'NSearchCtrl'
          }
        }
      })

      .state('tab.pcategory', {
        url: '/pcategory/:id',
        cache: false,
        views: {
          'tab-pcategory': {
            templateUrl: 'pcategory.html',
            controller: 'CategoryPlaceCtrl'
          }
        }
      })
      .state('tab.pcitycategory', {
        url: '/pcitycategory/:cityName',
        cache: false,
        views: {
          'tab-pcitycategory': {
            templateUrl: 'pcitycategory.html',
            controller: 'CategoryPlaceCityCtrl'
          }
        }
      })
      .state('tab.ocategory', {
        url: '/ocategory/:id',
        cache: false,
        views: {
          'tab-ocategory': {
            templateUrl: 'ocategory.html',
            controller: 'CategoryOfferCtrl'
          }
        }
      })
      .state('tab.oallcategory', {
        url: '/oallcategory/',
        cache: false,
        views: {
          'tab-oallcategory': {
            templateUrl: 'oallcategoryAngebote.html',
            controller: 'AllCategoryOfferCtrl'
          }
        }
      })

      .state('tab.ncategory', {
        url: '/ncategory/:id',
        cache: false,
        views: {
          'tab-ncategory': {
            templateUrl: 'ncategory.html',
            controller: 'CategoryNewsCtrl'
          }
        }
      })

      .state('tab.nallcategory', {
        url: '/nallcategory',
        cache: false,
        views: {
          'tab-nallcategory': {
            templateUrl: 'nallcategory.html',
            controller: 'AllCategoryNewsCtrl'
          }
        }
      })

      .state('tab.place', {
        url: '/place/:id',
        cache: false,
        views: {
          'tab-place': {
            templateUrl: 'place.html',
            controller: 'PlaceCtrl'
          }
        }
      })

      .state('tab.post', {
        url: '/post/:id',
        cache: false,
        views: {
          'tab-post': {
            templateUrl: 'post.html',
            controller: 'PostCtrl'
          }
        }
      })

      .state('tab.postFB', {
        url: '/postFB/:id',
        cache: false,
        views: {
          'tab-post': {
            templateUrl: 'postFB.html',
            controller: 'PostFBCtrl'
          }
        }
      })

      .state('tab.offer', {
        url: '/offer/:id',
        cache: false,
        views: {
          'tab-offer': {
            templateUrl: 'offer.html',
            controller: 'OfferCtrl'
          }
        }
      })

      .state('tab.about', {
        url: '/about',
        cache: false,
        views: {
          'tab-about': {
            templateUrl: 'about.html',
            controller: 'AboutCtrl'
          }
        }
      })

      .state('tab.terms', {
        url: '/terms',
        cache: false,
        views: {
          'tab-terms': {
            templateUrl: 'terms.html',
            controller: 'TermsCtrl'
          }
        }
      })

      .state('tab.privacy', {
        url: '/privacy',
        cache: false,
        views: {
          'tab-privacy': {
            templateUrl: 'privacy.html',
            controller: 'PrivacyCtrl'
          }
        }
      })
      .state('tab.disclaimer', {
        url: '/disclaimer',
        cache: false,
        views: {
          'tab-disclaimer': {
            templateUrl: 'disclaimer.html',
            controller: 'DisclaimerCtrl'
          }
        }
      })

      .state('tab.favorites', {
        url: '/favorites',
        cache: false,
        views: {
          'tab-favorites': {
            templateUrl: 'favorites.html',
            controller: 'FavoritesCtrl'
          }
        }
      })

      .state('tab.purchases', {
        url: '/purchases',
        cache: false,
        views: {
          'tab-purchases': {
            templateUrl: 'purchases.html',
            controller: 'PurchasesCtrl'
          }
        }
      })

      .state('tab.contact', {
        url: '/contact',
        cache: false,
        views: {
          'tab-contact': {
            templateUrl: 'contact.html',
            controller: 'ContactCtrl'
          }
        }
      })

      .state('tab.account', {
        url: '/account',
        cache: false,
        views: {
          'tab-account': {
            templateUrl: 'account.html',
            controller: 'AccountCtrl'
          }
        }
      })



     //$urlRouterProvider.otherwise('/intro');

    var estachequeado = localStorage.getItem("chequeado");
    var didTutorial = localStorage.getItem("didTutorial");

      if(estachequeado == 'true'){

      if (localStorage.getItem("id_user") === null) {

        return $urlRouterProvider.otherwise('/tab/login');

      }else{

        return $urlRouterProvider.otherwise('/tab/home');
      }
        
      }else{
        //return $urlRouterProvider.otherwise('/tab/login');
          return $urlRouterProvider.otherwise('/intro');
      }

})

.filter('unique', function() {

   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key); 
              output.push(item);
          }
      });
      return output;
   };
})


.filter('limitext', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    })


.directive('repeatDone', function () {
   return function (scope, element, attrs) {
     if (scope.$last) { // all are rendered
       scope.$eval(attrs.repeatDone);
     }
   }
})


.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, $el) {
            $rootScope.hideTabs = true;
            $scope.$on('$destroy', function() {
                $rootScope.hideTabs = false;
            });
        }
    };
})
.filter('newlines', function () {
  return function (text) {
    return text.replace(/,/g, '\n');
  }
})
.filter('ampersand', function(){
  return function(input){
      return input ? input.replace(/&amp;/, '&') : '';
  }
})
.service('UserService', function() {

  //for the purpose of this example I will store user data on ionic local storage but you should save it on a database
  
    var setUser = function(user_data) {
      window.localStorage.otherUserDetail = JSON.stringify(user_data);
    };
  
    var getUser = function(){
      return JSON.parse(window.localStorage.otherUserDetail || '{}');
    };

    var deleteUser = function(){
      localStorage.removeItem('otherUserDetail');
    };

    return {
      getUser: getUser,
      setUser: setUser,
      deleteUser: deleteUser
    };
})
.factory('UniEmailVerify', function($http) {
    return {
      geUniName: function(url) {
         return $http.get(url);
      }
    }
})
.factory('loginByOther', function($http){
  return {
		checkUserLoginStatus: function(url){
			return $http.get(url);
		}
	}
})
.factory('ClockSrv', function($interval,$http ){
  var clock = null;
  var service = {
      startClock: function(fn){
      if(clock === null){
         clock = $interval(fn, 900000);
         // 900000 = 15mints
      }
  },

  stopClock: function(){
     if(clock !== null){
     $interval.cancel(clock);
     clock = null;
  }
  }
  };
  return service;
})
.factory('SocialAuth', function($http, $q) {

	var SocialAuth = {};
	
	var authUser = null;
	
	var isGooglePlusAPIAvailableOrReject = function(deferred){
		if(window.plugins == null || window.plugins.googleplus == null){
			setTimeout(function(){
				console.log("API not available");
				deferred.reject("API not available");
			}, 100);
			
			return false;
		}
		
		return true;
	}

    SocialAuth.getAuthUser = function() {
        console.log('authUser = '+authUser);
        return authUser;
    };

    
    SocialAuth.isGooglePlusAvailable = function() {
        var deferred = $q.defer();

        if(isGooglePlusAPIAvailableOrReject(deferred)){
            window.plugins.googleplus.isAvailable(
            	    function (available) {
            	      deferred.resolve(available);
            	    }
            	);        	
        }

        return deferred.promise;
    };

    
    /**

     * @returns obj The success callback gets a JSON object with the following contents g.e.
     *  obj.email        // 'eddyverbruggen@gmail.com'
     *  obj.userId       // user id
     *  obj.displayName  // 'Eddy Verbruggen'
     *  obj.gender       // 'male' (other options are 'female' and 'unknown'
     *  obj.imageUrl     // 'http://link-to-my-profilepic.google.com'
     *  obj.givenName    // 'Eddy'
     *  obj.middleName   // null (or undefined, depending on the platform)
     *  obj.familyName   // 'Verbruggen'
     *  obj.birthday     // '1977-04-22'
     *  obj.ageRangeMin  // 21 (or null or undefined or a different number)
     *  obj.ageRangeMax  // null (or undefined or a number)
     *  obj.idToken
     *  obj.oauthToken
	 */
   
    
    SocialAuth.googlePlusSilentLogin = function() {
        var deferred = $q.defer();

        if(isGooglePlusAPIAvailableOrReject(deferred)){
	        window.plugins.googleplus.trySilentLogin(
	    	    {
	    	      'iOSApiKey': 'my_iOS_API_KEY_if_I_have_one'
	    	    },
	    	    function (obj) {
	    	    	deferred.resolve(obj);
	    	    },
	    	    function (err) {
	    	    	deferred.reject(err);
	    	    }
	        );
        }

        var promise = deferred.promise;

        promise.success = function(fn) {
            return promise.then(function(response) {
                fn(response);
            })
        }

        promise.error = function(fn) {
            return promise.then(null, function(response) {
                fn(response);
            })
        }

        //return the promise object
        return promise;
    }; 
    

    SocialAuth.googlePlusLogout = function() {
        var deferred = $q.defer();

        if(isGooglePlusAPIAvailableOrReject(deferred)){
	        window.plugins.googleplus.logout(
	        	    function (msg) {
	        	    	authUser = null;
	        	    	deferred.resolve(msg);
	        	    }
	        	);
        }

        //return the promise object
        return deferred.promise;
    };

    SocialAuth.googlePlusDisconnect = function() {
        var deferred = $q.defer();

        if(isGooglePlusAPIAvailableOrReject(deferred)){
	        window.plugins.googleplus.disconnect(
	        	    function (msg) {
	        	    	authUser = null;
	        	    	deferred.resolve(msg);
	        	    }
	        	);
        }
        return deferred.promise;
    };

	return SocialAuth;
})
.filter('datetostring', function(){
  return function(input){
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(input);
    //console.log([pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('.'));
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('.');
  }
})
