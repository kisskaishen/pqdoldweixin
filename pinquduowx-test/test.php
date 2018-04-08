<?php
//https请求(支持GET和POST)
function http_request($url, $data=null){
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
    if (!empty($data)){
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    }
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $output = curl_exec($curl);
    curl_close($curl);
    return $output;
}



$openid = 'oCuUzwNw3-EA-LluSa0jDF1H8jZo';

$access_token = 'Y8ICSv6YUICQ5buhzJcv3f-vcx4zAkfvPVkb-eKa4kFrEU5fHv5r58aNUL29BDh8iL994HROqBmxFrs_-xbYV2jvOLUO7-93XUTkeTUq8yDrobzXVUtIbgJmxePMKVrJKSBbAGAQYH';
$url = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token={$access_token}";
$template_id = "L22LKQdaEErpxPaXHIn1U0sGc9yJ-q1jKWeF4kgU70E";
$keyword1 = '苹果';
$keyword2 = '小黑，小红';
$keyword3 = '7月14日之前发货';
$Remark = '谢谢';
$data = array(
    'first' => array(
        'value' => urlencode('您购买的商品已拼团成功'),
        'color' => '#FF0000'
    ),
    'keyword1' => array(
        'value' => urlencode($keyword1),
        'color' => '#000000'
    ),
    'keyword2' => array(
        'value' => urlencode($keyword2),
        'color' => '#000000'
    ),
    'keyword3' => array(
        'value' => urlencode($keyword3),
        'color' => '#000000'
    ),
    'remark' => array(
        'value' => urlencode($Remark),
        'color' => '#FF0000'
    )
);
$push_data = array(
    'touser' => $openid,
    'template_id' => $template_id,
    'url' => 'http://wx.pinquduo.cn/special99.html',
    'data' => $data
);
$result = http_request($url,urldecode(json_encode($push_data)));
var_dump($result);
exit();
