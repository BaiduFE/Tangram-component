<?php
	$p1 = $_POST['select1'];
	if ($p1=="")
	{
		header('HTTP/1.1 500 error');
	}
	else {
		echo $p1;
	}
?>