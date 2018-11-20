/**
 * Created by lsw on 2018/11/17 0017.
 */

module.exports = (options) => {
  //返回xml消息给微信服务器
  let replayMessage =`<xml>
      <ToUserName><![CDATA[${options.ToUserName}]]></ToUserName>
      <FromUserName><![CDATA[${options.FromUserName}]]></FromUserName>
      <CreateTime>${Date.now()}</CreateTime>
      <MsgType><![CDATA[${options.MsgType}]]></MsgType>`;
  if(options.MsgType === 'text'){
    replayMessage += `<Content><![CDATA[${options.Content}]]></Content>`;
  }else if(options.MsgType === 'image'){
    replayMessage += `<Image><MediaId><![${options.mediaid}]></MediaId></Image>`
  }else if(options.MsgType === 'voice'){
    replayMessage += `<Voice><MediaId><![${options.mediaid}]></MediaId></Voice>`
  }else if(options.MsgType === 'video'){
    replayMessage += `<Video>
        <MediaId><![${options.mediaid}]></MediaId>
        <Title><![${options.title}]></Title>
        <Description><![${options.description}]></Description>
        </Video>`
  }else if(options.MsgType === 'music'){
    replayMessage += `<Music>
        <Title><![${options.title}]></Title>
        <Description><!${options.description}]></Description>
        <MusicUrl><![${options.MusicUrl}]></MusicUrl>
        <HQMusicUrl><![${options.HQMusicUrl}]></HQMusicUrl>
        <ThumbMediaId><![${options.ThumbMediaId}]></ThumbMediaId>
        </Music>`
  }else if(options.MsgType === 'news'){
    replayMessage += `<ArticleCount>1</ArticleCount>
      <Articles>
      <item>
      <Title><![CDATA[${options.title}]]></Title>
      <Description><![CDATA[${options.description}]]></Description>
      <PicUrl><![CDATA[${options.picUrl}]]></PicUrl>
      <Url><![CDATA[${options.url}]]></Url>
      </item>
      </Articles>`;
  }
  replayMessage += `</xml>`
  return replayMessage;
}