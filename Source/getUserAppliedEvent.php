<?php

$index = (int) $_POST["index"];
$user_id = $_POST["user_id"];

$conn = mysqli_connect("localhost", "root", "soso1221", "ucscplaza");
    if (mysqli_connect_errno($conn)){
        echo "Failed to connect to MySQL:".mysqli_connect_error();
}
$user_id = mysqli_real_escape_string($conn,$user_id);


$query = "SELECT tbl_event.event_key AS eventKey, tbl_event.event_title, application_status, event_writer, event_start_date FROM tbl_event JOIN tbl_application ON tbl_event.event_key = tbl_application.event_key WHERE event_applier = '$user_id' ORDER BY application_key DESC";

$result = $conn->query($query) or die($mysqli->error.__LINE__);
$returnValue = array();
if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$one_event=array('eventKey'=>$row["eventKey"],'title'=>$row["event_title"], 'application_status'=>$row["application_status"],'startDate'=>$row["event_start_date"],'writer'=>$row["event_writer"]);
		array_push($returnValue, $one_event);
	}
}

echo json_encode($returnValue);

mysqli_close($conn);

?>
