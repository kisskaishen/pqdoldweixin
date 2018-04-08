<?php
namespace wechat;
class wechatCallbackapiTest  
{
	const IMGURL = 'https://cdn2.pinquduo.cn/1510651802114789.jpg';
	const TUANURL = 'https://wx.pinquduo.cn/qualityFruit.html?tab=true';
	const DESCRIPTION = '点击免费领取5折购特权';
	const TITLE = '您有新鲜水果5折购的机会待领取，点击免费领取';
	private $useropenid;
	public function __construct(){
		
	}
    //验证签名
    public function valid()
    {
        $echoStr = $_GET["echostr"];
        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];
        $tmpArr = array(TOKEN, $timestamp, $nonce);
        sort($tmpArr);
        $tmpStr = implode($tmpArr);
        $tmpStr = sha1($tmpStr);
        if($tmpStr == $signature){
	    ob_clean();
            echo $echoStr;
            exit;
        }
    }
    //响应消息
    public function responseMsg()
    {
        $timestamp  = $_GET['timestamp'];
        $nonce = $_GET["nonce"];
        $msg_signature  = $_GET['msg_signature'];
        $encrypt_type = (isset($_GET['encrypt_type']) && ($_GET['encrypt_type'] == 'aes')) ? "aes" : "raw";        
		$postStr = file_get_contents("php://input");
		//file_put_contents('aaa.log',$postStr."\n",FILE_APPEND);
		//file_put_contents('ip.log',$_SERVER['HTTP_CLIENT_IP']."\n",FILE_APPEND);
		
		
		
        if (!empty($postStr)){
            $postObj = simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
            $RX_TYPE = trim($postObj->MsgType);
            //消息类型分离
            switch ($RX_TYPE)
            {
                case "event":
                    $result = $this->receiveEvent($postObj);
                    break;
                case "text":
                    $result = $this->receiveText($postObj);
                    break;
            }
            if(!empty($result)){
                echo $result;
                exit(); 
            }
            
        }else {
            echo "";
            exit;
        }
    }
	
public function curlPost($url,$data=""){     
    $ch = curl_init();  
    $opt = array(  
            CURLOPT_URL     => $url,              
            CURLOPT_HEADER  => 0,  
            CURLOPT_POST    => 1,  
            CURLOPT_POSTFIELDS      => $data,  
            CURLOPT_RETURNTRANSFER  => 1,  
            CURLOPT_TIMEOUT         => 20  
    );  
    $ssl = substr($url,0,8) == "https://" ? TRUE : FALSE;  
    if ($ssl){  
        $opt[CURLOPT_SSL_VERIFYHOST] = 2;  
        $opt[CURLOPT_SSL_VERIFYPEER] = FALSE; //FALSE返回对象，TRUE返回数组  
    }  
    curl_setopt_array($ch,$opt);  
    $data = curl_exec($ch);  
    curl_close($ch);  
    return $data;  
} 
	

    //接收事件消息
    private function receiveEvent($object)
    {
		$this->useropenid = $object->FromUserName;
		$obj = new WechatClass();
		
		$userdata = $obj->getUserInfo($this->useropenid);	
		$nickname = addslashes($userdata['nickname']);
		$unionid = $userdata['unionid'];
        $content = "";
        switch ($object->Event)
        {
            case "subscribe":
                $content = "主人，主人，终于等到你了…… 我是【小趣】，你还记得我吗？从今天开始我们就在一起了，以后就让我们彼此变得更了解吧
以后主人的购物由我来服务么么哒！~";
				//$result = $this->transmitText($object, $content);				
				//echo $result;
				
					$data = '{
						"touser":"'.$this->useropenid.'",
						"msgtype":"text",
						"text":
						{
							 "content":"'.$content.'"
						}
					}';
					$aaa = $obj->sendMsg($this->useropenid,$data);				
				
				//获取场景id
				$geteventkey = $object->EventKey; 
				//qrscene
				if(strstr($geteventkey,"qrscene")){
					$group_buy_id = str_replace("qrscene_","",$geteventkey);
					// $geturl = APIURL."/GroupBuy/autozan/nickname/{$nickname}/unionid/{$unionid}/useropenid/{$this->useropenid}/groupbuyid/{$group_buy_id}";
					// $tuanresult = $obj->curl_request($geturl);
					// $tuan_array = json_decode($tuanresult,true);
					// $msg = $tuan_array['msg'];
					
					// $data = '{
					// 	"touser":"'.$this->useropenid.'",
					// 	"msgtype":"text",
					// 	"text":
					// 	{
					// 		 "content":"'.$msg.'"
					// 	}
					// }';
					// $aaa = $obj->sendMsg($this->useropenid,$data);
                    $geturl = APIURL."/raisepic/checkout/nickname/{$nickname}/unionid/{$unionid}/useropenid/{$this->useropenid}/groupbuyid/{$group_buy_id}";
                    $tuanresult = $obj->curl_request($geturl);
                    $tuan_array = json_decode($tuanresult,true);
                    if ($tuan_array['code'] == 201) {
                        // 您不是新人用户
                        $msg = '您已关注过拼趣多，无法帮助好友助力，可以自己去商城开团享受0元免单哦！';
                    
                        $data = '{
                            "touser":"'.$this->useropenid.'",
                            "msgtype":"text",
                            "text":
                            {
                                 "content":"'.$msg.'"
                            }
                        }';
                        $obj->sendMsg($this->useropenid,$data);
                    } else if($tuan_array['code'] == 200){
                        // 发送参团验证
                        $title = '完成验证，即可为好友助力成功！';
                        $description = '点击完成验证，即可获得新人礼品一份！';
                        $url = 'https://wx.pinquduo.cn/likes.html?group_id='. $group_buy_id;
                        $img = 'https://cdn2.pinquduo.cn/1518075424358271.png';
                        $imgdata = '{
                                        "touser":"'.$this->useropenid.'",
                                        "msgtype":"news",
                                        "news":{
                                            "articles": [
                                             {
                                                 "title":"'.$title.'",
                                                 "description":"'.$description.'",
                                                 "url":"'.$url.'",
                                                 "picurl":"'.$img.'"
                                             }
                                             ]
                                        }
                                    }';
                    
                        $obj->sendMsg($this->useropenid,$imgdata);
                    }
                    
					
				}
				
				// $imgdata = '{
    //                             "touser":"'.$this->useropenid.'",
    //                             "msgtype":"news",
    //                             "news":{
    //                                 "articles": [
    //                                  {
    //                                      "title":"'.self::TITLE.'",
    //                                      "description":"'.self::DESCRIPTION.'",
    //                                      "url":"'.self::TUANURL.'",
    //                                      "picurl":"'.self::IMGURL.'"
    //                                  }
    //                                  ]
    //                             }
    //                         }';
				
				
				// $obj->sendMsg($this->useropenid,$imgdata);
				//强制退出
				exit();
                break;
			case "SCAN":

				//获取场景id
				$geteventkey = (int)$object->EventKey; 
				//qrscene
				if($geteventkey>0){              

					$group_buy_id = $geteventkey;

					// $geturl = APIURL."/GroupBuy/autozan/nickname/{$nickname}/unionid/{$unionid}/useropenid/{$this->useropenid}/groupbuyid/{$group_buy_id}";

					// $tuanresult = $obj->curl_request($geturl);
					// $tuan_array = json_decode($tuanresult,true);
					// $msg = $tuan_array['msg'];
					// $getmsg = $this->transmitText($object, $msg);

					$geturl = APIURL."/raisepic/checkout/nickname/{$nickname}/unionid/{$unionid}/useropenid/{$this->useropenid}/groupbuyid/{$group_buy_id}";
                    $tuanresult = $obj->curl_request($geturl);
                    $tuan_array = json_decode($tuanresult,true);
                    if ($tuan_array['code'] == 201) {
                        // 您不是新人用户
                        $msg = '您已关注过拼趣多，无法帮助好友助力，可以自己去商城开团享受0元免单哦！';
                    
                        $data = '{
                            "touser":"'.$this->useropenid.'",
                            "msgtype":"text",
                            "text":
                            {
                                 "content":"'.$msg.'"
                            }
                        }';
                        $obj->sendMsg($this->useropenid,$data);
                    } else if($tuan_array['code'] == 200){
                        // 发送参团验证
                        $title = '完成验证，即可为好友助力成功！';
                        $description = '点击完成验证，即可获得新人礼品一份！';
                        $url = 'https://wx.pinquduo.cn/likes.html?group_id='. $group_buy_id;
                        $img = 'https://cdn2.pinquduo.cn/1518075424358271.png';
                        $imgdata = '{
                                        "touser":"'.$this->useropenid.'",
                                        "msgtype":"news",
                                        "news":{
                                            "articles": [
                                             {
                                                 "title":"'.$title.'",
                                                 "description":"'.$description.'",
                                                 "url":"'.$url.'",
                                                 "picurl":"'.$img.'"
                                             }
                                             ]
                                        }
                                    }';
                    
                        $obj->sendMsg($this->useropenid,$imgdata);
                    }
                    
                    
                }
					
					
				
				
				// $imgdata = '{
    //                 "touser":"'.$this->useropenid.'",
    //                 "msgtype":"news",
    //                 "news":{
    //                     "articles": [
    //                      {
    //                          "title":"'.self::TITLE.'",
    //                          "description":"'.self::DESCRIPTION.'",
    //                          "url":"'.self::TUANURL.'",
    //                          "picurl":"'.self::IMGURL.'"
    //                      }
    //                      ]
    //                 }
    //             }';				
				// $obj->sendMsg($this->useropenid,$imgdata);								
				exit();
				
				
                break;					
            case "unsubscribe":
                break;
            case "CLICK":
                switch ($object->EventKey)
                {
					//售后维权
                    case "store":
                        $content = "售后维权请拨打电话0755-23217457";
                        break;
					//提交bug	
                    case "bug":
                        $content = "遇到软件上的使用问题或者建议，请发送邮件到1371616500@qq.com ，我们会有专员负责去处理问题的。另外谢谢大家对拼趣多工作的支持，祝大家生活愉快";
                        break;
						
                }
                break;
            default:
                $content = "如果需要联系客服，请到菜单【联系客服】处找到入口！！";
                break;      
				
        }
        $result = $this->transmitText($object, $content);
        return $result;
    }


    //接收文本消息
    private function receiveText($object)
    {
        $keyword = trim($object->Content);		
        $content = "如果需要联系客服，请到菜单【联系客服】处找到入口！！";
        if ($keyword == 'xxx'){ //匹配关键字
            // $content = "你好，需要什么帮助";
			$content = "   ";
        }
        $result = $this->transmitText($object, $content);
        return $result;
    }

    //回复文本消息
    private function transmitText($object, $content)
    {
        $xmlTpl = "<xml>
					<ToUserName><![CDATA[%s]]></ToUserName>
					<FromUserName><![CDATA[%s]]></FromUserName>
					<CreateTime>%s</CreateTime>
					<MsgType><![CDATA[text]]></MsgType>
					<Content><![CDATA[%s]]></Content>
				</xml>";
        $result = sprintf($xmlTpl, $object->FromUserName, $object->ToUserName, time(), $content);
        return $result;
    }

	//回复图文消息
    private function transmitNews($object, $newsArray)
    {
        if(!is_array($newsArray)){
            return;
        }
        $itemTpl = "    <item>
        <Title><![CDATA[%s]]></Title>
        <Description><![CDATA[%s]]></Description>
        <PicUrl><![CDATA[%s]]></PicUrl>
        <Url><![CDATA[%s]]></Url>
    </item>
";
        $item_str = "";
        foreach ($newsArray as $item){
            $item_str .= sprintf($itemTpl, $item['Title'], $item['Description'], $item['PicUrl'], $item['Url']);
        }
        $xmlTpl = "<xml>
<ToUserName><![CDATA[%s]]></ToUserName>
<FromUserName><![CDATA[%s]]></FromUserName>
<CreateTime>%s</CreateTime>
<MsgType><![CDATA[news]]></MsgType>
<ArticleCount>%s</ArticleCount>
<Articles>
$item_str</Articles>
</xml>";

        $result = sprintf($xmlTpl, $object->FromUserName, $object->ToUserName, time(), count($newsArray));
        return $result;
    }

    //回复音乐消息
    private function transmitMusic($object, $musicArray)
    {
        $itemTpl = "<Music>
        <Title><![CDATA[%s]]></Title>
        <Description><![CDATA[%s]]></Description>
        <MusicUrl><![CDATA[%s]]></MusicUrl>
        <HQMusicUrl><![CDATA[%s]]></HQMusicUrl>
    </Music>";

        $item_str = sprintf($itemTpl, $musicArray['Title'], $musicArray['Description'], $musicArray['MusicUrl'], $musicArray['HQMusicUrl']);

        $xmlTpl = "<xml>
    <ToUserName><![CDATA[%s]]></ToUserName>
    <FromUserName><![CDATA[%s]]></FromUserName>
    <CreateTime>%s</CreateTime>
    <MsgType><![CDATA[music]]></MsgType>
    $item_str
</xml>";

        $result = sprintf($xmlTpl, $object->FromUserName, $object->ToUserName, time());
        return $result;
    }

    //日志记录
    public function logger($log_content)
    {
    }
	

	

	
	
	
}
?>
