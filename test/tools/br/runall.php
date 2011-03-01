<?php
require 'config.php';

function run($b, $filter='*', $debug = false){
	$browser = Config::$BROWSERS[$b];
	$host = $debug ? 'localhost' : $browser[0];
	$path = $debug ? 'C:\\Users\\yangbo\\AppData\\Local\\Google\\Chrome SxS\\Application\\chrome.exe' : $browser[1];
	$filter = $debug ? 'baidu.ajax' : $filter;

	$url = "http://".$_SERVER['SERVER_ADDR'].":8000".substr($_SERVER['PHP_SELF'], 0, -11)."/list.php?batchrun=true";
	$url .= "^&browser=$b^&filter=$filter^&mail=true^&showsrconly=true";//FIXME 命令行启动，此处所有&必须进行转义，可以考虑在STAF中解决
	if(array_key_exists('quirk', $_GET))
	$url .= "&quirk=true";

	require_once 'lib/Staf.php';
	echo 'host : '.$host."\npath : ".$path."\nurl  :".$url;
	$result = Staf::process_start($path, $url, $host);
}
//干掉其他运行环境
Config::StopAll();
if(file_exists('report')){
	$reports = scandir('report');
	echo 'on batch run, please waiting : '. (sizeof($reports)-2);
	return;
}else{
	mkdir('report');
}
$filter = array_key_exists('filter', $_GET) ? $_GET['filter'] : '*';
/*记录运行时信息*/
$b = in_array("browser", $_GET) ? $_GET['browser'] : 'all';
if($b !='all'){
	run($b);
}else{
	foreach(Config::$BROWSERS as $b=>$i){
		run($b, $filter);
	}
}
?>