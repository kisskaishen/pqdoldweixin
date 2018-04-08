<?php
/*
    方倍工作室 https://www.cnblogs.com/txw1958/
    CopyRight 2014 www.doucube.com All Rights Reserved
*/

// error_reporting(E_ALL);
include_once './config/qrcodeconfig.php';
include_once './class/WechatClass.class.php';

class class_weixin_adv
{
    var $appid = "";
    var $appsecret = "";
    var $access_token = "";

    //构造函数，获取Access Token
    public function __construct($appid = NULL, $appsecret = NULL)
    {
        if($appid){
            $this->appid = $appid;
        }
        if($appsecret){
            $this->appsecret = $appsecret;
        }

        //hardcode
//        $this->lasttime = 1395049256;
//        $this->access_token = "nRZvVpDU7LxcSi7GnG2LrUcmKbAECzRf0NyDBwKlng4nMPf88d34pkzdNcvhqm4clidLGAS18cN1RTSK60p49zIZY4aO13sF-eqsCs0xjlbad-lKVskk8T7gALQ5dIrgXbQQ_TAesSasjJ210vIqTQ";
//
//        if (time() > ($this->lasttime + 7200)){
//            $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".$this->appid."&secret=".$this->appsecret;
//            $res = $this->https_request($url);
//            $result = json_decode($res, true);
//            //save to Database or Memcache
//            $this->access_token = $result["access_token"];
//            $this->lasttime = time();
//        }
        $wechatObj = new \wechat\WechatClass();
        $this->access_token = $wechatObj->getAccessToken($appid, $appsecret);
//   	$this->access_token = '7_9iV58abDPv0TpUiSSVruMQoJfzv2Z-cqFC9qHhvKGLirxjPNsQq0P0gZ69GqLITAaZVOYEDqcD_l1oCPI-ys3Ri0v-F3NGY4ddPGIWqxB53gJOUOcbePId27QKFWdMPh8O9v90zc1Y_ap1s_DKYgAAAWDR';
    }

    //获取关注者列表
    public function get_user_list($next_openid = NULL)
    {
        $url = "https://api.weixin.qq.com/cgi-bin/user/get?access_token=".$this->access_token."&next_openid=".$next_openid;
        $res = $this->https_request($url);
        return json_decode($res, true);
    }

    //获取用户基本信息
    public function get_user_info($openid)
    {
        $url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=".$this->access_token."&openid=".$openid."&lang=zh_CN";
        $res = $this->https_request($url);
        return json_decode($res, true);
    }

    //创建菜单
    public function create_menu($data)
    {
        $url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=".$this->access_token;
        $res = $this->https_request($url, $data);
        return json_decode($res, true);
    }

    //发送客服消息，已实现发送文本，其他类型可扩展
    public function send_custom_message($touser, $type, $data)
    {
        $msg = array('touser' =>$touser);
        switch($type)
        {
            case 'text':
                $msg['msgtype'] = 'text';
                $msg['text']    = array('content'=> urlencode($data));
                break;
        }
        $url = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=".$this->access_token;
        return $this->https_request($url, urldecode(json_encode($msg)));
    }

    //生成参数二维码
    public function create_qrcode($scene_type, $scene_id)
    {
        switch($scene_type)
        {
            case 'QR_LIMIT_SCENE': //永久
                $data = '{"action_name": "QR_LIMIT_SCENE", "action_info": {"scene": {"scene_id": '.$scene_id.'}}}';
                break;
            case 'QR_SCENE':       //临时
                $data = '{"expire_seconds": 1800, "action_name": "QR_SCENE", "action_info": {"scene": {"scene_id": '.$scene_id.'}}}';
                break;
        }
        $url = "https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=".$this->access_token;
        $res = $this->https_request($url, $data);
        $result = json_decode($res, true);
        return "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=".urlencode($result["ticket"]);
    }
    
    //创建分组
    public function create_group($name)
    {
        $data = '{"group": {"name": "'.$name.'"}}';
        $url = "https://api.weixin.qq.com/cgi-bin/groups/create?access_token=".$this->access_token;
        $res = $this->https_request($url, $data);
        return json_decode($res, true);
    }
    
    //移动用户分组
    public function update_group($openid, $to_groupid)
    {
        $data = '{"openid":"'.$openid.'","to_groupid":'.$to_groupid.'}';
        $url = "https://api.weixin.qq.com/cgi-bin/groups/members/update?access_token=".$this->access_token;
        $res = $this->https_request($url, $data);
        return json_decode($res, true);
    }
    
    //上传多媒体文件
    public function upload_media($type, $file)
    {
        $data = array("media"  => "@".dirname(__FILE__).'\\'.$file);
        $url = "https://file.api.weixin.qq.com/cgi-bin/media/upload?access_token=".$this->access_token."&type=".$type;
        $res = $this->https_request($url, $data);
        return json_decode($res, true);
    }

    //https请求（支持GET和POST）
    protected function https_request($url, $data = null)
    {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
        if (!empty($data)){
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        }
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($curl);
        curl_close($curl);
        return $output;
    }
}

$weixin = new class_weixin_adv("wxdbc22996638a2c73", "d259ccee138067613a26971092c6e48d");
$data = '{
     "button":[
     {
          "type":"view",
          "name":"下载APP",
          "url":"http://a.app.qq.com/o/simple.jsp?pkgname=com.jumper.spellgroup"
      },
      {
           "type":"view",
           "name":"进入商城",
           "url":"https://wx.pinquduo.cn"
           
      },
      {
           "name":"联系客服",
           "sub_button":[
            {
               "type":"view",
               "name":"商家入驻",
               "url":"http://www.pinquduo.cn/Home/Store/index"
            },
            {
               "type":"view",
               "name":"退补差价",
               "url":"http://wx.pinquduo.cn/refund_difference1.html"
            },
            {
               "type":"click",
               "name":"售后维权",
               "key":"store"
            },			
            {
               "type":"view",
               "name":"联系客服",
               "url":"http://56038536.im.m.weimob.com"
            },
            {
               "type":"view",
               "name":"我的订单",
               "url":"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdbc22996638a2c73&redirect_uri=https://wx.pinquduo.cn/goods_order.html&response_type=code&scope=snsapi_userinfo&state=123&connect_redirect=1#wechat_redirect"
            }
			
			]
       }]
}';
echo date('Y-m-m H:i:s');
var_dump($weixin->create_menu($data));

?>
