<?php

require('QQPay.php');

$qqPay = new QQPay();

$order = array(
	'order_sn' => '201704012340' . mt_rand(1000,9999),
	'order_amount' => 0.1
);
$script = $qqPay->getQQPay($order);

echo $script;
