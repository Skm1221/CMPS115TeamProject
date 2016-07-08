var map;
var markers = [];
var labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
var labelIndex = 0;

/*
 * Initialize Google Map functions - initMap
 */
function initMap() {
  var mapholder = document.getElementById("mapholder");
  var UCSCLatlon = new google.maps.LatLng(36.9923454, -122.0613478);
  var myOptions = {
    center: UCSCLatlon,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: true,
    navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
  }
  map = new google.maps.Map(mapholder, myOptions);
}

/*
 * Marker functions - setMarker, showAllMarker, hideAllMarker, removeAllMarker, removeFirstMarker
 */
function setMarker(lat, lng, tooltip) {
  var latlng = new google.maps.LatLng(lat, lng);
  var marker = new google.maps.Marker({
    position: latlng,
    map: map,
    title: tooltip,
    label: labels[labelIndex++ % labels.length]
  });
  markers.push(marker);
}
function showAllMarker() {
  for (var i=0; i<markers.length; i++) {
    markers[i].setMap(map);
  }
}
function hideAllMarker() {
  for (var i=0; i<markers.length; i++) {
    markers[i].setMap(null);
  }
}
function removeAllMarker() {
  for (var i=0; i<markers.length; i++) {
    markers[i].setMap(null);
    markers[i] = null;
  }
  markers = [];
}
function removeFirstMarker() {
  markers[0].setMap(null);
  markers = markers.slice(1);
}
function bounceMarker(marker) {
  marker.setAnimation(google.maps.Animation.BOUNCE);
}
function stopBounceMarker(marker) {
  marker.setAnimation(null);
}
function bounceOnceMarker(marker) {
  bounceMarker(marker);
  setTimeout(function(){stopBounceMarker(marker);}, 750);
}
function addPopupOnMarker(marker, content) {
  var infowindow = new google.maps.InfoWindow({
    content: content
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}

/*
 * Getting Current Location Function - getLocation, showPosition, showError
 */
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.querySelector("article").innerHTML = "Geolocation is not supported by this browser.";
  }
}
function showPosition(position) {
  var mapholder = document.getElementById("mapholder");
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  var currentLatlon = new google.maps.LatLng(lat, lng);
  var myOptions = {
    center: currentLatlon,
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
  }
  map = new google.maps.Map(mapholder, myOptions);
  var marker = new google.maps.Marker({position:currentLatlon, map:map, title: "You Are Here"});
}
function showError(error) {
  var mapholder = document.getElementById("mapholder");
  switch(error.code) {
    case error.PERMISSION_DENIED:
      mapholder.innerHTML = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      mapholder.innerHTML = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      mapholder.innerHTML = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      mapholder.innerHTML = "An unknown error occurred."
      break;
  }
}
