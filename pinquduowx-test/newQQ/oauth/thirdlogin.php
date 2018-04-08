<?php

require_once("../API/qqConnectAPI.php");
$redirect_address = isset($_GET['redirect_address']) ? $_GET['redirect_address'] : "";
if(!empty($redirect_address)){
	setcookie("redirectAddress",$redirect_address,time()+7200,"/");
}
$qc = new QC();
$qc->qq_login();
