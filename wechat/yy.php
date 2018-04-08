<?php
$nickname = $_COOKIE['user_name'];
$head_pic = $_COOKIE['head_pic'];
$openid = $_COOKIE['openid2'];
$unionid = $_COOKIE['openid'];
$oauth = 'wx';
$url = "https://pinquduo.cn/api_2_0_2/user/thirdLogin/nickname/{$nickname}/head_pic/{$head_pic}/oauth/{$oauth}/openid/{$openid}/unionid/{$unionid}";
$timeout = 5;
$con = curl_init((string)$url);
curl_setopt($con, CURLOPT_HEADER, false);
curl_setopt($con, CURLOPT_RETURNTRANSFER,true);
curl_setopt($con, CURLOPT_TIMEOUT, (int)$timeout);
$data = curl_exec($con);
echo $data;
exit();
?>