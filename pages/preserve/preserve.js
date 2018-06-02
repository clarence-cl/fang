
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageSrc:""
  },
preserve:function(){
  wx.getImageInfo({
    src: this.data.imageSrc,
    success:  (res)=> {
      wx.saveImageToPhotosAlbum({
        filePath: res.path,
        success(res) {
          console.log(res)
        }
      })
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    app.ajax("/web/qrcode", (res) => {//图片id
      app.ajax('/web/poetry_music/createimg', (res) => {
        console.log(res)
        this.setData({
          imageSrc:res.data.ret.img_url
        })
      }, "post", {
          "pm_id": options.audioId,
          "code_url": res.data.ret
        })
    }, "post", {
        "width": "763",
        "path": "pages/showcase/showcase?audioid="+options.audioId +"&peotryid="+options.peotryid
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})