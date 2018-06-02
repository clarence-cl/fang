//模拟数据
var API_HOST = "https://ceshi.xinzhibang168.com/poetry/poetry/public/index.php";
var DEBUG = false;//切换数据入口
var Mock = require('mock.js')
var mockData = require('data.js')
var http=function(url = '', fn, method = "get", data = {}, header = {}) {
  if (!DEBUG) {
    wx.request({
      url: API_HOST + url,
      method: method ? method : 'get',
      data: data ? data : {},
      header: header ? header : { "Content-Type": "application/json" },
      success: function (res) {
        fn(res);
      }
    });
  } else {
    // 模拟数据
    var res = Mock.mock(mockData.data[url])
    // 输出结果
    fn(res);
  }
}
module.exports = http
