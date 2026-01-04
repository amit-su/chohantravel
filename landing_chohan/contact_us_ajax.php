<?php ob_start();
session_start();
?>
<?php
$digit=$_SESSION['digit'];
$captcha=$_POST['captcha'];
if($digit!=$captcha)
{
	$sess_msg="Invalid captcha!. Please enter correct Captcha !.";

	$_SESSION['error']=$sess_msg;

	header("location: contact_us.php");

	exit();
}
else
{
?>

<?php

if(isset($_POST["email"]))

{
$subject = "Chohantoursandtravels"; 		
$msg = '<html>
<head>
<title>Chohantoursandtravels</title>
</head>
<body>
<style>
td{
padding:5px;
}
</style>
<table width=50% border=1 align="center" cellspacing=0 cellpading=0>
<tr>
<td style=padding=2px; colspan=2 width=100%><h3>Contact Us Details</h3></td>	</tr>
<tr>
<td style=padding=2px; width=50%>Name :</td><td width=50%>' .$_POST['name']. '</td>
</tr>
<tr>
<td width=50%>Email :</td><td width=50%>' .$_POST['email']. '</td>
</tr>
<tr>
<td width=50%>Mobile Number :</td><td width=50%>' .$_POST['mobile']. '</td>
</tr>
<tr>
<td width=50%>Your requirement:</td><td width=50%>' .$_POST['message']. '</td>
</tr>
</table></body></html>';
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$email_from = "info@chohantoursandtravels.com"; 
$full_name='Contact Us Form';
$email_from = $full_name.'<'.$email_from.'>';
$headers .= 'From: '.$email_from."\r\n";
//$headers .= 'Cc: deeprajsen777@gmail.com' . "\r\n";
$email_second='chohantoursandtravels@gmail.com';	
$mail = mail($email_second,$subject,$msg,$headers);
$_SESSION['done']="Mail sent succesfully! - Thanks for sharing the details, we will get back to you soon!";
header("location: contact_us.php");
exit();
}
}
?>