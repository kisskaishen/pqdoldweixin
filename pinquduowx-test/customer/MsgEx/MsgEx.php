<?php
    header('Content-type:text/json');
    $MsgEx_items = $_POST['MsgEx_items'];
    $MsgEx_key = $_POST['MsgEx_key'];
    $MsgEx = array("$MsgEx_key" => $MsgEx_items);
    $json = json_encode($MsgEx);
    file_put_contents('MsgEx.json',$json);
    echo $json;
?>