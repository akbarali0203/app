'use strict';
app
.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
    
/*
  var firstRun;
  
    // set up some logic to decide which slide to show first
  $scope.$on('$ionicView.enter', function() {
   		var jumpTo = firstRun ? 1 : 0;
      $ionicSlideBoxDelegate.slide(jumpTo);   
    	if (!firstRun) {
        firstRun = true;
      }
  });

  // Called to navigate to the main apptab
  $scope.startApp = function() {
    $state.go('tab.login');

  };
  */
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

.controller('LoginCtrl', ['$scope', '$ionicModal', '$timeout', '$ionicPopup', '$http', '$state', '$ionicHistory', 'config', 'strings', '$localStorage', '$sessionStorage', '$ionicPlatform', '$cordovaOauth', function($scope, $ionicModal, $timeout, $ionicPopup, $http, $state, $ionicHistory, config, strings, $localStorage, $sessionStorage, $ionicPlatform, $cordovaOauth) {
    
    $scope.$on('$ionicView.beforeEnter', function() {
      analytics.trackView('Login');
    });
   
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

      if(user_email && user_password){
          var str = config.urlBase+"controller/data_login.php?username="+user_email+"&password="+user_password;
          $http.get(str)
            .success(function(response){
              
               // $ionicHistory.clearCache();
               // $ionicHistory.clearHistory();
              
                $scope.admin=response.records;

                sessionStorage.setItem('loggedin_status',true);
                localStorage.setItem('id_user',$scope.admin.user_id);
                localStorage.setItem('status_user',$scope.admin.status);
                localStorage.setItem('city',$scope.admin.city);
                localStorage.setItem('user_firstname',$scope.admin.user_firstname);
                localStorage.setItem('user_lastname',$scope.admin.user_lastname);
                localStorage.setItem('user_photo',$scope.admin.user_photo);
                localStorage.setItem('user_uniemail',$scope.admin.user_uniemail);

              
              

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

      }else{

      }

    }
    
  var isIOS = ionic.Platform.isIOS();
  var isAndroid = ionic.Platform.isAndroid();
    
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
    
    // Facebook login function
    $scope.FBlogin = function(){
        $cordovaOauth.facebook("141557813331986", ["email", "public_profile", "user_website"]).then(function(result) {
            //alert('success login:'+JSON.stringify(result));
            localStorage.setItem('FBToken',result.access_token);
            $localStorage.accessToken = result.access_token;
               $http.get("https://graph.facebook.com/v2.2/me", {params: {access_token: localStorage.getItem("FBToken"), fields: "name,gender,location,picture,email,birthday", format: "json" }}).then(function(result) 
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
    
    
        // Google login function
            $scope.googleLogin = function () {
                console.log('google');
                $cordovaOauth.google("873989346781-42n20cdduvtt7bffgsuc89sjnt6v1srn.apps.googleusercontent.com",["email", "profile"]).then(function (result) {
                    $scope.oauthResult = result;
                }, function (error) {
                    $scope.oauthResult = "OAUTH ERROR (see console)";
                    console.log(error);
                });
            };

    
}])


.controller('SignupCtrl', ['$scope', '$http', '$state', '$ionicHistory', 'config', 'strings', '$ionicLoading', function(
                             $scope, $http, $state, $ionicHistory, config, strings, $ionicLoading) {
    
    $scope.titleCreate = strings.titleCreate;
    $scope.formFirstName = strings.formFirstName;
    $scope.formLastName = strings.formLastName;
    $scope.formPhone = strings.formPhone;
    $scope.formEmail = strings.formEmail;
    $scope.formPassword = strings.formPassword;
    $scope.formConfirmPassword = strings.formConfirmPassword;
    $scope.Signup = strings.Signup;
    $scope.AccReady = strings.AccReady;


    
    
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

    $scope.user = {
      user_firstname : '',
      user_lastname : '',
      user_email : '',
      user_uniemail : '',
      user_phone : '',
      user_alter : '',
      user_standort : '',
      user_password : '',
      user_photo: 'https://romlove.com/sites/default/files/square.original.300x300uc.jpg', 
      user_fbid: 'null', 
      user_status: 'nicht verifiziert'
    };

    $scope.saveusers = function (){

    var urlSignup = config.urlBase+'controller/new_user.php';
    $http.post(urlSignup, $scope.user, {
    headers : {
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    } })
    .then(
    function(response){
      $ionicLoading.show({ template: strings.SuccAcc, noBackdrop: true, duration: 2000});
      $state.go('tab.login',{},{location:"replace",reload:true});
    },

    function(response){
      /* if account already exists or database not connected*/
      $ionicLoading.show({ template: strings.ErrAcc, noBackdrop: true, duration: 2000});
    }
      ); 
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


  $scope.goBack = function() {
    $ionicHistory.backView().go();
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
    
    
    
    //user_city = user_city.toLowerCase();
    
    
    if(localStorage.getItem("city") == undefined){
        var user_city = '';
        $scope.user_city_name = '';
    }else {
        var user_city = localStorage.getItem("city");
        $scope.user_city_name = user_city;
    }
    
    
     //$scope.user_city = user_city;
    
    
    
     //var basic_url = config.urlBase+"images/"+user_city+".jpg";
    
    
    if(user_city != null){
        //user_city = basic_url;
        
        if(user_city == "Hamburg"){
            user_city = 'img/hamburg.jpg';
        }
        if(user_city == "Münster"){
            user_city = 'img/muenster.jpg';
        }
        if(user_city == "Köln"){
            user_city = 'img/koeln.jpg';
        }
        if(user_city == "Heidelberg"){
            user_city = 'img/heidelberg.jpg';
        }    
        if(user_city == "Göettingen"){
            user_city = 'img/goettingen.jpg';
        }
        if(user_city == "Gißsen"){
            user_city = 'img/Giessen.jpg';
        }
        if(user_city == "Frankfurt"){
            user_city = 'img/frankfurt.jpg';
        }
        if(user_city == "Düsseldorf"){
            user_city = 'img/duesseldorf.jpg';
        }
        if(user_city == "Dortmund"){
            user_city = 'img/dortmund.jpg';
        }
        if(user_city == "Bochum"){
            user_city = 'img/bochum-1.jpg';
        }
        if(user_city == "Essen"){
            user_city = 'img/essen.jpg';
        }
        
    }
    else{
         user_city = 'img/essen.jpg';
    }
    
    $scope.user_city = user_city;

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
      localStorage.removeItem('user_city');
        
        localStorage.removeItem('status_user');
        localStorage.removeItem('user_firstname');
        localStorage.removeItem('user_lastname');
        localStorage.removeItem('user_photo');
        localStorage.removeItem('user_uniemail');

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
  })
  .error(function(data, status, headers,config){
      console.log('Data places error');
  })

  $scope.categories = [];
  $http.get(config.urlBase+'json/data_places_categories.php')
    .success(function(data, status, headers,config){
      console.log('Data categories success');
      $scope.categories = data.categories;    })
    .error(function(data, status, headers,config){
      console.log('Data categories error');
    })

  $scope.news = [];
  $http.get(config.urlBase+'json/data_news.php')
    .success(function(data, status, headers,config){
      console.log('Data news success');
      $scope.news = data.news;    })
    .error(function(data, status, headers,config){
      console.log('Data news error');
    })

  $scope.offers = [];
  $http.get(config.urlBase+'json/data_offers.php')
    .success(function(data, status, headers,config){
      console.log('Data offers success');
      $scope.offers = data.offers;    })
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
      $ionicLoading.hide();
  })
  .error(function(data, status, headers,config){
      console.log('Data places error');
  })
  
  
  }])


.controller('PlaceCtrl', ['$scope', '$http', 'PlacesService', '$state', 'config', 'strings', '$ionicLoading', '$timeout', '$ionicModal', '$ionicPlatform', '$cordovaSocialSharing', '$cordovaInAppBrowser', '$localStorage', '$sce' , function($scope, $http, PlacesService, $state, config, strings, $ionicLoading, $timeout, $ionicModal, $ionicPlatform, $cordovaSocialSharing, $cordovaInAppBrowser, $localStorage, $sce) {

  $ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
  });
    
    var user_city = localStorage.getItem("city");
    $scope.user_city = user_city;
    
    var id_user = localStorage.getItem("id_user");
    $scope.userId = id_user;
    
      $scope.OfferButton = "Gönn dir";
    
  $scope.takeToOffer = function(){
     // alert('i clicked');
       $state.go('tab.uniid');
  }
    
  $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('Category Place');
  });
 // alert('ddddddddddd');
  $scope.information = strings.infoText;
  $scope.description = strings.descText;
  $scope.placeDetailsTitel = strings.placeDetailsTitel;
  $scope.audience = strings.audiText;
  $scope.address = strings.addrText;
  $scope.schedule = strings.scheText;
  $scope.phone = strings.phonText;
  $scope.website = strings.websText;
  $scope.bestOfferstext = strings.bestOffers;
  $scope.relatedOfferstext = strings.relatedOffers;
  $scope.readmoretext = strings.readMore;
  $scope.nofferstext = strings.noffers;
  $scope.moretext = strings.more;
  $scope.seeAlltext = strings.seeAll;
  $scope.titleShare = strings.titleShare;
  $scope.otherShare = strings.otherShare;
  $scope.currency = config.currency;
  $scope.saved = strings.saved;

  $scope.params = $state.params;
  $scope.imagesfolder = config.urlBase+'images';
  $scope.places = [];
  $http.get(config.urlBase+'json/data_places.php')
    .success(function(data, status, headers,config){
      console.log('Data places success');
      $scope.data = data.places[$state.params.id];
      $scope.places = data.places;
      $scope.idplace = $scope.data.place_id;
      $scope.latitude = $scope.data.place_latitude;
      $scope.longitude = $scope.data.place_longitude;
      $scope.imagePlace = $scope.data.place_image;
      $scope.linkWebsite = $scope.data.place_website;
      $scope.openMap = function(map) {
        var url = 'https://www.google.com/maps/search/?api=1&query='+$scope.latitude+','+$scope.longitude+'&zoom=15';
        window.open(encodeURI(url), '_system');
      }

      $scope.openWebsite = function(website) {
      window.open(encodeURI($scope.linkWebsite), '_system');
      }

    })

    .error(function(data, status, headers,config){
      console.log('Data places error');
    })
    
  $scope.gallery = [];
  $scope.imagesfolder = config.urlBase+'images';
  $http.get(config.urlBase+'json/data_gallery.php')
  .success(function(data, status, headers,config){
      console.log('Data gallery success');
      $scope.gallery = data.gallery;
      $ionicLoading.hide();
  })
  .error(function(data, status, headers,config){
      console.log('Data gallery error');
  })

  /*
  Not in use
  $scope.offers = [];
  $scope.imagesfolder = config.urlBase+'images';
  $http.get(config.urlBase+'json/data_offers.php')
  .success(function(data, status, headers,config){
      console.log('Data offers success');
      $scope.offers = data.offers;
  })
  .error(function(data, status, headers,config){
      console.log('Data offers error');
  })
  
  */
  $scope.morePlaces = [];
  $http.get(config.urlBase+'json/data_places.php')
  .success(function(data, status, headers,config){
      console.log('Data places success');
      $scope.morePlaces = data.places;
      
  })
  .error(function(data, status, headers,config){
      console.log('Data places error');
  })
  
  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }
  

    $ionicModal.fromTemplateUrl('modal.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });  

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
    $cordovaSocialSharing.shareViaWhatsApp(strings.shareMess, $scope.imagesfolder+'/'+$scope.imagePlace, $scope.appUrl);
  };

 $scope.OtherShare=function(){
     window.plugins.socialsharing.share(strings.shareMess, null, null, $scope.appUrl);
  }

 $scope.addTofavorite = function(data){
    $ionicLoading.show({ template: strings.saved, noBackdrop: true, duration: 1000 });
    PlacesService.favorite(data);
  };


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
    


  $scope.titleOffers = strings.offersTitel;
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


.controller('CategoryOfferCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', '$timeout', '$ionicModal', '$localStorage' , function($scope, $http, $state, config, strings, $ionicLoading, $timeout, $ionicModal, $localStorage) {

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

.controller('OfferCtrl', ['$scope', '$rootScope', 'OffersService', '$http', '$state', 'config', 'strings', '$ionicLoading', '$timeout', '$ionicPopup', '$ionicModal', '$ionicPlatform', '$cordovaSocialSharing', '$cordovaInAppBrowser', '$localStorage',  function($scope, $rootScope, OffersService, $http, $state, config, strings, $ionicLoading, $timeout, $ionicPopup, $ionicModal, $ionicPlatform, $cordovaSocialSharing, $cordovaInAppBrowser, $localStorage) {

  $ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
  });

  $scope.Math = window.Math;
    
  $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('Offers');
  });

  $scope.description = strings.descText;
  $scope.titleoffers = strings.offersTitel;
  $scope.relatedOfferstext = strings.relatedOffers;
  $scope.currency = config.currency;
  $scope.moretext = strings.seeAll;
  $scope.addedtext = strings.addedText;
  $scope.expiretext = strings.expireText;
  $scope.savetext = strings.saveText;
  $scope.detailsofferText = strings.detailsOfferText;
  $scope.howtouseOfferText = strings.howtouseOfferText;
  $scope.offerDetailsTitel = strings.offerDetailsTitel;
  $scope.getofferText = strings.getofferText;
  $scope.OrderDetails = strings.OrderDetails;
  $scope.buynow = strings.buynow;
  $scope.saved = strings.saved;

  $scope.subtotalText = strings.subtotalText;
  $scope.discountText = strings.discountText;
  $scope.totalText = strings.totalText;
  $scope.discountpriceText = strings.discountpriceText;
  $scope.oldpriceText = strings.oldpriceText;
  $scope.confirmText = strings.confirmText;
  $scope.successText = strings.successText;
  $scope.doneText = strings.doneText;
  $scope.errortitle = strings.errortitle;
  $scope.tryagainText = strings.tryagainText;
  $scope.errorText = strings.errorText;
  $scope.skipText = strings.skipText;

  $scope.titleShare = strings.titleShare;
  $scope.otherShare = strings.otherShare;

  $scope.formFirstName = strings.formFirstName;
  $scope.formLastName = strings.formLastName;
  $scope.formPhone = strings.formPhone;
  $scope.formEmail = strings.formEmail;

  $scope.params = $state.params;
  $scope.imagesfolder = config.urlBase+'images';
  $scope.offers = [];
  $http.get(config.urlBase+'json/data_offers.php')
    .success(function(data, status, headers,config){
      console.log('Data offers success');
      $scope.data = data.offers[$state.params.id];
      $scope.offers = data.offers;
      $scope.idoffer = $scope.data.offer_id;
      $scope.imageOffer = $scope.data.offer_image;
      $ionicLoading.hide();
    })

    .error(function(data, status, headers,config){
      console.log('Data offers error');
    })
    
  $ionicModal.fromTemplateUrl('modal.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });  

      $ionicModal.fromTemplateUrl('success.html', function($ionicModal) {
        $scope.success = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });  


      $ionicModal.fromTemplateUrl('error.html', function($ionicModal) {
        $scope.error = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });  

        $ionicModal.fromTemplateUrl('share.html', function($ionicModal) {
        $scope.share = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });  

    var id_user = localStorage.getItem("id_user");

    var InAppBrowserReference;

    $scope.paypal = function(paymentpaypal) {

      var urlpaypal = config.urlBase+"payment/paypal/index.php?id_user="+id_user+"&id_offer="+$scope.idoffer;
      InAppBrowserReference = window.open(encodeURI(urlpaypal), '_self', 'location=no', 'toolbar=no', 'zoom=no', 'cache=no', 'hardwareback=no');
      InAppBrowserReference.addEventListener('loadstart', closeInAppBrowser);

      function closeInAppBrowser(event) {
      if (event.url.match("/done")) {
        InAppBrowserReference.close();
      }}

    }

    /*$scope.stripe = function(paymentstripe) {

      var urlpaypal = config.urlBase+"payment/stripe/index.php?id_user="+id_user+"&id_offer="+$scope.idoffer;
      InAppBrowserReference = window.open(encodeURI(urlpaypal), '_self', 'location=no', 'toolbar=no', 'zoom=no', 'cache=no', 'hardwareback=no');
      InAppBrowserReference.addEventListener('loadstart', closeInAppBrowser);

      function closeInAppBrowser(event) {
      if (event.url.match("/done")) {
        InAppBrowserReference.close();
      }}

    }*/

    /*$scope.stripe = function(paymentstripe) {
      var url = config.urlBase+"payment/stripe/index.php?id_user="+id_user+"&id_offer="+$scope.idoffer;
      window.open(encodeURI(url), '_blank', 'location=no', 'toolbar=no', 'zoom=no', 'cache=no');
      return false;
      }*/

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
    $cordovaSocialSharing.shareViaWhatsApp(strings.shareMess, $scope.imagesfolder+'/'+$scope.imageOffer, $scope.appUrl);
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
    
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    //$state.reload();

  $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('Aktuelle Campus Events');
  });

    
  $scope.titlenews = strings.newsTitel;
  $scope.selectCategory = strings.selectCategory;

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
  



  }])

.controller('UniIdCtrl', ['$scope', '$localStorage', '$state' , function($scope, $localStorage, $state) {


    $scope.status_user = localStorage.getItem("status_user");
     $scope.user_firstname = localStorage.getItem("user_firstname");
     $scope.user_lastname = localStorage.getItem("user_lastname");
     $scope.user_photo = localStorage.getItem("user_photo");
    
    $scope.verify = function(){
       // alert('DFDAS00');
         $state.go('tab.verify');
    }

}])
.controller('VerifyCtrl', ['$scope', '$localStorage', '$state', function($scope, $localStorage, $state) {


    $scope.status_user = localStorage.getItem("status_user");
    $scope.user_uniemail = localStorage.getItem("user_uniemail");

}])
.controller('completeRestCtrl', ['$scope', '$localStorage', '$state', 'strings', '$http', 'config', '$ionicLoading'  , function($scope, $localStorage, $state, strings, $http, config, $ionicLoading ) {


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
    
    
        $scope.user = {
          user_firstname : $scope.user_detail.user_firstname,
          user_lastname : $scope.user_detail.user_lastname,
          user_email : $scope.user_detail.user_email,
          user_uniemail : '',
          user_phone : '',
          user_alter : '',
          user_standort : '',
          user_password : '',
          user_photo: $scope.user_detail.user_photo.data.url,
          user_fbid: $scope.user_detail.user_fbid, 
          user_status: 'nicht verifiziert',
          user_geschlecht:$scope.user_detail.user_gender,
          user_loginType: $scope.user_detail.user_loginType,
        };   
   
    $scope.speichern = function (){

        var urlSignup = config.urlBase+'controller/new_user.php';
        $http.post(urlSignup, $scope.user, {
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
        } })
        .then(
        function(response){
          $ionicLoading.show({ template: strings.SuccAcc, noBackdrop: true, duration: 2000});
            
            
            
            var str = config.urlBase+"controller/data_login_by_other.php?username="+ $scope.user_detail.user_email;
          $http.get(str)
            .success(function(response){
              
               // $ionicHistory.clearCache();
               // $ionicHistory.clearHistory();
              
                $scope.admin=response.records;

                sessionStorage.setItem('loggedin_status',true);
                localStorage.setItem('id_user',$scope.admin.user_id);
                localStorage.setItem('status_user',$scope.admin.status);
                localStorage.setItem('city',$scope.admin.city);
                localStorage.setItem('user_firstname',$scope.admin.user_firstname);
                localStorage.setItem('user_lastname',$scope.admin.user_lastname);
                localStorage.setItem('user_photo',$scope.admin.user_photo);
                localStorage.setItem('user_uniemail',$scope.admin.user_uniemail);

                $state.go('tab.uniid',{},{location:"replace",reload:true});

              
            })

            
            
            
          //$state.go('tab.uniid',{},{location:"replace",reload:true});
        },

        function(response){
          /* if account already exists or database not connected*/
          $ionicLoading.show({ template: strings.ErrAcc, noBackdrop: true, duration: 2000});
        }); 
    };

}])
.controller('MapsCtrl', function($scope, $state, $cordovaGeolocation, $http, config, $ionicModal) {

  $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('Google Map');
  });

    
    if($scope.city_name != undefined){
        $scope.city_name = $scope.city_name;
    } else {
         $scope.city_name = localStorage.getItem("city");
    }

	  $scope.Places = [];
      $scope.FullPlaces = [];
      $http.get(config.urlBase+'json/data_places.php')
      .success(function(data, status, headers,config){
          console.log('Data places success');
          $scope.FullPlaces = data.places;
		    $scope.Places = $scope.FullPlaces.filter( item => item.category_name === localStorage.getItem("city") );
            console.log($scope.morePlacess);
          //initialize();
            initi();
			  
      })
      .error(function(data, status, headers,config){
          console.log('Data places error');
      })
	
		var map;
        var bounds = new google.maps.LatLngBounds();
        var markers = [];
		
		
		
      function displayMap(){

        var myLatlng = new google.maps.LatLng(51.453339, 7.009360);
        var mapOptions = {
              center: myLatlng,
              zoom: 16,
              timeout: 10000,
              enableHighAccuracy: true,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              //maxZoom: 16,
              disableDefaultUI: true,
              styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#6195a0"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":"0"},{"saturation":"0"},{"color":"#f5f5f2"},{"gamma":"1"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"lightness":"-3"},{"gamma":"1.00"}]},{"featureType":"landscape.natural.terrain","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#bae5ce"},{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#fac9a9"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#787878"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"transit.station.airport","elementType":"labels.icon","stylers":[{"hue":"#0a00ff"},{"saturation":"-77"},{"gamma":"0.57"},{"lightness":"0"}]},{"featureType":"transit.station.rail","elementType":"labels.text.fill","stylers":[{"color":"#43321e"}]},{"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"hue":"#ff6c00"},{"lightness":"4"},{"gamma":"0.75"},{"saturation":"-68"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#eaf6f8"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#c7eced"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"lightness":"-49"},{"saturation":"-53"},{"gamma":"0.79"}]}]
          };
                        
        <!-- Display a map on the page -->
        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        map.setTilt(45);
		
		addMarkers();
		
		
		var geolocationDiv = document.createElement('div');
        var geolocationControl = new GeolocationControl(geolocationDiv, map);
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(geolocationDiv);
          
          function GeolocationControl(controlDiv, map) {

            // Set CSS for the control button
            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = '#444';
            controlUI.style.borderStyle = 'solid';
            controlUI.style.borderWidth = '1px';
            controlUI.style.borderColor = 'white';
            controlUI.style.height = '28px';
            controlUI.style.marginTop = '5px';
            controlUI.style.cursor = 'pointer';
            controlUI.style.textAlign = 'center';
            controlUI.title = 'Click to center map on your location';
            controlDiv.appendChild(controlUI);

            // Set CSS for the control text
            var controlText = document.createElement('div');
            controlText.style.fontFamily = 'Arial,sans-serif';
            controlText.style.fontSize = '10px';
            controlText.style.color = 'white';
            controlText.style.paddingLeft = '10px';
            controlText.style.paddingRight = '10px';
            controlText.style.marginTop = '8px';
            controlText.innerHTML = 'Karte zentrieren';
            controlUI.appendChild(controlText);

            // Setup the click event listeners to geolocate user
            google.maps.event.addDomListener(controlUI, 'click', geolocate);
        }

        function geolocate() {
            //alert('ckicked');
             var options = {timeout: 10000, enableHighAccuracy: true};

            $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
                var center  = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.panTo(center);

               
               });
            
        }
		
	  }
      
	function addMarkers() {

		var image = {
		url: 'img/g-pin.png', // image is 512 x 512
		scaledSize: new google.maps.Size(70, 70),
		};

		var infoWindowContent = []; 
		<!-- Display multiple markers on a map -->
		var infoWindow = new google.maps.InfoWindow(), marker, i;
		
		
		<!-- Loop through our array of markers & place each one on the map   -->
		for( i = 0; i < $scope.Places.length; i++ ) {
		
		var position = new google.maps.LatLng($scope.Places[i].place_latitude, $scope.Places[i].place_longitude);
		bounds.extend(position);
		marker = new google.maps.Marker({
			position: position,
			map: map,
			title: $scope.Places[i].place_name,
			icon: 'img/g-pin.png'
		});


		<!-- Allow each marker to have an info window     -->
		google.maps.event.addListener(marker, 'click', (function(marker, i) {
			return function() {
				infoWindow.setContent('<div class="info_content"><a href="#/tab/place/'+$scope.Places[i].id+'">' +$scope.Places[i].place_name +'</a></div>');
				infoWindow.open(map, marker);
			}
			})(marker, i));
			<!-- Automatically center the map fitting all markers on the screen -->
			markers.push(marker);
			map.fitBounds(bounds);
		}
		
        <!-- Override our map zoom level once our fitBounds function runs (Make sure it only runs once) -->
        var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
            this.setZoom(10);
            google.maps.event.removeListener(boundsListener);
        });
        
	}
	
      function initi() {
        
		  displayMap();

    }
    
    
    
    $ionicModal.fromTemplateUrl('share.html', function($ionicModal) {
        $scope.share = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });
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
    
  
	/*
    $scope.getName = function(name){
        
        $scope.city_name = name;
        console.log(name);
        //$state.go('tab.maps', {}, {reload: true});
		//$scope.Places = $scope.FullPlaces.filter( item => item.category_name === name );
		$scope.Places = [];
		displayMap();
		$scope.Places = $scope.FullPlaces.filter( item => item.category_name === name );
		addMarkers();
        $scope.share.hide();
    }
	*/
	$scope.getName = function(name){
        
        $scope.city_name = name;
        console.log(name);
        removeMarkers();
		$scope.Places = $scope.FullPlaces.filter( item => item.category_name === name );
		addMarkers();
        $scope.share.hide();
    }
    
function removeMarkers()
{
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
	markers = [];
}
        
})
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

  $scope.params = $state.params;
  $scope.imagesfolder = config.urlBase+'images';
  $scope.news = [];
  $http.get(config.urlBase+'json/data_news.php')
    .success(function(data, status, headers,config){
      console.log('Data news success');
      $scope.data = data.news[$state.params.id];
      $scope.news = data.news;
      $scope.data.news_date = Date.parse($scope.data.news_date);
      //$scope.imagePost = $scope.data.news_image;
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
    $cordovaSocialSharing.shareViaWhatsApp(strings.shareMess, $scope.imagesfolder+'/'+$scope.imagePost, $scope.appUrl);
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

.controller('ContactCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$timeout', '$ionicLoading', function($scope, $http, $state, config, strings, $timeout, $ionicLoading) {

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
      window.open(encodeURI($scope.contactWebsite), '_system');
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
            $ionicLoading.show({ template: $scope.contactSuccess, noBackdrop: true, duration: 2000 });             
            })
            .error(function(){   
            $ionicLoading.show({ template: $scope.contactFailed, noBackdrop: true, duration: 2000 });        
            });

      }else{
      }
    }


}])

.controller('AccountCtrl', ['$scope', '$http', '$state', 'config', 'strings', '$ionicLoading', '$ionicHistory', '$localStorage', '$ionicModal', function($scope, $http, $state, config, strings, $ionicLoading, $ionicHistory, $localStorage, $ionicModal) {

$ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
});
    
   $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('Account');
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
        
        localStorage.removeItem('status_user');
        localStorage.removeItem('user_firstname');
        localStorage.removeItem('user_lastname');
        localStorage.removeItem('user_photo');
        localStorage.removeItem('user_uniemail');
        localStorage.removeItem('city');

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
          user_alter : '',
          user_id : $scope.id_user
        };

        $scope.speichern = function (){

        var urlSignup = config.urlBase+'controller/edit_user.php';
        $http.post(urlSignup, $scope.user)
        .then(
        function(response){
          $ionicLoading.show({ template: strings.SuccAcc, noBackdrop: true, duration: 2000});
          $state.go('tab.login',{},{location:"replace",reload:true});
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


}])
.directive('uiShowPassword', [
  function () {
  return {
    restrict: 'A',
    scope: true,
    link: function (scope, elem, attrs) {
      var btnShowPass = angular.element('<button class="button button-clear"><i class="ion-eye"></i></button>'),
        elemType = elem.attr('type');

      // this hack is needed because Ionic prevents browser click event 
      // from elements inside label with input
      btnShowPass.on('mousedown', function (evt) {
        (elem.attr('type') === elemType) ?
          elem.attr('type', 'text') : elem.attr('type', elemType);
        btnShowPass.toggleClass('button-positive');
        //prevent input field focus
        evt.stopPropagation();
      });

      btnShowPass.on('touchend', function (evt) {
        var syntheticClick = new Event('mousedown');
        evt.currentTarget.dispatchEvent(syntheticClick);

        //stop to block ionic default event
        evt.stopPropagation();
      });

      if (elem.attr('type') === 'password') {
        elem.after(btnShowPass);
      }
    }
  };
}])
.directive('ionicRatings', [

  function () {
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
        index: '=index'
      },
      link: function(scope, element, attrs) {

        //Setting the default values, if they are not passed
        scope.iconOn = scope.ratingsObj.iconOn || 'ion-ios-star';
        scope.iconOff = scope.ratingsObj.iconOff || 'ion-ios-star-outline';
        scope.iconOnColor = scope.ratingsObj.iconOnColor || 'rgb(200, 200, 100)';
        scope.iconOffColor = scope.ratingsObj.iconOffColor || 'rgb(200, 100, 100)';
        scope.rating = scope.ratingsObj.rating || 0;
        scope.minRating = scope.ratingsObj.minRating || 0;
        scope.readOnly = scope.ratingsObj.readOnly || false;
        scope.index = scope.index || 0;

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

        scope.$watch('ratingsObj.rating', function(newValue, oldValue) {
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
  

}])
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