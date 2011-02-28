<?php
function geneHistory($html){
	require_once 'config.php';
	$reportpath = CONFIG::$HISTORY_REPORT_PATH.'/ui';
	if (!file_exists($reportpath))
	mkdir($reportpath,0777,true);
	date_default_timezone_set('PRC');
	$time = date('Y-m-d-H-i-s');
	$file_name = "$reportpath/$time.html";
	$file_pointer = fopen($file_name, "w");
	fwrite($file_pointer, $html);
	fclose($file_pointer);
}
?>