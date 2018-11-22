/**
 * Created by lsw on 2018/11/17 0017.
 */
  const {url} = require('../config')
module.exports =async (mes) => {
  let options = {
    ToUserName:mes.FromUserName,
    FromUserName:mes.ToUserName,
    CreateTime:Date.now(),
    MsgType:'text'
  }
  //根据用户输入指定字符，返回响应的响应
  let replayDate = '你在说什么，我听不懂~~~';
  if(mes.MsgType === 'text'){
    if(mes.Content === '预告片'){
      options.MsgType = 'news';
      options.title = '硅谷电影预告片';
      options.description = '这里有即将上映的电影~';
      options.picUrl = 'http://mmbiz.qpic.cn/mmbiz_jpg/mok2zxSlsr59AAbaqaq9Vr2Su5ia57aicJT1RCBNegYWFtz1ribHZXu6ajFs7AGhFqeGibL3gkxuPBay0w9C3ojMJA/0';
      options.url = `${url}/movie`;
    }else if(mes.Content === '语音识别'){
      options.MsgType = 'news';
      options.title = '语音识别电影';
      options.description = '这里用语音搜索你想看的电影~';
      options.picUrl = 'http://mmbiz.qpic.cn/mmbiz_jpg/mok2zxSlsr59AAbaqaq9Vr2Su5ia57aicJT1RCBNegYWFtz1ribHZXu6ajFs7AGhFqeGibL3gkxuPBay0w9C3ojMJA/0';
      options.url = `${url}/search`;
    }else{
      //搜索相关的电影
      const url = `http://api.douban.com/v2/movie/search?`;
      const {subjects} = await rp({method:'GET',url,json:true,qs:{count:1,q:mes.Content}})
      options.MsgType = 'news';
      options.title = subjects[0].title;
      options.description = `评分：${subjects[0].rating.average}`;
      options.picUrl =subjects[0].images.small;
      options.url = subjects[0].alt;
    }
  }
    else if(mes.MsgType === 'voice'){
    //搜索相关的电影
    const url = `http://api.douban.com/v2/movie/search?`;
    const {subjects} = await rp({method:'GET',url,json:true,qs:{count:1,q:mes.Recognition}});
    options.MsgType = 'news';
    options.title = subjects[0].title;
    options.description = `评分：${subjects[0].rating.average}`;
    options.picUrl =subjects[0].images.small;
    options.url = subjects[0].alt;

  } else if (mes.MsgType === 'event') {
    if (mes.Event === 'subscribe') {
      //关注事件/订阅事件
      content = `欢迎您关注硅谷电影公众号~ /n
                回复 预告片 查看硅谷电影预告片 /n
                回复 语音识别 查看语音识别电影 /n
                回复 任意文本 搜索相关的电影 /n
                回复 任意语音 搜索相关的电影 /n
                也可以点击<a href="${url}/search">语音识别</a>来跳转`;

    } else if (mes.Event === 'unsubscribe') {
      //取消关注事件
      console.log('无情取关~');
    }  else if (mes.Event === 'CLICK') {
      //用户初次访问公众号，会自动获取地理位置
      if(mes.EventKey === 'help'){
        replayDate = `硅谷电影公众号~ /n
                回复 预告片 查看硅谷电影预告片 /n
                回复 语音识别 查看语音识别电影 /n
                回复 任意文本 搜索相关的电影 /n
                回复 任意语音 搜索相关的电影 /n
                也可以点击<a href="${url}/search">语音识别</a>来跳转`;
      }

    }
  }
  options.Content = replayDate;
  return options;
}