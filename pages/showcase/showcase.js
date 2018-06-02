// pages/region/region.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    play: true,
    follow: "",
    time:30,
    musicTime:"",
    peonum:0,
    timer:'',
    showcaseData:"",
    peotryId:"",
    peotryCon:[]
  },
  onfollow: function () {
    console.log(this.data.audioid)
    this.setData({
      follow: !this.data.follow
    })
    if (this.data.follow){
      app.ajax("/web/poetry_music/"+this.data.audioid + "/collect", (res) => {
        if (res.statusCode == "422") {
          console.log("已点赞")
        }
      })
      this.setData({
        peonum: this.data.peonum+1
      })
    }else{
      if (this.data.peonum<=0){
        this.setData({
          peonum: 0
        })
      }else{
        app.ajax("/web/poetry_music/"+this.data.audioid+"/cancel_collect",(res)=>{
          console.log(res)
        })
        this.setData({
          peonum: this.data.peonum - 1
        })
      }

    }
  },
  onplay: function () {
    app.ajax('/web/poetry_music/'+this.data.audioid+'/play',(res)=>{

    })
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.setData({
        time: this.data.time - 1
      })
      if (this.data.time==0){
        clearInterval(this.timer)
        this.setData({
          time: this.data.musicTime,
          play: !this.data.play
        })
        this.audioCtx.pause()
        this.audioCtx.seek(0)
      }
    }, 1000)
    if (this.data.play) {
      this.audioCtx.play()
    } else{
      clearInterval(this.timer)
      this.audioCtx.pause()
    }
    this.setData({
      play:!this.data.play
    })
  },
  //重置音乐
  resetMusic:function(){
    clearInterval(this.timer)
    this.audioCtx.seek(0)
    this.audioCtx.pause()
    this.setData({
      time: this.data.musicTime,
      play: true
    })
  },
  torecording:function(){
    this.resetMusic()
    wx.navigateTo({
      url: '../recording/recording?peotryid=' + this.data.peotryId+'&audioid='+this.data.audioid,
    })
  },
  toranking: function () {
    wx.switchTab({
      url: '../ranking/ranking',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.ajax("/web/poetry_music/"+options.audioid+"/get",(res)=>{
      console.log(res)
      this.setData({
        count: res.data.ret.count,
        peonum: res.data.ret.count,
        showcaseData:res.data.ret,
        peotryId: options.peotryid,
        audioid:options.audioid,
        time: res.data.ret.music_length,
        musicTime: res.data.ret.music_length,
        follow: res.data.ret.is_collect==0?false:true,
        peotryCon:res.data.ret.poetry.content.split("|")
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx = wx.createAudioContext('myAudio')
    this.audioCtx.setSrc(this.data.audioSrc)
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
      title: this.data.showcaseData.user.name +'用'+this.data.showcaseData.province+'话朗读的诗词，用你的家乡话来试试',
      path: 'pages/showcase/showcase?audioid='+this.data.audioid+'&peotryid='+this.data.peotryId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }

  }
})