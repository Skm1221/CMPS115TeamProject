var eventData = [];
var user_id;

function receive_user_id() {
  user_id = window.location.href.split("?")[1].split("&")[0];
}

function return_currentPage(){
  window.location = "./main.html?"+user_id+"&";
}

function return_createPage(){
  window.location = "./CreateEvent.html?"+user_id+"&";
}

function return_myPage() {
  window.location = "./MyPage.html?"+user_id+"&";
}
//==================================================
// Server Communication
//==================================================

/* grabEventFromServer()
 * Grabs a list of random events of category type from the server.
 *   major: String. Major of event to grab. If
                       unspecified, picks a completely
                       random event.
 *   category: String. Category of event to grab. If
                       unspecified, picks a completely
                       random event.
 *   startDatetime: String. start date & time of event to grab. If
                       unspecified, set to current date & time
 *   endDatetime: String. end date & time of event to grab. If
                       unspecified, set to infinity.
 
 *   Returns an object containing the event's title, id,
             and location.
 */
function grabEventFromServer( keyword, major, category, startDatetime, endDatetime ) {
  //if any of parameters are not specified, they are set to "nnull".
  keyword == "" ? keyword = "nnull" : null;
  category == "" ? category = "nnull" : null;
  major == "" ?  major = "nnull" : null;

  //trim date&time
  if (startDatetime == "") {
    var startDatetime = new Date().format('Y-m-d-h-i');
  } else {
    var temp = startDatetime.split(/[-: ]/);
    var startDatetime = temp[2]+"-"+temp[1]+"-"+temp[0]+"-"+temp[3]+"-"+temp[4];
  }
  if (endDatetime == "") {
    var endDatetime = "nnull";
  } else {
    var temp = endDatetime.split(/[-: ]/);
    var endDatetime = temp[2]+"-"+temp[1]+"-"+temp[0]+"-"+temp[3]+"-"+temp[4];
    //check validity
    if (startDatetime > endDatetime) {
      Materialize.toast("Start date&time should be earlier than end date&time.", 3000);
      return;
    }
  }
  console.log("keyword: "+keyword+"\nmajor: "+major+"\ncategory: "+category+"\nstartDate: "+startDatetime+"\nendDate: "+endDatetime);

  var data = null;
  $.ajax({
    type: "POST",
    url: "getEventListByFilter.php",
    data: {
        keyword: keyword,
        major: major,
        category: category,
        startDatetime: startDatetime,
        endDatetime: endDatetime
    },
    success: function(result, status, xhr) {
      data = JSON.parse(result);
      addEvents(data);
    },
    error: function(xhr, status, error) {
      console.log("error: "+status+" "+error);
    }
  });
  return data;
}



/* getBriefInfoFromServer()
 * Gets the brief info for the side-bar from the server.
 *   eventId: String. Unique id of the event.
 *   Returns an object containing the event's rating,
             owner, brief description, time, max 
             attendance, detailed location info, and
             url of the event's homepage.
 */
function getBriefInfoFromServer( eventId ) {
  // Grab event info from server by eventId
  var data = null;
  $.ajax({
    type: "POST",
    url: "getEventInfoById.php",
    data: { eventKey: eventId.substr(3)},
    success: function(result) {
      console.log("getBriefInfoFromServer: Success");
      data = JSON.parse(result);
      checkUserJoined( eventId.substr(3), data );
    }
  });
} 
  

//==================================================
// Event HTML Generation
//==================================================

function isScreenWide() {
  var LARGE_SCREEN_SIZE = 992;
  return $(window).width() >= LARGE_SCREEN_SIZE;
}

function requestEvents() {
  //  initialize google map
  initMap();
  
  var isWide = isScreenWide();
  
  var keywordSearch = '#keywordSearch' + (isWide? 'L': 'S');
  var majorSearch = '#majorSearch' + (isWide? 'L': 'S');
  var categorySearch = '#categorySearch' + (isWide? 'L': 'S');
  var startDatetime = '#startDatetime' + (isWide? 'L': 'S');
  var endDatetime = '#endDatetime' + (isWide? 'L': 'S');
  
  // Find details for event from server
  var data = grabEventFromServer( $( keywordSearch ).val(),
                                  $( majorSearch ).val(),
                                  $( categorySearch ).val(),
                                  $( startDatetime ).val(),
                                  $( endDatetime ).val() );
}

function addEvents(data) {
  var parent = $( "#eventList" );

  //reset event list
  parent.html("");

  for (var i=0; i<data.length; i++) {
    var eventId = "evt" + data[i].event_key;

    eventData[eventId] = data[i]; 
    eventData[eventId].cached = false;
    
    // Create a new li element at the end of parent
    parent.append( "<li onmouseenter=\"bounceMarker('" + eventId + "')\" onmouseleave=\"stopMarker('" + eventId + "')\" id='" + eventId + "'></li>" );
    
    // Find li element and add the two containers to it
    var liContainer = $( "#" + eventId );
    liContainer.append( "<a onClick=\"toggleHeader('" + eventId + "');\" id='" + eventId + "Header' class='collapsible-header betweenGreenDeep-text eventHeader'></a>" );
    liContainer.append( "<div id='" + eventId + "Body' class='collapsible-body' class='hide' style=\"height:600px\"></div>" );

    // Add a marker to google map
    var latlng = data[i].latlng.split(",");
    $('#mapholder').addMarker({
      coords: latlng,
      id: eventId
    });
    
    // Generate Title
    var eventHeader = $( "#" + eventId + "Header" );
    eventHeader.append( "<h1>" + data[i].title + "</h1>" );
  }
}



/* toggleHeader()
 * Toggles the visibility of an event on the main
 * page's side bar. Makes server calls to find
 * the event details if it isn't cached.
 *   event: String. Unique identifier of event.
 */
function toggleHeader(event) {
  $( ".collapsible-header" ).toggleClass("betweenGreenDeep", false);
  $( ".collapsible-header" ).toggleClass("betweenGreenDeep-text", true);
  $( ".collapsible-header" ).toggleClass("white-text", false);
  //$( ".eventRating" ).toggleClass("hide", true);
  $( ".eventOwner" ).toggleClass("hide", true);
  
  // Check to see if event details aren't cached.
  // If not, create event.
  if (!eventData[event].cached) {
    getBriefInfoFromServer(event);
  }
 
  // Unhide events
  var thisHeader = $( "#" + event + "Header" );
  //var thisRating = $( "#" + event + "Rating" );
  var thisOwner = $( "#" + event + "Owner" );
  
  thisHeader.toggleClass("betweenGreenDeep", !thisHeader.hasClass("active"));
  thisHeader.toggleClass("betweenGreenDeep-text", thisHeader.hasClass("active"));
  thisHeader.toggleClass("white-text", !thisHeader.hasClass("active"));
  
  //thisRating.toggleClass("hide", thisHeader.hasClass("active"));
  
  thisOwner.toggleClass("hide", thisHeader.hasClass("active"));
}



/* generateDetails
 * Generates the HTML for the toggled side bar.
 * Makes a server call.
 *   eventId: String. Unique identifier for the event.
 */
function generateDetails( eventId, data, joined ) {
  eventData[eventId].cached = true

  // Create the header element
  var eventHeader = $( "#" + eventId + "Header" );
  eventHeader.append( "<div id='" + eventId + "Rating' class='eventRating hide'></div>" );
  eventHeader.append( "<h5 id='" + eventId + "Owner' class='eventOwner hide'>" + data.owner + "</h5>" );
  
  // Create the rating div
  /*
  var ratingContainer = $( "#" + eventId + "Rating" );
  ratingContainer.append( "<h3 id='" + eventId + "RatingNum'>" + data.rating + "</h3>" );
  ratingContainer.append( "<div id='" + eventId + "RatingStars' class='starContainer'></div>" );
  var starsContainer = $( "#" + eventId + "RatingStars" );
  createRatingStars( data.rating, starsContainer, true );
  */
  
  // Create body elements
  var eventBody = $( "#" + eventId + "Body" );
  eventBody.append( "<div class='row'></div>" );
  var iconRow = eventBody.children().last();
  eventBody.append( "<hr class='sectionDivider' />" );
  eventBody.append( "<div class='row'></div>" );
  var descriptionContainer = eventBody.children().last();
  
  // Top icon row
  var UserIsAHost = data.owner == user_id;
  if (UserIsAHost) {
    iconRow.append( "<a onClick='deleteEvent(" + eventId.substr(3) + ");' class='deleteBtn topBtn col s4 offset-s4'>" );
    var thisButton = iconRow.children().last();
    thisButton.append( "<img src='../images/png/delete.png' class='eventIcons' />" );
    thisButton.append( "<h5 class='betweenGreenDeep-text center-align'>Delete</h5>" );
  } else {
    var iconRowEvents = ["joinEvent(" + eventId.substr(3) + ")", "messageOwner(" + eventId.substr(3) + ");", "shareEvent(" + eventId.substr(3) + ");"];
    var iconRowClasses = ["joinBtn", "messageBtn", "shareBtn"];
    var iconRowIcons = ["circle-enter", "circle-message", "waiting"];
    var iconRowTexts = ["Enter", "Message", "Waiting"];

    var UserAlreadyJoined = joined.joined;
    if (UserAlreadyJoined) {
      iconRowEvents[0] = "leaveEvent(" + eventId.substr(3) + ");";
      iconRowIcons[0] = "circle-leave";
      iconRowTexts[0] = "Leave";
      
      var acceptance = joined.acceptanceStatus;
      if (acceptance != "first") {
        iconRowIcons[2] = acceptance;
        iconRowTexts[2] = acceptance.substr(0,1).toUpperCase() + acceptance.substr(1);
      }
    }

    for (var i = 0; i < 3; ++i) {
      iconRow.append( "<a id='" + eventId + iconRowIcons[i] +"' onClick=\"" + iconRowEvents[i] + "\" class='" + iconRowClasses[i] + " topBtn col s4'>" );
      var thisButton = iconRow.children().last();
      thisButton.append( "<img id='" + eventId + iconRowIcons[i] +"img' src='../images/png/" + iconRowIcons[i] + ".png' class='eventIcons center-align' />" );
      thisButton.append( "<h5 id='" + eventId + iconRowIcons[i] +"text' class='betweenGreenDeep-text center-align'>" + iconRowTexts[i] + "</h5>" );
    }
  }
    
  
  // Brief Description
  var isBriefShort = data.description.length <= 270;
  var description = (!isBriefShort)? data.description.substring(0, 270) + "..." : data.description + " ";
  var showMore = (!isBriefShort)? "more info": "Show more info";
  
  descriptionContainer.append( "<div class='col s12'></div>" );
  descriptionContainer = descriptionContainer.children().last();
  descriptionContainer.append( "<p class='eventDescription'>" + description + "<a onClick=\"openDetails('" + eventId + "');\">" + showMore + "</a></p>" );
  
  // Info rows
  var infoIcons = ["schedule", "perm_identity", "location_on", "home"];
  var infoTexts = [data.startDatetime + " ~ " + data.endDatetime, data.currentAttendance + " / " + data.maxAttendance, data.location, data.homepage];
  var infoTags  = ["p", "p", "p", "a"];
  var infoAttrs = ["", "", "", " href='http://" + data.homepage + "'"];
  for (var i = 0; i < 4; ++i) {
    eventBody.append( "<div class='row'></div>" );
    var thisInfoRow = eventBody.children().last();
    thisInfoRow.append( "<div class='eventDetails col s11 offset-s1'></div>" );
    var thisInfo = thisInfoRow.children().last();
    thisInfo.append( "<i class='betweenGreenDeep-text material-icons'>" + infoIcons[i] + "</i>" );
    thisInfo.append( "<" + infoTags[i] + infoAttrs[i] + ">" + infoTexts[i] + "</" + infoTags[i] + ">" );
  }
}



/* createRatingStars()
 * Takes a numerical rating and creates the 5 star display in
 * a specified container.
 *   rating:     Float.   The numerical rating of the event.
 *   container:  JQuery.  Container for the star display.
 *   whiteStars: Boolean. Output white stars if true, gold if false. 
 */
function createRatingStars( rating, container, whiteStars ) {
  var filledStar = "../images/png/fullstar.png";
  var halfStar = "../images/png/halfstar.png";
  var emptyStar = "../images/png/emptystar.png";
  var safeRating = (rating > 5)? 5: rating;
  
  if ( whiteStars ) {
    filledStar = "../images/png/whitestar.png";
    halfStar = "../images/png/halfgwstar.png";
  }
  
  var filledStars = Math.floor(safeRating);
  var emptyStars = Math.floor(5 - safeRating);
  
  // Create filled stars
  for (var i = 0; i < filledStars; ++i) {
    container.append("<img src='" + filledStar + "' />");
  }
  
  // Create half star if needed
  if (safeRating != filledStars) {
    container.append("<img src='" + halfStar + "' />");
  }
  
  // Create empty stars
  for (var i = 0; i < emptyStars; ++i) {
    container.append("<img src='" + emptyStar + "' />");
  }
}

function checkUserJoined(eventId, data) {
  $.ajax({
    type: "POST",
    url: "checkUserJoined.php",
    data: {
      userId: user_id,
      eventKey: eventId
    },
    success: function(result, status, xhr) {// result = { joined: boolean, acceptanceStatus: string }
      console.log("checkUserJoined: Success", "result: "+JSON.stringify(result));
      generateDetails( "evt"+eventId, data, JSON.parse(result) ); 
    }
  })
}

//==================================================
// Buttons from Expanded View
//==================================================

function joinEvent(eventId) {
  console.log("joinEvent: eventId - " + eventId);
  $.ajax({
    type: "POST",
    url: "addApplication.php",
    data: {
      userId: user_id,
      eventKey: eventId
    },
    success: function(result, status, xhr) {  // result = Boolean
      console.log("sendApplyRequest: Success");
      console.log("typeof result: " + (typeof result), "result: "+result);
      if (result){
        //alert("You apply the event successfully!");
        console.log($('#evt' + eventId + 'circle-enter'));
        $('#evt' + eventId + 'circle-enter').replaceWith(
          "<a id='evt"+eventId+"circle-leave' onclick='leaveEvent("+eventId+")' class='leaveBtn topBtn col s4'>" +
            "<img src='../images/png/circle-leave.png' class='eventIcons center-align' />" +
            "<h5 class='betweenGreenDeep-text center-align'>Leave</h5>" +
          "</a>");
      } else {
        Materialize.toast("Application failed! The event is currently full...", 3000);
      }
    }
  });

}

function leaveEvent(eventId) {
  console.log("leaveEvent: eventId - " + eventId);
  $.ajax({
    type: "POST",
    url: "removeApplication.php",
    data: {
      userId: user_id,
      eventKey: eventId
    },
    success: function(result, status, xhr) { // result = null
      //alert("You leave the event successfully!");
      $('#evt' + eventId + 'circle-leave').replaceWith(
        "<a id='evt"+eventId+"circle-enter' onclick='joinEvent("+eventId+")' class='enterBtn topBtn col s4'>" +
          "<img src='../images/png/circle-enter.png' class='eventIcons center-align' />" +
          "<h5 class='betweenGreenDeep-text center-align'>Enter</h5>" +
        "</a>");
      $('#evt' + eventId + 'acceptedimg').replaceWith(
        "<img id='evt"+eventId+"waitingimg' src='../images/png/waiting.png' class='eventIcons center-align' />"
      );
      $('#evt' + eventId + 'acceptedtext').replaceWith(
        "<h5 id='"+eventId+"waitingtext' class='betweenGreenDeep-text center-align'>Waiting</h5>"
      );
    }
  })
}

function deleteEvent(eventId) {
  console.log("deleteEvent: eventId - " + eventId);
  $.ajax({
    type: "POST",
    url: "removeEvent.php",
    data: {
      eventKey: eventId
    },
    success: function(result, status, xhr) { // result = null
      //alert("The event is deleted successfully");
      $('#evt'+eventId).remove();
      $('#mapholder').removeMarker('evt'+eventId);
    }
  });
}


function messageOwner(event) {
  Materialize.toast("Currently unavailable.", 3000);
}

//==================================================
// Google map event handlers
//==================================================

/* initMap()
 * Initialize google map
 */
function initMap(){
  $('#mapholder').googleMap({
    coords: [36.9923454, -122.0613478],
    zoom: 15,
    type: "ROADMAP",
    scrollwheel: true
  });
}


/* bounceMarker()
 * Takes a marker id and let marker bounce
 *   markerId: Id of marker. 'evt{id}Header'
 */
function bounceMarker(markerId) {
  $('#mapholder').getMarker(markerId).setAnimation(1);
}

/* stopMarker()
 * Takes a marker id and let marker stop bouncing
 *   markerId: Id of marker. 'evt{id}Header'
 */
function stopMarker(markerId) {
  $('#mapholder').getMarker(markerId).setAnimation(0);
}

//==================================================
// Google map event handlers
//==================================================
/* toggleFilter()
 * Open filter to choose major, category,
 * start date&time, and end date&time
 */
function toggleFilter() {
  var isWide = isScreenWide();
  
  var filter = '#collapsibleHeaderSearch' + (isWide? 'L': 'S');
  
  $( filter ).click();
}

/* 
 * Things when the document loads.
 */
$(function() {
  //allows dateTimePicker to work 
  var isWide = isScreenWide();
  isWide? $("#dtBoxStartL").DateTimePicker() : $("#dtBoxStartS").DateTimePicker();
  isWide? $("#dtBoxEndL").DateTimePicker() : $("#dtBoxEndS").DateTimePicker();

  //allows select to work 
  $('select').material_select(); 
 
  //allows collapsible to work 
  $('.collapsible').collapsible({ 
    accordion : false 
  }); 

  $('.modal-trigger').leanModal();

  initMap();
  
  requestEvents();
});
