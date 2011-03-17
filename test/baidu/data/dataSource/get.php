<?php
if(array_key_exists('err', $_REQUEST))
header('HTTP/1.1 500 error');
if(array_key_exists("m", $_REQUEST))
echo $_SERVER['REQUEST_METHOD'];
else if(array_key_exists("key", $_GET))
echo mktime();//返回一个当前时间，用于校验cache的有消息
else
echo "ajax!";
?>