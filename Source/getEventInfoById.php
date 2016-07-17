<?php
$event_id = $_POST["event_id"];
$event_id = mysqli_real_escape_string($conn,$event_id);
$conn = mysqli_connect("localhost:3307", "root", "soso1221", "ucscplaza");
    if (mysqli_connect_errno($conn)){
        echo "Failed to connect to MySQL:".mysqli_connect_error();
}

$query = "SELECT * FROM tbl_event where event_key = ".$event_id;

$result = $conn->query($query) or die($mysqli->error.__LINE__);

$row = $result->fetch_assoc();
$small=array('startDate'=>$row["event_start_date"],'endDate'=>$row["event_end_date"],'category'=>$row["event_category"],'major'=>$row["event_major"],'maxAttendance'=>$row["event_max_att"],'currentAttendance'=>$row["event_current_att"],'image'=>$row["event_file"],'description'=>$row["event_descrition"],'details'=>$row["event_details"],'hompage'=>$row["event_homepage"]);

echo json_encode($small);

mysqli_close($conn);

?>

