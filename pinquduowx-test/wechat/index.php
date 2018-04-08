<?php
namespace wechat;
include_once './config/qrcodeconfig.php';
include_once './class/WechatClass.class.php';
include_once './class/wechatCallbackapiTest.class.php';
$wechatObj = new wechatCallbackapiTest();
$wechatObj->responseMsg();
#$wechatObj->valid();

?>
