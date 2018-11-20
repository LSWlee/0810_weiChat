/**
 * Created by lsw on 2018/11/20 0020.
 */
const Trailers = require('../../modules/trailers');

module.exports = async movies => {
  for(var i=0;i<movies.length;i++){
    let item = movies[i];
  await Trailers.create(item);
  }
};