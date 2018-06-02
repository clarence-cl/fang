/*
 * Author: simsir-lin
 * Github: https://github.com/simsir-lin
 * Email: 15986907592@163.com
 */

const IMAGEPATH = '/assets/utils/toastr-wxapp/images/';
var timer = 0;

function ok(data, cb) {
  show(data, 'ok.png', cb);
}

function error(data, cb) {
  show(data, 'error.png', cb);
}

function warning(data, cb) {
  show(data, 'warning.png', cb);
}

function text(data, cb) {
  show(data, '', cb);
}

function loading(data) {
  let fn;
  if (wx.showLoading) {
    fn = wx.hideLoading
    wx.showLoading({
      title: data.title || data,
      mask: typeof data.mask == 'boolean' ? data.mask : true
    })
  } else {
    fn = wx.hideLoading
    wx.showToast({
      title: data.title || data,
      icon: 'loading',
      mask: typeof data.mask == 'boolean' ? data.mask : true,
      duration: data.duration || 3000
    })
  }
  return fn;
}

function startTimer(cb, duration) {
  if (cb) {
    timer = setTimeout(function () {
      clearTimeout(timer);
      cb();
    }, duration)
  }
}

function show(data, image, cb) {
  let title = '';
  let duration = 2000;
  let mask = false;
  if (!data) {
    startTimer(cb, duration)
    return;
  }
  if (typeof data == 'object') {
    title = data.title
    duration = data.duration
    mask = data.mask
  } else {
    title = data
  }
  if (title.length > 7 || image.length <= 0) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: duration,
      mask: false,
      complete: () => {
        startTimer(cb, duration)
      }
    })
  } else {
    wx.showToast({
      title: title,
      image: IMAGEPATH + image,
      duration: duration,
      mask: mask,
      complete: () => {
        startTimer(cb, duration)
      }
    })
  }
}

module.exports = {
  ok: ok,
  warning: warning,
  loading: loading,
  error: error,
  text: text
}
