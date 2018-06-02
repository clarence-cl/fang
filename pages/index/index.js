var app = getApp();
Page({
  data: {
    scrollviewWidth: app.device.w * 0.85,
    scrollviewIndex: 0,
    list: [],
    scrollLeft: 0,
    scrolling: false,
    timer: 0,
    num: 0
  },
  go: function (e) {
    this.setData({
      num: e.currentTarget.dataset.index
    })
    let dotIndex = Number(e.currentTarget.dataset.index)
    let flag = Number(e.currentTarget.dataset.flag);
    // let index = this.data.scrollviewIndex + flag;
    let index = dotIndex
    // if (index < 0) {
    // index = 0
    // }
    // if (index > 5) {
    // index = 5
    // }
    this.setData({
      scrollviewIndex: index,
      scrollLeft: (index * (this.data.scrollviewWidth + app.device.rpxToPx(30))) - app.device.rpxToPx(15)
    })
  },
  handleTouchStart(e) {
    this.data.x = e.changedTouches[0].pageX;
  },
  handleTouchEnd(e) {
    let x = e.changedTouches[0].pageX;
    if (this.data.x == x) {
      wx.navigateTo({
        url: '../showcase/showcase?audioid=' + this.data.list[this.data.scrollviewIndex].id + '&peotryid=' + this.data.list[this.data.scrollviewIndex].poetry.id
      })
      return;
    }
    if ((x - this.data.x) < -50) {
      if (this.data.scrollviewIndex >= this.data.list.length - 1) {
        return;
      }
      this.data.scrollviewIndex++;
    } else {
      if (this.data.scrollviewIndex <= 0) {
        return;
      }
      this.data.scrollviewIndex--;
    }
    this.setData({
      scrollviewIndex: this.data.scrollviewIndex
    })
    wx.createSelectorQuery().select('#scrollview').scrollOffset((res) => {
      this.setData({
        scrollLeft: (this.data.scrollviewIndex * (this.data.scrollviewWidth + app.device.rpxToPx(30))) - app.device.rpxToPx(15)
      })
    }).exec()
  },
  handleScroll: function () {
    this.data.scrolling = true;
    clearTimeout(this.data.timer)
    this.data.timer = setTimeout(() => {
      wx.createSelectorQuery().select('#scrollview').scrollOffset((res) => {
        let xishu = res.scrollLeft / this.data.scrollviewWidth;
        console.log(xishu)
        if (xishu == 0) {
          var zhengshu = Number((xishu + ''))
          var xiaoshu = Number((xishu + ''))
        } else {
          var zhengshu = Number((xishu + '').split('.')[0])
          var xiaoshu = Number((xishu + '').split('.')[1][0])
        }
        if (xiaoshu >= 5) {
          zhengshu += 1;
        }
        if (zhengshu <= 0) {
          zhengshu = 0
        }
        if (zhengshu > (this.data.list.length  - 1)) {
          zhengshu = this.data.list.length - 1
        }
        this.setData({
          scrollviewIndex: zhengshu,
          scrollLeft: (zhengshu * (this.data.scrollviewWidth + app.device.rpxToPx(30))) - app.device.rpxToPx(15)
        })
      }).exec()

    }, 200)
  },
  toinfo:function(e){
     //诗词id e.currentTarget.dataset.peotryid
     //音频id e.currentTarget.id
    console.log("诗词id" + e.currentTarget.dataset.peotryid + "|" + "音频id"+ e.currentTarget.id)
    wx.navigateTo({
      url: '../showcase/showcase?audioid='+e.currentTarget.id+'&peotryid='+e.currentTarget.dataset.peotryid
    })
  },
  onLoad: function (options) {
    app.ajax("/web/homepage/show",(res)=>{
     this.setData({
       "list":res.data.ret
     })
    })

  },
  onShareAppMessage: function () {
    return {
      title:'今日推荐',
      path:'pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }

  }
})
