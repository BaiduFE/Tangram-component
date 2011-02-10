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

$DEBUG = false;

//分析获取当前项目源码路径
$ss = explode('/', substr($_SERVER['SCRIPT_NAME'], 1));
$source_path = $_SERVER['DOCUMENT_ROOT'].'/'.$ss[0].'/src/';
$base_path = $_SERVER['DOCUMENT_ROOT'].'/tangram/src/';
$cached = array();

$f = explode(',', $_GET['f']);
$e = array_key_exists('e', $_GET) ? $_GET['e'] : 0;

$circle = array();
$include = gis_withsplit($f);

if($e !== 0){
	$circle = array();
	$exclude = gis_withsplit(explode(',', $e));
	foreach ($include as $d => $c){
		if(array_key_exists($d, $exclude)){
			unset($include[$d]);
		}
	}
}

foreach ($include as $d => $c){
	print $c;
}

/**
 * 因测试需要更新的引入方法，domain支持多个通过,分割，支持第二参数忽略已经引入内容，递归判定跳过的入口必须提前
 * @param $domain 期望载入的依赖库
 * @param $exclude 期望排除的依赖库
 * @param $parent 解决相互依赖问题
 */
function get_import_srcs($domain){
	global $DEBUG, $circle;
	if($DEBUG) print "分析$domain<br />";

	if(array_search($domain, $circle)) return array();//如果已经被分析过则直接返回
	array_push($circle, $domain);

	$include = array();
	$cnts = get_src_cnt($domain);
	$cnt = $cnts['c'];
	$is = $cnts['i'];
	if(sizeof($is) > 0)
	foreach($is as $d){
		$include = array_merge($include, get_import_srcs($d));
	}

	//因为依赖关系的前后联系，最后在include中加入当前domain
	$include[$domain] = $cnt;
	return $include;
}

/**
 * 切割支持f和e参数的','分割
 * @param unknown_type $domains
 */
function gis_withsplit($domains){
	$include = array();
	foreach ($domains as $d){//支持切分
		$include = array_merge($include, get_import_srcs($d));
	}
	return $include;
}

/**
 * 读取源文件内容，支持缓存
 * @param string $domain
 */
function get_src_cnt($domain){
	global $source_path, $base_path, $DEBUG, $cached;
	if($DEBUG)
	print "start read file $domain<br />";
	if(!array_key_exists($domain, $cached)){
		$path = join('/', explode('.', $domain)).'.js';
		//文件在当前项目存在则取当前项目，否则取tangram项目
		$cnt = file_get_contents((file_exists($source_path.$path) ? $source_path : $base_path).$path);
		
		$is = array();
		//正则匹配，提取所有(///import xxx;)中的xxx
		preg_match_all('/\/\/\/import\s+([^;]+);?/ies', $cnt, $is, PREG_PATTERN_ORDER);
		
		//移除//，顺便移除空行
		$cnt = preg_replace('/\/\/.*/m', '', $cnt);
		//移除/**/
		$cnt = preg_replace('/\/\*.*\*\//sU', '', $cnt);		
		
		$cached[$domain] = array('c'=>$cnt, 'i'=>$is[1]);
	}
	return $cached[$domain];
}
?>
