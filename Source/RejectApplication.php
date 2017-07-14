<?php


$application_key = $_POST["application_key"];

$conn = mysqli_connect("localhost", "root", "soso1221", "ucscplaza");
    if (mysqli_connect_errno($conn)){
        echo "Failed to connect to MySQL:".mysqli_connect_error();
}
$application_key = mysqli_real_escape_string($conn,$application_key);

$query =  "UPDATE tbl_application SET application_status = 'rejected' WHERE application_key = $application_key";

$result = $conn->query($query) or die($mysqli->error.__LINE__);

echo true;


mysqli_close($conn);

?>