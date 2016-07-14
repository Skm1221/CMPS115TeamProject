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
  var eventDescription = $( "#event_brief" ).val();
  var eventDetails = $( "#event_detailed" ).val();
  var eventImage = $( "#event_image_url" ).val();
  var eventCategory1 = $( "#category1" ).val();
  var eventCategory2 = $( "#category2" ).val();
  var eventCategory3 = $( "#category3" ).val();
  var eventCategory4 = $( "#category4" ).val();
  var eventStartTime = $( "#event_time_start" ).val();
  var eventEndTime = $( "#event_time_end" ).val();
  var eventLocation = $( "#event_location" ).val();
  var eventMaxAttendance = $( "#event_attendance" ).val();
  
  var eventStartDate = "";
  var eventEndDate = "";
  var singleDay = $( "#single_day_event" ).hasClass("actively_displayed");
  if ( singleDay ) {
    eventStartDate = $( "#event_date" ).val();
    eventEndDate = eventStartDate;
  } else {
    eventStartDate = $( "#event_start_date" ).val();
    eventEndDate = $( "#event_end_date" ).val();
  }
  
  // Check to see if all the required variables are set
  
  if (eventTitle === "") { 
    return;
  } else if (eventLocation === "") {
    return;
  } else if (eventStartTime === "") {
    return;
  } else if (eventEndTime === "") {
    return;
  } else if (eventStartDate === "") {
    alert("Start date missing!");
    return;
  } else if (eventEndDate === "") {
    alert("End date missing!");
    return;
  }
  
  // Submit form data
  var data = {
    title: eventTitle,
    description: eventDescription,
    details: eventDetails,
    image: eventImage,
    category1: eventCategory1,
    category2: eventCategory2,
    category3: eventCategory3,
    category4: eventCategory4,
    startTime: eventStartTime,
    endTime: eventEndTime,
    location: eventLocation,
    maxAttendance: eventMaxAttendance
  };
  return data;
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
    min: true,
    max: false
  });
  
  $("select").material_select();
  $("select").closest('.input-field').children('span.caret').remove();
}
