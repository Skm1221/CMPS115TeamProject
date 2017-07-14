<?php

$eventKey = $_POST["eventKey"];

$conn = mysqli_connect("localhost", "root", "soso1221", "ucscplaza");
    if (mysqli_connect_errno($conn)){
        echo "Failed to connect to MySQL:".mysqli_connect_error();
}

$eventKey = mysqli_real_escape_string($conn,$eventKey);

$query = "DELETE FROM tbl_event where event_key = $eventKey";

$result = $conn->query($query) or die($mysqli->error.__LINE__);

$query = "DELETE FROM tbl_application where event_key = $eventKey";

$result = $conn->query($query) or die($mysqli->error.__LINE__);

mysqli_close($conn);

?>
