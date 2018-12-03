;(function(root,factory,plug){
	factory.call(root,root.jQuery,plug)
})(this,function($,plug){
	var __I18N__ = {
		"chinese" : {
			"not_form": "必须为form元素"
		},
		"english" : {
			"not_form": "is not form element" 
		}
	};//架构中要使用的常量

	//console.log(getMessage("chinese","error"))
	function getMessage(lang,key){
		return __I18N__[lang][key];
	}

	var __DEFS__ = {
		lang : "english"
	};
	//alert(this);//root===window
	$.fn[plug] = function(options){
		//console.log(this);//form
		$.extends(this,__DEFS__,options)；
		console.log(this.lang)
		if(this.is("form")){

		}else{
			throw new Error("必须为form元素");
		}
	}
},"bootstrapValidator");