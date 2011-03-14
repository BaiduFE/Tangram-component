<?php
//		var json = {
//
//			text: "根节点",
//			children:[],
//			isExpand: true
//		
//		}
//
//		
//	/*for(var i = 0;i < 500; i ++){
//		var node = {
//			text: "节点"+i,
//			type: "trunk",
//			isExpand: true
//		}
//		json.children.push(node);
//	}
$json = "var json = {
	text: '根节点',
	children:[";
$nodes = array();
for ($i = 0; $i < 500; $i++) {
	$nodes[] = "{type:'trunk',id:'node".$i."', text: '节点" . $i . "'}";
}
$json .= join(',', $nodes) . "],isExpand: true};";
echo $json;
?>