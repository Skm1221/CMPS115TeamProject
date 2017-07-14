<?php


$nullText = "N/A";
$target_file = null;
$target_dir = "../uploads/";
$uploadOk = 1;
if ($_FILES["image"]){	// file이 attach됫는지 가려준다.
	$new_file_name = date("Y-m-d") . "-" .  date("h:i:sa") . "." . pathinfo($target_dir . basename( $_FILES["image"]["name"]),PATHINFO_EXTENSION);

	$target_file = $target_dir . $new_file_name;

	$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
	// Check if image file is a actual image or fake image
	if(isset($_POST["submit"])) {
	    $check = getimagesize($_FILES["image"]["tmp_name"]);
	    if($check !== false) {
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
	if ($_FILES["image"]["size"] > 5000000000) {
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
            $uploadOk = 1;
	    } else {
		  echo "Sorry, there was an error uploading your file.";
	    }
	}
}

if ($uploadOk == 1){
    $event_title = $_POST["title"];
    $event_start_date = $_POST["startTime"];
    $event_end_date = $_POST["endTime"];
    $event_major = $_POST["major"];
    $event_category = $_POST["category"];
    $event_file = $target_file;
    $event_description = $_POST["description"];
    $event_location = $_POST["location"];
    $event_latlng = $_POST["Coordinates"];
    $event_max_attendance = $_POST["maxAttendance"];
    $event_homepage = $_POST["homepage"];
    $event_writer = $_POST["writer"];



    $conn = mysqli_connect("localhost", "root", "soso1221", "ucscplaza");
        if (mysqli_connect_errno($conn)){
            echo "Failed to connect to MySQL:".mysqli_connect_error();
    }

    $event_title = mysqli_real_escape_string($conn,$event_title);
    $event_start_date = mysqli_real_escape_string($conn,$event_start_date);
    $event_end_date = mysqli_real_escape_string($conn,$event_end_date);
    $event_major = mysqli_real_escape_string($conn,$event_major);
    $event_category = mysqli_real_escape_string($conn,$event_category);
    $event_file = mysqli_real_escape_string($conn,$event_file);
    $event_location = mysqli_real_escape_string($conn,$event_location);
    $event_description = mysqli_real_escape_string($conn,$event_description);
    $event_max_attendance = mysqli_real_escape_string($conn, $event_max_attendance);
    $event_homepage = mysqli_real_escape_string($conn, $event_homepage);
    $event_writer = mysqli_real_escape_string($conn, $event_writer);
    $event_latlng = mysqli_real_escape_string($conn, $event_latlng);

    if ($event_homepage == $nullText) {
        $event_homepage = "No Homepage";
    }

    if ($event_major == $nullText) {
        $event_major = "No Major";
    }

    if ($event_category == $nullText) {
        $event_category = "No Category";
    }

    $query =  "INSERT INTO tbl_event (event_title, event_start_date, event_end_date, event_major, event_category, event_file, event_writer, event_location, event_description, event_max_att, event_homepage, event_latlng) VALUES ('".$event_title."','".$event_start_date."','".$event_end_date."','".$event_major."','".$event_category."','".$event_file."','".$event_writer."','".$event_location."','".$event_description."','".$event_max_attendance."','".$event_homepage."','".$event_latlng."')";
    $result = $conn->query($query) or die($mysqli->error.__LINE__);
    mysqli_close($conn);
}


?>
