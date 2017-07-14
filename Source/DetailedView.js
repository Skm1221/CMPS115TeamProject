//==================================================
// Open Modal
//==================================================

/* openDetails()
 * Generates and opens a modal window for the detailed view.
 *   eventId: String. Unique identifier for event.
 */
function openDetails( eventId ) {
  var modal = $( "#detailedView" );
  
  // Clean slate
  modal.empty();
  
  // Get the event data
  var data = null;
  $.ajax({
    type: "POST",
    url: "getEventInfoById.php",
    data: { eventKey: eventId.substr(3) },
    success: function(result) {
      data = JSON.parse(result);
      data.eid = eventId.substr(3);
      hasUserJoinedEvent( eventId.substr(3), data );
    }
  });
}

/* hasUserJoinedEvent()
 * Checks to see if the current user has joined an event
 *   eventId: String. Unique identifier for event.
 */
function hasUserJoinedEvent(eventId, eventData) {
  $.ajax({
    type: "POST",
    url: "checkUserJoined.php",
    data: {
      userId: getUserId(),
      eventKey: eventId
    },
    success: function(result, status, xhr) {
      eventData.joinStatus = JSON.parse(result);
      
      var modal = $( "#detailedView" );
      
      // Generate the HTML
      generateDetailsModal( modal, eventData );

      // Open the modal
      modal.openModal();
    }
  })
}

//==================================================
// Detailed View HTML Generation
//==================================================

/* generateDetailsModal()
 * Generates the HTML code for the detailedView modal.
 *   modal: JQuery. Modal container.
 *   data:  Object. Contains all of the event data.
 */
function generateDetailsModal( modal, data ) {
  // Create the basic structure
  modal.append( "<div class='modal-header' />" );
  modal.append( "<div class='modal-content row' />" );
  var header = modal.children().first();
  var content = modal.children().last();

  // Generate the header
  header.append( "<hr class='detailedViewDivider' />" );
  header.append( "<h1 class='detailedViewHeader betweenGreenDeep-text center-align'>" + data.title + "</h1>" );
  header.append( "<hr class='detailedViewDivider' />" );
  
  // Generate the content box
  content.append( "<div class='detailedViewImage col offset-s1 s5' />" );
  var imageBox = content.children().last();
  content.append( "<div class='col s5' />" );
  var iconBox = content.children().last();
  content.append( "<div class='detailedViewSummary betweenGreenDeep-borderThick col offset-s1 s10' />" );
  var summaryBox = content.children().last();
  
  // Generate the image
  generateImageBlock( imageBox, data );
  
  // Generate icons and text
  iconBox.append( "<div class='row' />" );
  var detailRows = iconBox.children().last();
  iconBox.append( "<hr class='detailedViewDivider' />" );
  iconBox.append( "<div class='row' />" );
  var buttonBox = iconBox.children().last();
  iconBox.append( "<hr class='detailedViewDivider' />" );
  iconBox.append( "<div class='row' />" );
  var attendanceBox = content.children().last();
  
  // Generate detail rows
  generateDetailRows( detailRows, data );
  
  // Generate event buttons
  generateButtons( buttonBox, data );
    
  // Generate attendance info
  generateAttendance( attendanceBox, data );
  
  // Generate summary
  summaryBox.append( "<p>" + data.description + "</p>" );
}

/* generateImageBlock()
 * Generates the image block of the detailed view.
 *   container: JQuery. Image container.
 *   data:      Object. Contains all of the event data.
 */
function generateImageBlock( container, data ) {
  // Determine if there is an image stored or not
  if (data.image != "") {
    // Image exists
    container.append( "<img src='" + data.image + "' />" );
    var imageContainer = container.children().last();
    
    // Make the image larger to fit the size of the box
    var img = new Image();
    img.onload = function() {
      if (this.width > this.height) {
        imageContainer.addClass("wideImage");
      } else {
        imageContainer.addClass("tallImage");
      }
    }
    img.src = data.image;
    
    
  } else {
    // Image doesn't exist
    container.addClass( "black-border" );
    container.append( "<i class='material-icons betweenGreenDeep-text center-align'>insert_photo</i>" );
    container.append( "<h4 class='center-align'>No Image</h4>" );
  }
}

/* generateDetailRows()
 * Generates the rows containing important information
 * about the event.
 *   container: JQuery. Image container.
 *   data:      Object. Contains all of the event data.
 */
function generateDetailRows( container, data ) {
  // Store each row's data
  var icon = ["schedule", "perm_identity", "location_on", "home"];
  var text = [data.startDatetime + " ~ " + data.endDatetime, data.currentAttendance + " / " + data.maxAttendance, data.location, data.homepage];
  var tag  = ["p", "p", "p", "a"];
  var attr = ["", "", "", " href='http://" + data.homepage + "'"];
  
  // Generate the HTML for the rows
  for (var i = 0; i < 4; ++i) {
    container.append( "<div class='detailedViewDetails col s12 betweenGreenDeep-text' />" );
    var currRow = container.children().last();
    
    currRow.append( "<i class='material-icons betweenGreenDeep-text'>" + icon[i] + "</i>" );
    currRow.append( "<" + tag[i] + attr[i] + " class='black-text'>" + text[i] + "</" + tag[i] + ">" );
  }
}

/* generateButtons()
 * Generates the buttons for the event management.
 *   container: JQuery. Image container.
 *   data:      Object. Contains all of the event data.
 */
function generateButtons( container, data ) {
  // Adjust third button according to info
  if ( isEventOwner( data.owner ) ) {
    container.append( "<a onClick='deleteDetailedEvent(" + data.eid + ");' class='detailedViewIconBtn col s4 offset-s4'>" );
    var delButton = container.children().last();
    delButton.append( "<img src='../images/png/delete.png' />" );
    delButton.append( "<p class='betweenGreenDeep-text truncate'>Delete</p>" );
    return;
  }
  
  // Store each button's data
  var func = ["joinDetailedEvent('" + data.eid + "');", "messageDetailedOwner('" + data.eid + "');", ""];
  var icon = ["circle-enter", "circle-message", "waiting"];
  var text = ["Enter", "Message", "Waiting"];
  
  // Check user join status
  if ( data.joinStatus.joined ) {
    func[0] = "leaveDetailedEvent(" + data.eid + ");";
    icon[0] = "circle-leave";
    text[0] = "Leave";
    
    var acceptance = data.joinStatus.acceptanceStatus;
    if ( acceptance != "first" ) {
      icon[2] = acceptance;
      text[2] = acceptance.substr(0,1).toUpperCase() + acceptance.substr(1);
    }
  }
  
  // Generate the HTML for the buttons
  for (var i = 0; i < 3; ++i) {
    container.append( "<a id='modalButton" + i + "' onClick=\"" + func[i] + "\" class='detailedViewIconBtn col s4' />" );
    var currRow = container.children().last();
    
    currRow.append( "<img id='modalButtonImage" + i + "' src='../images/png/" + icon[i] + ".png' />" );
    currRow.append( "<p id='modalButtonText" + i + "' class='betweenGreenDeep-text truncate'>" + text[i] + "</p>" );
  }
}

/* generateAttendance()
 * Generates the attendance info for the event management.
 *   container: JQuery. Image container.
 *   data:      Object. Contains all of the event data.
 */
function generateAttendance( container, data ) {
  // Break if not event owner
  if ( !isEventOwner(data.owner) )
    return;
  
  // Store each blocks's data
  var icon = ['waiting', 'accepted', 'rejected'];
  var num  = ['0', '0', '0'];
  var color = ['yellow-text', 'green-text', 'red-text'];
  
  // Generate the HTML for the rows
  for (var i = 0; i < 3; ++i) {
    container.append( "<div class='detailedViewAttendance col s4' />" );
    var currRow = container.children().last();
    
    currRow.append( "<img src='" + icon[i] + ".png' />" );
    currRow.append( "<p class='" + color[i] + "'>" + num[i] + "</p>" );
  }
}

//==================================================
// Miscellaneous
//==================================================

/* getUserId()
 * Gets the user id.
 */
function getUserId() {
  return window.location.href.split("?")[1].split("&")[0];
}

/* isEventOwner()
 * Checks if the current user is the owner of the event
 *   owner: String. Owner of event.
 */
function isEventOwner( owner ) {
  // Check to see if the current user is owner
  var uid = getUserId();
  return uid === owner;
}

//==================================================
// Button Functions
//==================================================

function joinDetailedEvent(eventId) {
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
      if (result){
        //alert("You apply the event successfully!");
        console.log($('#evt' + eventId + 'circle-enter'));
        $('#evt' + eventId + 'circle-enter').replaceWith(
          "<a id='evt"+eventId+"circle-leave' onclick='leaveEvent("+eventId+")' class='leaveBtn topBtn col s4'>" +
            "<img src='../images/png/circle-leave.png' class='eventIcons center-align' />" +
            "<h5 class='betweenGreenDeep-text center-align'>Leave</h5>" +
          "</a>");
        $( "#modalButton0" ).attr("onClick", "leaveDetailedEvent("+eventId+")");
        $( "#modalButtonImage0" ).attr("src", "../images/png/circle-leave.png");
        $( "#modalButtonText0" ).text("Leave");
      } else {
        Materialize.toast("Application failed! The event is currently full...", 3000);
      }
    }
  });

}

function leaveDetailedEvent(eventId) {
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
        "</a>")
      $( "#modalButton0" ).attr("onClick", "joinDetailedEvent("+eventId+")");
      $( "#modalButtonImage0" ).attr("src", "../images/png/circle-enter.png");
      $( "#modalButtonText0" ).text("Enter");
    }
  })
}

function deleteDetailedEvent(eventId) {
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


function messageDetailedOwner(event) {
  Materialize.toast("Currently unavailable.", 3000);
}
