<?php
$keyword = $_POST["keyword"];
$conn = mysqli_connect("localhost", "root", "soso1221", "ucscplaza");
    if (mysqli_connect_errno($conn)){
        echo "Failed to connect to MySQL:".mysqli_connect_error();
}
$keyword = mysqli_real_escape_string($conn,$keyword);



$query = "SELECT * FROM tbl_event WHERE event_title LIKE '%$keyword%' OR event_description LIKE '%$keyword%'";
$result = $conn->query($query) or die($mysqli->error.__LINE__);
$returnValue = array();
if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$one_event=array('event_key'=>$row["event_key"],'title'=>$row["event_title"],'latlng'=>$row["event_latlng"], 'rating'=>$row["event_rating"], 'creator'=>$row["event_writer"]);
		array_push($returnValue, $one_event);
	}
}

echo json_encode($returnValue);

mysqli_close($conn);

?>

