var arrayWaiting, arrayAccepted, arrayRejected;
var currentEventKey;

function WaitingList() {
    $.ajax({
        type: "POST",
        url: "getWaitingUserList.php",
        data: {
            eventKey : currentEventKey
        },
        success: function(html){
            html = JSON.parse(html);
            arrayWaiting = html;
            ShowList('waiting');
        }
    })
}

function AcceptedList() {
    $.ajax({
        type: "POST",
        url: "getAcceptedUserList.php",
        data: {
            eventKey : currentEventKey
        },
        success: function(html){
            html = JSON.parse(html);
            arrayAccepted = html;
            ShowList("accepted");
        }
    })
}

function RejectedList() {
    $.ajax({
        type: "POST",
        url: "getRejectedUserList.php",
        data: {
            eventKey : currentEventKey
        },
        success: function(html){
            html = JSON.parse(html);
            arrayRejected = html;
            ShowList("rejected");
        }
    })
}

function ShowList(nameOfList) {
    var tb = $("#" + nameOfList + "Tbody");
    tb.empty();
    if (nameOfList == "waiting") {
        for (i = 0; i < arrayWaiting.length; i++) {
            InsertRowOfList(nameOfList, arrayWaiting[i]);
        }
    }
    else if (nameOfList == "accepted") {
        for (i = 0; i < arrayAccepted.length; i++) {
            InsertRowOfList(nameOfList, arrayAccepted[i]);
        }
    }
    else {
        for (i = 0; i < arrayRejected.length; i++) {
            InsertRowOfList(nameOfList, arrayRejected[i]);
        }
    }
}

function InsertRowOfList(nameOfList, data) {
    var tb = document.getElementById(nameOfList + "Tbody");
    var tr = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");

    if (nameOfList == "waiting") {
        td1.setAttribute('width', '71%');
        td2.setAttribute('width', '8%');
        td3.setAttribute('width', '21%');
    }
    else {
        td1.setAttribute('width', '80%');
        td2.setAttribute('width', '8%');
        td3.setAttribute('width', '12%');
    }

    // td1
    var div = document.createElement("div");
    div.className = "applicant";
    var h1 = document.createElement("h1");
    var h2 = document.createElement("h2");
    var h3 = document.createElement("h3");

    var span1 = document.createElement("span");
    var span2 = document.createElement("span");
    var span2_2 = document.createElement("span");
    var span3 = document.createElement("span");

    span1.innerHTML = data.firstname + " " + data.lastname;
    span2.innerHTML = data.major + ", ";
    span2_2.innerHTML = data.division;
    span3.innerHTML = data.email + "@ucsc.edu";

    h1.appendChild(span1);
    h2.appendChild(span2);
    h2.appendChild(span2_2);
    h3.appendChild(span3);
    div.appendChild(h1);
    div.appendChild(h2);
    div.appendChild(h3);
    td1.appendChild(div);

    // td3
    var span4 = document.createElement("span");

    if (nameOfList == "waiting") {
        var accept = new Image(40, 40);
        var reject = new Image(40, 40);
        accept.src = "../images/png/accepted.png";
        reject.src = "../images/png/rejected.png";
        accept.setAttribute('onclick', 'sendSignal(' + data.applicationKey + ', "accepted");');
        reject.setAttribute('onclick', 'sendSignal(' + data.applicationKey + ', "rejected");');

        span4.appendChild(accept);
        span4.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        span4.appendChild(reject);
    }
    else {
        var waiting = new Image(40, 40);
        waiting.src = "../images/png/waiting.png";
        waiting.setAttribute('onclick', 'sendSignal(' + data.applicationKey + ', "waiting");');

        span4.appendChild(waiting);
    }

    td3.appendChild(span4);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tb.appendChild(tr);
}

function sendSignal(appKey, appStatus) {
    $.ajax({
        type: "POST",
        url: "changeApplicationStatus.php",
        data: {
            applicationKey : appKey,
            applicationStatus : appStatus,
            eventKey : currentEventKey
        },
        success: function(html){
            WaitingList();
            AcceptedList();
            RejectedList();
        }
    })
}

function openApplicantList(eventKey) {
    currentEventKey = eventKey;
    WaitingList();
    AcceptedList();
    RejectedList();

    $("#applicantList").openModal();
}