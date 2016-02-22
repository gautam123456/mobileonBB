// JavaScript Document
$ROOT_URL="http://localhost/masnep-Webapp/masnepservice";//http://www.lookplex.com/ws/masnepservice//http://www.lookplex.com/
//http://localhost/masnep-Webapp
var cm;
$(document).ready(function(e) {


$.ajaxSetup({ cache: true });
  $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
    FB.init({
      appId: '793762427404557',
      version: 'v2.3' // or v2.0, v2.1, v2.0
    });     
//    $('#loginbutton,#feedbutton').removeAttr('disabled');
    FB.getLoginStatus(function(response){
		statusChangeCallback(response)
		});
  });

 function CookieManager(){
 	this.setCookie= function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
	};

	this.getCookie= function (cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	    }
    return "";
	};
	this.deleteCookie=function(cname){
	    document.cookie = cname + "=" + "; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	};
	this.displayAllCookie=function(){
		console.log(document.cookie);
	},
	this.checkCookie=function () {

	}
 };
 
cm=new CookieManager();
cm.deleteCookie("SstoreID");
cm.deleteCookie("Ssession");
// This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(JSON.stringify(response));
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
	  $("#login").modal('hide');
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      //document.getElementById('status').innerHTML = 
	  console.log('Please log ' +
        'into this app.');
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      //document.getElementById('status').innerHTML = 
	  console.log('Please log ' +
        'into Facebook.');
    }
  }
function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me?fields=id,name,picture,gender,email', function(response) {
     // console.log('Successful login for: ' + response.me.name);
	 // $username=response.me.name;
	  $(".top-menu>a[data-target=#login]").attr({"data-target":"#logout","platform":"fb"}).html("Logg");
     // document.getElementById('status').innerHTML =
      console.log(  'Thanks for logging in, ' + JSON.stringify(response) + '!');
    });
  }
  
 

$(document).on('click', "button.login-btn",function(){
	if($(this).attr('id')=="facebook"){
		FB.login(function(response){
		statusChangeCallback(response);
		});//?scope='public_profile, email , user_friends'
	}
	else{
		alert('to be done');
	}
	
});

$(document).on('click',".top-menu>a[data-target=#logout]",function(e){
	e.preventDefault();
	if($(this).attr('platform')=='fb'){ 
		$(this).attr({"data-target":"#login"}).html("Log In");
		FB.logout(function(response){console.log('successfully logged out.'); console.log(JSON.stringify(response));}) 
	}
});

function checkLogInStatus(){
	FB.getLoginStatus(function(response) {
    	statusChangeCallback(response);
  	});
}


/******** TOP-MENU NAVIGATION ***********************/
$(document).on("click",".top-menu>a",function(e) {
	e.preventDefault();
	if($(this).attr("data-target")=="#login"){
		showModal("#login");
	}
	/*else if($(this).attr("data-target")=="#signup"){
		if(!$("#signup").hasClass("modal")){
			$.get("templates/login-signup-modal.txt",
			function(data,status,jqXhr){$("body").prepend(data);$("#signup").modal("show");}
			);
		}
		else{
			$("#signup").modal("show");
		}
	}*/
	else if($(this).attr("data-target")=="#hiw"){
		$(".how-it-works").slideDown();
	}
	else if($(this).attr("data-target")=="#faq"){
		showModal("#faq");
	}
	else if($(this).attr("data-target")=="#freelisting"){
		window.location="#/freelisting";
		return true;
	}
});
function showModal(e){
	if(!$(e).length>0){
			$.get("templates/login-signup-modal.txt",
				function(data,status,jqXhr){$("body").prepend(data);$(e).modal("show");}
			);
		}
		else{
			$(e).modal("show");
		}
}

$(document).on("click",".close",function(){
	$(".how-it-works").slideUp();
});

/************************* home photo slide ************************************/	

var slider;
function slide_function(){
		$(".slide-view>div").first().animate({marginLeft:"-1170px"},400,function(){//-1050px for 1140px max width
				$el=$(this);
				$(".slide-view>div").last().after($el.next().next().detach());
				$(".slide-view>div").last().before($el.next().detach());
				$(".slide-view>div").last().prev().before($el.detach().css("margin-left",""));
			});
		
}

function slide_control(e){
	slider=setTimeout(function(){
		slide_function();
		slide_control();
		},3000);
}
//slide_control();

$(".slide-view").on({
	mouseenter :function(){
		clearTimeout(slider);
		},
	mouseleave :function(){
		//slide_control();
		}
});

/********
FAQ
****/

$(".faq-menu>li").click(function(e) {
    $(".faq-menu>li").removeClass("active");
	$(this).addClass("active");
	//alert($(this).html());
});

/****
MODAL

***/
$(".modal-inner-link").click(function(e) {
    $to=$(this).attr("data-target")

	if($to=="#signup"){
		$($to).modal("toggle");
		$("#login").modal("toggle");
	}
	else{
		$($to).modal("toggle");
		$("#signup").modal("toggle");	
	}
});

/*******
FILTER
****/
$(".filter-menu>h5").click(function(e) {
	$(this).find("i").toggleClass("fa-angle-up");
	$(this).find("i").toggleClass("fa-angle-down");
    $(this).parent().find(".sub-filter").toggle("fast");
});

/******
PARLOR
******/
$(".nav-list>h4").click(function(e) {
    $(".nav-list>h4.active").removeClass("active");
	$(".nav-contents>div.active").removeClass("active").fadeOut();
	
	$(this).addClass("active");
	$to=$(this).attr("data-to");
	if($to=="rate-card"){
		$(".nav-contents>div.rate-card").addClass("active").fadeIn();
	}
	else if($to=="photos"){
		$(".nav-contents>div.photos").addClass("active").fadeIn();
	}
	else if($to=="reviews"){
		$(".nav-contents>div.comments").addClass("active").fadeIn();
	}
	else{
		$(".nav-contents>div.professionals").addClass("active").fadeIn();
	}
});


$(document).on('hover',".stars>i",function(e) {
   
   	$data_value=$(this).attr("data-value");
	$stars=$(this).parent().find("i");
	$i=0;
	while($data_value>0){
		$stars.eq($i).addClass("fa-star-hover");
		$data_value--;
		$i++;
	}
	},
	function(e){
		$(this).parent().find("i").removeClass("fa-star-hover");
	}
);

$(document).on('click',".stars>i",function(e) {
   
   	$data_value=$(this).attr("data-value");
	$stars=$(this).parent().find("i");
	$stars.removeClass("fa-star-active");
	$i=0;
	while($data_value>0){
		$stars.eq($i).addClass("fa-star-active");
		$data_value--;
		$i++;
	}
	});

$(".screen-menu-rate").click(function(e) {
	$(".nav-list>h4").eq(3).click();
});



function getLocationSuggestion($query_location){
	console.log($query_location);
	$.ajax({
					type:"POST",
					url: $ROOT_URL+"/getLocation",
					cache:false,
					data:"location="+$query_location,
					dataType:"json",
					xhrFields: {
					// The 'xhrFields' property sets additional fields on the XMLHttpRequest.
					// This can be used to set the 'withCredentials' property.
					// Set the value to 'true' if you'd like to pass cookies to the server.
					// If this is enabled, your server must respond with the header
					// 'Access-Control-Allow-Credentials: true'.
					withCredentials: false
				   },
				   //headers: {
					// Set any custom headers here.
					// If you set any non-simple headers, your server must include these
					// headers in the 'Access-Control-Allow-Headers' response header.
					//Access-Control-Allow-Headers: "Content-Type, Content-Range, Content-Disposition, Content-Description",
					//},
					beforeSend: function(){
						$(".search-bar-spinner").fadeIn();
						},
					success:function(data,status,jqXhr){
						$(".search-bar-spinner").fadeOut();
						$location_suggestion="";
						$.each(data,function(index,element){
							$location_suggestion+="<div class=\"list-group-item location-item\" data-l-guid=\""+element.guid+"\">"+element.locationName+"</div>";
						});
						//$location_suggestion+="<div class=\"list-group-item location-item hidden\" data-l-guid=\"\">xyz</div><div class=\"list-group-item location-item hidden\" data-l-guid=\"\"></div>";
						$(".location-suggestion").html($location_suggestion).slideDown();	
						}/*,
					error:function(){
						alert("hello");
						}*/
					}).fail(function(){
						$(".search-bar-spinner").fadeOut();
						console.log('failed');
					})
}

$suggestionInterval="";
$queryOld="";
$(document).on({
	focusin :function(){
			//showOverlay(false);
			//$('html, body').animate({scrollTop:200},500);
			$(".categories-list").slideUp();
			$queryNew=$("input[name=location]").val();
			$(this).on("keydown",function(e){ $queryNew=$("input[name=location]").val(); });
			$(".search-bar").toggleClass('attop')
			$suggestionInterval=setInterval(function(){
				
			if($queryOld!=$queryNew){
				if($queryNew.length>2){
					getLocationSuggestion($queryNew);
					$queryOld=$queryNew;
				}
				else{
					$(".location-suggestion").html("").slideUp();
				}
			}	
			},500);				
		},
	focusout:function(){
			$(".search-bar").toggleClass('attop');
			clearInterval($suggestionInterval);
			//setTimeout( $(".location-suggestion").fadeOut(),1000);
			}
	},"input[name=location]");

$(document).on({
	focusin : function(){
	$(".location-suggestion").fadeOut();
	$(".categories-list").slideDown();
	$(".search-bar").toggleClass('attop');//css("z-index","2000");
	},
	focusout :function(){
	$(".search-bar").toggleClass('attop');
	//setTimeout( $(".categories-list").fadeOut(),1000);
	}
},"input[name=service]");

$(document).on({
	focusin:function(){
		showOverlay(false);
		},
	focusout:function(){
		$(".overlay").fadeOut("slow");
		}
},".search-bar>.form-group");


$(document).on({
	focusin:function(){
		$('html, body').animate({scrollTop:180},500);
	},
},".search-bar:not(.search-bar-top)");


// FORM HANDLER

$(document).on('click','.checkbox-btn',function(){
  $(this).toggleClass('btn-default').toggleClass('btn-primary');
  
  $y=$(this).text();
  $z=$(this).find('input[type=hidden]');
  if($z.attr('name')=='et'|| $z.attr('name')=='hl' ){$z.toggleClass('checked');}
  if($z.attr('name')=='brand'){$('input[name=brand]').removeClass('checked');$z.toggleClass('checked');}

// chechk if button is hoo
  $d=$(this).parent().parent().parent().parent().attr('class');
  if($d=="hoo"){
    $z=$(this).parent().parent().find('td>select');
    $z.attr('disabled');
    if($z.attr('disabled')=='disabled'){
      $z.removeAttr('disabled');
    }
    else{
      $z.attr('disabled','disabled');
    }
  }


});





/************************************************************************************************/
/******************************************************	BACKBONE			BACKBONE 	BACKBONE
/************************************************************************************************/



});

