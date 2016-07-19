var eventCount = 0;
var eventData = [];

//==================================================
// Server Communication
//==================================================

/* grabEventFromServer()
 * Grabs a random event of category type from the server.
 *   category: String. Category of event to grab. If
                       unspecified, picks a completely
                       random event.
 *   Returns an object containing the event's title, id,
             and location.
 */
function grabEventFromServer( category ) {
  if (category != "") {
    // Grab event of category type
  } else {
    // Grab random event and set type
  }
  
  // Fill in this object with the labels grabbed
  return {
    title: "Event Title",
    eventId: "eventId",
    location: "Event Location",
    category: category
  };
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
  
  return {
    rating: "3.5",
    owner: "Amlesh Sivanantham",
    brief: "Lorem ipsum dolor sit amet, consectetaur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Et harumd und lookum like Greek to me, dereud facilis est er expedit distinct. Nam liber te conscient to factor tum poen legum odioque civiuda. Et tam neque pecun modut est neque nonor et imper ned libidig met, consectetur adipiscing elit, sed ut labore et dolore magna aliquam makes one wonder who would ever read this stuff? Bis nostrud exercitation ullam mmodo consequet. Duis aute in voluptate velit esse cillum dolore eu fugiat nulla pariatur. At vver eos et accusam dignissum qui blandit est praesent luptatum delenit aigue excepteur sint occae.",
    time: "time",
    attendance: "attendance",
    locationInfo: "location",
    homepage: "homepage"
  };
}


//==================================================
// Event HTML Generation
//==================================================

function addEvent() {
  var parent = $( "#eventList" );
  var eventNum = ++eventCount;
  var eventId = "evt" + eventNum;
  
  // Find details for event from server
  var data = grabEventFromServer( "" );
  eventData[eventId] = data;
  eventData[eventId].cached = false;
  
  // Create a new li element at the end of parent
  parent.append( "<li id='" + eventId + "'></li>" );
  
  // Find li element and add the two containers to it
  var liContainer = $( "#" + eventId );
  liContainer.append( "<a onClick=\"toggleHeader('" + eventId + "');\" id='" + eventId + "Header' class='collapsible-header betweenGreenDeep-text eventHeader'></a>" );
  liContainer.append( "<div id='" + eventId + "Body' class='collapsible-body' class='hide'></div>" );
  
  // Generate Title
  var eventHeader = $( "#" + eventId + "Header" );
  eventHeader.append( "<h1>" + data.title + "</h1>" );
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
  $( ".eventRating" ).toggleClass("hide", true);
  $( ".eventOwner" ).toggleClass("hide", true);
  
  // Check to see if event details aren't cached.
  // If not, create event.
  if (!eventData[event].cached) {
    generateDetails(event);
  }
  
  // Unhide events
  var thisHeader = $( "#" + event + "Header" );
  var thisRating = $( "#" + event + "Rating" );
  var thisOwner = $( "#" + event + "Owner" );
  
  thisHeader.toggleClass("betweenGreenDeep", !thisHeader.hasClass("active"));
  thisHeader.toggleClass("betweenGreenDeep-text", thisHeader.hasClass("active"));
  thisHeader.toggleClass("white-text", !thisHeader.hasClass("active"));
  
  thisRating.toggleClass("hide", thisHeader.hasClass("active"));
  
  thisOwner.toggleClass("hide", thisHeader.hasClass("active"));
}



/* generateDetails
 * Generates the HTML for the toggled side bar.
 * Makes a server call.
 *   eventId: String. Unique identifier for the event.
 */
function generateDetails( eventId ) {
  // Get info
  var data = getBriefInfoFromServer( eventId );
  eventData[eventId].owner = data.owner;
  eventData[eventId].brief = data.brief;
  eventData[eventId].time = data.time;
  eventData[eventId].attendance = data.attendance;
  eventData[eventId].locationInfo = data.locationInfo;
  eventData[eventId].homepage = data.homepage
  eventData[eventId].cached = true;
  
  
  // Create the header element
  var eventHeader = $( "#" + eventId + "Header" );
  eventHeader.append( "<div id='" + eventId + "Rating' class='eventRating hide'></div>" );
  eventHeader.append( "<h5 id='" + eventId + "Owner' class='eventOwner hide'>" + data.owner + "</h5>" );
  
  // Create the rating div
  var ratingContainer = $( "#" + eventId + "Rating" );
  ratingContainer.append( "<h3 id='" + eventId + "RatingNum'>" + data.rating + "</h3>" );
  ratingContainer.append( "<div id='" + eventId + "RatingStars' class='starContainer'></div>" );
  var starsContainer = $( "#" + eventId + "RatingStars" );
  createRatingStars( data.rating, starsContainer, true );
  
  // Create body elements
  var eventBody = $( "#" + eventId + "Body" );
  eventBody.append( "<div class='row'></div>" );
  var iconRow = eventBody.children().last();
  eventBody.append( "<hr class='sectionDivider' />" );
  eventBody.append( "<div class='row'></div>" );
  var descriptionContainer = eventBody.children().last();
  
  // Top icon row
  var iconRowEvents = ["joinEvent('" + eventId + "');", "messageOwner('" + eventId + "');", "shareEvent('" + eventId + "');"];
  var iconRowClasses = ["joinBtn", "messageBtn", "shareBtn"];
  var iconRowIcons = ["open_in_browser", "email", "share"];
  var iconRowTexts = ["Enter", "Message", "Share"];
  for (var i = 0; i < 3; ++i) {
    iconRow.append( "<a onClick=\"" + iconRowEvents[i] + "\" class='" + iconRowClasses[i] + " topBtn col s4'>" );
    var thisButton = iconRow.children().last();
    thisButton.append( "<i class='betweenGreenDeep-text material-icons eventIcons medium'>" + iconRowIcons[i] + "</i>" );
    thisButton.append( "<h5 class='betweenGreenDeep-text center-align'>" + iconRowTexts[i] + "</h5>" );
  }
  
  // Brief Description
  var isBriefShort = data.brief.length <= 270;
  var brief = (!isBriefShort)? data.brief.substring(0, 270) + "..." : data.brief + " ";
  var showMore = (!isBriefShort)? "more info": "Show more info";
  
  descriptionContainer.append( "<div class='col s12'></div>" );
  descriptionContainer = descriptionContainer.children().last();
  descriptionContainer.append( "<p class='eventDescription'>" + brief + "<a onClick=\"moreInfo('" + eventId + "');\">" + showMore + "</a></p>" );
  
  // Info rows
  var infoIcons = ["schedule", "perm_identity", "location_on", "home"];
  var infoTexts = [data.time, data.attendance, data.locationInfo, data.homepage];
  for (var i = 0; i < 4; ++i) {
    eventBody.append( "<div class='row'></div>" );
    var thisInfoRow = eventBody.children().last();
    thisInfoRow.append( "<div class='eventDetails col s11 offset-s1'></div>" );
    var thisInfo = thisInfoRow.children().last();
    thisInfo.append( "<i class='betweenGreenDeep-text material-icons'>" + infoIcons[i] + "</i>" );
    thisInfo.append( "<p>" + infoTexts[i] + "</p>" );
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


//==================================================
// Buttons from Expanded View
//==================================================

function joinEvent(event) {
}



function messageOwner(event) {
}



function shareEvent(event) {
}



function moreInfo(event) {
  
}


/* 
 * Things when the document loads.
 */
{
  $('.collapsible').collapsible({
    accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
  });
  
  for (var i = 0; i < 5; ++i) {
    addEvent();
  }
}
