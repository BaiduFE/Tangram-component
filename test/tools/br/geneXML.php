<?php
$DEBUG = false;
function generateXML($post, $server) {
	global $DEBUG;
	if($DEBUG)
	echo "start generate xml<br />";
	$dom = new DOMDocument('1.0', 'utf-8');
	$report = $dom->appendChild($dom->createElement('report'));

	require_once 'config.php';
	$cfg = preg_split('/[&=]/', $_POST['config']);
	$b = '';
	foreach($cfg as $key=>$item){
		if($item == 'browser'){
			$b = $cfg[$key + 1];
			break;
		}
	}
	if($b == ''){
		if($DEBUG) echo "Fail get browser info from config<br />";
		return;
	}
	if($DEBUG)echo "browser : $b<br />";
	foreach ($post as $kiss => $info) {
		if($DEBUG)echo "analysis kiss info : $kiss $info<br />";
		if ($kiss == 'config')
		continue;
		$testResult = $report->appendChild($dom->createElement('testResult'));
		$caseName = $testResult->appendChild($dom->createAttribute('caseName'));
		$testResult->setAttribute('caseName', $kiss);
		$browser = $testResult->appendChild($dom->createAttribute('browserInfo'));
		//		$testResult->setAttribute('browserInfo', $server['HTTP_USER_AGENT']);
		$testResult->setAttribute('browserInfo', $b);
		$host = $testResult->appendChild($dom->createAttribute('hostInfo'));
		//		$testResult->setAttribute('hostInfo', $server['REMOTE_ADDR']);
		$testResult->setAttribute('hostInfo', Config::$BROWSERS[$b][0]);

		$result = explode(",", $info); //拆分
		$failNumber = $testResult->appendChild($dom->createAttribute('failNumber'));
		$testResult->setAttribute('failNumber', $result[0]);
		$totalNumber = $testResult->appendChild($dom->createAttribute('totalNumber'));
		$testResult->setAttribute('totalNumber', $result[1]);
	}
	if (!file_exists('report')) {
		mkdir('report');
	}
	$dom->save('report/' . $b . '.xml');
}

function interXML() {
	$fs = scandir('report');
	require_once 'config.php';
	foreach (Config :: $BROWSERS as $b => $machine) {
		if (!in_array($b . '.xml', $fs)) {
			print "none browser xml exist $b";
			return;
		}
	}
	$caseList = array ();
	foreach ($fs as $f) {
		if (substr($f, 0, 1) == '.')
		continue;
		$xmlFile = simpleXML_load_file("report/$f");
		foreach ($xmlFile as $testResult) {
			$browser = $testResult['browserInfo'];
			$host = $testResult['hostInfo'];
			$caseName = $testResult['caseName']; //得到用例名称
			settype($caseName, "string"); //$caseName本来类型为object，需要做转换
			$fail = $testResult['failNumber'];
			$total = $testResult['totalNumber'];
			settype($browser, "string");
			settype($host, "string");
			settype($fail, "string");
			settype($total, "string");
			if (!array_key_exists($caseName, $caseList)) { //如果这个用例不存在
				$caseInfo = array (
					'hostInfo' => $host,
					'fail' => $fail,
					'total' => $total
				);
				$caseList[$caseName] = array (
				$browser => $caseInfo
				);
			} else { //否则添加到相应的用例中去
				$foundCase = $caseList[$caseName]; //找到用例名称对应的array，$caseName为key

				if (!array_key_exists($browser, $foundCase)) { //如果没有该浏览器信息，则添加
					$caseList[$caseName][$browser] = array (
						'hostInfo' => $host,
						'fail' => $fail,
						'total' => $total
					);
				} else {
					$foundBrowser = $foundCase[$browser]; //有这个浏览器
					array_push($foundBrowser, array (
						'hostInfo' => $host,
						'fail' => $fail,
						'total' => $total
					));
				}
			}

		}
		unlink("report/$f");
	}
	rmdir("report");
	return $caseList;
}



?>