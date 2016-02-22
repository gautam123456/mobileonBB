$(document).ready( function(){
$data_list="";

$days=["sundayTiming","mondayTiming","tuesdayTiming","wednesdayTiming","thursdayTiming","fridayTiming","saturdayTsiming"];
$times=["OFF","OFF","OFF","OFF","OFF","OFF","OFF"];



function auth(options){
	
	$.ajax({
		url:options.url,
		type:'POST',
		contentType: 'application/x-www-form-urlencoded',
		data:options.fields,
		dataType:'json',
		xhrFields: {
					withCredentials: true
				   },
		beforeSend:function(){
			$(".overlay").fadeIn();
		},

		success:function(data, status, xhr){
			if (data.status == "SUCCESSFULL") {
				cm.setCookie("lsessionID",data.lsessionID,2);
				cm.setCookie("ladminID",data.ladminID,2);
				var obj = JSON.parse(data.storeData);
				$data_list=obj;
				var lv=new ListView(obj);
				lv.render();
				var logoutv=new LogoutView();
				logoutv.render();
			}else if (data.status == "WRONG SESSION!") {

				$workspace.login();
				$(".label-warning").html("PLEASE INPUT RIGHT CREDENTIALS.");
			}
		},
		error:function(msg){

			console.log(msg.responseText);
			$workspace.login(false);
			if(msg.responseText!="LOGIN SESSION EXPIRED TRY AGAIN" && msg.responseText!="WRONG SESSION!"){
				$(".label-warning").html("PLEASE INPUT RIGHT CREDENTIALS.");
			}				
		}
	});
}

var StoreDetailsView=Backbone.View.extend({
	el:'.main-container',
	initialize:function(options){
		this.options=options;
	},
	events:{

        },
	render:function(){
		//console.log(this.options.data)
		var temp=_.template(this.options.text);
		var html=temp({data:this.options.data,brand:this.options.brand});
		this.$el.html(html);
		$(".submit-listing").val("Update").removeClass("submit-listing").addClass("update-listing");
		$(".form-group.bl").removeClass("hidden");
		$(".hoo>tbody>tr>td>select").append($("#timing-options").text());
	},
	postRender:function(){
			function touch(g,h,i){
			    $input=$("body").find('input[value='+g+']')
			    $input.click();
			};
			var data=this.options.data;
			var et=data.categoryList;
			var al=data.attributeList;
			
			if(et!=null ){
			  $et_list=et.split(',');
			  $.each($et_list,function(e,f){
			    touch(f);
			  })
			};

			if(al!=null ){
			  $al_list=al.split(',');
			  $.each($al_list,function(e,f){
			    //console.log(f);
			    touch(f);
			    });
			};


        console.log("After post rendering");
			
	}

});

var LoginView=Backbone.View.extend({
	el:'.main-container',
	events:{
		'click #loginadmin':function(){

            auth({
				url:$ROOT_URL+"/LookplexAdminLogin",
				atype:false,
				fields:{
					email:$(".login-form").find("input[type=text]").val(),
					password:$(".login-form").find("input[type=password]").val()
				}
			});
            $(".overlay").fadeOut();
		}
	},
	render:function(){
		var temp=_.template($('#login-template').html());
		this.$el.html(temp);
	},
    postRender:function(){
        $('#store').prop('disabled', true);
    }
});
var ListView=Backbone.View.extend({
    el:'.main-container',
    initialize:function(options){
        this.options=options;
    },
    events:{
        'click .sar-list>.list-group-item':function(e){
            $id=$(e.currentTarget).attr("data-id");
            $workspace.navigate("#/store/"+$id);
            //alert($id);
        }
    },
    render:function(){
        var temp=_.template($("#sar-list-template").html());
        var html=temp({datas:this.options});
        this.$el.html(html);
    }
});

var LogoutView=Backbone.View.extend({
	el:'.top-menu',
	events:{
		'click a.adminlogout':'adminLogout'
	},
	adminLogout:function(){
		cm.deleteCookie("lsessionID");
		cm.deleteCookie("ladminID");
		var loginv=new LoginView();
		loginv.render();
		$("a.adminlogout").remove();
	},
    render:function(){
    	var temp=_.template($('#logout-template').html());
		this.$el.append(temp);
    }
});

var Workspace=Backbone.Router.extend({
	routes:{
		'':'login',
		'store_list':'store_list',
		'store/:id':'store',
        'store_edit/:id-:guid':'store_edit'
	},
	login:function(){
		if(cm.getCookie('lsessionID')!="" && cm.getCookie('ladminID')!=""){
			this.store_list();
		}else{

			var loginView=new LoginView();
			loginView.render();
		}
	},
	store:function(_id){
		if(cm.getCookie('lsessionID')=="" || cm.getCookie('ladminID')=="" || $data_list==""){
			$workspace.navigate("");
			this.login();
		}
		else{
			var z;
			$.each($data_list,function(index,value){
				if(value.id==_id){z= value;};
			});

			cm.setCookie("PhotoSessionID",_id,2);

			cm.displayAllCookie();

			$.ajax({
				url:"templates/adminlisting.html",
				type:'GET',
				dataType:'text',
                xhrFields: {
                    withCredentials: true
                },
				success:function(text){
					var sv=new StoreDetailsView({data:z,text:text});
					sv.render();
					sv.postRender();
				}
			});
		}
		
	
	},
    store_edit:function(_id,guid){
        //console.log("id is "+_id);
        var store_data="";
        if(cm.getCookie('lsessionID')=="" || cm.getCookie('ladminID')=="" || $data_list==""){
            $workspace.navigate("");
            this.login();
        }
        else{
            $('#store').prop('disabled', false);
            $.ajax({
                type:"POST",
                url: $ROOT_URL+"/getstoredetailswithblockLocation",
                cache:false,
                data:{storeid:_id,guid:guid},
                dataType:"json",
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function(){
                    $(".search-bar-spinner").css("display","inline-block");
                },
                success:function(data,status,jqXhr){
                    store_data=data;
                    $('#store').focus(); $('#store').val(" ");$('#store').val("");
                    cm.setCookie("PhotoSessionID",store_data.sarId,2);
                    cm.displayAllCookie();
                    var brands;
                    $.ajax({
                        url:$ROOT_URL+'/getbrandgeneric',
                        contentType: 'application/x-www-form-urlencoded',
                        type:'POST',
                        async:'false',
                        xhrFields: {
                            withCredentials: true
                        },
                        dataType:'json',
                        success:function(data){
                            brands = data;
                        },
                        error:function(msg){
                            console.log("brands "+"msg");
                        }

                    });

                    $.ajax({
                        url:"templates/listingedit.html",
                        type:'GET',
                        xhrFields: {
                            withCredentials: true
                        },
                        dataType:'text',
                        success:function(text){
                            var sv=new StoreDetailsView({data:store_data,text:text,brand:brands});
                            sv.render();
                            sv.postRender();
                            console.log("---------------" + brands +"======"+ JSON.stringify(brands) + "----------------");
                        }
                    });
                    $(".overlay").fadeOut();
                }
            }).fail(function(){
                console.log('failed');
            })


        }
    },
	store_list:function(){
		if(cm.getCookie('lsessionID')!="" && cm.getCookie('ladminID')!=""){		
		$.ajax({
		url:$ROOT_URL+"/LookplexAdmin",
		type:'POST',
        xhrFields: {
            withCredentials: true
        },
		contentType: 'application/x-www-form-urlencoded',
		data:{lsessionid:cm.getCookie('lsessionID'),ladminid:cm.getCookie('ladminID')},
		dataType:'json',
		beforeSend:function(){
			$(".overlay").fadeIn();
		},
		success:function(data, status, xhr){
			if (data.status == "SUCCESSFULL") {
				var obj = JSON.parse(data.storeData);
				$data_list=obj;
				var lv=new ListView(obj);
				lv.render();
				
				if ($(".top-menu>a:last").hasClass("adminlogout")==false) {
					var logoutv=new LogoutView();
					logoutv.render();
				};
				$(".overlay").fadeOut();
			};
			//console.log("xhr : "+JSON.stringify(xhr));	
		},
		error:function(msg){
			$(".overlay").fadeOut();			
			console.log(msg.responseText);
			$workspace.login();
			if(msg.responseText!="LOGIN SESSION EXPIRED TRY AGAIN" && msg.responseText!="WRONG SESSION!"){
				$(".label-warning").html("PLEASE INPUT RIGHT CREDENTIALS.");
			}				
		}

	});
	}else{
			
			var loginView=new LoginView();
			loginView.render();
	}
	}

});
$workspace=new Workspace();
Backbone.history.start();

})
$.ajaxSetup({
    xhrFields: {
        withCredentials: true
    },
    crossDomain: true,
    type: "get",
    headers: {
        'Cache-Control' : 'max-age=1000',
        'Accept' : 'application/json',
        'X-Requested-With':'XMLHttpRequest'
    },
    beforeSend: function(xhr) {
        xhr.setRequestHeader('Content-Type', 'text/plain');
    }
});

