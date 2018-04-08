<?php
error_reporting(E_ALL^E_NOTICE^E_WARNING);
class JSSDK {
  private $appId;
  private $appSecret;

  public function __construct($appId, $appSecret) {
    $this->appId = $appId;
    $this->appSecret = $appSecret;
  }

  public function getSignPackage() {
    $jsapiTicket = $this->getJsApiTicket();
    //$url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    $url = "$_SERVER[HTTP_REFERER]";
    $timestamp = time();
    $nonceStr = $this->createNonceStr();

    // 这里参数的顺序要按照 key 值 ASCII 码升序排序
    $string = "jsapi_ticket=$jsapiTicket&noncestr=$nonceStr&timestamp=$timestamp&url=$url";

    $signature = sha1($string);

    $signPackage = array(
      "appId"     => $this->appId,
      "nonceStr"  => $nonceStr,
      "timestamp" => $timestamp,
      "url"       => $url,
      "signature" => $signature,
      "rawString" => $string
    );
    return $signPackage; 
  }
  private function createNonceStr($length = 16) {
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    $str = "";
    for ($i = 0; $i < $length; $i++) {
      $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
    }
    return $str;
  }

    private function getJsApiTicket() {
    // jsapi_ticket 应该全局存储与更新，以下代码以写入到文件中做示例
    $data = json_decode(file_get_contents("jsapi_ticket.json"));
    if ($data->expire_time < time()) {
      include_once './config/qrcodeconfig.php';
      include_once './class/WechatClass.class.php';
      $obj = new wechat\WechatClass();
      $accessToken = $obj->getAccessToken($this->appId, $this->appSecret);
//      $accessToken = $this->getAccessToken();
      $url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=$accessToken";
      $res = json_decode($this->httpGet($url));
      $ticket = $res->ticket;
      if ($ticket) {
        $data->expire_time = time() + 0;
        $data->jsapi_ticket = $ticket;
        $fp = fopen("jsapi_ticket.json", "w");
        fwrite($fp, json_encode($data));
        fclose($fp);

      }
    } else {
      $ticket = $data->jsapi_ticket;
    }

    return $ticket;
  }

  //   private function getAccessToken() {
  //   // access_token 应该全局存储与更新，以下代码以写入到文件中做示例
  //   $data = json_decode(file_get_contents("access_token.json"));

  //   if ($data->expire_time < time()) {
  //     $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$this->appId&secret=$this->appSecret";
  //     $res = json_decode($this->httpGet($url));
  //     $access_token = $res->access_token;

  //     if ($access_token) {
  //       $data->expire_time = time() + 0;
  //       $data->access_token = $access_token;
  //       $fp = fopen("access_token.json", "w");
  //       fwrite($fp, json_encode($data));
  //       fclose($fp);
  //     }
  //   } else {
  //     $access_token = $data->access_token;
  //   }
  //   return $access_token;
  // }


  public function getAccessToken()
  {
      $fileName = "./access_token";
      $time = time();
      if(file_exists($fileName)) {
        $fileContents = file_get_contents($fileName);
        $tokenApi = json_decode($fileContents,true);
        if(!empty($tokenApi) && $tokenApi['expires_in'] > $time) {
          return $tokenApi['access_token'];
        }
      }
      $url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.$this->appId.'&secret='.$this->appSecret;
      $tempArr = json_decode($this->httpGet($url), true);
      if (!empty($tempArr) && isset($tempArr['access_token'])) {
          $tempArr['expires_in'] = $tempArr['expires_in'] + $time;
          file_put_contents($fileName, json_encode($tempArr));
          return $tempArr['access_token'];
      }
      return '';
  }

  private function httpGet($url) {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_TIMEOUT, 500);
    curl_setopt($curl, CURLOPT_URL, $url);

    $res = curl_exec($curl);
    curl_close($curl);

    return $res;
  }
}
?>