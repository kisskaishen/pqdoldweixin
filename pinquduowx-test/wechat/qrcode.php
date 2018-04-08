<?php
namespace wechat;
header('content-type:text/html; charset=utf8');
header('Access-Control-Allow-Origin:*');
include_once './config/qrcodeconfig.php';
include_once './class/WechatClass.class.php';
set_time_limit(10); 
$groupbuyid = isset($_REQUEST['groupbuyid']) ? (int)$_REQUEST['groupbuyid'] : 0; 
if($groupbuyid<=0){
	$data = [
		'status' => 0,
		'msg' => '数据非法' 
	];
	echo json_encode($data);
	exit();	
}
$wechatObj = new WechatClass();
$wechatObj->setGroupBuy($groupbuyid);
$data = [
	'status' => 1,
	'msg' => '',
	'address' => $wechatObj->QrcodeCreate() 
];
echo json_encode($data);
exit();

?>