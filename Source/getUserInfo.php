<?php



$user_id = $_POST["user_id"];
$conn = mysqli_connect("localhost", "root", "soso1221", "ucscplaza");
    if (mysqli_connect_errno($conn)){
        echo "Failed to connect to MySQL:".mysqli_connect_error();
}
$user_id = mysqli_real_escape_string($conn,$user_id);

$query =  "select * from tbl_user where user_id = '$user_id'";

$result = $conn->query($query) or die($mysqli->error.__LINE__);
$row = $result->fetch_assoc();
$small = array('firstname'=>$row["user_firstname"], 'lastname'=>$row["user_lastname"], 'major'=>$row["user_major"], 'division'=>$row["user_division"], 'email'=>$row["user_email"]);


echo json_encode($small);

mysqli_close($conn);

?>
