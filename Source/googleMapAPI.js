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
  var maxZoomLevel = 15;

  var myOptions = {
    center: UCSCLatlon,
    zoom: maxZoomLevel,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
  }
  map = new google.maps.Map(mapholder, myOptions);


  // Bounds for UCSC
  var strictBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(36.977536, -122.068339),
    new google.maps.LatLng(37.005027, -122.052031)
  );

  // Set marker by click
  google.maps.event.addListener(map, 'click', function(event) {
    removeAllMarker();
    marker = setMarker(event.latLng, map);
    $('#event_coordinate').val(event.latLng.lat() + ", " + event.latLng.lng());
  });


  // Listen for the dragend event
  google.maps.event.addListener(map, 'dragend', function () {
    if (strictBounds.contains(map.getCenter())) return;

    // We're out of bounds - Move the map back within the bounds

    var c = map.getCenter(),
        x = c.lng(),
        y = c.lat(),
        maxX = strictBounds.getNorthEast().lng(),
        maxY = strictBounds.getNorthEast().lat(),
        minX = strictBounds.getSouthWest().lng(),
        minY = strictBounds.getSouthWest().lat();

    if (x < minX) x = minX;
    if (x > maxX) x = maxX;
    if (y < minY) y = minY;
    if (y > maxY) y = maxY;

    map.setCenter(new google.maps.LatLng(y, x));
  });

  // Limit the zoom level
  google.maps.event.addListener(map, 'zoom_changed', function () {
    if (map.getZoom() < maxZoomLevel) map.setZoom(maxZoomLevel);
  });
}

/*
 * Marker functions - setMarker, showAllMarker, hideAllMarker, removeAllMarker, removeFirstMarker
 */
function setMarker(latLng, tooltip) {
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    //title: tooltip,
    //label: labels[labelIndex++ % labels.length]
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