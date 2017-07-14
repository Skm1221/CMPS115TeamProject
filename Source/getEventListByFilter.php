<?php
$nullText = "nnull";
$major = $_POST["major"];
$category = $_POST["category"];
$startDate = $_POST["startDatetime"];
$endDate = $_POST["endDatetime"];
$categoryQuery = "";
$DateQuery = "";
$keyword = $_POST["keyword"];
$conn = mysqli_connect("localhost", "root", "soso1221", "ucscplaza");
    if (mysqli_connect_errno($conn)){
        echo "Failed to connect to MySQL:".mysqli_connect_error();
}
$major = mysqli_real_escape_string($conn,$major);
$startDate = mysqli_real_escape_string($conn,$startDate);
$endDate = mysqli_real_escape_string($conn,$endDate);
$keyword = mysqli_real_escape_string($conn,$keyword);

$anythingIn = false;
if ($keyword != $nullText) {
    $anythingIn = true;
    $keyword = "event_title LIKE '%$keyword%' OR event_description LIKE '%$keyword%'";
} else {
    $keyword = "";
}

if ($major != $nullText) {
    if ($anythingIn){
        $major = "AND event_major = '".$major."' "; 
    } else{
        $anythingIn = true;
        $major = "event_major = '".$major."' ";    
    }
} else {
    $major = "";
}

if ($category != $nullText) {
    $categoryLen = count($category);
    if ($anythingIn){
        $categoryQuery = "AND (event_category IN (";
    } else {
        $anythingIn = true;
        $categoryQuery = "(event_category IN (";
    }
    for ($i = 0; $i<$categoryLen; $i++){
        $category[$i] = mysqli_real_escape_string($conn,$category[$i]);
        if($i == $categoryLen - 1){
            $categoryQuery .= "'".$category[$i]."' )) ";
        } else {
            $categoryQuery .= "'".$category[$i]."' , ";
        }
    }

} 

if ($endDate != $nullText) {
    if ($anythingIn){
        $DateQuery = "AND (event_start_date <='".$endDate."' OR event_end_date >='".$startDate."') ";
    } else {
        $anythingIn = true;
        $DateQuery = "(event_start_date <='".$endDate."' OR event_end_date >='".$startDate."') ";
    }
} else {
    if ($anythingIn){
        $DateQuery = "AND event_end_date >='".$startDate."' ";
    } else {
        $anythingIn = true;
        $DateQuery = "event_end_date >='".$startDate."' ";
    }
}


$query = "SELECT * FROM tbl_event ";
if ($anythingIn) {
    $query .= "where ".$keyword.$major.$categoryQuery.$DateQuery." ORDER BY event_key DESC";
}
$result = $conn->query($query) or die($mysqli->error.__LINE__);
$returnValue = array();
if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$oneEvent=array('event_key'=>$row["event_key"],'title'=>$row["event_title"],'latlng'=>$row["event_latlng"], 'category'=>$row["event_category"],'location'=>$row["event_location"]);
		array_push($returnValue, $oneEvent);
	}
}

echo json_encode($returnValue);

mysqli_close($conn);

?>
