<?php echo $_GET['callback'].'({

         error_no : "0",  

         param_in : { 

             param1_name : "username", 

             param1_value : "", 

             param2_name : "loginpass", 

             param2_value : "", 

             param3_name : "verifypass",

             param3_value : "", 

             param4_name : "sex", 

             param4_value : "0",

             param5_name : "email", 

             param5_value : "",

             param6_name : "verifycode", 

             param6_value : ""

         },

         param_out :{  

             param1_name : "token",

             param1_contex : "58d432c039e797e558558dcac84b3c07",

             param2_name : "tpl",

             param2_contex : "pp", 

             param3_name : "crypt",

             param3_contex : "fd60604bdfa82118de08d9fc",

             param4_name : "k1344489599",

             param4_contex : "1303193101",

                         param5_name : "time",

                         param5_contex : "1303193101"



         },

         jslink: upath + "resp.php",

         sourceUrl: "/?apireg&time=&token=&tpl=pp&callback=bd__cbs__e6xgdy",

         

         more_param_in : { 

              param1_name : "u"

         },



         more_ext : {

             ext1_name : "\u5fd8\u8bb0\u5bc6\u7801",

             ext1_url : "http://passport.baidu.com/?getpass_index",

             ext2_name : "\u95ee\u9898\u53cd\u9988",

             ext2_url :  "http://passport.baidu.com/?question"

         }

    })';
