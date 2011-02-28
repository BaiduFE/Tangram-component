<?php
/**
 * 使用注意事项：一般情况下不会所产生的测试结果表格内容不会有问题，
 * 问题的引入是没有对每次添加的数据做浏览器判断，在正常情况下浏览器的顺序恒定不变的
 * 当不同浏览器运行的测试内容不同的情况下，如ie8下采用filter=baidu.fx，
 * 而chrome下采用filter=baidu.fx.collaplse
 * 在添加浏览器的时候按照顺序会先添加chrome，再添加ie8
 * 那么当chrome下用例只有baidu.fx.collapse的时候，
 * 由于他会默认先找到的浏览器为chrome，那么与它相邻的ie8的baidu.fx.current的内容会左移到chrome下。
 * 这个跟存储数据的格式有关系：caseList
 * 							/         \
 *               baidu.fx.collapse    baidu.fx.current
 *              /           \             /            \
 *          chrome          ie8         null           ie8
 *         /  |  \         / |  \    (supposed       /   |  \
 *    fail  total hostInfo          to be chrome)  fail total hostInfo
 *
 *
 *
 * 不直接使用<style type ="text/css">来设置css是因为有的邮件客户端会过滤这样的信息
 *
 * ***/

function geneHTML($caseList){
	date_default_timezone_set('PRC');
	$url = (isset ($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '') . $_SERVER['PHP_SELF'];
	require_once 'config.php';
	$report_path = CONFIG::$HISTORY_REPORT_PATH.'/ui';
	$html = "<!DOCTYPE HTML>
	<head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /></head>
	<frame>
	<div>
	 <h2 align='center'>自动化用例测试结果".date('Y-m-d H:i:s')."</h2>
	 <table>
	  <thead>
	    <th  bgcolor='#5E740B' style='color:#fff;horizontal-align: right;font-weight: bold;align: center;font-size: 18px;background-color: #0d3349;margin:0;padding:0.5em 0 0.5em 1em;text-shadow: rgba(0, 0, 0, 0.5) 4px 4px 1px;'>用例名称</th>".getThBrowser($caseList).
	   "</thead>".getTrCase($caseList).
	 "</table>
	 </div>
	 <br><br>
	<a href='$report_path' style='font:normal bolder 12pt Arial'>详情请点击这里</a>
	 </frame></HTML>";
	$html = formatHTML($html);
	return $html;
}

function formatHTML($html){
	$tablePattern = "<table color='#ffffff' style='color:#ffffff;border-collapse: separate;border-spacing: 1pt;border-right: 1px dashed black;align:center'>";
	$thPattern = "<th colspan='3' bgcolor='#0d3349' style='color:#fff;horizontal-align: right;font-weight: bold;align: center;font-size: 18px;background-color:#0d3349;margin:0;padding:0.5em 0 0.5em 1em;".
	"text-shadow: rgba(0, 0, 0, 0.5) 4px 4px 1px;' ";
	$trPattern = "<tr style='border:solid 1pt;horizontal-align:right;font-size:15px;align:center;font-family:Calibri,Helvetica,Arial;text-align:center;'>";
	$tdPattern = "<td bgcolor='#0d3349'>";
	//	$tdPattern = "<td style='background-color:#0d3349;border-top-left-radius:5px'>";
	$html = str_replace("<table>",$tablePattern,$html);
	$html = str_replace("<th colspan='3'",$thPattern,$html);
	$html = str_replace("<tr>",$trPattern,$html);
	$html = str_replace("<td>",$tdPattern,$html);
	return $html;
}

function getThBrowser($caseList){//创建浏览器相关单元格
	$thBrowser = '';
	foreach ($caseList as $casename => $casedetail) { //每一个用例
		foreach ($casedetail as $b => $info) {
			$thBrowser .= "<th colspan='3'>$b</th>";
		}
		break;
	}
	return $thBrowser;
}


function getTrCase($caseList){//创建case名对应的单元格
	$trCase = '';
	foreach ($caseList as $casename => $caseDetail) { //每一个用例
		$trCase .= "<tr><td>$casename</td>";
		foreach ($caseDetail as $br => $infos) { //$b为browser名字,$info为详细信息
			$fail = $infos['fail'];
			$total = $infos['total'];
			$path = '';

			if ($fail > 0) {
				$trCase .= "<td bgcolor='#710909' style='background-color:#710909;'>主机: {$infos['hostInfo']}</td>";
				$path .= str_replace('_', '.', $casename);
				$url_this = "http://" . $host = isset ($_SERVER['HTTP_X_FORWARDED_HOST']) ? $_SERVER['HTTP_X_FORWARDED_HOST'] : (isset ($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '') . $_SERVER['PHP_SELF'];
				$trCase .= "<td bgcolor='#710909'><a href='$url_this/../run.php?case=$path'>失败用例数:$fail</a></td><td bgcolor='#710909'>用例总数: {$fail}</td>";
			} else
			$trCase .= "<td bgcolor='#5E740B' style='background-color:#5E740B;'>主机: {$infos['hostInfo']}</td><td bgcolor='#5E740B' style='background-color:#5E740B;'>失败用例数:$fail</td><td bgcolor='#5E740B'>用例总数: {$total}</td>";
		}

		$trCase .= "</tr>";
	}
	return $trCase;
}

?>