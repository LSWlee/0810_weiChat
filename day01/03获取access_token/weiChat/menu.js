/**
 * Created by lsw on 2018/11/18 0018.
 */
/*
* 菜单模块配置*/

module.exports =  {
  "button":[
    {
      "type":"click",
      "name":"点我有惊喜~	☀",
      "key":"代表点击的是哪一个"
    },
    {
      "name":"菜单",
      "sub_button":[
        {
          "type":"view",
          "name":"跳转连接🌻",
          "url":"http://www.atguigu.com/"
        },
        {
          "type": "scancode_waitmsg",
          "name": "扫码带提示",
          "key": "rselfmenu_0_0",
          "sub_button": [ ]
        },
        {
          "type": "scancode_push",
          "name": "扫码推事件",
          "key": "rselfmenu_0_1",
          "sub_button": [ ]
        },
        {
          "type": "pic_sysphoto",
          "name": "系统拍照发图",
          "key": "rselfmenu_1_0",
          "sub_button": [ ]
        },
        {
          "type": "pic_photo_or_album",
          "name": "拍照或者相册发图",
          "key": "rselfmenu_1_1",
          "sub_button": [ ]
        },
        {
          "type": "pic_weixin",
          "name": "微信相册发图",
          "key": "rselfmenu_1_2",
          "sub_button": [ ]
        }
        ]
    },
    {
      "name":"下拉菜单👄",
      "sub_button":[
        {
          "type":"view",
          "name":"跳转连接🎪",
          "url":"http://www.atguigu.com/"
        },
        {
          "type": "scancode_waitmsg",
          "name": "扫码带提示",
          "key": "rselfmenu_0_0",
          "sub_button": [ ]
        },
        {
          "type": "scancode_push",
          "name": "扫码推事件",
          "key": "rselfmenu_0_1",
          "sub_button": [ ]
        },
        {
          "type": "pic_sysphoto",
          "name": "系统拍照发图",
          "key": "rselfmenu_1_0",
          "sub_button": [ ]
        },
        {
          "type": "pic_photo_or_album",
          "name": "拍照或者相册发图",
          "key": "rselfmenu_1_1",
          "sub_button": [ ]
        },
        {
          "type": "pic_weixin",
          "name": "微信相册发图",
          "key": "rselfmenu_1_2",
          "sub_button": [ ]
        },
        {
          "name": "发送位置",
          "type": "location_select",
          "key": "rselfmenu_2_0"
        },
        // {
        //   "type": "media_id",
        //   "name": "图片",
        //   "media_id": "MEDIA_ID1"
        // },
        // {
        //   "type": "view_limited",
        //   "name": "图文消息",
        //   "media_id": "MEDIA_ID2"
        // }
      ]
    }
    ]
}

