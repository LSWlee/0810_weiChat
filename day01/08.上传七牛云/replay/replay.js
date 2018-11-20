/**
 * Created by lsw on 2018/11/17 0017.
 */
  const {url} = require('../config')
module.exports = (mes) => {
  const options = {
    ToUserName:mes.FromUserName,
    FromUserName:mes.ToUserName,
    CreateTime:Date.now(),
    MsgType:'text'
  }
  //根据用户输入指定字符，返回响应的响应
  let replayDate = '你在说什么，我听不懂~~~';
  if(mes.MsgType === 'text'){
    if(mes.Content === '1'){
      replayDate = '大吉大利，今晚吃鸡'
    }else if(mes.Content === '2'){
      replayDate = '大吉大利，今晚盒子精'
    }else if(mes.Content.includes('爱')){
      replayDate = '么么哒~~~';
    }else if(mes.Content === '3'){
      //回复图文消息
      options.MsgType = 'news';
      options.title = '微信公众号开发~';
      options.description = 'class0810~';
      options.picUrl = 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=199783060,2774173244&fm=58&s=188FA15AB1206D1108400056000040F6&bpow=121&bpoh=75';
      options.url = 'http://www.atguigu.com';
    }else if(mes.Content === '4'){
      replayDate = `<a href="${url}/search">secrch页面</a>`;
    }
  }else if(mes.MsgType === 'voice'){
    replayDate = `语音识别结果为: ${mes.Recognition}`
  }else if (mes.MsgType === 'location') {
    //用户主动发送位置
    replayDate = `纬度：${mes.Location_X}  经度：${mes.Location_Y} 地图的缩放大小：${mes.Scale} 位置详情：${mes.Label}`;
  } else if (mes.MsgType === 'event') {
    if (mes.Event === 'subscribe') {
      //关注事件/订阅事件
      replayDate = '欢迎您关注公众号~';
      if (mes.EventKey) {
        //说明扫了带参数的二维码
        replayDate = '欢迎您关注公众号~, 扫了带参数的二维码';
      }
    } else if (mes.Event === 'unsubscribe') {
      //取消关注事件
      console.log('无情取关~');
    } else if (mes.Event === 'LOCATION') {
      //用户初次访问公众号，会自动获取地理位置
      replayDate = `纬度：${mes.Latitude} 经度：${mes.Longitude}`;
    } else if (mes.Event === 'CLICK') {
      //用户初次访问公众号，会自动获取地理位置
      replayDate = `用户点击了：${mes.EventKey}`;
    }
  }
  options.Content = replayDate;
  return options;
}