<?php
   # phpinfo();
   $filename = $_FILES["uploadDataField"]["name"];  
   $res = "{\"code\":\"0\", \"name\":\"";
   $res .= $filename;
   $res .= "\"}";
   move_uploaded_file($_FILES["uploadDataField"]["tmp_name"], "upload/" . $_FILES["uploadDataField"]["name"]);
   echo $res;
   
   
   //move_uploaded_file($_FILES["uploadDataField"]["tmp_name"], "upload/" . $_FILES["file"]["name"]);
   //move_uploaded_file($_FILES["uploadDataField"]["name"], "upload/" . $_FILES["uploadDataField"]["name"]);
?>
