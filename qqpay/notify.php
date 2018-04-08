<?php

require('QQPay.php');

$qqPay = new QQPay();

$script = $qqPay->checkNotify();

echo $script;