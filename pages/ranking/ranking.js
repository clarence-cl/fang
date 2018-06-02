// pages/ranking/ranking.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    topThree:[],
    province: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //这里既可以获取模拟的res
    app.ajax('/web/poetry_music/rand/get',(res)=> {
      var arr = (res.data.ret||'').slice(0, 3)
      var arrlast = arr.pop()
      arr.reverse().push(arrlast)
      this.setData({
        topThree: arr,
        province: (res.data.ret ||'').slice(3)
      })
      //  人数条宽度
      for (var i = 0; i < this.data.province.length; i++) {
        this.data.province[i].pwidth = this.data.province[i].read_count / this.data.province[0].read_count * 100 + "%"
      }
      this.setData({
        province: this.data.province
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  toRegion:function(e){
    var name = e.currentTarget.dataset.name
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '../region/region?name='+name+'&id='+id,
    })
  },
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
    return {
      title: '你的乡音排名第几？赶紧来为你的家乡助力打CALL',
      path: '/pages/ranking/ranking',
      imageUrl: '',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})