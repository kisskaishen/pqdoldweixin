<?php
    header('Content-type:text/json');
    $json = file_get_contents('MsgEx.json');
    echo $json;
?>
