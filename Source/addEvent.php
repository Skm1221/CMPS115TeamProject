<?php

$target_file = null;
$target_dir = "../uploads/";

if ($_FILES["image"]){	// file이 attach됫는지 가려준다.
	$new_file_name = date("Y-m-d") . "-" .  date("h:i:sa") . "." . pathinfo($target_dir . basename( $_FILES["image"]["name"]),PATHINFO_EXTENSION);

	$target_file = $target_dir . $new_file_name;
	$uploadOk = 1;

	$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
	// Check if image file is a actual image or fake image
	if(isset($_POST["submit"])) {
	    $check = getimagesize($_FILES["image"]["tmp_name"]);
	    if($check !== false) {
		echo "File is an image - " . $check["mime"] . ".";
		$uploadOk = 1;
	    } else {
		echo "File is not an image.";
		$uploadOk = 0;
	    }
	}
	// Check if file already exists
	if (file_exists($target_file)) {
	    echo "Sorry, file already exists.";
	    $uploadOk = 0;
	}
	// Check file size
	if ($_FILES["image"]["size"] > 500000) {
	    echo "Sorry, your file is too large.";
	    $uploadOk = 0;
	}
	// Allow certain file formats
	if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
	&& $imageFileType != "gif" ) {
	    echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
	    $uploadOk = 0;
	}
	// Check if $uploadOk is set to 0 by an error
	if ($uploadOk == 0) {
	    echo "Sorry, your file was not uploaded.";
	// if everything is ok, try to upload file
	} else {
	    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
		echo "The file has been uploaded.";
	    } else {
		echo "Sorry, there was an error uploading your file.";
	    }
	}
}

$event_title = $_POST["title"];
$event_start_date = $_POST["startTime"];
$event_end_date = $_POST["endTime"];
$event_major = $_POST["major"];
$event_category = $_POST["category"];
$event_file = $target_file;
$event_writer = $_POST["writer"];
$event_description = $_POST["description"];
$event_details = $_POST["details"];
$event_location = $_POST["location"];
$event_max_attendance = $_POST["maxAttendance"];



$conn = mysqli_connect("localhost:3307", "root", "soso1221", "ucscplaza");
    if (mysqli_connect_errno($conn)){
        echo "Failed to connect to MySQL:".mysqli_connect_error();
}

$event_title = mysqli_real_escape_string($conn,$event_title);
$event_start_date = mysqli_real_escape_string($conn,$event_start_date);
$event_end_date = mysqli_real_escape_string($conn,$event_end_date);
$event_major = mysqli_real_escape_string($conn,$event_major);
$event_category = mysqli_real_escape_string($conn,$event_category);
$event_file = mysqli_real_escape_string($conn,$event_file);
$event_writer = mysqli_real_escape_string($conn,$event_writer);
$event_location = mysqli_real_escape_string($conn,$event_location);
$event_description = mysqli_real_escape_string($conn,$event_description);
$event_details = mysqli_real_escape_string($conn, $event_details);
$event_max_attendance = mysqli_real_escape_string($conn, $event_max_attendance);

$query =  "INSERT INTO tbl_event (event_title, event_start_date, event_end_date, event_major, event_category, event_file, event_writer, event_location, event_description, event_details, event_max_att) VALUES ('".$event_title."','".$event_start_date."','".$event_end_date."','".$event_major."','".$event_category."','".$event_file."','".$event_writer."','".$event_location."','".$event_description."','".$event_details."','".$event_max_attendance."')";

$result = $conn->query($query) or die($mysqli->error.__LINE__);

echo 'true';

mysqli_close($conn);

?>
