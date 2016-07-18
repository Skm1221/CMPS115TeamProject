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
