<?php

$eventKey = $_POST["eventKey"];
$applicationKey = $_POST["applicationKey"];
$applicationStatus = $_POST["applicationStatus"];
$conn = mysqli_connect("localhost", "root", "soso1221", "ucscplaza");
    if (mysqli_connect_errno($conn)){
        echo "Failed to connect to MySQL:".mysqli_connect_error();
}
$eventKey = mysqli_real_escape_string($conn,$eventKey);
$applicationStatus = mysqli_real_escape_string($conn,$applicationStatus);
$applicationKey = mysqli_real_escape_string($conn,$applicationKey);

if ($applicationStatus == 'accepted') {
    $queryCheck =  "Select IFNULL(SUM(application_status = 'accepted'), 0) AS current_att, event_max_att FROM tbl_event LEFT OUTER JOIN tbl_application ON tbl_event.event_key = tbl_application.event_key WHERE tbl_event.event_key = $eventKey";

    $result = $conn->query($queryCheck) or die($mysqli->error.__LINE__);
    $row = $result->fetch_assoc();
    if (intval($row["current_att"]) == intval($row["event_max_att"])){
        exit;
    }
} 

$query =  "UPDATE tbl_application SET application_status = '$applicationStatus' WHERE application_key = $applicationKey";
$result = $conn->query($query) or die($mysqli->error.__LINE__);


mysqli_close($conn);

?>