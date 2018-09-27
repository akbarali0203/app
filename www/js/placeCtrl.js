'use strict';
app.controller('PlaceCtrl', ['$scope', '$http', 'PlacesService', '$state', 'config', 'strings', '$ionicLoading', '$timeout', '$ionicModal', '$ionicPlatform', '$cordovaSocialSharing', '$cordovaInAppBrowser', '$localStorage', '$sce', '$ionicPopup', '$cordovaClipboard', '$cordovaToast', '$window' , function($scope, $http, PlacesService, $state, config, strings, $ionicLoading, $timeout, $ionicModal, $ionicPlatform, $cordovaSocialSharing, $cordovaInAppBrowser, $localStorage, $sce, $ionicPopup, $cordovaClipboard, $cordovaToast, $window) {
    
var baseUrl = config.urlBase;
$scope.alertPopupJustCode;
/*
  $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('Category Place');
  });
    */

   $scope.$on('$ionicView.afterEnter', function() {

    $ionicLoading.hide();

});
    
    $scope.options = {
      loop: false,
      effect: 'slide',
      speed: 500,
      spaceBetween: 18,
      slidesPerView:1.2,
      direction: 'horizontal',
      pagination: false,
    }
    
  $scope.ratingFull = {};
  $scope.ratingFull.rate = 5;
  $scope.ratingFull.max = 5;

    $scope.FormReviewSend = 'SENDEN';
    $scope.review={};
    $scope.sendRatingForm = function(){
    //$ionicLoading.show({ template: $scope.contactSending, noBackdrop: true});

    var review_userid = localStorage.getItem("id_user");
        
       $scope.review = {
          review_userid : localStorage.getItem("id_user"),
          review_comment : $scope.review.message,
          review_stars : $scope.ratingFull.rate,
          review_topid : ' ',
          review_localid :$scope.idplace,
          review_status : 'Veröffentlicht',
        };
        

      if(review_userid){
          //var urlreview = config.urlBase+"controller/new_review.php?review_userid="+review_userid+"&review_stars="+review_stars+"&review_topid="+review_topid+"&review_localid="+review_localid+"&review_status="+review_status+"&review_comment="+review_comment;
          var urlreview = config.urlBase+"controller/new_review_by_app.php";
          $http.post(urlreview, $scope.review, {
    headers : {
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    } })
            .then(
                function(data, status, headers,config){
                  $scope.ratingFull.rate = 5;
                  $ionicLoading.show({ template: 'vielen Dank für Ihre Bewertung', noBackdrop: true, duration: 2000});
                  $state.reload();
                  
                },
              
                function(data, status, headers,config){
                  /* if account already exists or database not connected*/
                  $ionicLoading.show({ template: strings.ErrAcc, noBackdrop: true, duration: 2000});
                }
              );
      }else{
      }
    }
    
    
    
/* Review section  finish */
  $ionicLoading.show({
    template: '<ion-spinner icon="crescent" class="spinner-assertive"></ion-spinner>',
    noBackdrop: true
  });
    
    var user_city = localStorage.getItem("city");
    $scope.user_city = user_city;
    
    var id_user = localStorage.getItem("id_user");
    $scope.userId = id_user;
    
      
    


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

 

  $scope.activateTitle = 'AKTIVIEREN';

  $scope.params = $state.params;
  $scope.imagesfolder = config.urlBase+'images';
  $scope.places = [];
  $http.get(config.urlBase+'json/data_places.php')
    .success(function(data, status, headers,config){
      console.log('Data places success');
      $scope.data = data.places[$state.params.id];
      $scope.places = data.places;
      $scope.idplace = $scope.data.place_id;
      
      $scope.placesAddress = $scope.data.place_address;
      $scope.latitude = $scope.data.place_latitude;
      $scope.longitude = $scope.data.place_longitude;
      
      $scope.imagePlace = $scope.data.place_image;

      $scope.linkWebsite = $scope.data.place_website;
      $scope.linkfacebook = $scope.data.place_facebook;
      
      $scope.OfferButton =  $scope.data.place_button_titel;
      
      
      $scope.place_gutschein_type = $scope.data.place_gutschein_type;
      $scope.place_gutscheincode = $scope.data.place_gutscheincode;
      $scope.place_ext_link = $scope.data.place_ext_link;
      $scope.place_anzahl_tage = $scope.data.place_anzahl_tage;

      $scope.place_popupbtn = $scope.data.place_popupbtn;
      $scope.place_popuptitel = $scope.data.place_popuptitel;

      //analytics.trackView('Place: '+$scope.data.place_name+', '+$scope.data.category_name);


    /* get all review */

    $scope.reviews = [];
    //var headers = { "headers": {"Content-Type": "application/json"} };
    var urlGetReview = "https://uniheld-app.cdemo.me/json/data_review_by_localid.php?review_localid="+$scope.idplace;
    //$http.get(config.urlBase+'json/data_review_by_localid.php')
    $http.get(urlGetReview)
    .success(function(dataa, status, headers, config){
        console.log('Data Review success');
        $scope.dataa =  dataa.review;
        $scope.dataa = $scope.dataa.filter(Item => Item.review_localid ===  $scope.idplace);

    //$scope.dataa = $scope.dataa.review_localid;
    })
    .error(function(dataa, status, headers,config){
        console.log('Data places error');
    })



      
      $scope.openMap = function(map) {
        var url = 'https://www.google.com/maps/search/?api=1&query='+$scope.placesAddress+'&zoom=15';
       // var url = 'https://www.google.com/maps/search/?api=1&query='+$scope.placesAddress+$scope.latitude+','+$scope.longitude+'&zoom=15';
        window.open(encodeURI(url), '_system');
      }
      $scope.FBopen = function(facebook) {
        var url = 'https://'+$scope.linkfacebook;
        //window.open(encodeURI(url), '_system');
        cordova.InAppBrowser.open(encodeURI(url), '_blank', 'location=yes' );
      }
      $scope.openWebsite = function(website) {
        if (!/^(f|ht)tps?:\/\//i.test($scope.linkWebsite)) {
            $scope.linkWebsite = "http://" + $scope.linkWebsite;
        }
          cordova.InAppBrowser.open(encodeURI($scope.linkWebsite), '_blank', 'location=yes', 'hidden=yes' );
      }
      


      $scope.gutscheinLink = function(url) {
        //var url = $scope.place_ext_link;
        $scope.alertPopupJustCode.close();
        if (!/^(f|ht)tps?:\/\//i.test(url)) {
            url = "http://" + url;
        }
        //window.open(encodeURI(url), '_system');
       cordova.InAppBrowser.open(encodeURI(url), '_blank', 'location=yes' );



   


      }


      

    
      var limitStep = 3;
      $scope.limit = limitStep;
      $scope.incrementLimit = function() {
          $scope.limit += limitStep;
      };

    
        $scope.takeToOffer = function(){
        // alert('i clicked');
        var value=1;
        analytics.trackEvent($scope.OfferButton, 'Action', 'Clicked', value);
            
        




            
        if(localStorage.getItem('user_status') === 'nicht verifiziert'){
             $state.go('tab.uniid');
        } else {
            if($scope.place_gutschein_type === 'Uniheld'){
                $state.go('tab.uniid');
            }
            /*
            if($scope.place_gutschein_type === 'Uniheld ID'){
                $state.go('tab.uniid');
            }
            */
            // GutscheinType = allgemein + Gutscheincode = 'test123' + place_ext_link = ''
            if($scope.place_gutschein_type === 'Gutscheincode'  && $scope.place_gutscheincode != '' && $scope.place_ext_link === '' ){
                $scope.alertPopupJustCode = $ionicPopup.alert({
                    title: 'Gutschein Code',
                     scope: $scope,
                    template: '<button type="button" class="button button-block greenButtonOutLone buttonForOffer" ng-click="copyText(place_gutscheincode)" >{{place_gutscheincode}}</button><p>{{msg}}</p>',
                    okType: "button-cancel",
                    okText: 'Abbrechen',
                });
            }
            // GutscheinType = allgemein + Gutscheincode = '' + place_ext_link = 'test'
            if($scope.place_gutschein_type === 'Gutscheincode' && $scope.place_gutscheincode === '' && $scope.place_ext_link != '' ){
                var url = $scope.place_ext_link;
                $scope.gutscheinLink(url);
                $scope.alertPopupJustCode.close();
            }
            // GutscheinType = allgemein + Gutscheincode = 'test123' + place_ext_link = 'test'
             if($scope.place_gutschein_type === 'Gutscheincode' && $scope.place_gutscheincode != '' && $scope.place_ext_link != '' ){
                $scope.alertPopupJustCode = $ionicPopup.alert({
                    title: $scope.place_popuptitel,
                     scope: $scope,
                    template: '<button type="button"  class="button button-block greenButtonOutLone buttonForOffer" ng-click="copyTextWithoutClosePopup(place_gutscheincode)" >{{place_gutscheincode}}</button><br><button type="button" class="button button-block greenButton buttonForOffer" ng-click="gutscheinLink(place_ext_link)" >{{place_popupbtn}}</button>',
                    okType: "button-cancel",
                    okText: 'Abbrechen',
                });
            }

            
            // GutscheinType = allgemein + Gutscheincode = 'test123' + place_ext_link = 'test'
             if($scope.place_gutschein_type === 'Gutschein alle X Tage' && $scope.place_gutscheincode != '' && $scope.place_anzahl_tage != '' /* && $scope.place_active === 'yes' */ ){
                $scope.alertPopupJustCode = $ionicPopup.alert({
                    title: 'Gutschein Code',
                     scope: $scope,
                    template: '<button type="button" class="button button-block button-assertive" ng-click="activate()" >{{activateTitle}}</button><br>{{mgsActivate}}',
                    okType: "button-cancel",
                    okText: 'Abbrechen',
                });
            }

            // GutscheinType = allgemein + Gutscheincode = '' + place_ext_link = 'test'
            if($scope.place_gutschein_type === 'Gutschein alle X Tage' && $scope.place_gutscheincode === '' && $scope.place_anzahl_tage != '' /* && $scope.place_active === 'yes' */ ){
                $scope.alertPopupJustCode = $ionicPopup.alert({
                  title: 'Gutschein Code',
                    scope: $scope,
                  template: '<button type="button" class="button button-block button-assertive" ng-click="activate()" >{{activateTitle}}</button><br>{{mgsActivate}}',
                  okType: "button-cancel",
                  okText: 'Abbrechen',
              });
            }


            // Qr-code
            if($scope.place_gutschein_type === 'qr_code'){
                //$http.get(baseUrl+'controller/couponActivation.php?coupon='+$scope.place_gutscheincode+'&user_ID='+$scope.userId+'&action=Coupon')
                $http.get(baseUrl+'controller/qrcode.place.php?user_id='+$scope.userId+'&place_id='+$scope.idplace)
                .success(function(data, status, headers,config){
                        console.log('Qr-code success');
                        $scope.title = data.title;
                        $scope.barcodenum = data.qrcode;
                        $scope.message = data.message;
                                               
                        $scope.code = $scope.barcodenum;
                        $scope.type = 'EAN';
                        $scope.options = {
                            width: 3,
                            height: 130,
                            displayValue: true,
                            font: 'monospace',
                            textAlign: 'center',
                            fontSize: 15,
                            backgroundColor: '#ffffff',
                            lineColor: '#000000'
                        }

                        if(data.status == 'error')
                        {
                        $ionicLoading.show({ template: $scope.message, noBackdrop: true, duration: 2000});
                        } else {
                            $scope.alertPopupJustCode = $ionicPopup.alert({
                            title: $scope.title,
                            scope: $scope,
                            template: '<io-barcode code="{{ code }}" type="{{ type }}" options="options"></io-barcode><br><button type="button" class="button button-block button-assertive" ng-click="usedConfirm()">Jetzt Einlösen</button>',
                            okType: "button-cancel",
                            okText: 'Abbrechen',
                            });
                        }
                        })
                .error(function(data, status, headers,config){
                    console.log('Qr-code error');
                    $ionicLoading.show({ template: data.error, noBackdrop: true, duration: 2000});
                    })
        
                }
                $scope.usedConfirm = function(){
                    var urlusedConfirm = baseUrl+"controller/qrcode.place.php?user_id="+$scope.userId+"&place_id="+$scope.idplace+"&action=used";
                    $http.get(urlusedConfirm)
                    .success(function(data){
                             $scope.mgsActivate = data;
                             $scope.alertPopupJustCode.close();
                             })
        
                    .error(function(){
                           $scope.mgsActivate = "sorry";
                           });
                    }


            if($scope.place_gutschein_type === 'Einmaliger Gutschein' && $scope.place_gutscheincode != ''){
                $http.get(baseUrl+'controller/couponActivation.php?coupon='+$scope.place_gutscheincode+'&user_ID='+$scope.userId+'&action=Coupon')
                .success(function(data, status, headers,config){
                  console.log('Data categories success');

                  if(data.status === 'success'){
                    $scope.einmalCoupon = data.coupon;
                  } else{
                    $scope.einmalCouponErrormsg = data.message
                  }
                  $ionicLoading.hide();
                  })
                .error(function(data, status, headers,config){
                  console.log('Data categories error');
                })


                $ionicPopup.alert({
                    title: 'Gutschein Code',
                     scope: $scope,
                     template: '<div ng-if="einmalCoupon"><button type="button" class="button button-block greenButtonOutLone buttonForOffer" ng-click="copyText(einmalCoupon)" >{{einmalCoupon}}</button><br><button type="button"  class="button button-block greenButtonOutLone buttonForOffer" ng-click="getNewCoupon()" >Erhalte neuen Coupon</button></div><p class="text-center" ng-if="!einmalCoupon">{{einmalCouponErrormsg}}</p>',
                    okType: "button-cancel",
                    okText: 'Abbrechen',
                });
            }

            $scope.getNewCoupon = function(){
                $ionicLoading.show();
                $http.get(baseUrl+'controller/couponActivation.php?coupon='+$scope.place_gutscheincode+'&user_ID='+$scope.userId+'&action=newCoupon')
                .success(function(data, status, headers,config){
                  console.log('Data categories success');

                  if(data.status === 'success'){
                    $scope.einmalCoupon = data.coupon;
                  } else if(data.status === 'error'){
                    $scope.einmalCoupon = '';
                    $scope.einmalCouponErrormsg = data.message
                  }
                  $ionicLoading.hide();
                  })
                .error(function(data, status, headers,config){
                  console.log('Data categories error');
                })
            }
            
             $scope.activate = function(){
                //alert('activated');
                 //$scope.mgsActivate = "hi";
                  var urlactivate = "https://uniheld-app.cdemo.me/controller/activate.php?userid="+$scope.userId+"&localid="+localStorage.getItem('local_id')+"&days="+$scope.place_anzahl_tage;
                  $http.get(urlactivate)
                    .success(function(data){
                        $scope.activateTitle = 'JETZT EINLÖSEN';
                        $scope.mgsActivate = data;
                        //$scope.showToast(data, 'short', 'center');
                        //$ionicLoading.show({ template: data, noBackdrop: true, duration: 2000});
                        //alertPopupJustCode.close();
                    })
                    .error(function(){   
                        $scope.mgsActivate = "sorry";
                    });

             }
            
             $scope.copyText = function(value){
                $cordovaClipboard.copy(value).then(function() {
                    console.log("Copied text");
                    $scope.showToast('In Zwischenablage gespeichert', 'short', 'center');
                    $scope.alertPopupJustCode.close();
                }, function() {
                    console.error("There was an error copying");
                });
                 
             }

             $scope.copyTextWithoutClosePopup = function(value){
                $cordovaClipboard.copy(value).then(function() {
                    //console.log("Copied text");
                    $scope.showToast('In Zwischenablage gespeichert', 'short', 'center');
                }, function() {
                    console.error("There was an error copying");
                });
                 
             }
             
             
              $scope.showToast = function(message, duration, location) {
                $cordovaToast.show(message, duration, location).then(function(success) {
                    console.log("The toast was shown");
                }, function (error) {
                    console.log("The toast was not shown due to " + error);
                });
            }

             
             
        }
            
            //$state.go('tab.uniid');
        }


        $scope.runGallery();
      

    })

    .error(function(data, status, headers,config){
      console.log('Data places error');
    })
    

  
$scope.runGallery = function(){
       
    $scope.gallery = [];
    $scope.imagesfolder = config.urlBase+'images';
    $http.get(config.urlBase+'json/data_gallery.php')
    .success(function(data, status, headers,config){
        console.log('Data gallery success');
        $scope.gallery = data.gallery;
        $scope.gallery = $scope.gallery.filter(Item => Item.place_gallery_id == $scope.idplace);
        $ionicLoading.hide();
    })
    .error(function(data, status, headers,config){
        console.log('Data gallery error');
    })
    
  }

  $scope.removeReview = function(id){
    $ionicLoading.show();
    $http.get(config.urlBase+'controller/reviewDelete.php?review_id='+id)
    .success(function(data, status, headers,config){
        console.log('Deleted Review success');
        $ionicLoading.hide();
        $ionicLoading.show({ template: 'Beitrag gelöscht', noBackdrop: true, duration: 2000});
        $state.reload();
    })
    .error(function(data, status, headers,config){
        console.log('Data gallery error');
    })
  }

  

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

    $ionicModal.fromTemplateUrl('teil.html', function($ionicModal) {
      $scope.teil = $ionicModal;
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

  $scope.statusData = [];
  var user_email = localStorage.getItem("user_email");
  //var urlGetData = baseUrl+"controller/fbid.php?user_email="+user_email+"&user_login_type=''&user_login_id=''";
  //var urlGetData = config.urlBase+"controller/fbid.php?user_email="+user_email+"&user_login_type=null&user_login_id=null";
  var urlGetData = config.urlBase+"controller/userstatus.php?user_email="+user_email;
  $http.get(urlGetData)
  .success(function(data, status, headers,config){
           console.log('success');
           $scope.statusData = data.records;
           localStorage.setItem('user_status',$scope.statusData.status);
           })

  .error(function(data, status, headers,config){
         console.log('Data error');
  })

  }])