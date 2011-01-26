<?php
if(array_key_exists("key", $_GET))
echo mktime();//返回一个当前时间，用于校验cache的有消息
else
echo "ajax!";
?>