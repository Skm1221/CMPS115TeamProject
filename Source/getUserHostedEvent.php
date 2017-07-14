<?php

$index = (int) $_POST["index"];
$user_id = $_POST["user_id"];

$conn = mysqli_connect("localhost", "root", "soso1221", "ucscplaza");
    if (mysqli_connect_errno($conn)){
        echo "Failed to connect to MySQL:".mysqli_connect_error();
}
$user_id = mysqli_real_escape_string($conn,$user_id);


$query = "SELECT tbl_event.event_key AS eventKey, event_title, event_max_att, event_start_date, IFNULL(SUM(application_status = 'waiting'), 0) AS numOfApplication, IFNULL(SUM(application_status = 'accepted'),0) AS numOfAccepted FROM tbl_event LEFT JOIN tbl_application ON tbl_event.event_key = tbl_application.event_key WHERE event_writer = '$user_id' GROUP BY tbl_event.event_key ORDER BY tbl_event.event_key DESC";

$result = $conn->query($query) or die($mysqli->error.__LINE__);
$returnValue = array();
if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$one_event=array('eventKey'=>$row["eventKey"],'title'=>$row["event_title"], 'waitingCount'=>$row["numOfApplication"], 'acceptedCount'=>$row["numOfAccepted"], 'maxCount'=>$row["event_max_att"], 'startDate'=>$row["event_start_date"]);
		array_push($returnValue, $one_event);
	}
}

echo json_encode($returnValue);

mysqli_close($conn);

?>
