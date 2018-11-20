/**
 * Created by lsw on 2018/11/20 0020.
 */
const db = require('../db');
const crawler = require('./crawler');
const save = require('./save');
(async () => {
  await db;
  const movies = await crawler();
  await save(movies);
})();