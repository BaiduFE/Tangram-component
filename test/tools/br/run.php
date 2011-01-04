<?php
require_once "case.class.php";
$projroot = '../../../';
$srcpath = $projroot.'src/';
$testpath = $projroot.'test/';
$c = new Kiss($projroot, $_GET['case']);
$runsrc = !array_key_exists('type', $_GET) || $_GET['type']!='release';
$title = $c->name;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php print("run case $title");?></title>
<?php $c->print_js(); ?>
</head>
<body>
<?php if($c->js_frame){?>
<h1 id="qunit-header"><?php print($c->name);?></h1>
<h2 id="qunit-banner"></h2>
<h2 id="qunit-userAgent"></h2>
<ol id="qunit-tests"></ol>
<?php }?>
</body>
</html>
