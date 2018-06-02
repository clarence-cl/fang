// pages/personalCenter/personalCenter.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    regionId:'',
    regionName:'',
    regionData:"",
    pages: 1,
    maxPages:"",
    onoff:false
  },
 topeotry:function(e){
   wx.navigateTo({
     url: '../showcase/showcase?audioid='+e.currentTarget.dataset.audioid+'&peotryid='+e.currentTarget.id,  
   })
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      regionId: options.id ,
      regionName: options.name
    }) 
    
    app.ajax("web/sysconfig/banners/show",(res)=>{
      console.log(res.data.ret.provinces[0].banners)
      this.setData({
        imgurl:res.data.ret.provinces[options.id-1].banners
      })
    })
    app.ajax("/web/poetry_music/province/"+options.id+"/show?page_num="+this.data.pages+"&page_size=10",(res)=>{
       this.setData({
         regionData:res.data.ret.data,
         maxPages: res.data.ret.page_count,
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
    this.setData({
      pages: this.data.pages + 1
    })
    if (this.data.pages <= this.data.maxPages) {
      app.ajax("/web/poetry_music/province/" + this.data.regionId + "/show?page_num=" + this.data.pages +"&page_size=10", (res) => {
        this.setData({
          regionData: this.data.regionData.concat(res.data.ret.data)
        })
      }, 'get')
    } else {
      this.setData({
        onoff: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})