module.exports = {
	devServer: {
	  // 设置代理
	  proxy: {
		 "/cms": {
			target: "http://47.99.132.18:9999/", // 访问数据的计算机域名
			changOrigin: true //开启代理
		 }
	  }
	}
 };