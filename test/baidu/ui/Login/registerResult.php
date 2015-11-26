<?php 
$name = $_GET['userName'];
if($name == 'xxxx')
echo "<html><script>parent.bdPass.TemplateItems.{$_POST['callback']}.config.onSuccess();</script><body></body></html>";
else 
echo "<html><script>parent.bdPass.TemplateItems.{$_POST['callback']}.config.onFailure();</script><body></body></html>";