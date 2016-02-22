$(document).ready( function(){

function auth(options){
	
	$.ajax({
		url:options.url,
		type:'POST',
		data:options.fields,
		dataType:'json',
		brforeSend:function(){$(".overlay").fadeIn();},
		success:function(data){
			$.ajax({
			url:"templates/listing.html",
			type:'GET',
			dataType:'text',
			success:function(text){
				cm.setCookie("PhotoSessionID",data.id,2);
				var sv=new StoreDetailsView({data:data,text:text});
				sv.render();
				sv.postRender();
				$(".overlay").fadeIn();
			}
		});
		}

	});
}
var StoreDetailsView=Backbone.View.extend({
	el:'.main-container',
	initialize:function(options){
		this.options=options;
	},
	render:function(){
		console.log(this.options.data)
		var temp=_.template(this.options.text);
		var html=temp({data:this.options.data});
		this.$el.html(html);
		$(".hoo>tbody>tr>td>select").append($("#timing-options").text());
		
	},
	postRender:function(){
			function touch(g,h,i){
			    $input=$("body").find('input[value='+g+']')
			    $input.click();
			    if(h==4){
			    	/*
			    	$f=i.split(' to ')[0].replace(":","");
			    	$t=i.split(' to ')[1].replace(":","");
			    	
			    	$elem=$input.parent().parent().parent();
			    	$elem.find('select[name=from]').val($f);
			    	$elem.find('select[name=to]').val($t);
					//console.log($from+" "+ $f);
					//console.log($input.parent().parent().parent().find('select[name=from]').html());
					*/
			    }
			};
			
			var data=this.options.data;
			var et=data.categoryList;
			var al=data.attributeList;
			
			if(et!=null ){
			  $et_list=et.split(',');
			  $.each($et_list,function(e,f){
			  	touch(f);
			    console.log('category List :'+f);
			  })
			};
			if(al!=null ){
			  $al_list=al.split(',');
			  $.each($al_list,function(e,f){
			  	touch(f);
			  	console.log('attributeList :'+f);
			  })
			};
			//console.log(data.sundaytiming);
			if(data.mondaytiming!="OFF" ){
				touch('Mon',4,data.mondaytiming);
			}
			if(data.sundaytiming!="OFF" ){
				touch('Sun',4,data.sundaytiming);
			}
			if(data.tuesdaytiming!="OFF" ){
				touch('Tue',4,data.tuesdaytiming);
			}
			if(data.wednesdaytiming!="OFF" ){
				touch('Wed',4,data.wednesdaytiming);
			}
			if(data.thursdaytiming!="OFF" ){
				touch('Thu',4,data.thursdaytiming);
			}
			if(data.fridaytiming!="OFF" ){
				touch('Fri',4,data.fridaytiming);
			}
			if(data.saturdaytiming!="OFF" ){
				touch('Sat',4,data.saturdaytiming);
			}
			console.log(qq.basePublicApi.drawThumbnail("","","",""));
	}
});

var LoginView=Backbone.View.extend({
	el:'.main-container',
	events:{
		'click input[type=button]':function(){
			auth({
				url:$ROOT_URL+"/StoreAdminLogin",
				atype:false,
				fields:{
					email:$(".login-form").find("input[type=text]").val(),
					password:$(".login-form").find("input[type=password]").val(),
				}
			});	
		}
	},
	render:function(){
		var temp=_.template($('#login-template').html());
		this.$el.html(temp); 
	},
});

var Workspace=Backbone.Router.extend({
	routes:{
		'':'login',
		'store':'store'
	},
	login:function(){
		if(cm.getCookie('Ssession')!="" ||cm.getCookie('SstoreID')!="" ){
			this.store();
		}else{
			var loginView=new LoginView();
			loginView.render();
		}
	},
	store:function(){
		auth({url:$ROOT_URL+"/StoreAdmin"});
	},
	lookplex:function(){
		console.log("lookplex");
		
	}

});
var workspace=new Workspace();
Backbone.history.start();

})
