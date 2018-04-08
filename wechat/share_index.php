<?php
    error_reporting(E_ALL^E_NOTICE^E_WARNING);
    require_once "share_config.php";
    $jssdk = new JSSDK('wxdbc22996638a2c73','d259ccee138067613a26971092c6e48d');
    $signPackage = $jssdk->GetSignPackage();
  
    class Config{  
        var $appId;  
        var $timestamp;  
        var $nonceStr;  
        var $signature;  
        var $url;
    }  
      
    $config = new Config();  
      
    $config -> appId = $signPackage["appId"];  
    $config -> timestamp = $signPackage["timestamp"];  
    $config -> nonceStr = $signPackage["nonceStr"];  
    $config -> signature = $signPackage["signature"];
    $config -> url = $signPackage["url"]; 
      
    echo json_encode($config);
?>