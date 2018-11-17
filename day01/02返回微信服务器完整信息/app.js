/**
 * Created by lsw on 2018/11/16 0016.
 */
const express = require('express');
const sha1 = require('sha1');
const {getUserDataAsync,parseXMLDataAsync,formatMessage} = require('./untils/tools');
const replayMsg = require('./replay/replayMsg');
const replay = require('./replay/replay');
const app = express();
//01验证服务器有效性===============================
const config= {
  appID:'wx021e6eafc00cc0ff',
  appsecret:'a2d42914589fe5025ffb00936a455094',
  token:'0810_testWchect'
};

app.use(async (req, res, next) => {
  console.log(req.query);
/*
* { signature: 'c3cab9d4a2b8f04de7f29da49b8d3a99d53f19bb',微信签名
 echostr: '5244405427897106167',微信后台生成的随机字符串
 timestamp: '1542358262',时间戳
 nonce: '1745222764' }微信后台生成的随机数字
* */
//获取请求参数
const {signature,echostr,timestamp,nonce} = req.query;
const {token} = config;
// - 将参数签名加密的三个参数（timestamp、nonce、token）组合在一起，按照字典序排序
const arr = [timestamp,nonce,token].sort();
console.log(arr);

//// - 将排序后的参数拼接在一起，进行sha1加密
   const str = sha1(arr.join(''));
   console.log(str);
// - 加密后的到的就是微信签名，将其与微信发送过来的微信签名对比，
  //微信服务器会发送两种类型的消息给开发者
  /*1.get  用来验证服务器的有效性
   2.post  转发用户消息
   */
if(req.method === 'GET'){
//01验证服务器有效性
  if(str === signature){
    //说明消息来自微信服务器，然后接收微信服务器发送的消息并作出响应
    res.send(echostr);
  }else{
    //说明消息不是来自微信服务器
    res.send(err);
  }
}else if(req.method === 'POST'){
  //转发用户消息，首先需验证消息是否来自微信服务器
  if(str !== signature){
      res.send('error');
      return;
  };
  //拿到用户发送的消息,接受用户消息在请求体.
  const xmlData = await getUserDataAsync(req);
  console.log(xmlData);
// <xml><ToUserName><![CDATA[gh_58003d7722e8]]></ToUserName> 开发者的微信号
//   <FromUserName><![CDATA[odhy31OfUXvecq98whdZgMp-knhI]]></FromUserName> 微信用户openid
//   <CreateTime>1542367804</CreateTime>  发送消息的时间戳
//   <MsgType><![CDATA[text]]></MsgType>  消息类型
//   <Content><![CDATA[代]]></Content>     消息内容
//   <MsgId>6624419277028631800</MsgId>   消息id
//   </xml>
  //因为微信服务器发送的消息格式为xml格式，只能利用第三方工具转化成json数据
 const jsDate =await parseXMLDataAsync(xmlData);
 console.log(jsDate);
 /*{ xml:
  { ToUserName: [ 'gh_58003d7722e8' ],开发者的微信号
  FromUserName: [ 'odhy31OfUXvecq98whdZgMp-knhI' ],微信用户id
  CreateTime: [ '1542369783' ],
  MsgType: [ 'text' ],
  Content: [ '这' ],
  MsgId: [ '6624427776768910590' ] } }
 */
//格式化数据
  const mes = formatMessage(jsDate);
  console.log(mes);

  const options = replay(mes);
  const replayMessage = replayMsg(options);

  res.send(replayMessage);
}else{
  res.send('error');
}
});
app.listen(3000,err => {
  if(!err) console.log('服务器启动成功');
  else console.log(err);
});