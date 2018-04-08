<?php
	/** 
    * 图片合并 
    **/
	$font = 'yahei.ttf';
	


        $ewmPath = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQG98TwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyQzdmLTBUdHhiQS0xd1hVMzFwMXgAAgS75oFZAwSAUQEA';
        // 背景图片宽度
        $bg_w    = 600;
        // 背景图片高度
        $bg_h    = 700; // 背景图片高度
        //二维码宽
        $ewmWidth = 200;
        //二维码高
        $ewmHeight = 200;
        //商品图片宽度
        $goodWidth = 590;
        //商品图片高度
        $goodHeight = 368;
        //二维码距离右边框距离
        $ewmLeftMargin = 20;
        //二维码距离底部框距离
        $ewmBottomMargin = 24;
        // 背景图片
        $background = imagecreatetruecolor($bg_w,$bg_h);
        // 为真彩色画布创建白色背景，再设置为透明
        $color   = imagecolorallocate($background, 255, 255, 255);
        //颜色填充
        imagefill($background, 0, 0, $color);
        //透明图片
        imageColorTransparent($background, $color);

        // 开始位置X
        $start_x    = intval($bg_w-$ewmWidth-$ewmLeftMargin);
        // 开始位置Y
        $start_y    = intval($bg_h-$ewmHeight-$ewmBottomMargin);
        // 宽度
        $pic_w   = intval($ewmWidth);
        // 高度
        $pic_h   = intval($ewmHeight);
        //获取图片文件的内容
        $pic_path    = file_get_contents($ewmPath);
        //创建图片资源
        $resource   = imagecreatefromstring($pic_path);
        //获取图片资源文件的宽
        $image_width	= imagesx($resource);
        //获取图片资源文件的高
        $image_height	= imagesy($resource);
        //图片合并
        imagecopyresized($background,$resource,390,$start_y,0,0,$pic_w,$pic_h,imagesx($resource),imagesy($resource));
        //创建down图片资源
        $downresource = imagecreatefrompng('down.png');
        //图片合并
        imagecopyresized($background,$downresource,480,450,0,0,18,20,imagesx($downresource),imagesy($downresource));
        //商品图片资源
        $goodresource = imagecreatefromjpeg('http://cdn.pinquduo.cn/15017401102.jpg');
        //图片合并
        imagecopyresized($background,$goodresource,5,5,0,0,$goodWidth,$goodHeight,imagesx($goodresource),imagesy($goodresource));

        //文字颜色
        $fontcolor = imagecolorallocate($background, 204,204,204);
        //用户头像
        $head_pic = 'http://wx.qlogo.cn/mmopen/zZSYtpeVianR8v7QHKm3qO6wydccndNKGMiclrcOwUjvicllW3ibc3Is4QBok0CyuGmF2tX1OEf95WO6umS1ol7dibfKoab8oEVlw/0';

        //获取图片文件的内容
        $pic_path    = file_get_contents($head_pic);
        //创建图片资源
        $resource   = imagecreatefromstring($pic_path);
        //获取图片资源文件的宽
        $image_width	= imagesx($resource);
        //获取图片资源文件的高
        $image_height	= imagesy($resource);
        //图片合并
        imagecopyresized($background,$resource,20,395,0,0,60,60,imagesx($resource),imagesy($resource));
        //用户头像遮罩
        $head_pic = 'square_head@2x.png';
        //获取图片文件的内容
        $pic_path    = file_get_contents($head_pic);
        //创建图片资源
        $resource   = imagecreatefromstring($pic_path);
        //图片合并
        imagecopyresized($background,$resource,20,395,0,0,60,60,imagesx($resource),imagesy($resource));

        imagettftext($background,17,0,$start_x,intval($start_y-39),$fontcolor,$font,"长按二维码为我助力");

        imagettftext($background,20,0,20,606,imagecolorallocate($background, 226,0,37),$font,'快来拼趣多秒购0元商品');

        imagettftext($background,19,0,20,663,imagecolorallocate($background, 226,0,37),$font,'￥');

        imagettftext($background,40,0,50,663,imagecolorallocate($background, 226,0,37),$font,'0');


        header("Content-type: image/jpg");

        imagejpeg($background);

        exit;



?>