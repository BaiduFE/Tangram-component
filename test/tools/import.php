<?php
header("Content-type: text/javascript; charset=utf-8");
/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: import.php
 * author: berg
 * version: 1.0
 * date: 2010/07/18 23:57:52
 *
 * @fileoverview * import.js的php版本
 * 接受一个f参数，格式和import.js相同，自动合并js并输出
 * 此外，本脚本支持引入一个包所有文件（其实也就是一个目录下的所有js文件，**不递归**）
 * IE下，get请求不能超过2083字节，请注意。
 */

//$DEBUG = true;
$DEBUG = false;

$MATCHED = array();

$IMPORTED = array();

echo importTangram(explode(',', $_GET['f']), false);

// 无敌旋转分隔线

function importTangram($files, $returnFile = true){
	global $MATCHED, $DEBUG, $IMPORTED;

	$output = "";

	if(is_string($files)){
		$files = array($files);
	}else if(!is_array($files)){
		return $output;
	}
//	if($DEBUG)
//	var_dump($files);
	$srcpath = '../../src/';
	$basepath = '../../../tangram/src/';
	if(!file_exists($basepath)){
		$basepath = $srcpath;
	}
	foreach($files as $file){
		if(strrpos($file, '*')){
			$output .= importTangram(getPackage(str_replace(array(".", '*'), array('/', ''), $file)));
//			var_dump(str_replace(array(".", '*'), array('/', ''), $file));
		}elseif(in_array($file, $IMPORTED)){
			continue;
		}else{
			$IMPORTED[] = $file;
			$file = str_replace(".", '/', $file) . ".js";

			/*base analysis*/
			if(substr($file, 0, 8) != 'baidu/ui' 
				&& substr($file, 0, 8) != 'baidu/fx'
				&& substr($file, 0, 10) != 'baidu/data'){
				$file = $basepath.$file;
			}else{
				$file = $srcpath.$file;
			}
			if($DEBUG)
			echo "Importing: " . $file . ", returnFile $returnFile\n";
			if(!in_array($file, $MATCHED)){
				$content = file_get_contents($file);
				if(!$content){
					if($DEBUG)
					echo "no content... \n;";
					continue;
				}
				$MATCHED[] = $file;
				$matches = array();
				//去掉注释
				$content = trim(preg_replace("/\/\*(.*?)\*\//ies", "", $content));
				$output .= preg_replace("/\/\/\/import\s+([\w\-\$]+(\.[\w\-\$]+)*);?/ies", "importTangram('\\1')", $content);
			}
		}
	}
	return $output;
}

function getPackage($packagePath){
	$files = array();
	if ($handle = opendir($packagePath)) {
		while ($file = readdir($handle)) {
			if(strrpos($file, ".js"))
			$files[] = substr($packagePath . $file, 0, -3); //把最后的.js去掉，适应importTangram的输入
		}
		closedir($handle);
	}
	return $files;
}
