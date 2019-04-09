function sendMessage(mobile) {
  var http = require('http');
  var username = "";
  var secretkey = "";
  
  var path = "/sms_token?ddtkey=" + username + "&secretkey=" + secretkey
      + "&mobile=" + mobile + "&content=Go"

  var options = {
      host: '112.124.17.46',
      port: 7001,
      path: path,
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  };
  http.get(options, function (res) {
      var resData = "";
      res.on("data", function (data) {
          resData += data;
      });
      res.on("end", function () {
          console.log("影片已经上映，短信通知成功")
      });
  })
}
