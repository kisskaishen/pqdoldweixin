<?php
    date_default_timezone_set('Asia/Shanghai');
	//获取当前服务器时间
	$time= date('Y-m-d H:i:s',time());
	echo strtotime($time);
?>