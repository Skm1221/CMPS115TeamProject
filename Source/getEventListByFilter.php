<?php
$nullText = "nnull";
$major = $_POST["major"];
$category = $_POST["category"];
$startDate = $_POST["startDate"];
$endDate = $_POST["endDate"];
$category_query = "";
$startDate_query = "";
$endDate_query = "";
$conn = mysqli_connect("localhost:3307", "root", "soso1221", "ucscplaza");
    if (mysqli_connect_errno($conn)){
        echo "Failed to connect to MySQL:".mysqli_connect_error();
}
$major = mysqli_real_escape_string($conn,$major);
$startDate = mysqli_real_escape_string($conn,$startDate);
$endDate = mysqli_real_escape_string($conn,$endDate);

$anything_in = false;

if ($major != $nullText) {
    $anything_in = true;
    $major = "event_major = '".$major."' ";
}
if (count($category) != 0) {
    $category_len = count($category);
    if ($anything_in){
        $category_query = "AND (event_category IN (";
    } else {
        $anything_in = true;
        $category_query = "(event_category IN (";
    }
    for ($i = 0; $i<$category_len; $i++){
        $category[$i] = mysqli_real_escape_string($conn,$category[$i]);
        if($i == $category_len - 1){
            $category_query .= "'".$category[$i]."' )) ";
        } else {
            $category_query .= "'".$category[$i]."' , ";
        }
    }

} 

if ($startDate != $nullText) {
    if ($anything_in){
        $startDate_query = "AND event_start_date <='".$endDate."' ";
    } else {
        $anything_in = true;
        $startDate_query = "event_start_date <='".$endDate."' ";
    }
}

if ($endDate != $nullText) {
    if ($anything_in){
        $endDate_query = "AND event_end_date >='".$startDate."' ";
    } else {
        $anything_in = true;
        $endDate_query = "event_end_date >='".$startDate."' ";
    }
}


$query = "SELECT * FROM tbl_event ";
if ($anything_in) {
    $query .= "where ".$major.$category_query.$startDate_query.$endDate_query;
}
$result = $conn->query($query) or die($mysqli->error.__LINE__);
$returnValue = array();
if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$one_event=array('event_id'=>$row["event_id"],'title'=>$row["event_title"],'location'=>$row["event_location"], 'rating'=>$row["event_rating"], 'writer'=>$row["event_writer"]);
		array_push($returnValue, $one_event);
	}
}

echo json_encode($returnValue);

mysqli_close($conn);

?>
