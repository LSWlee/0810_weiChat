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
const {writeFile,readFile,createReadStream} = require('fs');
const {appID,appsecret} = require('../config');
const api = require('../api');

class Wechat {
  /**
   * 获取access_token
   * @return {Promise<result>}
   */
   async getAccessToken () {
    //定义请求地址
    const url = `${api.accessToken}appid=${appID}&secret=${appsecret}`
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

  /**
   * 创建自定义菜单
   * @param menu
   * @returns {Promise.<*>}
   */
  async createMenu (menu) {
    try {
      //获取access_token
      const {access_token} = await this.fetchAccessToken();
      //定义请求地址
      const url = `${api.menu.create}access_token=${access_token}`
      //发送请求
      const result = await rp({method:'POST',url,json:true,body:menu});
      return result
    }catch (e) {
      return 'createMenu方法出了问题' + e
    }
  }

  /**
   * 删除菜单的方法
   * @returns {Promise.<*>}
   */
  async deleteMenu () {
    try {
      //获取access_token
      const {access_token} = await this.fetchAccessToken();
      //定义请求地址
      const url = `${api.menu.delete}access_token=${access_token}`
      //发送请求
      return await rp({method:'GET',url,json:true})
    }catch (e) {
      return 'deleteMenu方法出了问题' + e;
    }
  }

  /**
   * 创建标签
   * @param name 标签名
   * @return {Promise<*>}
   */
  async createTag (name) {
    try {
      //获取access_token
      const {access_token} = await this.fetchAccessToken();
      //定义请求地址
      const url = `${api.tag.create}access_token=${access_token}`;
      //发送请求
      const result = await rp({method: 'POST', url, json: true, body: {tag: {name}}});

      return result;
    } catch (e) {
      return 'createTag方法出了问题：' + e;
    }
  }

  /**
   * 获取标签下粉丝列表
   * @param tagid
   * @param next_openid
   * @returns {Promise.<*>}
   */
  async getTagUsers (tagid, next_openid = '') {
    try {
      const {access_token} = await this.fetchAccessToken();
      const url = `${api.tag.getUsers}access_token=${access_token}`;
      return await rp({method: 'POST', url, json: true, body: {tagid, next_openid}});
    } catch (e) {
      return 'getTagUsers方法出了问题' + e;
    }
  }

  /**
   * 批量为用户打标签
   * @param openid_list
   * @param tagid
   * @returns {Promise.<*>}
   */
  async batchUsersTag (openid_list, tagid) {
    try {
      const {access_token} = await this.fetchAccessToken();
      const url = `${api.tag.batch}access_token=${access_token}`;
      return await rp({method: 'POST', url, json: true, body: {tagid, openid_list}});
    } catch (e) {
      return 'batchUsersTag方法出了问题' + e;
    }
  }

  /**
   * 给指定标签的人群发消息
   * @param optios
   * @returns {Promise.<*>}
   */
  async sendAllByTag (options) {
    try {
      //获取access_token
      const {access_token} = await this.fetchAccessToken();
      //定义请求地址
      const url = `${api.message.sendall}access_token=${access_token}`;
      //发送请求
      return await rp({method:'POST',url,json:true,body:options});

    } catch (e) {
      return 'sendAllByTag方法出了问题' + e;
    }
  }

  async uploadMaterial (type,material,body) {
      try {
        //获取access_token
        const {access_token} = await this.fetchAccessToken();
        //定义请求地址
        let url ='';
        let options = {method:'POST',json:true};
        if(type === 'news' ){
          url = `${api.upload.uploadimg}access_token=${access_token}`;
          //以请求体参数上传
          options.body = material;
        }else if(type === 'pic') {
          url = `${api.upload.uploadimg}access_token=${access_token}`;
          //以form表单上传
          options.formData = {
            media: createReadStream(material)
          }
        }else{
          url = `${api.upload.uploadimg}access_token=${access_token}&type=${type}`;
          //以form表单上传，从request库中找方法
          options.formData = {
            media: createReadStream(material)
          };
          if (type === 'video') {
            options.body = body;
          }
        }
        options.url = url;
        //发送请求
        return await rp(options);
      }catch(e) {
        return 'uploadMaterial方法出了问题' + e;
      }
  }
}



//测试代码块
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
  //上传图片获取media_id
  //  let result1 = await w.uploadMaterial('image', './er.jpg');
  //  console.log(result1);
  //
  //  //上传图片获取地址
  //  let result2 = await w.uploadMaterial('pic', './tp.jpg');
  //  console.log(result2);
  //
  //  //上传图文消息
  //  let result3 = await w.uploadMaterial('news', {
  //  "articles": [{
  //    "title": '微信公众号开发',
  //    "thumb_media_id": result1.media_id,
  //    "author": '佚名',
  //    "digest": '这里是class0810开发的',
  //    "show_cover_pic": 1,
  //    "content": `<!DOCTYPE html>
  //                 <html lang="en">
  //                 <head>
  //                   <meta charset="UTF-8">
  //                   <title>Title</title>
  //                 </head>
  //                 <body>
  //                   <h1>微信公众号开发</h1>
  //                   <img src="${result2.url}">
  //                 </body>
  //                 </html>`,
  //    "content_source_url": 'http://www.atguigu.com',
  //    "need_open_comment":1,
  //    "only_fans_can_comment":1
  //  }
  //  ]
  //  });
  //  console.log(result3);


})();
