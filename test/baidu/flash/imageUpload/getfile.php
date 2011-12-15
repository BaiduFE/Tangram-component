 <?php
 
/*if ( ($_FILES["file"]["size"] < 200000) && $_FILES["uploadDataField"] )
 {
     $filename = $_FILES["uploadDataField"]["name"]; 
     $out['code'] = 0;
     $out['filename'] = $filename;
     $out['des'] = $_POST["aaa"];
     $out['path'] = "upload/test.png";   
     move_uploaded_file($_FILES["uploadDataField"]["tmp_name"], "upload/test.png" );
 }
 else{
     $out['error'] = 1;
     $out['info'] = 'Invalid file';
 }
 echo json_encode($out);*/
ob_start();
var_dump($_FILES);           
$str=ob_get_clean();         
file_put_contents('1.txt',$str, LOCK_EX);
?>
