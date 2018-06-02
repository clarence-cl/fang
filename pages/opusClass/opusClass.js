// pages/opusClass/opusClass.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classTitle: "",
    classData: "",
    id: "",
    pages: 1,
    maxPages: 2,
    onoff:false
  },
toshowCase:function(e){
  wx.navigateTo({
    url: '../recording/recording?audioid=' + e.currentTarget.dataset.audioid + '&peotryid=' + e.currentTarget.id,
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      classTitle: options.title,
      id: options.id,
      imgurl: options.imgurl
    })
    app.ajax("/web/poetry_cat/" +options.id +"/show?page_num="+this.data.pages+"&page_size=10", (res) => {
      console.log(res) 
      this.setData({ 
        classData: res.data.ret.data,
         maxPages: res.data.ret.page_count
      })
    }, "get")
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
    this.setData({
      pages: this.data.pages + 1
    })
    if (this.data.pages <= this.data.maxPages){
      app.ajax("/web/poetry_cat/1/show?page_num=2", (res) => {//"+this.data.id+" ?page_num=this.data.pages&page_size=7
        this.data.header.XTIM = new Date().getTime()
        this.data.header.XTOKEN = app.MD5.hexMD5(res.ret.access_token + res.ret.user_id + this.data.header.XTIM)
        this.data.header.XACCESSUSER = wx.getStorageSync("token").userId
        console.log(res)
        this.setData({
          classData: this.data.classData.concat(res.ret.data),
           maxPages: res.ret.page_count
        })
      }, "get", {}, this.data.header)
    }else{
      this.setData({
        onoff:true
      })
    }
  },

  /**
   * 用户点击右上角分享  
   */
  onShareAppMessage: function () {

  }
})