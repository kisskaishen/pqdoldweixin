<?php

$appid = "wxdbc22996638a2c73";  
$secret = "d259ccee138067613a26971092c6e48d";

function getAccessToken($appid, $secret)
{
    $fileName = './access_token';
    $time = time();
    if(file_exists($fileName)) {
    	$fileContents = file_get_contents($fileName);
    	$tokenApi = json_decode($fileContents,true);
    	if(!empty($tokenApi) && $tokenApi['expires_in'] > $time) {
    		return $tokenApi['access_token'];
    	}
    }
    
    $url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.$appid.'&secret='.$secret;
    $tempArr = json_decode(curl_request($url), true);
    if (!empty($tempArr) && isset($tempArr['access_token'])) {
    	$tempArr['expires_in'] = $tempArr['expires_in'] + $time;
    	file_put_contents($fileName, json_encode($tempArr));
    	return $tempArr['access_token'];
    }
    return '';
}

function curl_request($url, $data=null){
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
	if (!empty($data) || count($data)>0){
		curl_setopt($curl, CURLOPT_POST, 1);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
	}
	curl_setopt($curl, CURLOPT_TIMEOUT, 10);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	$output = curl_exec($curl);
	curl_close($curl);
	return $output;
}
$ip = [];

exit(json_encode([
	'status'	=>	1,
	'msg'		=>	'获取成功',
	'data'		=>	getAccessToken($appid, $secret)
]));