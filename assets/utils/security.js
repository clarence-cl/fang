var md5 = require('md5.js')
var API = 'https://bounty.xinzhibang168.com/bounty/bounty/public/index.php/web'

class Token {
  constructor(value, expire) {
    if (!value) {
      this.value = null
      this.expire = null
    } else {
      if (typeof value == 'object') {
        this.value = value.value
        this.expire = value.expire
      } else {
        this.value = value
        this.expire = expire
      }
    }
  }

  isInvalid() {
    if (!this.value) {
      return true
    }
    if (!this.expire) {
      return true
    }
    return this.expire * 1000 < ((new Date().getTime()) + (3 * 60 * 1000))
  }

  getValue() {
    return this.value || null
  }
}

class Security {
  constructor() {
    this.token = new Token(wx.getStorageSync('localtoken') || null)
    this.userid = wx.getStorageSync('localuserid') || '';
  }

  setToken(value) {
    this.token = new Token(value)
    wx.setStorage({
      key: 'localtoken',
      data: value
    })
  }

  setUserId(userid) {
    this.userid = userid;
    wx.setStorageSync('localuserid', userid);
  }

  getToken() {
    return this.token.getValue()
  }

  clearToken() {
    wx.setStorageSync('localtoken', null)
    this.token = new Token(null)
  }

  isAuthenticated() {
    let invalid = this.token.isInvalid()
    return !invalid;
  }

  http(method, url, data) {
    method = method.toUpperCase();
    let that = this
    let header = {}
    let token = that.token.getValue();

    header['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8'

    if (token) {
      let userid = that.userid;
      let nowtime = Date.parse(new Date()) / 1000;
      let encrypt = md5.hexMD5(token + userid + nowtime);
      header['X-ACCESS-SECURE-TOKEN'] = encrypt;
      header['X-TIME'] = nowtime;
      header['X-ACCESS-USER'] = userid;
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: API + url,
        method: method,
        data: data || {},
        header: header,
        success: (res) => {          
          if (res.statusCode == 404) {
            reject('未定义路由');
          } else if (res.statusCode == 500) {
            reject('服务器维护中^_^');
          } else if (res.statusCode == 422 || res.statusCode == 442) {
            if (typeof res.data == 'string') {
              res.data = JSON.parse(res.data);
            }
            reject(res.data.error || res.data.ret);
          } else if (res.statusCode == 420 || res.statusCode == 401) {
            this.clearToken();
            reject('relogin');
          } else {
            if (typeof res.data == 'string') {
              res.data = JSON.parse(res.data);
            }
            resolve(res.data.ret);
          }
        },
        fail: function (res) {
          reject(res.errMsg || '发送网络错误(http fail)')
        }
      })
    })
  }

  upload(url, data) {
    let that = this
    let header = {}
    let token = that.token.getValue();

    header['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8'

    if (token) {
      let userid = that.userid;
      let nowtime = Date.parse(new Date()) / 1000;
      let encrypt = md5.hexMD5(token + userid + nowtime);
      header['X-ACCESS-SECURE-TOKEN'] = encrypt;
      header['X-TIME'] = nowtime;
      header['X-ACCESS-USER'] = userid;
    }
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: API + url,
        filePath: data.file,
        name: data.filename,
        header: header,
        formData: data.form || {},
        success: (res) => {  
          console.log(res)        
          if (res.statusCode == 404) {
            reject('未定义路由');
          } else if (res.statusCode == 500) {
            reject('服务器维护中^_^');
          } else if (res.statusCode == 422 || res.statusCode == 442) {
            if (typeof res.data == 'string') {
              res.data = JSON.parse(res.data);
            }
            reject(res.data.error || res.data.ret);
          } else if (res.statusCode == 420 || res.statusCode == 401) {
            this.clearToken();
            reject('登录身份已失效，请重新打开');
          } else {
            if (typeof res.data == 'string') {
              res.data = JSON.parse(res.data);
            }
            resolve(res.data.ret);
          }
        },
        fail: (res) => {
          reject(res.errMsg || '发送网络错误(http fail)')
        },
      })
    })
  }
}

module.exports = Security;
