/**
 * Created by lsw on 2018/11/20 0020.
 */
const db = require('../db');
const crawler = require('./crawler');
const save = require('./save');
const upload = require('./upload');
(async () => {
  await db;

  //将图片和视频上传到七牛中
  await upload()
})();