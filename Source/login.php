<?php

$userId = $_POST["id"];
$userPasswd = $_POST["pw"];

$conn = mysqli_connect("localhost:3307", "root", "soso1221", "ucscplaza");
    if (mysqli_connect_errno($conn)){
        echo "Failed to connect to MySQL:".mysqli_connect_error();
}
$userId = mysqli_real_escape_string($conn,$userId);
$userPasswd = mysqli_real_escape_string($conn,$userPasswd);

$query = "SELECT * FROM tbl_user WHERE user_Id='".$userId."' AND user_passwd='".$userPasswd."' ";

$result = $conn->query($query) or die($mysqli->error.__LINE__);
if(($result->num_rows > 0)){
    session_start();
    $_SESSION["user_id"] = $userId;
    echo "true";
}else {
    echo "No Result";
}

mysqli_close($conn);

?>
