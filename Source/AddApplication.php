<?php

$userId = $_POST["userId"];
$eventKey = $_POST["eventKey"];
$conn = mysqli_connect("localhost", "root", "soso1221", "ucscplaza");
    if (mysqli_connect_errno($conn)){
        echo "Failed to connect to MySQL:".mysqli_connect_error();
}
$userId = mysqli_real_escape_string($conn,$userId);
$eventKey = mysqli_real_escape_string($conn,$eventKey);

$queryCheck =  "Select IFNULL(SUM(application_status = 'accepted'), 0) AS current_att, event_max_att FROM tbl_event LEFT OUTER JOIN tbl_application ON tbl_event.event_key = tbl_application.event_key WHERE tbl_event.event_key = $eventKey";

$result = $conn->query($queryCheck) or die($mysqli->error.__LINE__);
$row = $result->fetch_assoc();
if ($row["current_att"] == $row["event_max_att"]){
    echo false;
} else {
    $query =  "INSERT INTO tbl_application (event_key, event_applier) VALUES ($eventKey,'$userId') ON DUPLICATE KEY UPDATE event_key = $eventKey, event_applier = '$userId'";
    $result = $conn->query($query) or die($mysqli->error.__LINE__);
    echo true;
}

mysqli_close($conn);

?>
