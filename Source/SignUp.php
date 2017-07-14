<?php

$userId = $_POST["id"];
$userPasswd = $_POST["pw"];
$firstname = $_POST["firstname"];
$lastname = $_POST["lastname"];
$major = $_POST["major"];
$division = $_POST["division"];
$userEmail = $_POST["email"];


$conn = mysqli_connect("localhost", "root", "soso1221", "ucscplaza");
    if (mysqli_connect_errno($conn)){
        echo "Failed to connect to MySQL:".mysqli_connect_error();
}

$userId = mysqli_real_escape_string($conn,$userId);
$userPasswd = mysqli_real_escape_string($conn,$userPasswd);
$fisrtname = mysqli_real_escape_string($conn,$firstname);
$lastname = mysqli_real_escape_string($conn,$lastname);
$userEmail = mysqli_real_escape_string($conn,$userEmail);
$major = mysqli_real_escape_string($conn,$major);
$division = mysqli_real_escape_string($conn,$division);

$query =  "INSERT INTO tbl_user (user_id, user_passwd, user_firstname, user_lastname, user_email, user_division, user_major) VALUES ('".$userId."','".$userPasswd."','".$firstname."','".$lastname."','".$userEmail."','".$division."','".$major."')";


$result = $conn->query($query) or die($mysqli->error.__LINE__);

echo 'true';

mysqli_close($conn);

?>
