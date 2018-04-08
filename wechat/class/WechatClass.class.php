<?php
namespace wechat;
class WechatClass{
    private $token;
    private $appID;
    private $appSecret;
    private $accessTokenFile = './access_token';
	private $groupbuyid;
	private $accessToken;
    public function __CONSTRUCT(){
        $this->token     = TOKEN;
        $this->appID     = AppID;
        $this->appSecret = APP_SECRET;		
		// $this->accessToken = file_get_contents($this->accessTokenFile); 
    }
	/*
	**设置团id
	*/
	public function setGroupBuy($groupbuyid){
		$this->groupbuyid = $groupbuyid;
	}
	
    /* 创建二维码 
		@param - $qrcodeID传递的参数，$qrcodeType二维码类型 默认为临时二维码 
		@return - 返回二维码图片地址
	*/
    public function QrcodeCreate(){
		//临时二维码
        $qrcodeType = 'QR_SCENE'; 
		//团id  只能是一个整数	
		$qrcodeID = $this->groupbuyid;
		//拼装发送请求数据包	
        $push_data = array(
            "expire_seconds" => EXPIRETIME,
            "action_name" => $qrcodeType,
			"action_info" => [
				"scene" => ["scene_id" => $qrcodeID ]
			]
        );
        $access_token = $this->getAccessToken($this->appID, $this->appSecret);		
        $url = "https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=".$access_token;
        $tempArr = json_decode($this->curl_request($url, urldecode(json_encode($push_data)) ), true);
        if(isset($tempArr['ticket'])){
            return 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='.$tempArr['ticket'];
        }else{
            return $this->QrcodeCreate();
        }
    }
    
    /* 从微信服务器获取access_token并写入配置文件 */
   //  public function AccessTokenGet(){		
   //      $url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.$this->appID.'&secret='.$this->appSecret;
   //      $tempArr = json_decode($this->curl_request($url), true);
   //      if(@array_key_exists('access_token', $tempArr)){            
   //          $tempWriter = fopen($this->accessTokenFile, 'w');
   //          fwrite($tempWriter, $tempArr['access_token']);
			// $this->accessToken = $tempArr['access_token']; 
   //      }
   //  }

    /*
     *	获取微信接口凭证access_token
     *	@author WangZhou
     *	@param $appId String 微信公众号唯一表示
     *	@param $appSecret String 微信公众号秘钥
     *  @return String
     */
    public function getAccessToken($appId, $appSecret)
    {
    	$fileName = $this->accessTokenFile;
    	$time = time();
    	if(file_exists($fileName)) {
    		$fileContents = file_get_contents($fileName);
    	
    		$tokenApi = json_decode($fileContents,true);
    		if(!empty($tokenApi) && $tokenApi['expires_in'] > $time) {

    			return $tokenApi['access_token'];
    		}
    	}
    
    	$url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.$this->appID.'&secret='.$this->appSecret;
        $tempArr = json_decode($this->curl_request($url), true);
        if (!empty($tempArr) && isset($tempArr['access_token'])) {
        	$tempArr['expires_in'] = $tempArr['expires_in'] + $time;
        	file_put_contents($fileName, json_encode($tempArr));
        	return $tempArr['access_token'];
        }
    	return '';
    }
	
	//获取用户信息	
	public function getUserInfo($useropenid){
		$access_token = $this->getAccessToken($this->appID, $this->appSecret);	
		$userurl = "https://api.weixin.qq.com/cgi-bin/user/info?access_token={$access_token}&openid={$useropenid}";
		$resultstr = $this->curl_request($userurl);
		$resultArray = json_decode($resultstr,true);
		if(isset($resultArray['errcode'])){
			return $this->getUserInfo();	
		}else{
			return $resultArray;
		}
	}	
	
	//发送客服消息	
	public function sendMsg($useropenid,$data){
		$access_token = $this->getAccessToken($this->appID, $this->appSecret);		
		$userurl = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token={$access_token}";
		$resultstr = $this->curl_request($userurl,$data);
		return $resultstr;
	}		
	
	

    /* 
	**https请求(支持GET和POST) 
	**CURLOPT_SSL_VERIFYPEER,CURLOPT_SSL_VERIFYHOST - 在做https中要用到
	**CURLOPT_RETURNTRANSFER - 不以文件流返回，带1
	*/	
	public function curl_request($url, $data=null){
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

		//如果微信token无效了，重新刷新token
		$resultArray = json_decode($output,true);
		if (isset($resultArray['errcode']) && $resultArray['errcode'] == 40001) {
			$this->refresh_token();
		}

		return $output;
	}

	/**
	 * 刷新token
	 */
	public function refresh_token()
	{
		$fileName = $this->accessTokenFile;
		$time = time();
		$url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.$this->appID.'&secret='.$this->appSecret;
	    $tempArr = json_decode($this->curl_request($url), true);
	    if (!empty($tempArr) && isset($tempArr['access_token'])) {
	    	$tempArr['expires_in'] = $tempArr['expires_in'] + $time;
	    	file_put_contents($fileName, json_encode($tempArr));
	    	return $tempArr['access_token'];
	    }
	}
}
?>