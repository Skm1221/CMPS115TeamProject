<?php


$eventKey = $_POST["eventKey"];
$application_key = $_POST["application_key"];
$conn = mysqli_connect("localhost", "root", "soso1221", "ucscplaza");
    if (mysqli_connect_errno($conn)){
        echo "Failed to connect to MySQL:".mysqli_connect_error();
}
$eventKey = mysqli_real_escape_string($conn,$eventKey);
$application_key = mysqli_real_escape_string($conn,$application_key);

$queryCheck =  "Select IFNULL(SUM(application_status = 'accepted'), 0) AS current_att, event_max_att FROM tbl_event LEFT OUTER JOIN tbl_application ON tbl_event.event_key = tbl_application.event_key WHERE tbl_event.event_key = $eventKey";

$result = $conn->query($queryCheck) or die($mysqli->error.__LINE__);
$row = $result->fetch_assoc();
if (intval($row["current_att"]) == intval($row["event_max_att"])){
    echo false;
} else {
    $query =  "UPDATE tbl_application SET application_status = 'accepted' WHERE application_key = $application_key";
    $result = $conn->query($query) or die($mysqli->error.__LINE__);
    echo true;
}

mysqli_close($conn);

?>