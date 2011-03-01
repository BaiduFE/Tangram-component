<?php
$debug = true;
//$debug = false;
/*非批量运行*/
if (!file_exists('report')) {
	if (!$debug)
	return;
	else
	mkdir('report');
}

require_once 'geneXML.php';
generateXML($_POST, $_SERVER);

/*如果全部运行完毕，发送邮件*/
$kissList = interXML();
require_once 'geneHTML.php';
if(sizeof($kissList)>0){
	$html =	geneHTML($kissList);
	$config = $_POST['config'];
	if(sizeof(explode('mail=true', $config))>1){
		require_once 'geneHistory.php';
		geneHistory($html);
		require_once 'smail.php';
		sendmail($html, true);
	}

	if(!$debug){
		require_once 'lib/Staf.php';
		$host = array();
		foreach(Config::$BROWSERS as $b=>$f){
			$h = $f[0];
			if(!in_array($f[0], $host)){
				Staf::process('stop all confirm', $h);
				Staf::process('free all', $h);
			}
			array_push($host, $f[0]);
		}
	}
}
?>