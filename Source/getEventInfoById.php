<?php
$eventKey = $_POST["eventKey"];
$conn = mysqli_connect("localhost", "root", "soso1221", "ucscplaza");
    if (mysqli_connect_errno($conn)){
        echo "Failed to connect to MySQL:".mysqli_connect_error();
}

$query = "SELECT event_title, event_start_date, event_end_date, event_max_att, event_file, event_description, event_homepage, event_location, event_writer, event_latlng, IFNULL(SUM(application_status = 'accepted'),0) AS current_att FROM tbl_event LEFT OUTER JOIN tbl_application ON tbl_event.event_key = tbl_application.event_key WHERE tbl_event.event_key = $eventKey GROUP BY tbl_event.event_key";

$result = $conn->query($query) or die($mysqli->error.__LINE__);
$row = $result->fetch_assoc();
$small=array('title'=>$row["event_title"],'startDatetime'=>$row["event_start_date"],'endDatetime'=>$row["event_end_date"],'maxAttendance'=>$row["event_max_att"],'currentAttendance'=>$row["current_att"],'image'=>$row["event_file"],'description'=>$row["event_description"],'homepage'=>$row["event_homepage"],'location'=>$row["event_location"],'owner'=>$row["event_writer"],'event_key'=>$eventKey,'latlng'=>$row["event_latlng"], 'rating'=>$row["event_rating"]);

echo json_encode($small);

mysqli_close($conn);

?>