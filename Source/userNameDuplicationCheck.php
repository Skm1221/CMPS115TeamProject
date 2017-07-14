<?php

$userId = $_POST["id"];

$conn = mysqli_connect("localhost", "root", "soso1221", "ucscplaza");
    if (mysqli_connect_errno($conn)){
        echo "Failed to connect to MySQL:".mysqli_connect_error();
}

$forQuery = mysqli_real_escape_string($conn,$userId);

$query = "SELECT * FROM tbl_user where user_Id = '".$forQuery."' ";



$result = $conn->query($query) or die($mysqli->error.__LINE__);
if($result->num_rows > 0){
    echo "false";
}else {
    echo "true";
}
mysqli_close($conn);

?>