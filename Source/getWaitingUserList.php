<?php

$index = (int) $_POST["index"];
$event_key= $_POST["eventKey"];

$conn = mysqli_connect("localhost", "root", "soso1221", "ucscplaza");
    if (mysqli_connect_errno($conn)){
        echo "Failed to connect to MySQL:".mysqli_connect_error();
}
$event_key = mysqli_real_escape_string($conn,$event_key);


$query = "SELECT user_id, user_firstname, user_lastname, user_major, user_email, application_key FROM tbl_user INNER JOIN tbl_application ON tbl_user.user_id = tbl_application.event_applier WHERE tbl_application.event_key = $event_key AND tbl_application.application_status = 'waiting'";

$result = $conn->query($query) or die($mysqli->error.__LINE__);
$returnValue = array();
if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$one_event=array('applicationKey'=>$row["application_key"],'email'=>$row["user_email"], 'major'=>$row["user_major"], 'division'=>$row["user_division"], 'firstname'=>$row["user_firstname"], 'lastname'=>$row["user_lastname"], 'id'=>$row["user_id"]);
		array_push($returnValue, $one_event);
	}
}

echo json_encode($returnValue);

mysqli_close($conn);

?>
