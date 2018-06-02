module.exports = {
  previewImage: previewImage,
  saveImage: saveImage,
  downImage: downImage,
  openDocument: openDocument,
  selectAddress: selectAddress,
  backTop: backTop,
  showModal: showModal,
  pay: pay,
  auth: auth,
  startSoterAuthentication: startSoterAuthentication,
  call: call,
  showActionSheet: showActionSheet
}

function downImage(image) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: image,
      success: (image) => {
        resolve(image.path)
      },
      fail: (res) => {
        reject(res.errMsg || '图片下载失败')
      }
    })
  })
}

function showActionSheet(arr) {
  return new Promise((resolve, reject) => {
    wx.showActionSheet({
      itemList: arr,
      success: function (res) {
        console.log(res)
        resolve(res.tapIndex)
      },
      fail: function (res) {
        reject(res.errMsg)
      }
    })
  })
}

function startSoterAuthentication(title, unique) {
  let modalTitle = '确定' + (title || '进行该操作') + '吗';
  return new Promise((resolve, reject) => {
    wx.checkIsSupportSoterAuthentication({
      success(res) {
        if (res.supportMode.length <= 0) {
          showModal(modalTitle).then(() => {
            resolve();
          }, () => {
            reject();
          })
        } else {
          wx.startSoterAuthentication({
            requestAuthModes: ['fingerPrint'],
            challenge: unique || ('' + new Date().getTime() / 1000),
            authContent: '请使用指纹确认' + (title || '操作'),
            success(res) {
              if (res.errCode == 0) {
                resolve();
              } else {
                reject();
              }
            },
            fail(res) {
              if (res.errCode == 90008) {
                reject();
              } else {
                showModal(modalTitle).then(() => {
                  resolve();
                }, () => {
                  reject();
                })
              }
            }
          })
        }
      },
      fail() {
        showModal(modalTitle).then(() => {
          resolve();
        }, () => {
          reject();
        })
      }
    })
  })
}

function auth(title) {
  wx.showModal({
    title: '提示',
    content: title,
    confirmText: '开启',
    cancelText: '取消',
    success: function(res) {
      if (res.confirm) {
        wx.openSetting()
      }
    }
  })
}

function pay(config) {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      'timeStamp': config.timeStamp,
      'nonceStr': config.nonceStr,
      'package': config.package,
      'signType': config.signType,
      'paySign': config.paySign,
      'success': function() {
        resolve()
      },
      'fail': function(res) {
        console.log(res);
        reject('支付已取消')
      }
    })
  })
}

function showModal(title, options) {
  let defaultOption = {
    cancel: '取消',
    confirm: '确定'
  }
  options = Object.assign(defaultOption, options || {})
  return new Promise(function(resolve, reject) {
    wx.showModal({
      title: '提示',
      content: title,
      confirmText: options.confirm,
      cancelText: options.cancel,
      success: function(res) {
        if (res.confirm) {
          resolve();
        } else {
          reject();
        }
      }
    })
  })
}

function backTop() {
  wx.pageScrollTo({
    scrollTop: 0
  })
}

function previewImage(pic, current) {
  let params = {
    urls: typeof pic == 'string' ? [pic] : pic
  };
  if (current) {
    params.current = current;
  }
  wx.previewImage(params);
}

function saveImage(pic) {
  wx.saveImageToPhotosAlbum({
    filePath: pic
  })
}

function openDocument(file) {
  return new Promise(function(resolve, reject) {
    let types = ['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx'];
    let filetype = file.substring(file.lastIndexOf(".") + 1, file.length);
    if (types.indexOf(filetype) >= 0) {
      wx.openDocument({
        filePath: file,
        success: () => {
          resolve();
        },
        fail: (res) => {
          reject(res);
        }
      })
    } else {
      reject('不支持打开' + filetype + '文件');
    }
  })
}

function call(num) {
  wx.makePhoneCall({
    phoneNumber: num
  })
}

function selectAddress() {
  return new Promise(function(resolve, reject) {
    wx.chooseAddress({
      success: (res) => {
        resolve(res)
      },
      fail: function(res) {
        console.log(res.errMsg)
        let authreg = /auth/i;
        if (authreg.test(res.errMsg)) {
          auth('无法获取通讯地址，请开启允许获取通讯地址权限');
        } else {
          reject(res.errMsg)
        }
      }
    })
  })
}
