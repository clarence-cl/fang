// pages/productionClass/productionClass.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     protitle:'',
     proid:'',
     collectionData:[],
     pages: 1,
     maxPages:"",
     onoff:false
  },
  topeotry: function (e) {
    wx.navigateTo({
      url: '../showcase/showcase?audioid='+e.currentTarget.dataset.audioid+'&peotryid='+e.currentTarget.id,
    })
  },
  toopus:function(e){
    console.log(e)
    wx.navigateTo({
      url: '../opus/opus?regionId='+e.currentTarget.dataset.provinceid
      + '&peotryId=' + e.currentTarget.id + '&audioId=' + e.currentTarget.dataset.audioid + '&til='+this.data.proid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      protitle:options.title,
      proid: options.id,
      imgurl:options.img
    })
    if (options.id == 0 || options.id == 1){
      //0最新上传1历史热门2每日推荐
      app.ajax("web/poetry_music/getlist?page_num=" + this.data.pages + "&page_size=10&type=" + options.id, (res) => {
        this.setData({
          collectionData: res.data.ret.data,
          maxPages: res.data.ret.page_count
        })
      }, 'get')
    } else if (options.id == 2){
      app.ajax("web/poetry_music/getlist?page_num=" + this.data.pages + "&page_size=10&type=" + options.id, (res) => {
        this.setData({
          collectionData: res.data.ret.data,
          maxPages: res.data.ret.page_count,
          time: Object.keys(res.data.ret.data)
        })
      }, 'get')
    }
     else if(options.id==4){
     //我的收藏
     app.ajax("/web/poetry_music/my_collect?page_num="+this.data.pages+"&page_size=10", (res) => {
       this.setData({
         collectionData:res.data.ret.data,
         maxPages:res.data.ret.page_count
       })
     }, 'get')
    } else if (options.id == 5) {
      //我的作品
      app.ajax("/web/poetry_music/my_music?page_num="+this.data.pages+"&page_size=10", (res) => {
        console.log(res.data.ret.page_count)
        this.setData({
          collectionData:res.data.ret.data,
          maxPages: res.data.ret.page_count
        })
      }, 'get')
    }
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
      if (this.data.proid == 4) {
      //我的收藏
      app.ajax("/web/poetry_music/my_collect?page_num=" + this.data.pages + "&page_size=10", (res) => {
        this.setData({
          collectionData: res.data.ret.data,
          maxPages: res.data.ret.page_count
        })
      }, 'get')
    } 
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
      pages: this.data.pages+1
    })
    if (this.data.pages <= this.data.maxPages) {
      if (this.data.proid == 4) {
        app.ajax("/web/poetry_music/my_collect?page_num=" + this.data.pages + "&page_size=10", (res) => {
          this.setData({
            collectionData: this.data.collectionData.concat(res.data.ret.data)
          })
        }, 'get')
      } else if (this.data.proid == 5){
        //我的作品
        app.ajax("/web/poetry_music/my_music?page_num=" + this.data.pages + "&page_size=10", (res) => {
          
          this.setData({
            collectionData: this.data.collectionData.concat(res.data.ret.data),
          })
        }, 'get')
      }
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