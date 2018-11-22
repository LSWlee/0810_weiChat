/**
 * Created by lsw on 2018/11/16 0016.
 */
const express = require('express');
const handleRequest = require('./replay/handleRequest');
const router = require('./router');
const db = require('./db');

const app = express();
app.set('views','views');
app.set('view engine','ejs');
db
  .then(res => {
    app.use(router);
    app.use(handleRequest());
  });

app.listen(3000,err => {
  if(!err) console.log('服务器启动成功');
  else console.log(err);
});