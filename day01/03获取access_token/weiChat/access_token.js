/**
 * Created by lsw on 2018/11/18 0018.
 */
//请求地址
//https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
//请求方式：
//GET
//请求成功的响应结果：
//JSON： {"access_token":"ACCESS_TOKEN","expires_in":7200}
//发送请求： 因为服务器端没有ajax引擎所以不能发ajax请求，采用别的办法借助http模块或别的库
//npm install --save request request-promise-native  发送请求返回值默认是promise对象
/*
整理：
读取本地保存access_token（readAccessToken）
- 有
- 判断是否过期（isValidAccessToken）
- 过期了, 重新发送请求，获取access_token（getAccessToken），保存下来（覆盖之前的）(saveAccessToken)
- 没有过期, 直接使用
- 没有
- 发送请求，获取access_token，保存下来*/

const rp = require('request-promise-native');
const {writeFile,readFile} = require('fs');
const {appID,appsecret} = require('../config');

class Wechat {
  /**
   * 获取access_token
   * @return {Promise<result>}
   */
   async getAccessToken () {
    //定义请求地址
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`
    //发送请求
    const result = await rp({method:'GET',url,json:true})//返回的数据自动转换为js对象
    //设置access_token的过期时间
    result.expires_in = Date.now() + 7200000 - 300000;
    return result;
  }

  /**
   * 保存access_token
   * @param filePath  保存的路径
   * @param accessToken 要保存的凭据
   * @returns {Promise}
   */
  saveAccessToken (filePath,accessToken) {
    //js对象没办法存储，会默认调用toString() --->  [object Object]
    //将js对象转化为json字符串
    //异步的方法都要考录是否要包promise对象
     return new Promise((resolve,reject) => {
       writeFile(filePath,JSON.stringify(accessToken),err => {
         if(!err){
            resolve()
         }else{
            reject('saveAccessToken方法出了问题' + err)
         }
       })
     })
  }

  /**
   * 读取access_token
   * @param filePath  文件路径
   * @returns {Promise}
   */
  readAccessToken (filePath) {
    return new Promise((resolve,reject) => {
      readFile(filePath,(err,data) => {
        //读取的数据是buffer
        if(!err){
          //读取到的是上边存储的字符串，需要转化成js对象
          resolve(JSON.parse(data.toString()))
        }else{
          reject('readAccessToken方法出了问题' + err);
        }
      })
    })
  }

  /**
   * 判断access_token是否过期
   * @param expires_in
   * @returns {boolean}
   */
  isValidAccessToken ({expires_in}) {
    if(Date.now()>=expires_in){
      //说明没过期
      return false
    }else{
      //说明过期了
      return true
    }
  }

  /**
   * 返回有效的access_token的方法
   * @returns {Promise.<{access_token: *, expires_in: (*|number)}>}
   */
  fetchAccessToken () {
    if(this.access_token && this.expires_in && this.isValidAccessToken(this)) {
      //说明access_token是有效的
      return Promise.resolve({access_token:this.access_token,expires_in:this.expires_in})
    }
    //目的返回有效的access_token
   return this.readAccessToken('./accessToken.txt')
      .then(async res => {
        if (this.isValidAccessToken(res)) {
          //没有过期，直接使用
          //then函数的返回值，promise对象包着res
          return res;
        } else {
          //过期了
          const accessToken = await this.getAccessToken();
          await this.saveAccessToken('./accessToken.txt', accessToken);
          //then函数的返回值，promise对象包着accessToken
          return accessToken
        }
      })
      .catch(async err => {
        const accessToken = await this.getAccessToken();
        await this.saveAccessToken('./accessToken.txt',accessToken)
        return accessToken
      })
      .then(res => {
        //不管上面成功或失败都会来到这
        this.access_token = res.access_token;
        this.expires_in = res.expires_in;
        return Promise.resolve(res);
      })
  }
};



(async () => {
  /*
   读取本地保存access_token（readAccessToken）
   - 有
   - 判断是否过期（isValidAccessToken）
   - 过期了, 重新发送请求，获取access_token（getAccessToken），保存下来（覆盖之前的）(saveAccessToken)
   - 没有过期, 直接使用
   - 没有
   - 发送请求，获取access_token，保存下来
   */
    const w = new Wechat();
    let result = await w.fetchAccessToken();
    console.log(result);
        result = await w.fetchAccessToken();
    console.log(result)
})();
