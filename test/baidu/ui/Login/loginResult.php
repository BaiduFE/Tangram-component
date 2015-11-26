<?php 
$name = $_GET['userName'];
$password = $_GET['passWord'];
if($name == 'xxxx' && $password == 'xxxx')
echo "<html><script>parent.bdPass.TemplateItems.{$_POST['callback']}.config.onSuccess();</script><body></body></html>";
else 
echo "<html><script>parent.bdPass.TemplateItems.{$_POST['callback']}.config.onFailure();</script><body></body></html>";