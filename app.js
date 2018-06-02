var toastr = require('/assets/utils/toastr-wxapp/toastr-wxapp.js')
var wxapp = require('/assets/utils/wxapp.js')
var Security = require('/assets/utils/security.js')
var MD5 = require('/assets/utils/md5.js')
var mockData = require('/assets/utils/mock/data.js');
var API_HOST = "https://ceshi.xinzhibang168.com/poetry/poetry/public/index.php";
var DEBUG = false;//切换数据入口
var Mock = require('/assets/utils/mock/mock.js')
var http = require('/assets/utils/mock/login.js')
var XTIME = Math.round(new Date().getTime() / 1000)
App({
  onLaunch: function (option) {
    this.security = new Security();
    wx.getSystemInfo({
      success: (res) => {
        this.device = {
          w: res.windowWidth,
          h: res.windowHeight,
          isAndroid: res.platform != 'ios',
          rpxToPx: function (rpx) {
            return rpx * res.windowWidth / 750;
          }
        }
      }
    })

  },
  onShow: function (option) {
    var s = wx.getStorageSync("token")
  },
  //模拟数据
  ajax: function (url = '', fn, method = "get", data = {}) {
    var XTIM = Math.round(new Date().getTime() / 1000)
    var XACCESSUSER = wx.getStorageSync("token").userId
    var XACCESS = wx.getStorageSync("token").access_token
    var XTOKEN = this.MD5.hexMD5(XACCESS + XACCESSUSER + XTIM)
    this.header = {
      "X-ACCESS-SECURE-TOKEN": XTOKEN,
      "X-ACCESS-USER": XACCESSUSER,
      "X-TIME": XTIM
    }
    var token = wx.getStorageSync("token")
    console.log(token.userId)
    console.log(token)
    if (!token.userId || token.userId == "undefined") {// == undefined || token.userId == null
      this.login(() => {
        this.ajax(url, fn, method = "get", data = {})
        return false
      })
    } else {
      if (token.access_token_tim <= XTIME){
        http('/web/auth/applet/refresh/'+this.refresh_token, (res) => {
          wx.setStorageSync("token", {
            "access_token": res.data.ret.access_token,
            "access_token_tim": res.data.ret.access_token_expired_time,
            "userId": res.data.ret.user_id
          })
        }, "get", {}, this.header)
       }
      if (!DEBUG) {
        wx.request({
          url: API_HOST + url,
          method: method ? method : 'get',
          data: data ? data : {},
          header: this.header ? this.header : { "Content-Type": "application/json" },
          success: function (res) {
            fn(res);
          }
        });
      } else {
        // 模拟数据
        var res = Mock.mock(mockData.data[url])
        // 输出结果
        // console.log(JSON.stringify(res, null, 2))
        fn(res)

      }
    }
  },
  login: function (ajax) {
    var that = this
    wx.login({
      success: function (res) {
        http('/web/auth/applet/jscode2session?code=' + res.code, (res) => {
          var opernId = res.data.ret.open_id
          wx.getUserInfo({
            success: function (res) {
              var data = {
                "encrypted_data": res.encryptedData,
                "iv": res.iv,
                "open_id": opernId
              }
              http('/web/auth/applet/login', (res) => {
                if (res.statusCode == "200") {
                  that.userId = res.data.ret.user_id;
                  wx.setStorageSync("token", {
                    "access_token": res.data.ret.access_token,
                    "access_token_tim": res.data.ret.access_token_expired_time,
                    "userId": res.data.ret.user_id,
                    "refresh_token": res.data.ret.refresh_token
                  })
                  if (res.data.ret.access_token_expired_time < XTIME) {
                    http('/web/auth/applet/refresh/' + res.data.ret.refresh_token, (res) => {
                      wx.setStorageSync("token", {
                        "access_token": res.data.ret.access_token,
                        "access_token_tim": res.data.ret.access_token_expired_time,
                        "userId": res.data.ret.user_id
                      })
                    }, "get", {}, that.header)
                  }
                } else {
                  wx.setStorageSync("token", {
                    "access_token": null,
                    "access_token_tim": null,
                    "userId": null
                  })
                }
              }, "post", data)
              ajax()
            },
            fail: function () {
              wx.openSetting({
                success(res) {
                  if (res.authSetting["scope.userInfo"]) {
                    ajax()
                  } else {
                    wx.showModal({
                      title: "提示",
                      content: "请授权",
                      showCancel: false,
                      success: function (res) {
                        ajax()
                      }
                    })
                  }
                }
              })
            }
          })
        })
      }
    });
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.data.userInfo) {
      typeof cb == "function" && cb(this.data.userInfo)
    } else {
      wx.login({
        success: (() => {
          wx.getUserInfo({
            lang: 'zh_CN',
            success: function ({ userInfo }) {
              that.data.userInfo = userInfo
              typeof cb == "function" && cb(that.data.userInfo)
            }
          })
        })
      });
    }
  },

  

  data: {
    token: '',
    XACCESSUSER: '',
    useId: '',
    header: '',
    refresh_token:'',
    http:http,
  },
  cache: {
  },
  toastr: toastr,
  wxapp: wxapp,
  MD5: MD5
})
