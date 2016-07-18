var eventCount = 0;

function addEvent() {
  var parent = $( "#eventList" );
  var eventNum = ++eventCount;
  var eventId = "evt" + eventNum;
  
  // Find details for event from server
  var title = "Title";
  var rating = "3.5";
  var owner = "Amlesh Sivanantham";
  var brief = "Lorem ipsum dolor sit amet, consectetaur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Et harumd und lookum like Greek to me, dereud facilis est er expedit distinct. Nam liber te conscient to factor tum poen legum odioque civiuda. Et tam neque pecun modut est neque nonor et imper ned libidig met, consectetur adipiscing elit, sed ut labore et dolore magna aliquam makes one wonder who would ever read this stuff? Bis nostrud exercitation ullam mmodo consequet. Duis aute in voluptate velit esse cillum dolore eu fugiat nulla pariatur. At vver eos et accusam dignissum qui blandit est praesent luptatum delenit aigue excepteur sint occae.";
  var time = "time";
  var maxAttendance = "attendance";
  var location = "location";
  var homepage = "homepage";
  
  // Create a new li element at the end of parent
  parent.append( "<li id='" + eventId + "'></li>" );
  
  // Find li element and add the two containers to it
  var liContainer = $( "#" + eventId );
  liContainer.append( "<a onClick=\"toggleHeader('" + eventId + "');\" id='" + eventId + "Header' class='collapsible-header betweenGreenDeep-text eventHeader'></a>" );
  liContainer.append( "<div id='" + eventId + "Body' class='collapsible-body' class='hide'></div>" );
  
  // Create the header element
  var eventHeader = $( "#" + eventId + "Header" );
  eventHeader.append( "<h1>" + title + "</h1>" );
  eventHeader.append( "<div id='" + eventId + "Rating' class='eventRating hide'></div>" );
  eventHeader.append( "<h5 id='" + eventId + "Owner' class='eventOwner hide'>" + owner + "</h5>" );
  
  // Create the rating div
  var ratingContainer = $( "#" + eventId + "Rating" );
  ratingContainer.append( "<h3 id='" + eventId + "RatingNum'>" + rating + "</h3>" );
  ratingContainer.append( "<div id='" + eventId + "RatingStars' class='starContainer'></div>" );
  var starsContainer = $( "#" + eventId + "RatingStars" );
  createRatingStars( rating, starsContainer, true );
  
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
  var isBriefShort = brief.length <= 270;
  brief = (!isBriefShort)? brief.substring(0, 270) + "..." : brief + " ";
  var showMore = (!isBriefShort)? "more info": "Show more info";
  
  descriptionContainer.append( "<div class='col s12'></div>" );
  descriptionContainer = descriptionContainer.children().last();
  descriptionContainer.append( "<p class='eventDescription'>" + brief + "<a onClick=\"moreInfo('" + eventId + "');\">" + showMore + "</a></p>" );
  
  // Info rows
  var infoIcons = ["schedule", "perm_identity", "location_on", "home"];
  var infoTexts = [time, maxAttendance, location, homepage];
  for (var i = 0; i < 4; ++i) {
    eventBody.append( "<div class='row'></div>" );
    var thisInfoRow = eventBody.children().last();
    thisInfoRow.append( "<div class='eventDetails col s11 offset-s1'></div>" );
    var thisInfo = thisInfoRow.children().last();
    thisInfo.append( "<i class='betweenGreenDeep-text material-icons'>" + infoIcons[i] + "</i>" );
    thisInfo.append( "<p>" + infoTexts[i] + "</p>" );
  }
}

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

function toggleHeader(event) {
  $( ".collapsible-header" ).toggleClass("betweenGreenDeep", false);
  $( ".collapsible-header" ).toggleClass("betweenGreenDeep-text", true);
  $( ".collapsible-header" ).toggleClass("white-text", false);
  $( ".eventRating" ).toggleClass("hide", true);
  $( ".eventOwner" ).toggleClass("hide", true);
  
  var thisHeader = $( "#" + event + "Header" );
  var thisRating = $( "#" + event + "Rating" );
  var thisOwner = $( "#" + event + "Owner" );
  
  thisHeader.toggleClass("betweenGreenDeep", !thisHeader.hasClass("active"));
  thisHeader.toggleClass("betweenGreenDeep-text", thisHeader.hasClass("active"));
  thisHeader.toggleClass("white-text", !thisHeader.hasClass("active"));
  
  thisRating.toggleClass("hide", thisHeader.hasClass("active"));
  
  thisOwner.toggleClass("hide", thisHeader.hasClass("active"));
}

function joinEvent(event) {
}

function messageOwner(event) {
}

function shareEvent(event) {
}

function moreInfo(event) {
  
}

{
  $('.collapsible').collapsible({
    accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
  });
}
