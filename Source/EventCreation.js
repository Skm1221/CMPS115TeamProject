/* eventLengthToggle()
 * Toggles the currently visible date setting.
 */

var user_id;

function receive_user_id() {
    user_id = window.location.href.split("?")[1].split("&")[0];
}

function return_myPage(){
    window.location = "./MyPage.html?"+user_id+"&";
}

function return_mainPage(){
    window.location = "./main.html?"+user_id+"&";
}


function eventLengthToggle() {
  var singleDay = $( "#single_day_event" );
  var multiDay = $( "#multi_day_event" );
  if ( singleDay.hasClass("actively_displayed") ) {
    singleDay.hide();
    singleDay.toggleClass("actively_displayed", false);
    $( "#event_date" ).removeAttr("required");
    multiDay.show();
    multiDay.toggleClass("actively_displayed", true);
    $( "#event_end_date" ).attr("required","required");
    $( "#event_start_date" ).attr("required","required");
  } else {
    multiDay.hide();
    multiDay.toggleClass("actively_displayed", false);
    $( "#event_end_date" ).removeAttr("required");
    $( "#event_start_date" ).removeAttr("required");
    singleDay.show();
    singleDay.toggleClass("actively_displayed", true);
    $( "#event_date" ).attr("required","required");
  }
}


/* addImage()
 * Adds the input image.
 */
function addImage() {
  $( "#mainImage" ).toggleClass("hide", false);
  $( "#imagePlusText" ).toggleClass("hide", true);
  $( "#imageText" ).toggleClass("hide", true);
}


/* This checks to see if add image button is pressed
 * If so, it triggers the real file input button
 */
$(document).ready( function() {
  $('#imageBtn').click(function(){
    $("#realImageInput").click();
  });
  $("#dtBox").DateTimePicker({
    dateTimeFormat: "yyyy-MM-dd HH:mm"
  });
});



// replaces the cover image of what was inputed.
function handleFileSelectImage(evt) {
    var reader = new FileReader();
    reader.addEventListener("load", function (evt) {
    $( "#mainImage" ).attr("src", event.target.result);
    })
    reader.readAsDataURL(evt.target.files[0]);

    reader.onload = (function(file) {
      var img = new Image();
      img.src = file.target.result;

      img.onload = function() {
        var container = $( "#mainImage" );
        if (this.width > this.height) {
          container.toggleClass("wideImage", true);
          container.toggleClass("tallImage", false);
        }
        else {
          container.toggleClass("tallImage", true);
          container.toggleClass("wideImage", false);
        }
      };
    });
}


// When realImageInput notices a change, this event is triggered
document.getElementById('realImageInput').addEventListener('change', handleFileSelectImage, false);

/* openMap()
 * Opens the map and sets the event location to the location found.
 */
function openMap() {

}

/* timeChecker()
 * Checks to see if time is in the proper format
 * Returns False, if everything is okay
 */
function timeChecker(timeStart, timeEnd){
  timeStart = timeStart.replace(/-/g,"0");
  timeEnd = timeEnd.replace(/-/g,"0");
  console.log(timeStart);
  console.log(timeEnd);
  return !(parseInt(timeStart) < parseInt(timeEnd)) ;
}


/* submitForm()
 * Submits the form and all of the information.
 */
function submitForm() {
  // Grab all of the form data
  var eventTitle = $( "#event_title" ).val();
  //var eventDescription = $( "#event_brief" ).val();
  var eventDetails = $( "#event_detailed" ).val();
  var eventMajor = $( '#event_major').val();
  var eventCategory = $( "#event_category" ).val();
  var eventStartTime = $( "#event_time_start" ).val();
  var eventEndTime = $( "#event_time_end" ).val();
  var eventLocation = $( "#event_location" ).val();
  var eventCoordinate = $('#event_coordinate').val();
  var eventMaxAttendance = $( "#event_attendance" ).val();
  var eventHomepage = $("#event_homepage").val();

  eventStartTime = eventStartTime.replace(" ","-").replace(":","-");
  eventEndTime = eventEndTime.replace(" ","-").replace(":","-");

  // Do Robust checks
  if(eventHomepage == ""){
    eventHomepage = "N/A";
  }

  console.log("DATA TO SUBMIT: ");
  console.log("Title: "+eventTitle);
  console.log("Details: "+eventDetails);
  console.log("Major: "+eventMajor);
  console.log("Category: "+eventCategory);
  console.log("Start Time: "+eventStartTime);
  console.log("End Time: "+eventEndTime);
  console.log("Location: "+eventLocation);
  console.log("Coordinates: "+eventCoordinate);
  console.log("Max Attendance: "+eventMaxAttendance);
  console.log("Homepage: "+eventHomepage);

  // Check to see if all the required variables are set
  var error = false;
  if (eventTitle === "") { 
    Materialize.toast("Event title required.", 3000);
    error = true;
  }
  if (eventCoordinate === "") {
    Materialize.toast("Google Maps pin required.", 3000);
    error = true;
  }
  if (eventStartTime === "" || eventEndTime === "") {
    if (eventStartTime === "") {
      Materialize.toast("Event start time required.", 3000);
      error = true;
    }
    if (eventEndTime === "") {
      Materialize.toast("Event end time required.", 3000);
      error = true;
    }
  } else if (timeChecker(eventStartTime, eventEndTime)){
    Materialize.toast("Event end time set to before the event begins.", 3000);
    error = true;
  }
  if (eventLocation === "") {
    Materialize.toast("Event location required.", 3000);
    error = true;
  }
  if (eventMaxAttendance !== "") {
    if (!(parseFloat(eventMaxAttendance) === eventMaxAttendance >>> 0)) {
      Materialize.toast("Max attendance must be a positive whole number.", 3000);
      error = true;
    } else if (parseInt(eventMaxAttendance) == 0) {
      Materialize.toast("Max attendace cannot be zero.", 3000);
      error = true;
    } else if(parseInt(eventMaxAttendance) > 9999){
      Materialize.toast("Max attendace cannot be greater than 9999", 3000);
      error = true;
	}
  }
  else if(eventMaxAttendance == ""){
	  eventMaxAttendance = "9999"
  }
  
  // Break if there's a required field missing
  if ( error ) {
    return;
  }

  // pulling the image file.
  var imageFile = document.getElementById('realImageInput').files[0];

  var fd = new FormData();

  fd.append("title",eventTitle);
  fd.append("description", eventDetails);
  fd.append("major", eventMajor);
  fd.append("category", eventCategory);
  fd.append("startTime", eventStartTime);
  fd.append("endTime", eventEndTime);
  fd.append("location",eventLocation);
  fd.append("Coordinates",eventCoordinate);
  fd.append("maxAttendance",eventMaxAttendance);
  fd.append("homepage",eventHomepage);
  fd.append("image", imageFile);
    fd.append("writer", user_id);

  // Actual sending of the data is here
  console.log("about to submit data");

  $.ajax({
    contentType: false,
    processData: false,
    type: "POST",
    url: "addEvent.php",
    data: fd,
    success: function(html){
      //alert("success save");
        if(html== ""){
            return_mainPage();
        } else {
            Materialize.toast(html, 3000);
        }
    }
  });
  console.log("submitted data");
}

{
  var singleDay = $( "#single_day_event" );
  var multiDay = $( "#multi_day_event" );
  singleDay.show();
  multiDay.hide();
  singleDay.toggleClass("actively_displayed", true);
  multiDay.toggleClass("actively_displayed", false);

  var eventDate = $( "#event_date" );
  var eventStartDate = $( "#event_start_date" );
  var eventEndDate = $( "#event_end_date" );
  eventDate.attr("required","required");
  eventStartDate.removeAttr("required");
  eventEndDate.removeAttr("required");

  $( ".datepicker" ).pickadate({
    format: 'yyyy/mm/dd',
    formatSubmit: 'yyyy/mm/dd',
    min: true,
    max: false
  });

  $("select").material_select();
  $("select").closest('.input-field').children('span.caret').remove();
}
