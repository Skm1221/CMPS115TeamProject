<?php

$userEmail = $_POST["email"];
$privateKey = crypt($userEmail,'st');

// email로 private key 보내기

require '../PHPMailer/PHPMailerAutoload.php';
try{
    $mail = new PHPMailer(true);

    $mail->IsSMTP();                            // Set mailer to use SMTP
    $mail->Host = 'smtp.gmail.com';             // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;                     // Enable SMTP authentication
    $mail->Username = 'sorudals@gmail.com';          // SMTP username
    $mail->Password = 'soso3033'; // SMTP password
    $mail->SMTPSecure = 'tls';                  // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 587;                          // TCP port to connect to

    $mail->setFrom('kyso@ucsc.edu', 'UCSC_PLAZA');
    $mail->addReplyTo('kyso@ucsc.edu', 'UCSC_PLAZA');
    $mail->addAddress($userEmail.'@ucsc.edu');   // Add a recipient

    $mail->IsHTML(true);  // Set email format to HTML

    
    $bodyContent = '<h1>Welcome to UCSC_PLAZA</h1>';
    $bodyContent .= '<p>your private key = <b>'.$privateKey.'</b></p>';

    $mail->Subject = 'Email from UCSC_PLAZA for email certification';
    $mail->Body = $bodyContent;
    $mail->Send();
    echo json_encode(array('result' => 'true', 'privateKey'=>$privateKey));
}catch (phpmailerException $e) {
    echo $e->errorMessage(); //Pretty error messages from PHPMailer
} catch (Exception $e) {
    echo $e->getMessage(); //Boring error messages from anything else!
}

?>
