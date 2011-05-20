<?php 
$path = dirname(__FILE__);
$handle = fopen($path."/resp.js", "r") or exit("Unable to open file!");
while(!feof($handle)){
	$line .= fgets($handle);
}
echo $line;	
fclose($handle); 
?>