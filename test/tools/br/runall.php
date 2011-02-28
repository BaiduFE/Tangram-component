<?php
require 'config.php';

function run($b, $filter='*', $debug = false){
	$browser = Config::$BROWSERS[$b];
	$host = $debug ? 'localhost' : $browser[0];
	$path = $debug ? 'C:\\Users\\yangbo\\AppData\\Local\\Google\\Chrome SxS\\Application\\chrome.exe' : $browser[1];
	$filter = $debug ? 'baidu.ajax' : $filter;

	$url = "http://".$_SERVER['SERVER_ADDR'].":8000".substr($_SERVER['PHP_SELF'], 0, -11)."/list.php?batchrun=true";
	$url .= ",browser=$b,filter=$filter,mail=true";
	if(array_key_exists('quirk', $_GET))
	$url .= ",quirk=true";
	if(array_key_exists('mail', $_GET))
	$url .= ",mail=true";

	require_once 'lib/Staf.php';
	$result = Staf::process_start($path, $url, $host);
}

if(file_exists('report')){
	$reports = scandir('report');
	print 'on batch run, please waiting : '. (sizeof($reports)-2);
	return;
}else{
	mkdir('report');
}

/*记录运行时信息*/
$b = in_array("browser", $_GET) ? $_GET['browser'] : 'all';
if($b !='all'){
	run($b);
}else{
	foreach(Config::$BROWSERS as $b=>$i){
		run($b);
	}
}
?>