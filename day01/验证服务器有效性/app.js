/**
 * Created by lsw on 2018/11/16 0016.
 */
const express = require('express');
const app = express();


app.use((req,res,next) => {

});



app.listen(3000,err => {
  if(!err) console.log('服务器启动成功');
  else console.log(err);

})