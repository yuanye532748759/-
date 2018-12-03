;(function(root,factory,plug){
	factory.call(root,root.jQuery,plug)
})(this,function($,plug){
	//console.log(getMessage("chinese","error"))
	function getMessage(lang,key){
		return __I18N__[lang][key];
	}
	var __I18N__ = {
		"zh" : {
			"not_form": "必须为form元素",
			"def_error" : "验证失败"
		},
		"en" : {
			"not_form": "is not form element",
			"def_error" : "invalid"
		}
	};//架构中要使用的常量

	//规则引擎
	var __RULES__ = {
		"required" : function(){
			return this.val()!="";
		},
		"email" : function(){
			return /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(this.val());
		},
		"mobile" : function(){
			return /^1\d{10}$/.test(this.val());
		},
		"regex" : function(){
			return new RegExp(this.data("bv-regex")).test(this.val());
		},
		"amount" : function(){
			return  /^([1-9][0-9]*)?[0-9]\.[0-9]{2}$/.test(this.val());
		},
		"integer" : function(){
			return true;
		},
		"min" : function(){
			return true;
		},
		"max" : function(){
			return true;
		}
	}
	//defaults  默认的参数
	var __DEFS__ = {
		lang : "en",
		raise : "change",
		extendRule : function(rules){
			$.extend(__RULES__,rules)
		}
	};
	function showMessage(t,$f,rule){
		var msg = $f.data("bv-"+rule+"-message");
		//校验失败
		if(msg){
			$f.after("<p class='text-danger'>"+msg+"</p>");
		}else{
			$f.after("<p class='text-danger'>"+getMessage(t.lang,"def_error")+"</p>");
		}
		if($f.is(":hidden")){
			var index = $f.parents(".tab-pane").index()
			$f.parents(".tab-content").prev().find("a").eq(index).tab('show')
		}
	}
	//alert(this);//root===window
	$.fn[plug] = function(options){
		//console.log(this);//form
		var that = this;
		$.extend(this,__DEFS__,options);//扩展
		if(this.is("form")){
			var $fileds = this.find("input,textarea,select");
			$fileds.on(this.raise,function(){
				var $field = $(this);//当前被校验的表单元素
				var $group = $field.parents(".form-group:first");//找到对应的group
				//reset重置好样式状态和提示信息
				$group.removeClass("has-success has-error").children("p.text-danger").remove();
				var result = false;//校验结果，默认为false
				$.each(__RULES__,function(rule,valid){
					if($field.data("bv-"+rule)){
						result = valid.call($field);//调用某个rule的验证，返回结果
						$group.addClass(result?"has-success":"has-error");
						if(!result){
							showMessage(that,$field,rule);
							return false;
						}
					}
				});
			});
			this.on("submit",function(){
				$fileds.trigger(that.raise);
				if($fileds.parents(".form-group.has-error").size()==0){
					this.submit();
				}
				return false;
			})
			return this;
		}else{
			throw new Error(getMessage(this.lang,"not_form"));
		}
	}
},"bootstrapValidator");