/* eventLengthToggle()
 * Toggles the currently visible date setting.
 */
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
    //alert($( '#realImageInput').val());
    var reader = new FileReader();
    reader.addEventListener("load", function (evt) {
    $( "#mainImage" ).attr("src", event.target.result);  
    })
    reader.readAsDataURL(evt.target.files[0]);
}


// When realImageInput notices a change, this event is triggered
document.getElementById('realImageInput').addEventListener('change', handleFileSelectImage, false);

/* openMap()
 * Opens the map and sets the event location to the location found.
 */
function openMap() {
  
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
  //
  //  Not needed because of new clock.
  //
  //var eventStartDate = "";
  //var eventEndDate = "";
  //var singleDay = $( "#single_day_event" ).hasClass("actively_displayed");
  //if ( singleDay ) {
  //  eventStartDate = $( "#event_date" ).val();
  //  eventEndDate = eventStartDate;
  //} else {
  //  eventStartDate = $( "#event_start_date" ).val();
  //  eventEndDate = $( "#event_end_date" ).val();
  //}
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
  
  if (eventTitle === "") { 
    alert("Event title missing!");
    return;
  } else if (eventLocation === "") {
    alert("Event location missing!");
    return;
  } else if (eventStartTime === "") {
    alert("Event start time missing!");
    return;
  } else if (eventEndTime === "") {
    alert("Event end time missing!");
    return;
  } else if (eventStartDate === "") {
    alert("Start date missing!");
    return;
  } else if (eventEndDate === "") {
    alert("End date missing!");
    return;
  }
  
  // Submit form data

  // pulling the image file.
  var imageFile = document.getElementById('realImageInput').files[0];
  
  var fd = new FormData();

  fd.append("title",eventTitle);
  //fd.append("description", eventDescription);
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

  // Actual sending of the data is here
  console.log("about to submit data");

  $.ajax({
    contentType: false,
    processData: false,
    type: "POST",
    url: "addEvent.php",
    data: fd,
    success: function(html){
      alert("success save");
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
