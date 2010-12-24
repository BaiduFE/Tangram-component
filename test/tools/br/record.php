
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
//if ($debug)
//print "browser : $b \r\n";
require_once 'geneXML.php';
generateXML($_POST, $_SERVER);

/*如果全部运行完毕，发送邮件*/
$kissList = interXML();
require_once 'geneHTML.php';
if(sizeof($kissList)>0){
	$html =	geneHTML($kissList);
	require_once 'geneHistory.php';
	geneHistory($html);
	$config = $_POST['config'];
	$r = new Request($config);
	if($r->contain('mail')){
		require_once 'smail.php';
		sendmail($html, true);
		//	if (PEAR::isError($mail_object)) {
		//		echo("<p>" . $mail_object->getMessage() . "</p>");
		//	} else {
		//		echo("<p>送信成功!</p>");
		//	}
	}

	if(!$debug){
		require_once 'lib/Staf.php';
		Staf::process('stop all confirm', '10.81.23.218');
		Staf::process('stop all confirm', '10.81.23.219');
		Staf::process('stop all confirm', '10.81.23.220');
		Staf::process('free all', '10.81.23.218');
		Staf::process('free all', '10.81.23.219');
		Staf::process('free all', '10.81.23.220');
	}
	//	//	unset($GLOBALS['RUNNING']);
}
?>