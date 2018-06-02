// pages/recording/recording.js
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
const options = {
  duration: 60000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3',
  frameSize: 50
}
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinceList: [
      [{ name: "安徽", id: 1 }, { name: "澳门", id: 2 }, { name: "北京", id: 3 }, { name: "重庆", id: 4 }, { name: "福建", id: 5 }, { name: "甘肃", id: 6 }, { name: "广东", id: 7 }, { name: "广西", id: 8 }, { name: "贵州", id: 9 }, { name: "海南", id: 10 }, {
        name: "河北", id: 11
      }, { name: "河南", id: 12 }],
      [{ name: "黑龙江", id: 13 }, { name: "湖北", id: 14 }, { name: "湖南", id: 15 }, { name: "吉林", id: 16 }, { name: "江苏", id: 17 }, { name: "江西", id: 18 }, { name: "辽宁", id: 19 }, { name: "内蒙古", id: 20 }, { name: "宁夏", id: 21 }, { name: "青海", id: 22 }, { name: "山东", id: 23 }, { name: "山西", id: 24 }],
      [{ name: "陕西", id: 25 }, { name: "上海", id: 26 }, { name: "四川", id: 27 }, { name: "台湾", id: 34 },{ name: "天津", id: 28 }, { name: "西藏", id: 29 }, { name: "香港", id: 30 }, { name: "新疆", id: 31 }, { name: "云南", id: 32 }, { name: "浙江", id: 33 }]
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    regionId: '',
    regionSwitch: false,
    careful: "请使用您的方言开始录制,最长60秒",
    timer: '',
    outtime: '',
    onoff: true,
    onshow: true,
    filePath: '',
    auditionSwitch: true,
    releaseSwitch: false,
    proWidth: 0,
    recordData: "",
    peotryId: "",
    audioId:"",
    tconoff: false,
    auditionsTime: 0,
    initauditionsTime:'',
    auditionsTimeSwitch: true
  },
  //录制
  recording: function () {
    if (this.data.onoff) {
      this.setData({
        tconoff: true
      })
      this.data.outtime = setTimeout(() => {
        this.setData({
          onoff: !this.data.onoff,
          tconoff: false
        })
        //开始录音
        recorderManager.start(options)
        clearInterval(this.data.timer)
        var j = 59
        this.data.timer = setInterval(() => {
          var i = j--
          if (i < 10) { i = "0" + i } else { i = i }
          this.setData({
            careful: "00:" + i,
            auditionsTime: this.data.auditionsTime + 1
          })
          //停止录音
          if (parseInt(i)<= 0||i=="00") {
            clearInterval(this.data.timer)
            this.setData({
              onoff: true,
              onshow: false,
              outtime: false,
              tconoff: false
            })
            recorderManager.stop()
            // console.log(this.data.auditionsTime - 1)
            recorderManager.onStop((res) => {
              const { tempFilePath } = res
              this.setData({
                filePath: res.tempFilePath,
                onoff: true,
                onshow: false,
                outtime: false,
                tconoff: false
              })
            })
          }
        }, 1000)
      }, 3000)
    } else {
      clearInterval(this.data.timer)
      clearTimeout(this.data.outtime)
      recorderManager.stop()
      recorderManager.onStop((res) => {
        const { tempFilePath } = res
        this.setData({
          onoff: true,
          filePath: res.tempFilePath,
          initauditionsTime: this.data.auditionsTime-1
        })
      })
      this.setData({
        onoff: !this.data.onoff,
        onshow: false,
        outtime: false,
        tconoff: false
      })

    }
  },
  //试听
  audition: function () {
    console.log(this.data.filePath)
    innerAudioContext.src = this.data.filePath
    this.setData({
      tconoff: false
    })
    if (this.data.auditionSwitch) {
      clearInterval(this.data.timer)
      this.data.timer=setInterval(() => {
        this.setData({
          auditionsTime: this.data.auditionsTime - 1,
        })
        if (this.data.auditionsTime<=0){
          clearInterval(this.data.timer)
          this.setData({
            auditionSwitch: !this.data.auditionSwitch,
            auditionsTimeSwitch: true,
            auditionsTime:this.data.initauditionsTime
          })
        }
      }, 1000)
      this.setData({
        auditionSwitch: !this.data.auditionSwitch,
        auditionsTimeSwitch: false
      })
      innerAudioContext.src = this.data.filePath
      innerAudioContext.play()
    } else {
      this.setData({
        auditionSwitch: !this.data.auditionSwitch,
        auditionsTimeSwitch: true
      })
      innerAudioContext.pause()
    }
    innerAudioContext.onEnded(() => {
      this.setData({
        auditionSwitch: true
      })
    })
  },
  //重录
  remake: function () {
    innerAudioContext.pause()
    this.setData({
      filePath:'',
      onshow: true,
      careful: "请使用您的方言开始录制, 最长60秒",
      initauditionsTime:0,
      auditionsTime:0
    })
    console.log(this.data.filePath)
  },
  //发布
  release: function () {
    innerAudioContext.pause()
    // console.log(this.data.filePath, this.data.peotryId)
    
    var that = this
    this.setData({
      releaseSwitch: true,
      proWidth: 1
    })
    wx.uploadFile({
      url: 'https://ceshi.xinzhibang168.com/poetry/poetry/public/index.php/web/record/upload?',
      filePath: that.data.filePath,
      header: app.header,
      name: 'files',
      success: function (res) {
        var data = JSON.parse(res.data)
        if (data.status == "200") {
          that.setData({
            proWidth: "100%",
          })
          setTimeout(() => {
            that.setData({
              regionSwitch: true,
            })
          }, 5000)
        } else {
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          })
        }
      },
      fail: function () {
        console.log("失败")
      }
    })
  },

  // 地区选择
  regionChoice: function (e) {
    this.setData({
      regionId: e.target.id
    })
  },
  //确定
  ensure: function () {
    if (this.data.regionId == '') {
      wx.showModal({
        content: "请选择你的地区",
        showCancel: false
      })
    } else {
      wx.navigateTo({
        url: '../opus/opus?regionId=' + this.data.regionId+'&peotryId='+this.data.peotryId+'&audioId='+this.data.audioId,
      })
    }
  },
  cancel: function () {
    this.setData({
      regionSwitch: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.authorize({
      scope: 'scope.record',
      success() {
      }
    })
    app.ajax("/web/poetry/"+options.peotryid+ "/get", (res) => {
      this.setData({
        recordData: res.data.ret,
        peotryId: options.peotryid,
        audioId:options.audioid,
        peotryCon: ((res.data.ret.poetry ||'').content||"").split("|")
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
    innerAudioContext.pause();
    innerAudioContext.onPause(() => {
      console.log("暂停");
    })
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


})