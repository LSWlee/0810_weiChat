/**
 * Created by lsw on 2018/11/16 0016.
 */
/*
工具方法
*/
const {parseString} = require('xml2js');
module.exports ={
  getUserDataAsync (req) {
      return new Promise((resolve,reject) => {
        //接收数据
        //绑定接收数据事件每次读取会触发当前事件，将读取的内容传入到回调函数中
        let result = ''
        //事件都为异步所以用Promise
          req
            .on('data',data => {
              console.log(data.toString());//读取的数据为buffer数据
              result += data.toString();
          })
            .on('end',() => {
              console.log('数据以接受完毕');
              resolve(result);
            })
      })
  },
  parseXMLDataAsync (xmlData) {
    //因为有两中状态，所以包装Promise对象
    return new Promise((resolve,reject) => {
      parseString(xmlData,{trim:true},(err,data) => {
        if(!err){
          resolve(data);
        }else{
          reject('parseString方法错误'+err);
        }
      })
    });
  },
  formatMessage ({xml}) {
    /*1.去掉xml
      2.去掉[]
    * */
    let result = {};
    for(var key in xml){    // Content: [ '这' ],
      let arr = xml[key]
      result[key] = arr[0];
    }
    return result;
  }

};




