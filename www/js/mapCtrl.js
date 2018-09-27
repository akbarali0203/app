'use strict';
app.controller('MapsCtrl', function($scope, $state, $cordovaGeolocation, $http, config, $ionicModal, $ionicLoading) {

    
  $scope.$on('$ionicView.beforeEnter', function() {
    analytics.trackView('Google Map');
  });

    /*
    if($scope.city_name != undefined){
        $scope.city_name = $scope.city_name;
    } else {
         $scope.city_name = localStorage.getItem("user_city");
    }
    */

    /*
    //facebook events function
   $scope.eventFulllist = [];
   $http.get(config.urlBase+'json/facebook_events.php')
   .success(function(data, status, headers,config){
       console.log('Data events success');
       $scope.events = data.events;
       $scope.eventFulllist = data.events;
         $scope.events = data.events.filter( item => item.category_name === localStorage.getItem("user_city") );
         console.log($scope.events);
   })
   .error(function(data, status, headers,config){
       console.log('Data event error');
   })
*/
	  $scope.Places = [];
      $scope.FullPlaces = [];
      $http.get(config.urlBase+'json/data_places.php')
      .success(function(data, status, headers,config){
          console.log('Data places success');
          $scope.FullPlaces = data.places;

          if(localStorage.getItem("user_role") == "Demo"){
            $scope.FullPlaces = $scope.FullPlaces.filter(Item =>  Item.place_status == 'Demo');
          } 
          else {
            $scope.FullPlaces = $scope.FullPlaces.filter(Item =>  Item.place_status != 'Demo');
          }
          
            $scope.Places = $scope.FullPlaces.filter( item => item.category_name === localStorage.getItem("user_city") );

          if($scope.Places.length == 0){
              $ionicLoading.show({ template: "Leider kein Ergebnis gefunden", noBackdrop: true, duration: 2000});
          }

            //$scope.Places = $scope.FullPlaces;
            //console.log($scope.morePlacess);
         // facebook event line
          //$scope.Places = $scope.Places.concat($scope.events);
          LoadMap();
			  
      })
      .error(function(data, status, headers,config){
          console.log('Data places error');
      })
    
      
      var markers = [];
      var map;
      var infoWindow;
      function LoadMap() {

    
            var mapOptions = {
                center: new google.maps.LatLng(51.453339, 7.009360),
                timeout: 10000,
                enableHighAccuracy: true,
                // zoom: 8, //Not required.
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#6195a0"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":"0"},{"saturation":"0"},{"color":"#f5f5f2"},{"gamma":"1"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"lightness":"-3"},{"gamma":"1.00"}]},{"featureType":"landscape.natural.terrain","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#bae5ce"},{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#fac9a9"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#787878"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"transit.station.airport","elementType":"labels.icon","stylers":[{"hue":"#0a00ff"},{"saturation":"-77"},{"gamma":"0.57"},{"lightness":"0"}]},{"featureType":"transit.station.rail","elementType":"labels.text.fill","stylers":[{"color":"#43321e"}]},{"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"hue":"#ff6c00"},{"lightness":"4"},{"gamma":"0.75"},{"saturation":"-68"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#eaf6f8"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#c7eced"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"lightness":"-49"},{"saturation":"-53"},{"gamma":"0.79"}]}]
            };
            infoWindow = new google.maps.InfoWindow();
            map = new google.maps.Map(document.getElementById("map"), mapOptions);
            //map.setTilt(45);
            addMarkers();




/*
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
              
    
                 $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
                    var latLng = {lat: position.coords.latitude, lng: position.coords.longitude}
                    //var center  = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    //map.panTo(center);
                });
                
                
            }
*/

        }

        function addMarkers(){
        //Create LatLngBounds object.
        var latlngbounds = new google.maps.LatLngBounds();
 
        for (var i = 0; i < $scope.Places.length; i++) {
            var data = $scope.Places[i]
            var myLatlng = new google.maps.LatLng($scope.Places[i].place_latitude, $scope.Places[i].place_longitude);
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: $scope.Places[i].place_name,
                /* icon: 'img/mapIcons/'+$scope.Places[i].type_name+'.png', */
                
                icon: {
                    url: 'img/mapIcons/'+$scope.Places[i].type_name+'.svg',
                    scaledSize: new google.maps.Size(60, 60),
                    anchor: new google.maps.Point(20, 58)
                },
                
            });
            (function (marker, data) {
                google.maps.event.addListener(marker, "click", function (e) {
                    infoWindow.setContent('<div class="info_content"><a style="text-decoration: none; color:#38c723" href="#/tab/place/'+data.id+'">' +data.place_name +'</a></div>');
                    infoWindow.open(map, marker);
                });
            })(marker, data);
            markers.push(marker);
            //Extend each marker's position in LatLngBounds object.
            latlngbounds.extend(marker.position);
        }

        /*
        var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
            this.setZoom(40);
            google.maps.event.removeListener(boundsListener);
        });
        */
        //Get the boundaries of the Map.
        var bounds = new google.maps.LatLngBounds();
 
        //Center map and adjust Zoom based on the position of all markers.
        map.setCenter(latlngbounds.getCenter());
        map.fitBounds(latlngbounds);
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
        
        if(name === 'All'){
            $scope.Places = $scope.FullPlaces;
            //$scope.Places = $scope.Places.concat($scope.eventFulllist);
        } else {
            $scope.Places = $scope.FullPlaces.filter( item => item.category_name === name );
            /*
            $scope.events = $scope.eventFulllist.filter( item => item.category_name === name );
            $scope.Places = $scope.Places.concat($scope.events);
            */
        }
        if($scope.Places.length == 0){
            $ionicLoading.show({ template: "Leider kein Ergebnis gefunden", noBackdrop: true, duration: 2000});
        }
		addMarkers();
        $scope.share.hide();
    }
    
function removeMarkers()
{
   markers.forEach(function(m) { m.setMap(null); });
   markers = [];
}
        
})