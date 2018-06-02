// pages/production/production.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    proClass: [
      { name: "最新上传", id: "0" },
      { name: "历史热门", id: "1" },
      { name: "每日推荐", id: "2" },
      { name: "诗词大全", id: "3" },
      { name: "我的收藏", id: "4" },
      { name: "我的作品", id: "5" }
    ]
  },
  toproductionClass: function (e) {
    var title = e.target.dataset.title
    var id = e.target.id
    
    if (id == "3") {
      wx.navigateTo({
        url: '../peotryClass/peotryClass?title=' + title + '&id=' + id,
      })
    } else {
      if (id == "0"){
        var imgurl = this.data.classimg.new
      } else if (id == "1"){
        var imgurl = this.data.classimg.hot
      } else if (id == "2") {
        var imgurl = this.data.classimg.day
      } else if (id == "4") {
        var imgurl = this.data.classimg.cat
      } else if (id == "5") {
        var imgurl = this.data.classimg.myc
      }
      wx.navigateTo({
        url: '../productionClass/productionClass?title='+title+'&id='+id+'&img='+imgurl,
      })
    }
  },
  toinfo: function (e) {
    console.log(e.currentTarget.dataset.audioid)
    app.ajax("/web/poetry_music/" + e.currentTarget.dataset.audioid + "/get", (res) => {
      wx.navigateTo({
        url: '../showcase/showcase?audioid=' + e.currentTarget.dataset.audioid + '&peotryid=' + res.data.ret.poetry.id
      })
    })
    return

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.ajax("/web/sysconfig/banners/show", (res) => {
      console.log(res)
      this.setData({
        imgUrls: res.data.ret.lastest_music,
        classimg: res.data.ret.class,
      })
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