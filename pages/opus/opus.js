// pages/opus/opus.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicTime: 0,
    time: "0",
    play: true,
    showcaseData: {},
    musicPath: '',
  },
  //重置音乐
  resetMusic: function () {
    clearInterval(this.timer)
    this.audioCtx.seek(0)
    this.audioCtx.pause()
    this.setData({
      time: this.data.musicTime,
      play: true
    })
  },
  torecording: function () {
    this.resetMusic()
    wx.navigateTo({
      url: '../recording/recording',
    })
  },
  toranking: function () {
    wx.switchTab({
      url: '../ranking/ranking',
    })
  },
  topreserve: function () {
    this.resetMusic()
    wx.navigateTo({
      url: '../preserve/preserve',
    })
  },
  onplay: function () {
    app.ajax('/web/poetry_music/' + this.data.audioid + '/play', (res) => {

    })
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.setData({
        time: this.data.time - 1
      })
      if (this.data.time == "0") {
        clearInterval(this.timer)
        this.setData({
          "play": true,
          "time": this.data.musicTime
        })
      }
    }, 1000)
    if (this.data.play) {
      this.audioCtx.play()
    } else {
      clearInterval(this.timer)
      this.audioCtx.pause()
    }
    this.setData({
      play: !this.data.play,
    })
  },
  //生成图片
  picture: function () {
     wx.navigateTo({
       url: '../preserve/preserve?audioId='+this.data.myaudioId +'&peotryid='+this.data.peotryId,
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.til)
    this.setData({
      peotryId: options.peotryId,
      regionId: options.regionId,
      audioId: options.audioId
    })
    var that = this
    that.audioCtx = wx.createAudioContext('myAudio')
    //获取音频
    if (options.til==5){
      app.ajax("/web/poetry_music/" + options.audioId+"/get",(res)=>{
        this.setData({
          musicPath: res.data.ret.final_url,
          myaudioId: res.data.ret.id,
          showcaseData: res.data.ret,
          time: res.data.ret.music_length,
          musicTime: res.data.ret.music_length,
          peotryCon: res.data.ret.poetry.content.split("|")
        })
      })
    }else{
    app.ajax('/web/record/merge', (res) => {
      that.setData({
        "musicPath": res.data.ret.path
      })
      that.audioCtx.setSrc(that.data.musicPath)
      app.ajax('/web/record/save', (res) => {
        //获取页面信息
        app.ajax("/web/poetry_music/"+res.data.ret.id+"/get",(res)=>{
          that.setData({
            myaudioId: res.data.ret.id
          })
          that.setData({
            showcaseData: res.data.ret,
            time: res.data.ret.music_length,
            musicTime: res.data.ret.music_length,
            peotryCon: res.data.ret.poetry.content.split("|")
          })
        })
      }, "post", {
          poetry_id: options.peotryId,
          province_id: options.regionId,
          poetrymusic: that.data.musicPath
        })
    }, "post", { 'poetry_id': options.peotryId})
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
    this.resetMusic()
    return {
      title: this.data.showcaseData.user.name + '用' + this.data.showcaseData.province + '话朗读诗词，用你的家乡话来试试',
      path: 'pages/showcase/showcase?regionId=' + this.data.regionId + '&peotryid=' + this.data.peotryId + '&audioid='+this.data.myaudioId,
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