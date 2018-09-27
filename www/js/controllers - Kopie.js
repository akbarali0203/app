'use strict';
app
.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
    

  // Lets create a function 
  // That will go to state main
  $scope.startApp = function () {
    $state.go('tab.login');
    // At the same time, lets write to local storage.
    // This will just let us know that we have completed
    // the tutorial
    window.localStorage.didTutorial = 'true';
  };
  // At the start of this controller
  // Lets check local storage for didTutorial
  if (window.localStorage.didTutorial === 'true') {
    // If it we did do the tutorial, lets call
    // $scope.startApp
    $scope.startApp();

  } else {
    // If we didn't do the tutorial,
    // Lets just stay where we are
    console.log('Need to do into');
    setTimeout(function () {
      navigator.splashscreen.hide();
    }, 750);
  }
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
})
.controller('TabCtrl', ['$scope', '$state', 'strings', '$localStorage', function($scope, $state, strings, $localStorage) {

  $scope.titleOffers = strings.placesTitel;
  $scope.titleHome = strings.homeTitel;
    
    var id_user = localStorage.getItem("id_user");
    $scope.userId = id_user;

  }])

.controller('LoginCtrl', ['$scope', '$ionicModal', '$timeout', '$ionicPopup', '$http', '$state', '$ionicHistory', 'config', 'strings', '$localStorage', '$sessionStorage', '$ionicPlatform', '$cordovaOauth', '$ionicLoading', 'UserService', '$q', 'loginByOther', 'SocialAuth' , function($scope, $ionicModal, $timeout, $ionicPopup, $http, $state, $ionicHistory, config, strings, $localStorage, $sessionStorage, $ionicPlatform, $cordovaOauth, $ionicLoading, UserService, $q, loginByOther,SocialAuth) {
    
    $scope.$on('$ionicView.beforeEnter', function() {
      analytics.trackView('Login');
    });

    $scope.reportSent = true;
    $timeout(function() {
      $scope.reportSent = false;
    }, 3000);


    $scope.toIntro = function(){
      window.localStorage.didTutorial = "false";
      $state.go('intro');
    }


      var isIOS = ionic.Platform.isIOS();
      $scope.ios = isIOS;
      var isAndroid = ionic.Platform.isAndroid();
      $scope.android = isAndroid;

       $ionicPlatform.ready(function() { 
 
        if (isIOS) {
          $scope.appUrl = config.appstoreAppUrl+config.appstoreAppId;
          $scope.ios = "true";
        }
        if (isAndroid) {
          $scope.appUrl = config.playstoreAppUrl+config.playstoreAppId;
          $scope.android = "true";
        }
      });
    
   $scope.showPass = function(){
        $scope.showPassword = !$scope.showPassword;
    }


// checking installed app version

/*
    $http.get('app-version.json')
    .success(function(data, status, headers,config){
      $scope.appVersion = data.version;
      $scope.deviceInformation = ionic.Platform.device();
      $scope.deviceName = $scope.deviceInformation.model;
      $scope.currentPlatform = ionic.Platform.platform();
      $scope.currentPlatformVersion = ionic.Platform.version();
      console.log(ionic.Platform.platform());
      console.log(ionic.Platform.device());
      console.log(ionic.Platform.version());
      console.log($scope.appVersion);
      })
    .error(function(data, status, headers,config){
      console.log('Data error');
    })
    */
//finished


   
    $scope.welcome = strings.welcome;
    $scope.remPass = strings.remPass;
    $scope.formEmail = strings.formEmail;
    $scope.formPassword = strings.formPassword;
    $scope.forget = strings.forget;
    $scope.AccCreate = strings.AccCreate;
    $scope.Login = strings.Login;

    $scope.insertinvited = function(user) {
    if(user.isChecked) {
        localStorage.setItem('chequeado', true);
    } else {
        localStorage.setItem('chequeado', false);
          
    }
    }

    $scope.deschequear = function(){
      if($scope.estachequeado == 'true'){
        localStorage.setItem('chequeado', false);
    }
    }

    $scope.username = localStorage.correo;

    if($scope.username == null){
    localStorage.setItem('chequeado', false);
    };

    $scope.loginData={};

    $scope.doLogin=function(){
      var user_email=$scope.loginData.username;
      var user_password=$scope.loginData.password;

      if(user_password.match(/^\s|\s$/)){
        $ionicLoading.show({ template: "Fehler: Bitte erneut versuchen", noBackdrop: true, duration: 2000});
        return;
    }
     

  


      if(user_email && user_password){
          var str = config.urlBase+"controller/data_login.php?username="+user_email+"&password="+user_password;
          $http.get(str)
            .success(function(response){
              
               // $ionicHistory.clearCache();
               // $ionicHistory.clearHistory();
              
                $scope.admin=response.records;



                sessionStorage.setItem('loggedin_status',true);
                $scope.setUserDetailLocalstorage($scope.admin);

//////////////////////////////// store mobile info
              $scope.appVersion = config.appVersion;
              $scope.deviceInformation = ionic.Platform.device();
              $scope.deviceName = $scope.deviceInformation.model;
              $scope.currentPlatform = ionic.Platform.platform();
              $scope.currentPlatformVersion = ionic.Platform.version();

              $scope.userDetailUndMobileDetail = {
                id_user : localStorage.getItem('id_user'),
                appVersion : $scope.appVersion,
                deviceName : $scope.deviceName,
                //deviceInformation : $scope.deviceInformation,
                currentPlatform : $scope.currentPlatform,
                currentPlatformVersion :  $scope.currentPlatformVersion
              };

              var infostr = config.urlBase+"controller/appInfo.php";
              $http.post(infostr, $scope.userDetailUndMobileDetail , {
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                } })
                .then(function(response){
                    console.log('success');

                },
                function(response){
                  console.log('error');
                  //$ionicLoading.show({ template: strings.ErrAcc, noBackdrop: true, duration: 2000});
            
                }
            
                  ); 

///////////////////////////////////

                $ionicHistory.nextViewOptions({
                  disableAnimate:true,
                  disableBack:true
                })
                


                $state.go('tab.home',{},{location:"replace",reload:true});
              
            })
            .error(function(){

          $ionicPopup.alert({
          title: strings.passWrongtitle,
          template: '<center>'+strings.passWrongtext+'</center>',
          okType: "button-assertive",
          okText: strings.passWrongbutton,
        })

            });
            window.plugins.OneSignal.sendTags({city: localStorage.getItem('user_city'), key2: localStorage.getItem('user_geschlecht')});
      }else{
        $ionicLoading.show({ template: "Fehler: Bitte erneut versuchen", noBackdrop: true, duration: 2000});
      }
       
    }
    

    

  // This is the success callback from the login method
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
      // For the purpose of this example I will store user data on local storage
      UserService.setUser({
        authResponse: authResponse,
				userID: profileInfo.id,
				name: profileInfo.name,
				email: profileInfo.email,
				picture : "https://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
      });
      var urlGetData = config.urlBase+"controller/fbid.php?user_email="+profileInfo.email+"&user_login_type=Facebook+&user_login_id="+profileInfo.id;
      loginByOther.checkUserLoginStatus(urlGetData).then(function(data){
        $scope.data = data.data.records;
        $scope.admin=$scope.data;
        sessionStorage.setItem('loggedin_status',true);
        $scope.setUserDetailLocalstorage($scope.admin);

        //////////////////////////////// store mobile info
        $scope.appVersion = config.appVersion;
        $scope.deviceInformation = ionic.Platform.device();
        $scope.deviceName = $scope.deviceInformation.model;
        $scope.currentPlatform = ionic.Platform.platform();
        $scope.currentPlatformVersion = ionic.Platform.version();

        $scope.userDetailUndMobileDetail = {
          id_user : localStorage.getItem('id_user'),
          appVersion : $scope.appVersion,
          deviceName : $scope.deviceName,
          //deviceInformation : $scope.deviceInformation,
          currentPlatform : $scope.currentPlatform,
          currentPlatformVersion :  $scope.currentPlatformVersion
        };

        var infostr = config.urlBase+"controller/appInfo.php";
        $http.post(infostr, $scope.userDetailUndMobileDetail , {
          headers : {
              'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
          } })
          .then(function(response){
              console.log('success');

          },
          function(response){
            console.log('error');
            //$ionicLoading.show({ template: strings.ErrAcc, noBackdrop: true, duration: 2000});
      
          }
      
            ); 

///////////////////////////////////

        $ionicHistory.nextViewOptions({
          disableAnimate:true,
          disableBack:true,
          historyRoot:true,
        })
        $ionicHistory.clearCache();
        window.plugins.OneSignal.sendTags({city: localStorage.getItem('user_city'), key2: localStorage.getItem('user_geschlecht')});
          if($scope.admin.status === "nicht verifiziert"){
            $state.go('tab.uniid',{},{location:"replace",reload:true});
          } else  if($scope.admin.status === "verifiziert") {
            $state.go('tab.home',{},{location:"replace",reload:true});
          } else  if($scope.data === false) {
            $state.go('tab.completeRest',{},{location:"replace",reload:true});
          }
          
      });
      $ionicLoading.hide();
      //$state.go('app.home');
    }, function(fail){
      // Fail get profile info
      console.log('profile info fail', fail);
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    console.log('fbLoginError', error);
    $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=id,name,gender,location,picture.type(large),email,birthday&access_token=' + authResponse.accessToken, null,
      function (response) {
        console.log(response);
        var name = response.name;
        var location = response.location;
        var dob = response.birthday;
        var photo = "https://graph.facebook.com/" + response.id + "/picture?type=large";
        var gender = response.gender;
        name = name.split(" ");
        if((location === undefined) || (location === null)){
          location = 'Essen';
        }
        else {
          location = location.name;
        }
        if((dob === undefined) || (dob === null)){
          dob = '';
        }
        if((photo === undefined) || (photo === null)){
          photo = 'https://uniheld-app.cdemo.me/upload_photo/user.png';
        } else {
          photo = photo;
        }
        if((gender === undefined) || (gender === null)){
          gender = '';
        } else {
          if(gender === 'male'){
            gender = 'männlich';
          }
          if(gender === 'female'){
            gender = 'weiblich';
          }
        }


        $scope.userDetail = {
          user_firstname : name[0],
          user_lastname : name[1],
          user_email : response.email,
          user_uniemail : '',
          user_phone : '',
          user_alter : dob,
          user_gender : gender,
          user_standort : location,
          user_photo: photo,
          user_fbid: response.id, 
          user_status: 'nicht verifiziert',
          user_loginType: 'Facebook'
        };
        localStorage.setItem("user_loginType", 'Facebook');
        localStorage.setItem("afterLogin", JSON.stringify($scope.userDetail));
        info.resolve(response);
      },
      function (response) {
				console.log(response);
        info.reject(response);
      }
    );
    return info.promise;
  };

  //This method is executed when the user press the "Login with facebook" button
  $scope.FBlogin = function() {
    $ionicLoading.show({
      template: 'Laden...'
    });
    facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
  };
  /*
  var isFacebookAvailableOrReject = function(deferred){
    if(window.plugins == null || window.plugins.facebookConnectPlugin == null){
        setTimeout(function(){
            console.log("API not available");
            deferred.reject("API not available");
        }, 100);

        return false;
    }

    return true;
}
*/

  $scope.FBloginIfConnected = function() {
    //var deferred = $q.defer();
    //if(isGooglePlusAPIAvailableOrReject(deferred)){
    facebookConnectPlugin.getLoginStatus(function(success){
      if(success.status === 'connected'){
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        console.log('getLoginStatus', success.status);

    		// Check if we have our user saved
        var user = UserService.getUser('facebook');
    		if(!user.userID){
					getFacebookProfileInfo(success.authResponse)
					.then(function(profileInfo) {
						// For the purpose of this example I will store user data on local storage
						UserService.setUser({
							authResponse: success.authResponse,
							userID: profileInfo.id,
							name: profileInfo.name,
							email: profileInfo.email,
							picture : "https://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
						});              
            var urlGetData = config.urlBase+"controller/fbid.php?user_email="+profileInfo.email+"&user_login_type=Facebook+&user_login_id="+profileInfo.id;
            loginByOther.checkUserLoginStatus(urlGetData).then(function(data){
              $scope.data = data.data.records;
              $scope.admin=$scope.data;
              sessionStorage.setItem('loggedin_status',true);
              $scope.setUserDetailLocalstorage($scope.admin);

              //////////////////////////////// store mobile info
              $scope.appVersion = config.appVersion;
              $scope.deviceInformation = ionic.Platform.device();
              $scope.deviceName = $scope.deviceInformation.model;
              $scope.currentPlatform = ionic.Platform.platform();
              $scope.currentPlatformVersion = ionic.Platform.version();

              $scope.userDetailUndMobileDetail = {
                id_user : localStorage.getItem('id_user'),
                appVersion : $scope.appVersion,
                deviceName : $scope.deviceName,
                //deviceInformation : $scope.deviceInformation,
                currentPlatform : $scope.currentPlatform,
                currentPlatformVersion :  $scope.currentPlatformVersion
              };

              var infostr = config.urlBase+"controller/appInfo.php";
              $http.post(infostr, $scope.userDetailUndMobileDetail , {
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                } })
                .then(function(response){
                    console.log('success');

                },
                function(response){
                  console.log('error');
                  //$ionicLoading.show({ template: strings.ErrAcc, noBackdrop: true, duration: 2000});
            
                }
            
                  ); 

///////////////////////////////////

              $ionicHistory.clearCache();
              $ionicHistory.nextViewOptions({
                disableAnimate:true,
                disableBack:true,
                historyRoot:true,
              })
              window.plugins.OneSignal.sendTags({city: localStorage.getItem('user_city'), key2: localStorage.getItem('user_geschlecht')});
                if($scope.admin.status === "nicht verifiziert"){
                  $state.go('tab.uniid',{},{location:"replace",reload:true});
                } else  if($scope.admin.status === "verifiziert") {
                  $state.go('tab.home',{},{location:"replace",reload:true});
                } else  if($scope.data === false) {
                  $state.go('tab.completeRest',{},{location:"replace",reload:true});
                }
                
            });
						//$state.go('app.home');
					}, function(fail){
						// Fail get profile info
						console.log('profile info fail', fail);
					});
				}else{
					//$state.go('app.home');
        }
        var urlGetData = config.urlBase+"controller/fbid.php?user_email="+user.email+"&user_login_type=Facebook+&user_login_id="+user.id;
        loginByOther.checkUserLoginStatus(urlGetData).then(function(data){
          $scope.data = data.data.records;
          $scope.admin=$scope.data;
          sessionStorage.setItem('loggedin_status',true);
          $scope.setUserDetailLocalstorage($scope.admin);
  
          $ionicHistory.nextViewOptions({
            disableAnimate:true,
            disableBack:true,
            historyRoot:true,
          })
          $ionicHistory.clearCache();
          window.plugins.OneSignal.sendTags({city: localStorage.getItem('user_city'), key2: localStorage.getItem('user_geschlecht')});
            if($scope.admin.status === "nicht verifiziert"){
              $state.go('tab.uniid',{},{location:"replace",reload:true});
            } else  if($scope.admin.status === "verifiziert") {
              $state.go('tab.home',{},{location:"replace",reload:true});
            } else  if($scope.data === false) {
              $state.go('tab.completeRest',{},{location:"replace",reload:true});
            }
        });

      }
    });
   //}
  };
  

  $scope.setUserDetailLocalstorage = function(admin){

    localStorage.setItem('id_user',admin.user_id);
    localStorage.setItem('user_status',admin.status);
    localStorage.setItem('user_city',admin.city);
    localStorage.setItem('user_firstname',admin.user_firstname);
    localStorage.setItem('user_lastname',admin.user_lastname);
    localStorage.setItem('user_photo',admin.user_photo);
    localStorage.setItem('user_uniemail',admin.user_uniemail);
    localStorage.setItem('user_alter',admin.user_alter);
    localStorage.setItem('user_email',admin.user_email);
    localStorage.setItem('user_geschlecht',admin.user_geschlecht);
    localStorage.setItem('user_phone',admin.user_phone);
    localStorage.setItem('user_uniname',admin.uniname);
    localStorage.setItem('user_role',admin.user_role);
  }


// Auto Login 
//$scope.$on('$ionicView.beforeEnter', function(){
  $scope.checkLoginStatus = function(){

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      console.log('Device Ready');
    

    if(localStorage.getItem('user_loginType') === 'Facebook'){
      console.log('running facebook');
      $scope.FBloginIfConnected();
   }

   if(localStorage.getItem('user_loginType') === 'Google'){
    console.log('running Google');
    initView();
   }
  }
  }
  //});

  var silentLoginAttempt = function(){
		SocialAuth.isGooglePlusAvailable()
    	.then(function(available){
    		console.log("google plus availability is: " + available);
    		if(available){
    			var promise = SocialAuth.googlePlusSilentLogin();
    	    	promise.success(function(msg){
              console.log("silent login success");
              var id = msg.userId;
              var location = msg.location;
              var dob = msg.birthday;
              var photo = msg.imageUrl;
              var gender = msg.gender;
  
              if((location === undefined) || (location === null)){
                location = 'Essen';
              }
              if((dob === undefined) || (dob === null)){
                dob = '';
              }
              if((photo === undefined) || (photo === null)){
                photo = 'https://uniheld-app.cdemo.me/upload_photo/user.png';
              }
              if((gender === undefined) || (gender === null)){
                gender = '';
              } else {
                if(gender === 'male'){
                  gender = 'männlich';
                }
                if(gender === 'female'){
                  gender = 'weiblich';
                }
              }
              $scope.userDetail = {
                user_firstname : msg.givenName,
                user_lastname : msg.familyName,
                user_email : msg.email,
                user_uniemail : '',
                user_phone : '',
                user_alter : dob,
                user_gender : gender,
                user_standort : location,
                user_photo: photo,
                user_fbid: id, 
                user_status: 'nicht verifiziert',
                user_loginType: 'Google'
              };
                $ionicLoading.hide();
                var urlGetData = config.urlBase+"controller/fbid.php?user_email="+msg.email+"&user_login_type=Google+&user_login_id="+id;
                loginByOther.checkUserLoginStatus(urlGetData).then(function(data){
                  $scope.data = data.data.records;
                  $scope.admin=$scope.data;
                  sessionStorage.setItem('loggedin_status',true);
                  $scope.setUserDetailLocalstorage($scope.admin);
                  localStorage.setItem("user_loginType", 'Google');
                  $ionicHistory.nextViewOptions({
                    disableAnimate:true,
                    disableBack:true,
                    historyRoot:true,
                  })
                  $ionicHistory.clearCache();
                  window.plugins.OneSignal.sendTags({city: localStorage.getItem('user_city'), key2: localStorage.getItem('user_geschlecht')});
                    if($scope.admin.status === "nicht verifiziert"){
                      $state.go('tab.uniid',{},{location:"replace",reload:true});
                    } else  if($scope.admin.status === "verifiziert") {
                      $state.go('tab.home',{},{location:"replace",reload:true});
                    } else  if($scope.data === false) {
                      $state.go('tab.completeRest',{},{location:"replace",reload:true});
                    }
                });
    		    });
    	    	promise.error(function(err){
    	    		console.log("silent login failed: " + err);
    		    });
    		}
    	});
	}
	
    var initView = function(){
    	$ionicPlatform.ready(function(){
    		if(SocialAuth.getAuthUser() == null){
    			silentLoginAttempt();
    		}else{
          console.log('userInfo');
      }
    	})
    }
    
    
    /*
    // Facebook login function
    $scope.FBlogin = function(){
    
        $cordovaOauth.facebook("141557813331986", ["email", "public_profile", "user_website"]).then(function(result) {
            //alert('success login:'+JSON.stringify(result));
            localStorage.setItem('FBToken',result.access_token);
            $localStorage.accessToken = result.access_token;
               $http.get("https://graph.facebook.com/v2.2/me", {params: {access_token: localStorage.getItem("FBToken"), fields: "name,gender,location,picture.type(large),email,birthday", format: "json" }}).then(function(result) 
                    {

                //console.log(JSON.stringify(result));
                var name = result.data.name;
                   name = name.split(" ");
                var dob = result.data.birthday;
                var gender = result.data.gender;
                var location = result.data.location;
                var picture = result.data.picture;
               
                var id =result.data.id;
                var userid = localStorage.getItem("FBToken");
                debugger;
               $scope.userDetail = {
                  user_firstname : name[0],
                  user_lastname : name[1],
                  user_email : result.data.email,
                  user_uniemail : '',
                  user_phone : '',
                  user_alter : '',
                  user_gender : gender,
                  user_standort : location,
                  user_photo: picture, 
                  user_fbid: userid, 
                  user_status: 'nicht verifiziert',
                  user_loginType: 'FB'
                };
                localStorage.setItem("afterLogin", JSON.stringify($scope.userDetail));
                $state.go('tab.completeRest');

            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
            //$location.path("");
        }, function(error) {
            alert("There was a problem signing in!  See the console for logs");
            console.log(error);
        });
    }

    // Instagram login function
            $scope.instagramLogin = function () {
              console.log('Instagram');
              $cordovaOauth.instagram("9346182122134a09a9e65fab2bbb3761", ["basic", "likes"]).then(function (result) {
                console.log('success login:'+JSON.stringify(result));
                localStorage.setItem('instagramToken',result.access_token);
                $scope.oauthResult = result;
              }, function (error) {
                $scope.oauthResult = "OAUTH ERROR (see console)";
                console.log(error);
              });
            };
    */
    
    
    //This method is executed when the user press the "Login with Google" button
    $scope.googleSignIn = function() {
      $ionicLoading.show({
        template: 'Laden...'
      });
      
        $scope.loginInGoogle();
    };
      
  $scope.loginInGoogle = function(){
      window.plugins.googleplus.login(
          { },
          function (user_data) {
            console.log(user_data);
            //for the purpose of this example I will store user data on local storage
            var id = user_data.userId;
            //localStorage.setItem("googleToken", user_data.accessToken);
            //debugger;
            var location = user_data.location;
            var dob = user_data.birthday;
            var photo = user_data.imageUrl;
            var gender = user_data.gender;

            if((location === undefined) || (location === null)){
              location = 'Essen';
            }
            if((dob === undefined) || (dob === null)){
              dob = '';
            }
            if((photo === undefined) || (photo === null)){
              photo = 'https://uniheld-app.cdemo.me/upload_photo/user.png';
            }
            if((gender === undefined) || (gender === null)){
              gender = '';
            } else {
              if(gender === 'male'){
                gender = 'männlich';
              }
              if(gender === 'female'){
                gender = 'weiblich';
              }
            }
            $scope.userDetail = {
              user_firstname : user_data.givenName,
              user_lastname : user_data.familyName,
              user_email : user_data.email,
              user_uniemail : '',
              user_phone : '',
              user_alter : dob,
              user_gender : gender,
              user_standort : location,
              user_photo: photo,
              user_fbid: id, 
              user_status: 'nicht verifiziert',
              user_loginType: 'Google'
            };

            localStorage.setItem("user_loginType", 'Google');
            localStorage.setItem("afterLogin", JSON.stringify($scope.userDetail));
            //$state.go('tab.completeRest');
            UserService.setUser({
              userID: user_data.userId,
              name: user_data.displayName,
              email: user_data.email,
              picture: user_data.imageUrl,
              accessToken: user_data.accessToken,
              idToken: user_data.idToken
            });
  
            $ionicLoading.hide();
            var urlGetData = config.urlBase+"controller/fbid.php?user_email="+user_data.email+"&user_login_type=Google+&user_login_id="+id;
            loginByOther.checkUserLoginStatus(urlGetData).then(function(data){
              $scope.data = data.data.records;
              $scope.admin=$scope.data;
              sessionStorage.setItem('loggedin_status',true);
              $scope.setUserDetailLocalstorage($scope.admin);
              localStorage.setItem("user_loginType", 'Google');
              $ionicHistory.nextViewOptions({
                disableAnimate:true,
                disableBack:true,
                historyRoot:true,
              })
              $ionicHistory.clearCache();
              window.plugins.OneSignal.sendTags({city: localStorage.getItem('user_city'), key2: localStorage.getItem('user_geschlecht')});
                if($scope.admin.status === "nicht verifiziert"){
                  $state.go('tab.uniid',{},{location:"replace",reload:true});
                } else  if($scope.admin.status === "verifiziert") {
                  $state.go('tab.home',{},{location:"replace",reload:true});
                } else  if($scope.data === false) {
                  $state.go('tab.completeRest',{},{location:"replace",reload:true});
                }
            });
            //$state.go('app.home');
            //$state.go('tab.home',{},{location:"replace",reload:true});
          },
          function (msg) {
            $ionicLoading.hide();
            console.log(msg);
          }
      );
  }
      
    
}])


.controller('SignupCtrl', ['$scope', '$http', '$state', '$ionicHistory', 'config', 'strings', '$ionicLoading', '$cordovaCamera', '$cordovaFile', '$cordovaFileTransfer', '$cordovaDevice', '$ionicPopup', '$cordovaActionSheet','$ionicPlatform', function(
                             $scope, $http, $state, $ionicHistory, config, strings, $ionicLoading, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $ionicPopup, $cordovaActionSheet, $ionicPlatform) {
    
    $scope.titleCreate = strings.titleCreate;
    $scope.formFirstName = strings.formFirstName;
    $scope.formLastName = strings.formLastName;
    $scope.formPhone = strings.formPhone;
    $scope.formEmail = strings.formEmail;
    $scope.formPassword = strings.formPassword;
    $scope.formConfirmPassword = strings.formConfirmPassword;
    $scope.Signup = strings.Signup;
    $scope.AccReady = strings.AccReady;

    $scope.imagesfolder = config.urlBase+'upload_photo';

    $scope.showPass = function(){
        $scope.showPassword = !$scope.showPassword;
    }
    
    
    $scope.categories = [];
        $http.get(config.urlBase+'json/data_places_categories.php')
        .success(function(data, status, headers,config){
          console.log('Data categories success');
          $scope.categories = data.categories;
          $ionicLoading.hide();
          })
        .error(function(data, status, headers,config){
          console.log('Data categories error');
        })
    
    $scope.$on('$ionicView.beforeEnter', function() {
      analytics.trackView('Signup');
    });

    
//user_photo: 'https://romlove.com/sites/default/files/square.original.300x300uc.jpg', 
    $scope.saveusers = function (user){
      
      var nameOfImg = 'https://uniheld-app.cdemo.me/upload_photo/user.png';
      if(localStorage.getItem('nameOfImg') == undefined){
         nameOfImg = 'https://uniheld-app.cdemo.me/upload_photo/user.png';
      } else{
         nameOfImg =  'https://uniheld-app.cdemo.me/upload_photo/'+localStorage.getItem('nameOfImg');
      }


      $scope.user = {
        user_firstname : user.user_firstname,
        user_lastname : user.user_lastname,
        user_email : user.user_email,
        user_uniemail : user.user_uniemail,
        user_phone : user.user_phone ,
        user_alter : user.user_alter,
        user_standort : user.user_standort,
        user_password : user.user_password,
        user_photo: nameOfImg,
        user_geschlecht: user.user_geschlecht,
        user_fbid: 'null', 
        user_status: 'nicht verifiziert',
        user_login_type: ''
        
      };

    var urlSignup = config.urlBase+'controller/new_user.php';
    $http.post(urlSignup, $scope.user , {
    headers : {
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    } })
    .then(
    function(response){
      //console.log(response);
      if(response['data'].indexOf('request_status') == -1){
        $ionicLoading.show({ template: strings.SuccAcc, noBackdrop: true, duration: 2000});
        var user_email=$scope.user.user_email;
        var user_password=$scope.user.user_password;
        if(user_email && user_password){
        var str = config.urlBase+"controller/data_login.php?username="+user_email+"&password="+user_password;
        $http.get(str)
        .success(function(response){
               $scope.admin=response.records;
               sessionStorage.setItem('loggedin_status',true);
               localStorage.setItem('id_user',$scope.admin.user_id);
               localStorage.setItem('user_status',$scope.admin.status);
               localStorage.setItem('user_city',$scope.admin.city);
               localStorage.setItem('user_firstname',$scope.admin.user_firstname);
               localStorage.setItem('user_lastname',$scope.admin.user_lastname);
               localStorage.setItem('user_photo',$scope.admin.user_photo);
               localStorage.setItem('user_uniemail',$scope.admin.user_uniemail);
               localStorage.setItem('user_alter',$scope.admin.user_alter);
               localStorage.setItem('user_email',$scope.admin.user_email);
               localStorage.setItem('user_geschlecht',$scope.admin.user_geschlecht);
               localStorage.setItem('user_phone',$scope.admin.user_phone);
               localStorage.setItem('user_uniname',$scope.admin.uniname);


              //////////////////////////////// store mobile info
              $scope.appVersion = config.appVersion;
              $scope.deviceInformation = ionic.Platform.device();
              $scope.deviceName = $scope.deviceInformation.model;
              $scope.currentPlatform = ionic.Platform.platform();
              $scope.currentPlatformVersion = ionic.Platform.version();

              $scope.userDetailUndMobileDetail = {
                id_user : localStorage.getItem('id_user'),
                appVersion : $scope.appVersion,
                deviceName : $scope.deviceName,
                //deviceInformation : $scope.deviceInformation,
                currentPlatform : $scope.currentPlatform,
                currentPlatformVersion :  $scope.currentPlatformVersion
              };

              var infostr = config.urlBase+"controller/appInfo.php";
              $http.post(infostr, $scope.userDetailUndMobileDetail , {
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                } })
                .then(function(response){
                    console.log('success');

                },
                function(response){
                  console.log('error');
                  //$ionicLoading.show({ template: strings.ErrAcc, noBackdrop: true, duration: 2000});
            
                }
            
                  ); 

///////////////////////////////////


               $ionicHistory.nextViewOptions({
                 disableAnimate:true,
                 disableBack:true
               });
                    $state.go('tab.home',{},{location:"replace",reload:true});
               })
              .error(function(){
                $ionicPopup.alert({
                                  title: strings.passWrongtitle,
                                  template: '<center>'+strings.passWrongtext+'</center>',
                                  okType: "button-assertive",
                                  okText: strings.passWrongbutton,
                                  })
                });

          };
          //$state.go('tab.login',{},{location:"replace",reload:true});
        }else {
          $ionicLoading.show({ template: strings.ErrAcc, noBackdrop: true, duration: 2000});
      }
    },
    function(response){
      /* if account already exists or database not connected*/
      $ionicLoading.show({ template: strings.ErrAcc, noBackdrop: true, duration: 2000});

    }

      ); 

}

  $scope.image = null;
                                 
  $scope.galerie = function(){
    var type = Camera.PictureSourceType.PHOTOLIBRARY;
    $scope.selectPicture(type);
  }
  $scope.kamera = function(){
    var type = Camera.PictureSourceType.CAMERA;
    $scope.selectPicture(type);
  }                            
  // Present Actionsheet for switch beteen Camera / Library
  var cameraOptions;
  $scope.loadImage = function() {
    cameraOptions = $ionicPopup.alert({
      title: 'Bild auswählen',
      scope: $scope,
      template: '<button class="button button-block outline_button" ng-click="galerie()">Galerie</button><br><button ng-click="kamera()" class="button button-block outline_button">Kamera</button>',
      okType: "button-assertive",
      okText: 'Abbrechen',
    });
  };

  // Take image with the camera or from library and store it inside the app folder
  // Image will not be saved to users Library.
  $scope.selectPicture = function(sourceType) {
    $scope.show();
    cameraOptions.close();
    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };

    $cordovaCamera.getPicture(options).then(function(imagePath) {
      // Grab the file name of the photo in the temporary directory
      var currentName = imagePath.replace(/^.*[\\\/]/, '');

      //Create a new name for the photo
      var d = new Date(),
      n = d.getTime(),
      newFileName =  n + ".jpg";

      // If you are trying to load image from the gallery on Android we need special treatment!
      if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
        window.FilePath.resolveNativePath(imagePath, function(entry) {
          window.resolveLocalFileSystemURL(entry, success, fail);
          function fail(e) {
            console.error('Error: ', e);
          }

          function success(fileEntry) {
            var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
            // Only copy because of access rights
            $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
              $scope.image = newFileName;
              $scope.uploadImage();
              //$scope.hide();
            }, function(error){
              $scope.showAlert('Error', error.exception);
            });
          };
        }
      );
      } else {
        var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        // Move the file to permanent storage
        $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
          $scope.image = newFileName;
          $scope.uploadImage();
          //$scope.hide();
        }, function(error){
          $scope.showAlert('Error', error.exception);
        });
      }
    },
    function(err){
      // Not always an error, maybe cancel was pressed...
      $scope.hide();
    })
  };

  // Returns the local path inside the app for an image
  $scope.pathForImage = function(image) {
    if (image === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + image;
    }
  };


  $scope.uploadImage = function() {
    // Destination URL
    // var url = "http://localhost:8888/upload.php";
    var url = "https://uniheld-app.cdemo.me/upload_photo/upload.php";

    // File for Upload
    var targetPath = $scope.pathForImage($scope.image);

    // File name only
    var filename = $scope.image;
    localStorage.setItem('nameOfImg',filename );
    
    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      httpMethod : 'post',
      mimeType: "multipart/form-data",
      params : {'fileName': filename}
    };

    $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
      //$scope.showAlert('Erfolgreich', 'Der Bildupload ist abgeschlossen.');
      $ionicPopup.alert({
        title: 'Erfolgreich',
        template: '<center>Der Bildupload ist abgeschlossen.</center>',
        okType: "button-assertive",
        okText: 'ok',
      })
    });
    $scope.hide();
  }

  $scope.show = function() {

    $ionicLoading.show({
        template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
        });
    };
 
    $scope.hide = function(){
      $ionicLoading.hide();
    };

  $scope.showAlert = function(title, msg) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: msg
    });
  };             
                                 
                                 
                                 
                                 
                                 
                                 
}])

.controller('NoInternetCtrl', ['$scope', '$state', 'strings', '$ionicPlatform', '$ionicHistory', '$ionicPopup', function($scope, $state, strings, $ionicPlatform, $ionicHistory, $ionicPopup) {

  $scope.conMess = strings.conMess;
  $scope.conSubMess = strings.conSubMess;
  $scope.conTry = strings.conTry;

    $ionicPlatform.registerBackButtonAction(function(event) {
      console.log($state.current.name);
      if($state.current.name == "tab.nointernet") {
        $ionicPopup.confirm({
          title: strings.titleExit,
          template: '<center>'+strings.messageExit+'</center>',
          okType: "button-light",
          okText: strings.yesText,
          cancelType: "button-assertive",
          cancelText: strings.noText,
        }).then(function(res) {
          if (res) {
            ionic.Platform.exitApp();
          }
        })
      }
      else {
        navigator.app.backHistory();
      }
    }, 100);

  }])

.controller('HomeCtrl', ['$rootScope', '$scope', '$http', '$state', 'config', 'strings', '$ionicPlatform', '$ionicPopup', '$ionicHistory', '$cordovaToast', '$localStorage', function($rootScope, $scope, $http, $state, config, strings, $ionicPlatform, $ionicPopup, $ionicHistory, $cordovaToast, $localStorage) {

  /*
  var tabs = document.querySelectorAll('div.tabs')[0];
  tabs = angular.element(tabs);
  tabs.css('display', 'none');
  
  $scope.$on('$destroy', function() {
    console.log('HideCtrl destroy');
    tabs.css('display', '');
  });
  */
  /*
  $rootScope.$on('$stateChangeSuccess',
  function(event, toState, toParams, fromState, fromParams) {
    $state.current = toState;
    if(fromState.name == 'tab.uniid' || toState.name=='tab.verify'){
      console.log('sss');
      //$rootScope.hideBackButton = false;
      $rootScope.globalStyleVars = {
        'color': '#bce224',
      }
 
      
    }
  }
)
*/
  $scope.goBack = function() {
    
    $scope.lastViewTitle = $ionicHistory.backView();
    if($scope.lastViewTitle != null){
      if($scope.lastViewTitle.stateName == "tab.uniid")
      {
        window.history.back();
      } else { 
        
      $ionicHistory.backView().go();
      //$ionicHistory.goBack();
      }
    } else{
      window.history.back();
    }

  }

  
  
    $scope.options = {
      loop: false,
      effect: 'slide',
      speed: 500,
      spaceBetween: 5,
      slidesPerView:2.7,
      direction: 'horizontal',
      pagination: false,
    }

  
 $ionicHistory.clearCache();
    
  $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('Home');
  });

  $ionicPlatform.registerBackButtonAction(function(event) {
      console.log($state.current.name);
      if($state.current.name == "tab.home") {
        $ionicPopup.confirm({
          title: strings.titleExit,
          template: '<center>'+strings.messageExit+'</center>',
          okType: "button-light",
          okText: strings.yesText,
          cancelType: "button-assertive",
          cancelText: strings.noText,
        }).then(function(res) {
          if (res) {
            ionic.Platform.exitApp();
          }
        })
      }
      else {
        navigator.app.backHistory();
      }
    }, 100);


    var CheckInternetConnection = function() {
      if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
          $state.go('tab.nointernet');
          $ionicLoading.hide();
        }
      }
    }

    var id_user = localStorage.getItem("id_user");
    $scope.userId = id_user;
    
    var id_user = localStorage.getItem("id_user");
    $scope.userId = id_user;
    

    CheckInternetConnection();
 
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){

      if(!id_user) {
        $state.go('tab.login');
      }else{
        $state.go('tab.home');
      }
        
      })

    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
      $state.go('tab.nointernet');
      $ionicLoading.hide();
    })

    $scope.doLogout=function(){

      localStorage.removeItem('chequeado');
      localStorage.removeItem('loggedin_status');
      localStorage.removeItem('id_user');
      localStorage.removeItem('city');

        
        localStorage.removeItem('user_status');
        localStorage.removeItem('user_firstname');
        localStorage.removeItem('user_lastname');
        localStorage.removeItem('user_photo');
        localStorage.removeItem('user_uniemail');
        localStorage.removeItem('user_city');
        localStorage.removeItem('user_alter');
        localStorage.removeItem('user_phone');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_geschlecht');
        localStorage.removeItem('user_uniname');
        localStorage.removeItem('newsFavorites');
        localStorage.removeItem('offersFavorites');
        localStorage.removeItem('placesFavorites');
        localStorage.removeItem('nameOfImg');


        if(localStorage.getItem('user_loginType') === 'Facebook'){
          facebookConnectPlugin.logout(
            function(response){
                console.log(JSON.stringify(response));
                localStorage.removeItem('otherUserDetail');
                localStorage.removeItem('afterLogin');
                localStorage.removeItem('user_loginType');
            },
            function(err){
                console.log(JSON.stringify(err));
            }
          );
        }

        if(localStorage.getItem('user_loginType') === 'Google'){
          window.plugins.googleplus.logout(
            function (msg) {
              console.log(msg); // do something useful instead of alerting 
              localStorage.removeItem('otherUserDetail');
              localStorage.removeItem('afterLogin');
              localStorage.removeItem('user_loginType');
            }
          );
        }



      $ionicHistory.nextViewOptions({
        disableAnimate:true,
        disableBack:true
      })

      $state.go('tab.login',{},{location:"replace",reload:true});

    }
    
    
    $scope.doLogin=function(){

      $state.go('tab.login');

    }
    
    

  $scope.city = strings.cityName;
  $scope.welcomtext = strings.textWel;
    
  $scope.bestOffers = strings.bestOffers;
  
  $scope.otherCity = 'alle Standorte';
  $scope.localOfferstext = strings.localOfferstext;
  $scope.latestNewstext = strings.latestNews;
  $scope.bestOfferstext = strings.bestOffers;

  $scope.accountTitel = strings.accountTitel;
  $scope.aboutusTitel = strings.aboutusTitel;
  $scope.signoutTitel = strings.signoutTitel;
  $scope.contactTitel = strings.contactTitel;

  $scope.seeAlltext = strings.seeAll;
  $scope.currency = config.currency;
  $scope.imagesfolder = config.urlBase+'images';

    
  $scope.places = [];
  $http.get(config.urlBase+'json/data_places.php')
  .success(function(data, status, headers,config){
      console.log('Data places success');
      $scope.places = data.places;
      //$scope.pls = $scope.places.filter(Item =>  $scope.places.category_name == 'Essen');
      
      if(localStorage.getItem("user_role") == "Demo"){
        $scope.places = $scope.places.filter(Item =>  Item.place_status == 'Demo');
       /*
       var filteredplaces = [];
       for (var k = 0; k < $scope.places.length; ++k) {
           var item = $scope.places[k];
           if (item.place_status === "Demo") {
            filteredplaces.push(item);
          }
            
       }
       $scope.places = filteredplaces;
       */
      } 
      else {
        $scope.places = $scope.places.filter( item =>  item.place_status != 'Demo');
        
      }

  })
  .error(function(data, status, headers,config){
      console.log('Data places error');
  })

  $scope.categories = [];
  $http.get(config.urlBase+'json/data_places_categories.php')
    .success(function(data, status, headers,config){
      console.log('Data categories success');
      $scope.categories = data.categories;
      if(localStorage.getItem("user_city") == '' || localStorage.getItem("user_city") == undefined){
        $scope.user_city_name = 'Essen';
        $scope.user_city = 'essen.jpg';
      } else {
        $scope.cityDetail=$scope.categories.filter(Item=>Item.place_category_name==localStorage.getItem("user_city"));
        $scope.user_city_name=$scope.cityDetail[0].place_category_name;
        $scope.user_city=$scope.cityDetail[0].place_category_image;
      }
      
      
      
    })
    .error(function(data, status, headers,config){
      console.log('Data categories error');
    })

  $scope.news = [];
  $http.get(config.urlBase+'json/data_news.php')
    .success(function(data, status, headers,config){
      console.log('Data news success');
      $scope.news = data.news;    
      
    })
    .error(function(data, status, headers,config){
      console.log('Data news error');
    })
/*
    var todayDate = new Date();
    $scope.current = todayDate.getFullYear()  + "-" + (todayDate.getMonth() + 1)+ "-" + todayDate.getDate();
    var cdate =  $scope.current;

    $scope.compareDates = function(now){

     
      var pdate= Date.parse(now.toString());
      $scope.currentDate = cdate;
     // var Onow = new Date(now);


    // console.log('cdate='+typeof(cdate));
    // console.log('pdate='+typeof(pdate));
     
      if(cdate > pdate)
     {
       console.log('yes');
  
     } else {
      console.log('noo');

     }


    }
*/

  $scope.offers = [];
  $http.get(config.urlBase+'json/data_offers.php')
    .success(function(data, status, headers,config){
      console.log('Data offers success');
      $scope.offers = data.offers;
      //offer_status

      


      

      if(localStorage.getItem("user_role") == "Demo"){
        $scope.offers = $scope.offers.filter(Item =>  Item.offer_status == 'Demo');

      }
      else {
        $scope.offers = $scope.offers.filter(Item =>  Item.offer_status != 'Demo');
      }
      
    })
    .error(function(data, status, headers,config){
      console.log('Data offers error');
    })

  }])

.controller('CategoriesCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', '$timeout', '$ionicHistory', function($scope, $http, $state, config, strings, $ionicLoading, $timeout, $ionicHistory) {

  $ionicLoading.show({
  template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
  noBackdrop: true
  });
    
 
    
  $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('Lokale Angebote');
  });




  $scope.titlecategories = strings.categoriesTitel;
  $scope.selectCategory = strings.selectCategory;
  $scope.imagesfolder = config.urlBase+'images';

  $scope.categories = [];
  $http.get(config.urlBase+'json/data_places_categories.php')
    .success(function(data, status, headers,config){
      console.log('Data categories success');
      $scope.categories = data.categories;
      $ionicLoading.hide();
      })
    .error(function(data, status, headers,config){
      console.log('Data categories error');
    })

  }])

.controller('TypesCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', '$timeout', function($scope, $http, $state, config, strings, $ionicLoading, $timeout) {

  $ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
  });
    
  $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('Kategorie wählen');
  });
    


  $scope.selectType = strings.typeSelect;

  $scope.params = $state.params;
  $scope.cityName = $state.params.cityName;
  $scope.imagesfolder = config.urlBase+'images';
  $scope.categories = [];
  $http.get(config.urlBase+'json/data_places_categories.php')
    .success(function(data, status, headers,config){
      console.log('Data categories success');
      $scope.data = data.categories[$state.params.id];
      $scope.categories = data.categories;
      
    })

    .error(function(data, status, headers,config){
      console.log('Data categories error');
    })

  $scope.types = [];
  $http.get(config.urlBase+'json/data_places_types.php')
  .success(function(data, status, headers,config){
      console.log('Data types success');
      $scope.types = data.types;
      $ionicLoading.hide();
  })
  .error(function(data, status, headers,config){
      console.log('Data types error');
  })



  }])

.controller('CategoryPlaceCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', '$timeout', function($scope, $http, $state, config, strings, $ionicLoading, $timeout) {

$ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
  });

  $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('Kategorie Detail Page');
  });

 
    
 $scope.myTitle = 'IONIC RATINGS DEMO';

  $scope.ratingsObject = {
    iconOn: 'ion-ios-star', //Optional
    iconOff: 'ion-ios-star-outline', //Optional
    iconOnColor: 'rgb(200, 200, 100)', //Optional
    iconOffColor: 'rgb(200, 100, 100)', //Optional
    rating: 4, //Optional
    minRating: 0, //Optional
    readOnly: false, //Optional
    callback: function(rating,index) { //Mandatory    
      $scope.ratingsCallback(rating,index);
    }
  };

  $scope.ratingsCallback = function(rating, index) {
    console.log('Selected rating is : ', rating, ' and index is ', index);
  };

    
  $scope.params = $state.params;
  $scope.imagesfolder = config.urlBase+'images';
  $scope.types = [];
  $http.get(config.urlBase+'json/data_places_types.php')
    .success(function(data, status, headers,config){
      console.log('Data types success');
      $scope.data = data.types[$state.params.id];
      $scope.types = data.types;
      
    })

    .error(function(data, status, headers,config){
      console.log('Data types error');
    })

  $scope.places = [];
  $http.get(config.urlBase+'json/data_places.php')
  .success(function(data, status, headers,config){
      console.log('Data places success');
      $scope.places = data.places;

      if(localStorage.getItem("user_role") == "Demo"){
        $scope.places = $scope.places.filter(Item =>  Item.place_status == 'Demo');
      } 
      else {
        $scope.places = $scope.places.filter(Item =>  Item.place_status != 'Demo');
      }

      $scope.places = $scope.places.filter( item => item.category_name === localStorage.getItem("user_city") );

      $ionicLoading.hide();
  })
  .error(function(data, status, headers,config){
      console.log('Data places error');
  })
  
  
  }])

.controller('CategoryPlaceCityCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', '$timeout', function($scope, $http, $state, config, strings, $ionicLoading, $timeout) {



  $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('All places from One City');
  });
    
    



    
  $scope.params = $state.params.cityName;
  $scope.imagesfolder = config.urlBase+'images';
  $scope.places = [];
  $http.get(config.urlBase+'json/data_places.php')
  .success(function(data, status, headers,config){
      console.log('Data places success');
      $scope.places = data.places;
      $scope.places = $scope.places.filter(Item =>  Item.category_name == $scope.params);

      if(localStorage.getItem("user_role") == "Demo"){
        $scope.places = $scope.places.filter(Item => Item.place_status == 'Demo');
      } 
      else {
        $scope.places = $scope.places.filter(Item => Item.place_status != 'Demo');
      }
      
  })
  .error(function(data, status, headers,config){
      console.log('Data places error');
  })
  
  
  }])


.controller('OCategoriesCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', '$timeout', function($scope, $http, $state, config, strings, $ionicLoading, $timeout) {

    
  $ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
  });
    
    var id_user = localStorage.getItem("id_user");
    $scope.userId = id_user;
    
  $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('Top Angebote');
  });
    


  $scope.titleTopOffers = strings.titleTopOffers;
  $scope.selectCategory = strings.selectCategory;
  $scope.imagesfolder = config.urlBase+'images';

  $scope.offers_categories = [];
  $http.get(config.urlBase+'json/data_offers_categories.php')
    .success(function(data, status, headers,config){
      console.log('Data offers_categories success');
      $scope.offers_categories = data.offers_categories;
    $ionicLoading.hide();
    })
    .error(function(data, status, headers,config){
      console.log('Data offers_categories error');
    })
    

  }])


.controller('CategoryOfferCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', '$timeout', '$ionicModal', '$localStorage' , '$ionicPlatform', '$cordovaSocialSharing', function($scope, $http, $state, config, strings, $ionicLoading, $timeout, $ionicModal, $localStorage, $ionicPlatform, $cordovaSocialSharing) {

$scope.currency = config.currency;
    
    var id_user = localStorage.getItem("id_user");
    $scope.userId = id_user;


$ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
  });
    
  $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('Top Angebote Detail page');
  });
    
  $scope.titleShare = strings.titleShare;
  $scope.otherShare = strings.otherShare;

  $scope.params = $state.params;
  $scope.imagesfolder = config.urlBase+'images';
  $scope.offers_categories = [];
  $http.get(config.urlBase+'json/data_offers_categories.php')
    .success(function(data, status, headers,config){
      console.log('Data offers_categories success');
      $scope.data = data.offers_categories[$state.params.id];
      $scope.offers_categories = data.offers_categories;
      
    })

  .error(function(data, status, headers,config){
      console.log('Data offers_categories error');
    })

  $scope.offers = [];
  $http.get(config.urlBase+'json/data_offers.php')
  .success(function(data, status, headers,config){
      console.log('Data offers success');
      $scope.offers = data.offers;

      if(localStorage.getItem("user_role") == "Demo"){
        $scope.offers = $scope.offers.filter(Item =>  Item.offer_status == 'Demo');
      } 
      else {
        $scope.offers = $scope.offers.filter(Item => Item.offer_status != 'Demo');
      }


      $ionicLoading.hide();
  })
  .error(function(data, status, headers,config){
      console.log('Data offers error');
  })
  
  
  
  $ionicModal.fromTemplateUrl('share.html', function($ionicModal) {
        $scope.share = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });  


   $scope.shareViaTwitter = function() {
    var twitter = 'https://twitter.com/home?status='+$scope.appUrl;
    window.open(encodeURI(twitter), '_system');
  };

  $scope.shareViaGoogle = function() {
    var google = 'https://plus.google.com/share?url='+$scope.appUrl;
    window.open(encodeURI(google), '_system');
  };

   $scope.shareViaFacebook = function() {
    var facebook = 'https://www.facebook.com/sharer/sharer.php?u='+$scope.appUrl;
    window.open(encodeURI(facebook), '_system');
  };
        
  $scope.shareViaWhatsApp = function() {
    $cordovaSocialSharing.shareViaWhatsApp(strings.shareMess, $scope.imagesfolder+'/'+$scope.imagePlace, $scope.appUrl);
  };

 $scope.OtherShare=function(){
     window.plugins.socialsharing.share(strings.shareMess, null, null, $scope.appUrl);
  }

 $scope.addTofavorite = function(data){
    $ionicLoading.show({ template: strings.saved, noBackdrop: true, duration: 1000 });
    OffersService.favorite(data);
  };


  }])

  .controller('AllCategoryOfferCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', '$timeout', '$ionicModal', '$localStorage' , '$ionicPlatform', '$cordovaSocialSharing', '$ionicHistory', function($scope, $http, $state, config, strings, $ionicLoading, $timeout, $ionicModal, $localStorage, $ionicPlatform, $cordovaSocialSharing, $ionicHistory) {

    $scope.currency = config.currency;


        
        var id_user = localStorage.getItem("id_user");
        $scope.userId = id_user;
    
    $ionicLoading.show({
        template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
        noBackdrop: true
      });
        
      $scope.$on('$ionicView.beforeEnter', function() {
        analytics.trackView('Top Angebote Detail page');
      });
        
      $scope.titleShare = strings.titleShare;
      $scope.otherShare = strings.otherShare;
    
      $scope.params = $state.params;
      $scope.imagesfolder = config.urlBase+'images';
      $scope.offers_categories = [];
      $http.get(config.urlBase+'json/data_offers_categories.php')
        .success(function(data, status, headers,config){
          console.log('Data offers_categories success');
          $scope.data = data.offers_categories[$state.params.id];
          $scope.offers_categories = data.offers_categories;
          
        })
    
      .error(function(data, status, headers,config){
          console.log('Data offers_categories error');
        })
    
      $scope.offers = [];
      $http.get(config.urlBase+'json/data_offers.php')
      .success(function(data, status, headers,config){
          console.log('Data offers success');
          $scope.offers = data.offers;

          if(localStorage.getItem("user_role") == "Demo"){
            $scope.offers = $scope.offers.filter(Item =>  Item.offer_status == 'Demo');
          } 
          else {
            $scope.offers = $scope.offers.filter(Item =>  Item.offer_status != 'Demo');
          }

          $ionicLoading.hide();
      })
      .error(function(data, status, headers,config){
          console.log('Data offers error');
      })
      
      
      
      $ionicModal.fromTemplateUrl('share.html', function($ionicModal) {
            $scope.share = $ionicModal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });  
    
    
       $scope.shareViaTwitter = function() {
        var twitter = 'https://twitter.com/home?status='+$scope.appUrl;
        window.open(encodeURI(twitter), '_system');
      };
    
      $scope.shareViaGoogle = function() {
        var google = 'https://plus.google.com/share?url='+$scope.appUrl;
        window.open(encodeURI(google), '_system');
      };
    
       $scope.shareViaFacebook = function() {
        var facebook = 'https://www.facebook.com/sharer/sharer.php?u='+$scope.appUrl;
        window.open(encodeURI(facebook), '_system');
      };
            
      $scope.shareViaWhatsApp = function() {
        $cordovaSocialSharing.shareViaWhatsApp(strings.shareMess, $scope.imagesfolder+'/'+$scope.imagePlace, $scope.appUrl);
      };
    
     $scope.OtherShare=function(){
         window.plugins.socialsharing.share(strings.shareMess, null, null, $scope.appUrl);
      }
    
     $scope.addTofavorite = function(data){
        $ionicLoading.show({ template: strings.saved, noBackdrop: true, duration: 1000 });
        OffersService.favorite(data);
      };
    
    
      }])

.controller('SearchCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', '$timeout', function($scope, $http, $state, config, strings, $ionicLoading, $timeout) {

  $scope.titlesearch = strings.searchTitel;
  $scope.searchresults = strings.resultsSearch;
  $scope.inputext = strings.inputSearch;
    
  $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('Suche');
  });

  $ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
  });

  $scope.params = $state.params;
  $scope.imagesfolder = config.urlBase+'images';
  $scope.places = [];
  $http.get(config.urlBase+'json/data_places.php')
    .success(function(data, status, headers,config){
      console.log('Data places success');
      $scope.data = data.places[$state.params.id];
      $scope.places = data.places;

      if(localStorage.getItem("user_role") == "Demo"){
        $scope.places = $scope.places.filter(Item =>  Item.place_status == 'Demo');
      } 
      else {
        $scope.places = $scope.places.filter(Item =>  Item.place_status != 'Demo');
      }


      $ionicLoading.hide();
  })

  .error(function(data, status, headers,config){
      console.log('Data places error');
  })


}])

.controller('OSearchCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', '$timeout', function($scope, $http, $state, config, strings, $ionicLoading, $timeout) {

  $scope.titleOfferssearch = strings.searchOffersTitel;
  $scope.searchresults = strings.resultsSearch;
  $scope.inputext = strings.inputSearch;

  $ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
  });

  $scope.imagesfolder = config.urlBase+'images';
  $scope.offers = [];
  $http.get(config.urlBase+'json/data_offers.php')
    .success(function(data, status, headers,config){
      console.log('Data offers success');
      $scope.offers = data.offers;

      if(localStorage.getItem("user_role") == "Demo"){
        $scope.offers = $scope.offers.filter(Item =>  Item.offer_status == 'Demo');
      } 
      else {
        $scope.offers = $scope.offers.filter(Item =>  Item.offer_status != 'Demo');
      }


      $ionicLoading.hide();
  })

  .error(function(data, status, headers,config){
      console.log('Data offers error');
  })


}])

.controller('NCategoriesCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', '$timeout', '$ionicModal', '$ionicHistory', function($scope, $http, $state, config, strings, $ionicLoading, $timeout, $ionicModal, $ionicHistory) {

  $ionicLoading.show({
  template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
  noBackdrop: true
  });
    


  $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('Aktuelle Campus Events');
  });

    
  $scope.titlenews = strings.newsTitel;
  $scope.selectCategory = strings.selectEventCategory;

  $scope.imagesfolder = config.urlBase+'images';


   $scope.news_categories = [];
  $http.get(config.urlBase+'json/data_news_categories.php')
    .success(function(data, status, headers,config){
      console.log('Data news_categories success');
      $scope.news_categories = data.news_categories;
      $ionicLoading.hide();
      })
    .error(function(data, status, headers,config){
      console.log('Data news_categories error');
    })
    /*
     // related with facebook events
    $scope.news = [];
    $http.get(config.urlBase+'json/data_news.php')
    .success(function(data, status, headers,config){
        console.log('Data news success');
        $scope.news = data.news;
        $ionicLoading.hide();
    })
    .error(function(data, status, headers,config){
        console.log('Data news error');
    })

    // related with facebook events
    $scope.eventsNews = [];
    $http.get(config.urlBase+'json/facebook_events.php')
    .success(function(data, status, headers,config){
        console.log('Data events success');
        $scope.eventsNews = data.events;
        //$scope.eventFulllist = data.events;
        //$scope.news_categories = $scope.eventFulllist;
          //$scope.events = data.events.filter( item => item.category_name === localStorage.getItem("user_city") );
          console.log($scope.events);
          $ionicLoading.hide();
    })
    .error(function(data, status, headers,config){
        console.log('Data event error');
    })
*/

  }])

.controller('UniIdCtrl', ['$scope', '$localStorage', '$state', '$location', '$ionicHistory', '$http', 'config'  , function($scope, $localStorage, $state, $location, $ionicHistory, $http, config  ) {


    $scope.status_user = localStorage.getItem("user_status");
    $scope.user_firstname = localStorage.getItem("user_firstname");
    $scope.user_lastname = localStorage.getItem("user_lastname");
    $scope.user_photo = localStorage.getItem("user_photo");
    $scope.user_uniname = localStorage.getItem("user_uniname");

    var photoname = $scope.user_photo.substring($scope.user_photo.lastIndexOf('/')+1);
    if(photoname === 'user.png'){
      $scope.showmsg= 'ID nur mit Profilbild und Verifizierung gültig';
    }

     if($scope.user_uniname == '' || $scope.user_uniname == undefined){
        $scope.user_uniname = '';
     }
    
    $scope.verify = function(){
       // alert('DFDAS00');
       /*
       $rootScope.hideBackButton = false;
       $ionicViewService.nextViewOptions({
        disableBack: true
       });
     */
         $state.go('tab.verify');
    }

    $scope.verificationChecker = function(){
      $scope.statusData = [];
      var user_email = localStorage.getItem("user_email");
      //var urlGetData = config.urlBase+"controller/fbid.php?user_email="+user_email+"&user_login_type=null&user_login_id=null";
      //var urlGetData = config.urlBase+"controller/fbid.php?user_email="+user_email+"&user_login_type="+' '+"&user_login_id="+' ';
      var urlGetData = config.urlBase+"controller/userstatus.php?user_email="+user_email;
      $http.get(urlGetData)
      .success(function(data, status, headers,config){
               console.log('success');
               $scope.statusData = data.records;
               localStorage.setItem('user_status',$scope.statusData.status);
               //alert($scope.statusData.status);
               if($scope.statusData.status === 'verifiziert'){
                   //alert('stop');
                   $ionicHistory.nextViewOptions({
                    disableAnimate:true,
                    disableBack:true,
                  })
                   $state.go('tab.home',{},{location:"replace",reload:true});
               }
               })
    
      .error(function(data, status, headers,config){
             console.log('Data error');
      })
      }

   // navigationButton.visibility = 'collapse'
    
 

}])
.controller('VerifyCtrl', ['$scope', '$localStorage', '$state', 'config', '$http', '$location', '$ionicPlatform', '$ionicHistory', '$ionicLoading', '$rootScope', '$ionicPopup', 'ClockSrv', function($scope, $localStorage, $state, config, $http, $location, $ionicPlatform, $ionicHistory, $ionicLoading, $rootScope, $ionicPopup, ClockSrv ) {

                           

  $scope.user = {

  user_uniemail : localStorage.getItem("user_uniemail"),

  };

  $scope.hideBackButton = false;


  $scope.status_user = localStorage.getItem("status_user");
  $scope.user_uniemail = localStorage.getItem("user_uniemail");

  $scope.checkUniName = function(v){
  var lastemail=v;
  var splitUniEmailAddress = v.split("@");
  var uniEmailAddressIs = splitUniEmailAddress[1];

  /*

   $scope.checkUniNameInDb = $scope.uniDb.filter(Item => Item.uni_email_end === uniEmailAddressIs);

   if($scope.checkUniNameInDb.length <= 0){

   $scope.msgVerify = "Diese Universität existiert nicht in unserer Datenbank. Bitte schreibe richtig";

   }

   */

  $ionicLoading.show();
  $scope.user = {
  userid : localStorage.getItem('id_user'),
  uniEmail : $scope.user.user_uniemail,
  old_uniemail : $scope.user_uniemail,
  };

  var baseurl = config.urlBase;
  var checkEmailIsRite = config.urlBase+'/controller/uniemail.php?uniemail='+uniEmailAddressIs+'&fullEmail='+lastemail;
  $http.get(checkEmailIsRite)
  .success(function(data, status, headers,config){

           console.log(data);
           $scope.data = data.status;
           $scope.uniname = data.uniname;
           if($scope.data === 'success'){

           if(localStorage.getItem('id_user')){

           //var urlVerify = config.urlBase+"controller/sendEmailForVerification.php?userid="+localStorage.getItem('id_user')+"&uniEmail="+$scope.user_uniemail;

           var urlVerify = baseurl+"controller/sendEmailForVerification.php";

           $http.post(urlVerify,$scope.user, {

                      headers : {

                      'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'

                      } } )

           .success(function(){

                    console.log('success');

                    if($scope.user.uniEmail != $scope.user.old_uniemail){
                      console.log('old uni emial and new uni email dont match');
                      localStorage.setItem('user_uniemail', $scope.user.uniEmail);
                    }
                    $scope.user.user_uniemail=$scope.user.uniEmail;
                    $ionicLoading.hide();
                    $scope.msgVerify = "Bitte bestätige die Verifizierung."
                    $ionicLoading.show({ template: $scope.contactSuccess, noBackdrop: true, duration: 500 });
                    })

           .error(function(){
                  $scope.user.user_uniemail=lastemail;

                  $ionicLoading.hide();

                  //$ionicLoading.show({ template: $scope.contactFailed, noBackdrop: true, duration: 2000 });

                  });

           }
           } else if($scope.data === 'exists'){
              $ionicLoading.hide();
              $scope.user.user_uniemail=lastemail;
              $scope.msgVerify = "Überprüfe deine Eingabe. Deine Uni E-Mail existiert bereits.";
           }else {
            $ionicLoading.hide();
            $scope.user.user_uniemail=lastemail;
            $scope.msgVerify = "Überprüfe deine Eingabe. Deine Uni E-Mail Adresse scheint nicht korrekt zu sein.";
           }

           })
           .error(function(data, status, headers,config){
            console.log('Data Error');
            $ionicLoading.hide();
           });

  }

  $scope.senden=function(user){
  $scope.msgVerify = "";

  var checkUniName =  $scope.checkUniName($scope.user.user_uniemail);

  /*
  ClockSrv.startClock(function(){
      verificationChecker();
  });
  */

  }


/*
  var verificationChecker = function(){
  //alert('wdfcwd');
  $scope.statusData = [];
  var user_email = localStorage.getItem("user_email");
  //var urlGetData = config.urlBase+"controller/fbid.php?user_email="+user_email+"&user_login_type=null&user_login_id=null";
  //var urlGetData = config.urlBase+"controller/fbid.php?user_email="+user_email+"&user_login_type="+' '+"&user_login_id="+' ';
  var urlGetData = config.urlBase+"controller/userstatus.php?user_email="+user_email;
  $http.get(urlGetData)
  .success(function(data, status, headers,config){
           console.log('success');
           $scope.statusData = data.records;
           localStorage.setItem('user_status',$scope.statusData.status);
           //alert($scope.statusData.status);
           if($scope.statusData.status === 'verifiziert'){
               //alert('stop');
               ClockSrv.stopClock();
               $ionicHistory.nextViewOptions({
                disableAnimate:true,
                disableBack:true,
              })
               $state.go('tab.home',{},{location:"replace",reload:true});
           }
           })

  .error(function(data, status, headers,config){
         console.log('Data error');
  })
  }
  */
/*
  $scope.$on('$destroy', function() {
        alert('stop on dis');
        ClockSrv.stopClock();
  });
          */

}])
.controller('completeRestCtrl', ['$scope', '$localStorage', '$state', 'strings', '$http', 'config', '$ionicLoading', '$ionicHistory' , function($scope, $localStorage, $state, strings, $http, config, $ionicLoading, $ionicHistory ) {


$scope.accountTitel = strings.accountTitel;
$scope.accountFirstName = strings.accountFirstName;
$scope.accountLastName = strings.accountLastName;
$scope.accountPhone = strings.accountPhone;
$scope.accountEmail = strings.accountEmail;
$scope.favoritesTitel = strings.favoritesTitel;
$scope.purchasesTitel = strings.purchasesTitel;
$scope.signoutTitel = strings.signoutTitel;
$scope.contactTitel = strings.contactTitel;
$scope.formPhone = strings.formPhone;
    


    $scope.categories = [];
    $http.get(config.urlBase+'json/data_places_categories.php')
    .success(function(data, status, headers,config){
    console.log('Data categories success');
    $scope.categories = data.categories;
    $ionicLoading.hide();
    })
    .error(function(data, status, headers,config){
    console.log('Data categories error');
    })

    $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('Signup');
    });
    
    
    
    $scope.user_detail = localStorage.getItem("afterLogin");
    $scope.user_detail = JSON.parse($scope.user_detail);
    
    if($scope.user_detail.user_photo == undefined){
      $scope.user_detail.user_photo = "";
    }
    
        $scope.user = {
          user_firstname : $scope.user_detail.user_firstname,
          user_lastname : $scope.user_detail.user_lastname,
          user_email : $scope.user_detail.user_email,
          user_uniemail : '',
          user_phone : '',
          user_alter : $scope.user_detail.user_alter,
          user_standort : $scope.user_detail.user_standort,
          user_password : '',
          user_photo: $scope.user_detail.user_photo,
          user_fbid: $scope.user_detail.user_fbid, 
          user_status: 'nicht verifiziert',
          user_geschlecht:$scope.user_detail.user_gender,
          user_loginType: $scope.user_detail.user_loginType,
        };   
   
    $scope.speichern = function (user){


        var urlSignup = config.urlBase+'controller/new_user.php';
        $http.post(urlSignup, user, {
          headers : {
            'Access-Control-Allow-Origin' : '*',
              'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
          } })
        .success(function(response){
          console.log(response);
          var str = config.urlBase+"controller/data_login_by_other.php?username="+ $scope.user.user_email;
          $http.get(str)
          .success(function(response){
            
             // $ionicHistory.clearCache();
             // $ionicHistory.clearHistory();
            
              $scope.admin=response.records;

              sessionStorage.setItem('loggedin_status',true);
              localStorage.setItem('id_user',$scope.admin.user_id);
              localStorage.setItem('user_status',$scope.admin.status);
              localStorage.setItem('user_city',$scope.admin.city);
              localStorage.setItem('user_firstname',$scope.admin.user_firstname);
              localStorage.setItem('user_lastname',$scope.admin.user_lastname);
              localStorage.setItem('user_photo',$scope.admin.user_photo);
              localStorage.setItem('user_uniemail',$scope.admin.user_uniemail);
              localStorage.setItem('user_alter',$scope.admin.user_alter);
              localStorage.setItem('user_email',$scope.admin.user_email);
              localStorage.setItem('user_geschlecht',$scope.admin.user_geschlecht);
              localStorage.setItem('user_phone',$scope.admin.user_phone);
              localStorage.setItem('user_uniname',$scope.admin.uniname);
              //$ionicNavBarDelegate.showBackButton(false);
              $ionicHistory.nextViewOptions({
                disableAnimate:true,
                disableBack:true,
               
              })
              $state.go('tab.uniid',{},{location:"replace",reload:true});
          })
          .error(function(){   
            console.log('sec error');
          //$ionicLoading.show({ template: $scope.contactFailed, noBackdrop: true, duration: 2000 });        
          });
          $ionicLoading.show({ template: strings.SuccAcc, noBackdrop: true, duration: 2000});
       //$ionicLoading.show({ template: $scope.contactSuccess, noBackdrop: true, duration: 2000 });             
       })
       .error(function(){   
         console.log('error');
       //$ionicLoading.show({ template: $scope.contactFailed, noBackdrop: true, duration: 2000 });        
       });
       
    };


$scope.springToHome = function(){

  
  var urlSignup = config.urlBase+'controller/new_user.php';
  $http.post(urlSignup, $scope.user, {
    headers : {
      'Access-Control-Allow-Origin' : '*',
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    } })
  .success(function(response){
    console.log('success');
    var str = config.urlBase+"controller/data_login_by_other.php?username="+ $scope.user.user_email;
    $http.get(str)
    .success(function(response){
      
       // $ionicHistory.clearCache();
       // $ionicHistory.clearHistory();
      
        $scope.admin=response.records;

        sessionStorage.setItem('loggedin_status',true);
        localStorage.setItem('id_user',$scope.admin.user_id);
        localStorage.setItem('user_status',$scope.admin.status);
        localStorage.setItem('user_city',$scope.admin.city);
        localStorage.setItem('user_firstname',$scope.admin.user_firstname);
        localStorage.setItem('user_lastname',$scope.admin.user_lastname);
        localStorage.setItem('user_photo',$scope.admin.user_photo);
        localStorage.setItem('user_uniemail',$scope.admin.user_uniemail);
        localStorage.setItem('user_alter',$scope.admin.user_alter);
        localStorage.setItem('user_email',$scope.admin.user_email);
        localStorage.setItem('user_geschlecht',$scope.admin.user_geschlecht);
        localStorage.setItem('user_phone',$scope.admin.user_phone);
        //$ionicNavBarDelegate.showBackButton(false);
        $ionicHistory.nextViewOptions({
          disableAnimate:true,
          disableBack:true,
         
        })
        $state.go('tab.home',{},{location:"replace",reload:true});
    })
    .error(function(){   
      console.log('sec error');
    //$ionicLoading.show({ template: $scope.contactFailed, noBackdrop: true, duration: 2000 });        
    });
    $ionicLoading.show({ template: strings.SuccAcc, noBackdrop: true, duration: 2000});
 //$ionicLoading.show({ template: $scope.contactSuccess, noBackdrop: true, duration: 2000 });             
 })
 .error(function(){   
   console.log('error');
 //$ionicLoading.show({ template: $scope.contactFailed, noBackdrop: true, duration: 2000 });        
 }); 

 /*
         $ionicHistory.nextViewOptions({
          disableAnimate:true,
          disableBack:true,
         
        })
        $state.go('tab.home',{},{location:"replace",reload:true});
  */
}

}])

.controller('filterCityCtrl', ['$scope', '$localStorage', function($scope, $localStorage, config) {


    $scope.imagesfolder = config.urlBase+'images';
    $scope.categories = [];
    $http.get(config.urlBase+'json/data_places_categories.php')
    .success(function(data, status, headers,config){
    console.log('Data categories success');
    $scope.categories = data.categories;

    })
    .error(function(data, status, headers,config){
    console.log('Data categories error');
    })

}])

.controller('NSearchCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', '$timeout', function($scope, $http, $state, config, strings, $ionicLoading, $timeout) {

  $scope.titleNewssearch = strings.searchnewsTitel;
  $scope.searchresults = strings.resultsSearch;
  $scope.inputext = strings.inputSearch;

  $ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
  });

  $scope.imagesfolder = config.urlBase+'images';
  $scope.news = [];
  $http.get(config.urlBase+'json/data_news.php')
    .success(function(data, status, headers,config){
      console.log('Data news success');
      $scope.news = data.news;
      $ionicLoading.hide();
  })

  .error(function(data, status, headers,config){
      console.log('Data news error');
  })

/*
  // facebook events
  $scope.eventFulllist = [];
  $http.get(config.urlBase+'json/facebook_events.php')
  .success(function(data, status, headers,config){
    console.log('Data events success');
    $scope.events = data.events;
      console.log($scope.events);
      $ionicLoading.hide();
  })
  .error(function(data, status, headers,config){
    console.log('Data event error');
  })
*/

}])

.controller('CategoryNewsCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', '$timeout', '$ionicModal' ,'$localStorage' , function($scope, $http, $state, config, strings, $ionicLoading, $timeout, $ionicModal, $localStorage) {

$ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
  });
    
    var id_user = localStorage.getItem("id_user");
    $scope.userId = id_user;
    
    //alert('dsvdsv');
  $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('Aktuelle Campus Events Detail');
  });

  $scope.params = $state.params;
  $scope.imagesfolder = config.urlBase+'images';
  $scope.news_categories = [];
  $http.get(config.urlBase+'json/data_news_categories.php')
    .success(function(data, status, headers,config){
      console.log('Data news_categories success');
      $scope.data = data.news_categories[$state.params.id];
      $scope.news_categories = data.news_categories;
    })

    .error(function(data, status, headers,config){
      console.log('Data news_categories error');
    })

  $scope.news = [];
  $http.get(config.urlBase+'json/data_news.php')
  .success(function(data, status, headers,config){
      console.log('Data news success');
      $scope.news = data.news;
      $ionicLoading.hide();
  })
  .error(function(data, status, headers,config){
      console.log('Data news error');
  })

  $scope.countItems = function(items) {
    var noData = 0;
    if(items > 0) {
      noData = 1;
    }
    return noData;
};

  
    $ionicModal.fromTemplateUrl('share.html', function($ionicModal) {
        $scope.share = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });  


   $scope.shareViaTwitter = function() {
    var twitter = 'https://twitter.com/home?status='+$scope.appUrl;
    window.open(encodeURI(twitter), '_system');
  };

  $scope.shareViaGoogle = function() {
    var google = 'https://plus.google.com/share?url='+$scope.appUrl;
    window.open(encodeURI(google), '_system');
  };

   $scope.shareViaFacebook = function() {
    var facebook = 'https://www.facebook.com/sharer/sharer.php?u='+$scope.appUrl;
    window.open(encodeURI(facebook), '_system');
  };

  $scope.shareViaWhatsApp = function() {
    $cordovaSocialSharing.shareViaWhatsApp(strings.shareMess, $scope.imagesfolder+'/'+$scope.imagePlace, $scope.appUrl);
  };

 $scope.OtherShare=function(){
     window.plugins.socialsharing.share(strings.shareMess, null, null, $scope.appUrl);
  }

 $scope.addTofavorite = function(data){
    $ionicLoading.show({ template: strings.saved, noBackdrop: true, duration: 1000 });
    OffersService.favorite(data);
  };


  }])
  .controller('AllCategoryNewsCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', '$timeout', '$ionicModal' ,'$localStorage' , function($scope, $http, $state, config, strings, $ionicLoading, $timeout, $ionicModal, $localStorage) {

    $ionicLoading.show({
        template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
        noBackdrop: true
      });
        
        var id_user = localStorage.getItem("id_user");
        $scope.userId = id_user;
        
        //alert('dsvdsv');
      $scope.$on('$ionicView.beforeEnter', function() {
        analytics.trackView('Aktuelle Campus Events Detail');
      });
    
      $scope.params = $state.params;
      $scope.imagesfolder = config.urlBase+'images';
      $scope.news_categories = [];
      $http.get(config.urlBase+'json/data_news_categories.php')
        .success(function(data, status, headers,config){
          console.log('Data news_categories success');
          $scope.data = data.news_categories[$state.params.id];
          $scope.news_categories = data.news_categories;
        })
    
        .error(function(data, status, headers,config){
          console.log('Data news_categories error');
        })
    
      $scope.news = [];
      $http.get(config.urlBase+'json/data_news.php')
      .success(function(data, status, headers,config){
          console.log('Data news success');
          $scope.news = data.news;
          $ionicLoading.hide();
      })
      .error(function(data, status, headers,config){
          console.log('Data news error');
      })
    
      
        $ionicModal.fromTemplateUrl('share.html', function($ionicModal) {
            $scope.share = $ionicModal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });  
    
    
       $scope.shareViaTwitter = function() {
        var twitter = 'https://twitter.com/home?status='+$scope.appUrl;
        window.open(encodeURI(twitter), '_system');
      };
    
      $scope.shareViaGoogle = function() {
        var google = 'https://plus.google.com/share?url='+$scope.appUrl;
        window.open(encodeURI(google), '_system');
      };
    
       $scope.shareViaFacebook = function() {
        var facebook = 'https://www.facebook.com/sharer/sharer.php?u='+$scope.appUrl;
        window.open(encodeURI(facebook), '_system');
      };
    
      $scope.shareViaWhatsApp = function() {
        $cordovaSocialSharing.shareViaWhatsApp(strings.shareMess, $scope.imagesfolder+'/'+$scope.imagePlace, $scope.appUrl);
      };
    
     $scope.OtherShare=function(){
         window.plugins.socialsharing.share(strings.shareMess, null, null, $scope.appUrl);
      }
    
     $scope.addTofavorite = function(data){
        $ionicLoading.show({ template: strings.saved, noBackdrop: true, duration: 1000 });
        OffersService.favorite(data);
      };
    
    
      }])

.controller('PostCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', '$ionicModal', '$timeout', '$ionicPlatform', '$cordovaSocialSharing', '$cordovaInAppBrowser', 'NewsService', function($scope, $http, $state, config, strings, $ionicLoading, $ionicModal, $timeout, $ionicPlatform, $cordovaSocialSharing, $cordovaInAppBrowser, NewsService) {

  $ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
  });

  $scope.description = strings.descText;
  $scope.titlenews = strings.newsTitel;
  $scope.relatedNewstext = strings.relatedNews;
  $scope.moretext = strings.seeAll;
  $scope.titleShare = strings.titleShare;
  $scope.otherShare = strings.otherShare;

  //$scope.params = $state.params;
  $scope.imagesfolder = config.urlBase+'images';
  $scope.news = [];
  $http.get(config.urlBase+'json/data_news.php')
    .success(function(data, status, headers,config){
      console.log('Data news success');
      $scope.data = data.news[$state.params.id];
      $scope.imageEvent = $scope.data.news_image;

      $scope.news = data.news;
      $scope.news_adresse = $scope.data.news_adresse;
      $scope.data.news_date = Date.parse($scope.data.news_date);
      //$scope.imagePost = $scope.data.news_image;
      $ionicLoading.hide();
    })
    .error(function(data, status, headers,config){
      console.log('Data news error');
    })



  $scope.openMap = function(map) {
    var url = 'https://www.google.com/maps/search/?api=1&query='+$scope.news_adresse+'&zoom=15';
    // var url = 'https://www.google.com/maps/search/?api=1&query='+$scope.placesAddress+$scope.latitude+','+$scope.longitude+'&zoom=15';
    window.open(encodeURI(url), '_system');
  }

  $ionicModal.fromTemplateUrl('share.html', function($ionicModal) {
  $scope.share = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });  


  var isIOS = ionic.Platform.isIOS();
  var isAndroid = ionic.Platform.isAndroid();


  $ionicPlatform.ready(function() { 
    if (isIOS) {
      $scope.appUrl = config.appstoreAppUrl+config.appstoreAppId;
    }
    if (isAndroid) {
      $scope.appUrl = config.playstoreAppUrl+config.playstoreAppId;
    }
  });

    $scope.shareViaTwitter = function() {
    var twitter = 'https://twitter.com/home?status='+$scope.appUrl;
    window.open(encodeURI(twitter), '_system');
  };

  $scope.shareViaGoogle = function() {
    var google = 'https://plus.google.com/share?url='+$scope.appUrl;
    window.open(encodeURI(google), '_system');
  };

    $scope.shareViaFacebook = function() {
    var facebook = 'https://www.facebook.com/sharer/sharer.php?u='+$scope.appUrl;
    window.open(encodeURI(facebook), '_system');
  };

  $scope.shareViaWhatsApp = function() {
    $cordovaSocialSharing.shareViaWhatsApp(strings.shareMess, $scope.imagesfolder+'/'+$scope.imageEvent, $scope.appUrl);
  };

  $scope.OtherShare=function(){
      window.plugins.socialsharing.share(strings.shareMess, null, null, $scope.appUrl);
  }

  $scope.addTofavorite = function(data){
    $ionicLoading.show({ template: strings.saved, noBackdrop: true, duration: 1000 });
    NewsService.favorite(data);
  };

  }])

.controller('PostFBCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', '$ionicModal', '$timeout', '$ionicPlatform', '$cordovaSocialSharing', '$cordovaInAppBrowser', 'NewsService', function($scope, $http, $state, config, strings, $ionicLoading, $ionicModal, $timeout, $ionicPlatform, $cordovaSocialSharing, $cordovaInAppBrowser, NewsService) {

  $ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
  });

  $scope.description = strings.descText;
  $scope.titlenews = strings.newsTitel;
  $scope.relatedNewstext = strings.relatedNews;
  $scope.moretext = strings.seeAll;
  $scope.titleShare = strings.titleShare;
  $scope.otherShare = strings.otherShare;

  $scope.params = $state.params;
  $scope.imagesfolder = config.urlBase+'images';


  $scope.eventNews = [];
  $http.get(config.urlBase+'json/facebook_events.php')
  .success(function(data, status, headers,config){
      console.log('Data events success');
      console.log(data);
      $scope.data = data.events.filter( item => item.id == $state.params.id);
      $scope.data = $scope.data[0];

      $scope.data.news_image = $scope.data.image;
      $scope.news = data.events;
      $scope.news_adresse = $scope.data.place_address;
      $scope.data.news_date = Date.parse($scope.data.start_time);


        //$scope.events = data.events.filter( item => item.category_name === localStorage.getItem("user_city") );
        console.log($scope.events);
        $ionicLoading.hide();
  })
  .error(function(data, status, headers,config){
      console.log('Data event error');
  })

/*
  $scope.news = [];
  $http.get(config.urlBase+'json/data_news.php')
    .success(function(data, status, headers,config){
      console.log('Data news success');
      $scope.data = data.news[$state.params.id];
      $scope.imageEvent = $scope.data.news_image;

      $scope.news = data.news;
      $scope.news_adresse = $scope.data.news_adresse;
      $scope.data.news_date = Date.parse($scope.data.news_date);
      //$scope.imagePost = $scope.data.news_image;
      $ionicLoading.hide();
    })
    .error(function(data, status, headers,config){
      console.log('Data news error');
    })
*/


  $scope.openMap = function(map) {
    var url = 'https://www.google.com/maps/search/?api=1&query='+$scope.news_adresse+'&zoom=15';
    // var url = 'https://www.google.com/maps/search/?api=1&query='+$scope.placesAddress+$scope.latitude+','+$scope.longitude+'&zoom=15';
    window.open(encodeURI(url), '_system');
  }

  $ionicModal.fromTemplateUrl('share.html', function($ionicModal) {
  $scope.share = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });  


  var isIOS = ionic.Platform.isIOS();
  var isAndroid = ionic.Platform.isAndroid();


  $ionicPlatform.ready(function() { 
    if (isIOS) {
      $scope.appUrl = config.appstoreAppUrl+config.appstoreAppId;
    }
    if (isAndroid) {
      $scope.appUrl = config.playstoreAppUrl+config.playstoreAppId;
    }
  });

    $scope.shareViaTwitter = function() {
    var twitter = 'https://twitter.com/home?status='+$scope.appUrl;
    window.open(encodeURI(twitter), '_system');
  };

  $scope.shareViaGoogle = function() {
    var google = 'https://plus.google.com/share?url='+$scope.appUrl;
    window.open(encodeURI(google), '_system');
  };

    $scope.shareViaFacebook = function() {
    var facebook = 'https://www.facebook.com/sharer/sharer.php?u='+$scope.appUrl;
    window.open(encodeURI(facebook), '_system');
  };

  $scope.shareViaWhatsApp = function() {
    $cordovaSocialSharing.shareViaWhatsApp(strings.shareMess, $scope.imagesfolder+'/'+$scope.imageEvent, $scope.appUrl);
  };

  $scope.OtherShare=function(){
      window.plugins.socialsharing.share(strings.shareMess, null, null, $scope.appUrl);
  }

  $scope.addTofavorite = function(data){
    $ionicLoading.show({ template: strings.saved, noBackdrop: true, duration: 1000 });
    NewsService.favorite(data);
  };

}])

.controller('ForgetCtrl', ['$scope', '$ionicModal', '$timeout', '$ionicPopup', '$http', '$state', '$ionicHistory', 'config', 'strings', '$ionicLoading', function($scope, $ionicModal, $timeout, $ionicPopup, $http, $state, $ionicHistory, config, strings, $ionicLoading) {
    
    $scope.formEmail = strings.formEmail;
    $scope.titleforget = strings.titleforget;
    $scope.forgetText = strings.forgetText;
    $scope.sendNow = strings.sendNow;
    $scope.succForget = strings.succForget;
    $scope.forgetErr = strings.forgetErr;
    $scope.Login = strings.Login;

    $scope.loginData={};

    $scope.goBack = function() {
      $ionicHistory.backView().go();
    }

    $scope.doLogin=function(){
    var user_email=$scope.loginData.username;

      if(user_email){
          var str = config.urlBase+"controller/data_forget.php?username="+user_email;
          $http.get(str)
            .success(function(){
            $scope.success.show();                  
            })
            .error(function(){   
            $ionicLoading.show({ template: $scope.forgetErr, noBackdrop: true, duration: 2000 });           
            });

      }else{
      }
    }

$scope.cancelar = function(){
$scope.success.hide();
$state.go('tab.login',{},{location:"replace",reload:true});
}

    $ionicModal.fromTemplateUrl('success.html', function($ionicModal) {
        $scope.success = $ionicModal;
    }, {
        scope: $scope,
        hardwareBackButtonClose: false,
        animation: 'slide-in-up'
    }); 

$ionicHistory.nextViewOptions({
disableAnimate:true,
disableBack:true
})

}])

.controller('AboutCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$localStorage', '$ionicLoading', function($scope, $http, $state, config, strings, $localStorage, $ionicLoading) {

$ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
});

    
      $scope.$on('$ionicView.beforeEnter', function() {
      analytics.trackView('Über Uns');
    });
    
$scope.aboutusTitel = strings.aboutusTitel;
  $scope.termsTitel = strings.termsTitel;
  $scope.privacyTitel = strings.privacyTitel;

$scope.strings = [];
  $scope.imagesfolder = config.urlBase+'images';
  $http.get(config.urlBase+'json/data_strings.php')
  .success(function(data, status, headers,config){
      console.log('Data strings success');
      $scope.strings = data.strings;
      $ionicLoading.hide();
  })
  .error(function(data, status, headers,config){
      console.log('Data strings error');
  })

}])

.controller('PrivacyCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$localStorage', '$ionicLoading', function($scope, $http, $state, config, strings, $localStorage, $ionicLoading) {

$ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
});

$scope.privacyTitel = strings.privacyTitel;

$scope.strings = [];
  $scope.imagesfolder = config.urlBase+'images';
  $http.get(config.urlBase+'json/data_strings.php')
  .success(function(data, status, headers,config){
      console.log('Data strings success');
      $scope.strings = data.strings;
      $ionicLoading.hide();
  })
  .error(function(data, status, headers,config){
      console.log('Data strings error');
  })

}])

.controller('DisclaimerCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$localStorage', '$ionicLoading', function($scope, $http, $state, config, strings, $localStorage, $ionicLoading) {

  $ionicLoading.show({
      template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
      noBackdrop: true
  });
  
  $scope.privacyTitel = strings.privacyTitel;
  
  $scope.strings = [];
    $scope.imagesfolder = config.urlBase+'images';
    $http.get(config.urlBase+'json/data_strings.php')
    .success(function(data, status, headers,config){
        console.log('Data strings success');
        $scope.strings = data.strings;
        $ionicLoading.hide();
    })
    .error(function(data, status, headers,config){
        console.log('Data strings error');
    })
  
  }])

.controller('TermsCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$localStorage', '$ionicLoading', function($scope, $http, $state, config, strings, $localStorage, $ionicLoading) {

$ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
});

$scope.termsTitel = strings.termsTitel;

$scope.strings = [];
  $scope.imagesfolder = config.urlBase+'images';
  $http.get(config.urlBase+'json/data_strings.php')
  .success(function(data, status, headers,config){
      console.log('Data strings success');
      $scope.strings = data.strings;
      $ionicLoading.hide();
  })
  .error(function(data, status, headers,config){
      console.log('Data strings error');
  })

}])

.controller('FavoritesCtrl', ['$scope', 'OffersService', 'PlacesService', 'NewsService', '$http', '$state', 'config', 'strings', '$localStorage', '$ionicLoading', function($scope, OffersService, PlacesService, NewsService, $http, $state, config, strings, $localStorage, $ionicLoading) {

  $scope.favoritesTitel = strings.favoritesTitel;
  $scope.offersTitel = strings.offersTitel;
  $scope.placesTitel = strings.placesTitel;
  $scope.newsTitel = strings.newsTitel;
  $scope.listEmpty = strings.listEmpty;
    
  $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('Favoriten');
  });

  $scope.id_user = localStorage.getItem("id_user");

  $ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
  });

  $scope.imagesfolder = config.urlBase+'images';

     $scope.$on('$ionicView.enter',function(){
      $scope.favoriteOffers =  OffersService.favorite();
      $ionicLoading.hide();
    });
    

    $scope.removefavoriteOffer = function(id) {
       $scope.favoriteOffers =  OffersService.favorite(id);
    };

    $scope.$on('$ionicView.enter',function(){
    $scope.favoritePlaces =  PlacesService.favorite();
    $ionicLoading.hide();
    });
    

    $scope.removefavoritePlace = function(id) {
       $scope.favoritePlaces =  PlacesService.favorite(id);
    };


    $scope.$on('$ionicView.enter',function(){
    $scope.favoriteNews =  NewsService.favorite();
    $ionicLoading.hide();
    });
    

    $scope.removefavoritePost = function(id) {
       $scope.favoriteNews =  NewsService.favorite(id);
    };


}])

.controller('PurchasesCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', function($scope, $http, $state, config, strings, $ionicLoading) {


$scope.purchasesTitel = strings.purchasesTitel;
$scope.purchasesRef = strings.purchasesRef;
$scope.purchasesAmout = strings.purchasesAmout;
$scope.purchasesOrder = strings.purchasesOrder;


$ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
});

$scope.id_user = localStorage.getItem("id_user");

  $scope.orders = [];
  $scope.imagesfolder = config.urlBase+'images';
  $http.get(config.urlBase+'json/data_orders.php')
  .success(function(data, status, headers,config){
      console.log('Data orders success');
      $scope.orders = data.orders;
      $ionicLoading.hide();
  })
  .error(function(data, status, headers,config){
      console.log('Data orders error');
  })

}])

.controller('ContactCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$timeout', '$ionicLoading', '$cordovaInAppBrowser', function($scope, $http, $state, config, strings, $timeout, $ionicLoading, $cordovaInAppBrowser) {

    $scope.contactTitel = strings.contactTitel;
    $scope.FormcontactName = strings.FormcontactName;
    $scope.FormcontactEmail = strings.FormcontactEmail;
    $scope.FormcontactMessage = strings.FormcontactMessage;
    $scope.FormcontactSend = strings.FormcontactSend;
    $scope.contactEmail = strings.contactEmail;
    $scope.contactPhone = strings.contactPhone;
    $scope.contactWebsite = strings.contactWebsite;
    $scope.contactAddress = strings.contactAddress;
    $scope.contactSending = strings.contactSending;
    $scope.contactSuccess = strings.contactSuccess;
    $scope.contactFailed = strings.contactFailed;
    
    $scope.$on('$ionicView.beforeEnter', function() {
      analytics.trackView('Kontakt');
    });


    $scope.openEmail = function(email) {
      window.open(encodeURI('mailto:'+$scope.contactEmail), '_system');
    }

    $scope.openPhone = function(phone) {
      window.open(encodeURI('tel:'+$scope.contactPhone), '_system');
    }
    
    $scope.openWeb = function(website) {
      //window.open(encodeURI($scope.contactWebsite), '_system');
      cordova.InAppBrowser.open(encodeURI($scope.contactWebsite), '_blank', 'location=yes', 'hidden=yes' );
    }

    $scope.openMap = function(map) {
      window.open(encodeURI('https://www.google.es/maps/place/'+$scope.contactAddress), '_system');
    }

    $scope.contact={};

    $scope.sendForm=function(){
    $ionicLoading.show({ template: $scope.contactSending, noBackdrop: true});

    var user_id = localStorage.getItem("id_user");
    var user_name = $scope.contact.name;
    var user_email = $scope.contact.email;
    var user_massage = $scope.contact.message;

      if(user_email){
          var urlContact = config.urlBase+"controller/contact.php?user_id="+user_id+"&user_name="+user_name+"&user_email="+user_email+"&user_massage="+user_massage;
          $http.get(urlContact)
            .success(function(){
              $scope.contact.name = '';
              $scope.contact.email = '';
              $scope.contact.message = '';
            $ionicLoading.show({ template: $scope.contactSuccess, noBackdrop: true, duration: 2000 });             
            })
            .error(function(){   
            $ionicLoading.show({ template: $scope.contactFailed, noBackdrop: true, duration: 2000 });        
            });

      }else{
      }
    }


}])

.controller('AccountCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', '$ionicHistory', '$localStorage', '$ionicModal', '$cordovaCamera', '$cordovaFile', '$cordovaFileTransfer', '$cordovaDevice', '$ionicPopup', '$cordovaActionSheet', function($scope, $http, $state, config, strings, $ionicLoading, $ionicHistory, $localStorage, $ionicModal, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $ionicPopup, $cordovaActionSheet) {

  $ionicLoading.show({
      template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
      noBackdrop: true
  });

  $scope.$on('$ionicView.beforeEnter', function() {
      analytics.trackView('Account');
  });

  

  $scope.showPass = function(){
    $scope.showPassword = !$scope.showPassword;
}


  $scope.accountTitel = strings.accountTitel;
  $scope.accountFirstName = strings.accountFirstName;
  $scope.accountLastName = strings.accountLastName;
  $scope.accountPhone = strings.accountPhone;
  $scope.accountEmail = strings.accountEmail;
  $scope.favoritesTitel = strings.favoritesTitel;
  $scope.purchasesTitel = strings.purchasesTitel;
  $scope.signoutTitel = strings.signoutTitel;
  $scope.contactTitel = strings.contactTitel;
  $scope.Signup = strings.Signup;
  $scope.imagesUploadfolder = config.urlBase+'upload_photo';

  $scope.formPhone = strings.formPhone;
  $scope.formFirstName = strings.formFirstName;
  $scope.formLastName = strings.formLastName;
  
  $scope.categories = [];
  $http.get(config.urlBase+'json/data_places_categories.php')
  .success(function(data, status, headers,config){
    console.log('Data categories success');
    $scope.categories = data.categories;
    $ionicLoading.hide();
    })
  .error(function(data, status, headers,config){
    console.log('Data categories error');
  })

  
/*
$scope.user_status = localStorage.getItem('user_status');
$scope.user_city = localStorage.getItem('user_city');
$scope.user_firstname = localStorage.getItem('user_firstname');
$scope.user_lastname = localStorage.getItem('user_lastname');
$scope.user_photo = localStorage.getItem('user_photo');
$scope.user_uniemail = localStorage.getItem('user_uniemail');
$scope.user_email = localStorage.getItem('user_email');
$scope.user_alter = localStorage.getItem('user_alter');
$scope.user_phone = localStorage.getItem('user_phone');
$scope.user_geschlecht = localStorage.getItem('user_geschlecht');

  var myDate = new Date($scope.user_alter);
  $scope.user_alter = myDate;
//console.log(typeof(Number($scope.user_photo)));
  
$scope.user = {
user_firstname : $scope.user_firstname,
user_lastname : $scope.user_lastname,
user_email : $scope.user_email,
user_uniemail : $scope.user_uniemail,
user_phone : Number($scope.user_phone),
user_geschlecht : $scope.user_geschlecht,
user_standort : $scope.user_city,
user_status : $scope.user_status,
user_alter : $scope.user_alter,
user_id : $scope.id_user
};
*/
$scope.id_user = localStorage.getItem("id_user");

  
$scope.users = [];
$scope.imagesfolder = config.urlBase+'images';
$http.get(config.urlBase+'json/data_users.php')
.success(function(data, status, headers,config){
    console.log('Data users success');
    $scope.users = data.users;
    $scope.users = data.users.filter(Item => Item.user_id ==localStorage.getItem('id_user') );
    localStorage.setItem('user_status',$scope.users[0].user_status);
    $scope.user_alter = $scope.users[0].user_alter;
    $scope.user_photo = $scope.users[0].user_photo;
    var photoname = $scope.user_photo.substring($scope.user_photo.lastIndexOf('/')+1);
    if(photoname === 'user.png'){
      $scope.showmsg= 'nur mit Profilbild gültig';
    }
    if($scope.user_alter == ''){
      $scope.user_alter = '';
    } else{
      $scope.user_alter = new Date($scope.users[0].user_alter);
    }
    
    

    $ionicLoading.hide();
})
.error(function(data, status, headers,config){
    console.log('Data users error');
})


  $scope.doLogout=function(){
      

    localStorage.removeItem('chequeado');
    localStorage.removeItem('loggedin_status');
    localStorage.removeItem('id_user');
    localStorage.removeItem('city');

      
      localStorage.removeItem('user_status');
      localStorage.removeItem('user_firstname');
      localStorage.removeItem('user_lastname');
      localStorage.removeItem('user_photo');
      localStorage.removeItem('user_uniname');
      localStorage.removeItem('user_city');
      localStorage.removeItem('user_alter');
      localStorage.removeItem('user_phone');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_geschlecht');
      localStorage.removeItem('user_uniname');
      localStorage.removeItem('newsFavorites');
      localStorage.removeItem('offersFavorites');
      localStorage.removeItem('placesFavorites');
      localStorage.removeItem('nameOfImg');


      if(localStorage.getItem('user_loginType') === 'Facebook'){
        facebookConnectPlugin.logout(
          function(response){
              console.log(JSON.stringify(response));
              localStorage.removeItem('otherUserDetail');
              localStorage.removeItem('afterLogin');
              localStorage.removeItem('user_loginType');
          },
          function(err){
              console.log(JSON.stringify(err));
          }
        );
      }

      if(localStorage.getItem('user_loginType') === 'Google'){
        window.plugins.googleplus.logout(
          function (msg) {
            console.log(msg); // do something useful instead of alerting 
            localStorage.removeItem('otherUserDetail');
            localStorage.removeItem('afterLogin');
            localStorage.removeItem('user_loginType');
          }
        );
      }

    $ionicHistory.nextViewOptions({
      disableAnimate:true,
      disableBack:true
    })
    
    $state.go('tab.login',{},{location:"replace",reload:true});

  }
      
      
      
  $scope.formatDate = function(date){
    var now = new Date(date);
  if (isNaN(now)){
    now = '';
    return now;
  } else {
   var now = new Date(date);
   now = now.toISOString().substr(0,10);
   return now;
  }
};

      $scope.updateProfile = function (user){
        
        var nameOfimg
        if(localStorage.getItem('nameOfImg') == null && localStorage.getItem('nameOfImg') == undefined){
          
          nameOfimg = user.user_photo;
        } else{
          
          nameOfimg =  'https://uniheld-app.cdemo.me/upload_photo/'+localStorage.getItem('nameOfImg');
        }
        user.user_photo = nameOfimg;
        
      var urlupdateProfle = config.urlBase+'controller/edit_profile_app.php';
      $http.post(urlupdateProfle, user, {
      headers : {
          'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
      } })
      .then(
      function(response){

                $scope.admin=response.data.records;
                sessionStorage.setItem('loggedin_status',true);
                localStorage.setItem('id_user',$scope.admin.user_id);
                localStorage.setItem('user_status',$scope.admin.status);
                localStorage.setItem('user_city',$scope.admin.city);
                localStorage.setItem('user_firstname',$scope.admin.user_firstname);
                localStorage.setItem('user_lastname',$scope.admin.user_lastname);
                localStorage.setItem('user_photo',$scope.admin.user_photo);
                localStorage.setItem('user_uniemail',$scope.admin.user_uniemail);
                localStorage.setItem('user_alter',$scope.admin.user_alter);
                localStorage.setItem('user_email',$scope.admin.user_email);
                localStorage.setItem('user_geschlecht',$scope.admin.user_geschlecht);
                localStorage.setItem('user_phone',$scope.admin.user_phone);

          $scope.share.hide();
          $ionicLoading.show({ template: strings.SuccAcc, noBackdrop: true, duration: 2000});
          $state.reload();
      },

      function(response){
        /* if account already exists or database not connected*/
        $ionicLoading.show({ template: strings.ErrAcc, noBackdrop: true, duration: 2000});
      }
        ); 
  };

      
      
  $ionicModal.fromTemplateUrl('share.html', function($ionicModal) {
      $scope.share = $ionicModal;
  }, {
      scope: $scope,
      animation: 'slide-in-up'
  });  

  
  
  
  $scope.image = null;
                                 
  $scope.galerie = function(){
    var type = Camera.PictureSourceType.PHOTOLIBRARY;
    $scope.selectPicture(type);
  }
  $scope.kamera = function(){
    var type = Camera.PictureSourceType.CAMERA;
    $scope.selectPicture(type);
  }                            
  // Present Actionsheet for switch beteen Camera / Library
  var cameraOptions;
  $scope.loadImage = function() {
    cameraOptions = $ionicPopup.alert({
      title: 'Bild auswählen',
      scope: $scope,
      template: '<button class="button button-block outline_button" ng-click="galerie()">Galerie</button><br><button ng-click="kamera()" class="button button-block outline_button">Kamera</button>',
      okType: "button-assertive",
      okText: 'Abbrechen',
    });
  };

// Take image with the camera or from library and store it inside the app folder
// Image will not be saved to users Library.
$scope.selectPicture = function(sourceType) {
  $scope.show();
  cameraOptions.close();
  var options = {
    quality: 100,
    destinationType: Camera.DestinationType.FILE_URI,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true
  };

  $cordovaCamera.getPicture(options).then(function(imagePath) {
    // Grab the file name of the photo in the temporary directory
    var currentName = imagePath.replace(/^.*[\\\/]/, '');

    //Create a new name for the photo
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";

    // If you are trying to load image from the gallery on Android we need special treatment!
    if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
      window.FilePath.resolveNativePath(imagePath, function(entry) {
        window.resolveLocalFileSystemURL(entry, success, fail);
        function fail(e) {
          console.error('Error: ', e);
        }

        function success(fileEntry) {
          var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
          // Only copy because of access rights
          $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
            $scope.image = newFileName;
              $scope.uploadImage();
          }, function(error){
            $scope.showAlert('Error', error.exception);
          });
        };
      }
    );
    } else {
      var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      // Move the file to permanent storage
      $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
        $scope.image = newFileName;
          $scope.uploadImage();
      }, function(error){
        $scope.showAlert('Error', error.exception);
      });
    }
  },
  function(err){
    // Not always an error, maybe cancel was pressed...
    $scope.hide();
  })
};

// Returns the local path inside the app for an image
$scope.pathForImage = function(image) {
  if (image === null) {
    return '';
  } else {
    return cordova.file.dataDirectory + image;
  }
};

$scope.uploadImage = function() {
  // Destination URL
  // var url = "http://localhost:8888/upload.php";
  var url = "https://uniheld-app.cdemo.me/upload_photo/upload.php";

  // File for Upload
  var targetPath = $scope.pathForImage($scope.image);
 
  // File name only
  var filename = $scope.image;
  localStorage.setItem('nameOfImg', filename);
  var options = {
    fileKey: "file",
    fileName: filename,
    chunkedMode: false,
    httpMethod : 'post',
    mimeType: "multipart/form-data",
    params : {'fileName': filename}
  };

  $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
    //$scope.showAlert('Erfolgreich', 'Der Bildupload ist abgeschlossen.');
    $ionicPopup.alert({
      title: 'Erfolgreich',
      scope: $scope,
      template: 'Der Bildupload ist abgeschlossen.',
      okType: "button-assertive",
      okText: 'ok',
    });
  });
  $scope.hide();
}

$scope.show = function() {

  $ionicLoading.show({

    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',

    });

  };

  $scope.hide = function(){
  $ionicLoading.hide();
  };

$scope.showAlert = function(title, msg) {
  var alertPopup = $ionicPopup.alert({
    title: title,
    template: msg
  });
};     
  
  
  

}])

			
/*
.directive('ionicRatings', ionicRatings);

  function ionicRatings() {
    return {
      restrict: 'AE',
      replace: true,
      template: '<div class="text-center ionic_ratings">' +
        '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="iconOffColor" ng-click="ratingsClicked(1)" ng-if="rating < 1" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="iconOnColor" ng-click="ratingsUnClicked(1)" ng-if="rating > 0" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="iconOffColor" ng-click="ratingsClicked(2)" ng-if="rating < 2" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="iconOnColor" ng-click="ratingsUnClicked(2)" ng-if="rating > 1" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="iconOffColor" ng-click="ratingsClicked(3)" ng-if="rating < 3" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="iconOnColor" ng-click="ratingsUnClicked(3)" ng-if="rating > 2" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="iconOffColor" ng-click="ratingsClicked(4)" ng-if="rating < 4" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="iconOnColor" ng-click="ratingsUnClicked(4)" ng-if="rating > 3" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="iconOffColor" ng-click="ratingsClicked(5)" ng-if="rating < 5" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="iconOnColor" ng-click="ratingsUnClicked(5)" ng-if="rating > 4" ng-class="{\'read_only\':(readOnly)}"></span>' +
        '</div>',
      scope: {
        ratingsObj: '=ratingsobj',
        index: '=index',
        rating: '=rating'
      },
      link: function(scope, element, attrs) {

        //Setting the default values, if they are not passed
        scope.iconOn = scope.ratingsObj.iconOn || 'ion-ios-star';
        scope.iconOff = scope.ratingsObj.iconOff || 'ion-ios-star-outline';
        scope.iconOnColor = scope.ratingsObj.iconOnColor || 'rgb(200, 200, 100)';
        scope.iconOffColor = scope.ratingsObj.iconOffColor || 'rgb(200, 100, 100)';
        //scope.rating = scope.ratingsObj.rating || 0;
        scope.minRating = scope.ratingsObj.minRating || 0;
        scope.readOnly = scope.ratingsObj.readOnly || false;
        scope.index = scope.index || 0;
          scope.rating = scope.rating || 0;

        //Setting the color for the icon, when it is active
        scope.iconOnColor = {
          color: scope.iconOnColor
        };

        //Setting the color for the icon, when it is not active
        scope.iconOffColor = {
          color: scope.iconOffColor
        };

        //Setting the rating
        scope.rating = (scope.rating > scope.minRating) ? scope.rating : scope.minRating;

        //Setting the previously selected rating
        scope.prevRating = 0;

        scope.$watch('rating', function(newValue, oldValue) {
          setRating(newValue);
        });

        function setRating(val, uiEvent) {
          if (scope.minRating !== 0 && val < scope.minRating) {
            scope.rating = scope.minRating;
          } else {
            scope.rating = val;
          }
          scope.prevRating = val;
          if (uiEvent) scope.ratingsObj.callback(scope.rating, scope.index);
        }

        //Called when he user clicks on the rating
        scope.ratingsClicked = function(val) {
          setRating(val, true);
        };
        
        //Called when he user un clicks on the rating
        scope.ratingsUnClicked = function(val) {
          if (scope.minRating !== 0 && val < scope.minRating) {
            scope.rating = scope.minRating;
          } else {
            scope.rating = val;
          }
          if (scope.prevRating == val) {
            if (scope.minRating !== 0) {
              scope.rating = scope.minRating;
            } else {
              scope.rating = 0;
            }
          }
          scope.prevRating = val;
          scope.ratingsObj.callback(scope.rating, scope.index);
        };
      }
    };
  }
/*
.controller('EditAccountCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', '$ionicHistory', '$localStorage', '$ionicModal', function($scope, $http, $state, config, strings, $ionicLoading, $ionicHistory, $localStorage, $ionicModal) {

$ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
});
    
   $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('Edit Account');
  });

$scope.accountTitel = strings.accountTitel;
$scope.accountFirstName = strings.accountFirstName;
$scope.accountLastName = strings.accountLastName;
$scope.accountPhone = strings.accountPhone;
$scope.accountEmail = strings.accountEmail;
$scope.favoritesTitel = strings.favoritesTitel;
$scope.purchasesTitel = strings.purchasesTitel;
$scope.signoutTitel = strings.signoutTitel;
$scope.contactTitel = strings.contactTitel;
     $scope.Signup = strings.Signup;
    
        $scope.categories = [];
        $http.get(config.urlBase+'json/data_places_categories.php')
        .success(function(data, status, headers,config){
          console.log('Data categories success');
          $scope.categories = data.categories;
          $ionicLoading.hide();
          })
        .error(function(data, status, headers,config){
          console.log('Data categories error');
        })
    
    $scope.$on('$ionicView.beforeEnter', function() {
      analytics.trackView('Signup');
    });

$scope.id_user = localStorage.getItem("id_user");

  $scope.users = [];
  $scope.imagesfolder = config.urlBase+'images';
  $http.get(config.urlBase+'json/data_users.php')
  .success(function(data, status, headers,config){
      console.log('Data users success');
      $scope.users = data.users;
      $ionicLoading.hide();
  })
  .error(function(data, status, headers,config){
      console.log('Data users error');
  })

        $scope.doLogout=function(){

      localStorage.removeItem('chequeado');
      localStorage.removeItem('loggedin_status');
      localStorage.removeItem('id_user');

      $ionicHistory.nextViewOptions({
        disableAnimate:true,
        disableBack:true
      })

      $state.go('tab.login',{},{location:"replace",reload:true});

    }
        
        
        
        $scope.user = {
          user_firstname : '',
          user_lastname : '',
          user_email : '',
          user_uniemail : '',
          user_phone : '',
          user_geschlecht : '',
          user_standort : '',
          user_status : '',
          user_geburtsdatum : '',
        };

        $scope.saveusers = function (){

        var urlSignup = config.urlBase+'controller/new_user.php';
        $http.post(urlSignup, $scope.user)
        .then(
        function(response){
          $ionicLoading.show({ template: strings.SuccAcc, noBackdrop: true, duration: 2000});
          $state.go('tab.login',{},{location:"replace",reload:true});
        },

        function(response){
   
          $ionicLoading.show({ template: strings.ErrAcc, noBackdrop: true, duration: 2000});
        }
          ); 
    };

        
        
    $ionicModal.fromTemplateUrl('share.html', function($ionicModal) {
        $scope.share = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });  


}])
*/