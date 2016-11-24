//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
      imgUrls: [
          'http://upload.didadi.fm/data/upload/shop/tuan/05327074233224018.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
      indicatorDots: true,
      autoplay: false,
      interval: 1000,
      duration: 300
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
