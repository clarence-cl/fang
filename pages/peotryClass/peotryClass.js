// pages/peotryClass/peotryClass.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    peotryClass: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.ajax('/web/sysconfig/banners/show', (res) => {
      this.setData({
        peotry: res.data.ret.poetry_bak
      })
    })
    
    app.ajax('/web/poetry_cat/get', (res) => {
      for (var i = 0; i < res.data.ret.length; i++) {
        if (res.data.ret[i].type == 0) {
          res.data.ret[i].bgimg = this.data.peotry.tag
          res.data.ret[i].type = "唐诗"
          res.data.ret[i].count = res.data.ret[i].count+"人在读"
        } else if (res.data.ret[i].type == 1) {
          res.data.ret[i].type = "宋词"
          res.data.ret[i].bgimg = this.data.peotry.song
          res.data.ret[i].count = res.data.ret[i].count + "人在读"
        } else if (res.data.ret[i].type == 2) {
          res.data.ret[i].type = "现代诗"
          res.data.ret[i].bgimg = this.data.peotry.xian
          res.data.ret[i].count = res.data.ret[i].count + "人在读"
        } else if (res.data.ret[i].type == 3) {
          res.data.ret[i].type = "其他"
          res.data.ret[i].bgimg = this.data.peotry.other
          res.data.ret[i].count = res.data.ret[i].count
        }
      }
      this.setData({
        peotryClass: res.data.ret
      })
    }, "get", {})
  },
  toOpusClass: function (e) {
    var title = e.currentTarget.dataset.title
    var id = e.currentTarget.id
    wx.navigateTo({
      url: "../opusClass/opusClass?title=" + title + "&id=" + id + "&imgurl="+e.currentTarget.dataset.imgurl,
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