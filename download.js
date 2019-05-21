var downloadFile = function (res, fileName, fileType) {
  if (fileName == null) {
    fileName = 'test.doc'
  }
  if (fileType == null) {
    fileType = 'application/msword;charset=utf-8';
  }
  var blob = new Blob([res], {
    type: fileType
  })
  var downloadElement = document.createElement('a');
  var href = window.URL.createObjectURL(blob); //创建下载的链接
  downloadElement.href = href;
  downloadElement.download = fileName; //下载后文件名
  document.body.appendChild(downloadElement);
  downloadElement.click(); //点击下载
  document.body.removeChild(downloadElement); //下载完成移除元素
  window.URL.revokeObjectURL(href); //释放掉blob对象
}