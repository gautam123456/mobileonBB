
//PRODUCTION
$ROOT_URL="https://storeapi.lookplex.com/ws/masnepservice";//http://www.lookplex.com/
$SER_URL="https://storeapi.lookplex.com/ws/service";///ws/service
$uploadPoint="https://storeapi.lookplex.com/ws/server/uploads/";//"https://storeapi.lookplex.com/masnep-Webapp/server/uploads/"
//LOCALHOST
//$uploadPoint='http://localhost:8082/masnep-Webapp/server/uploads/';
//$ROOT_URL="http://localhost/masnep-Webapp/masnepservice";//http://www.lookplex.com/
//$SER_URL="http://localhost/masnep-Webapp/service";//"https://storeapi.lookplex.com/masnep-Webapp/service";///ws/service
$domain = "lookplex.com";
$flag = true;
var cm;
var AuthStates = {
    google: null,
    facebook: null
};
$user={
    displayName:null,
    image:null,
    platform:null,
    access_token:""
};

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    $(this).scrollTop(0);
});

$(document).ready(function(e) {
    function CookieManager(){
        this.setCookie= function (cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires+"; "+"path=/; domain=lookplex.com";
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
            document.cookie = cname + "=" + "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=lookplex.com";
        };
        this.displayAllCookie=function(){
            console.log(document.cookie);
        },
            this.checkCookie=function () {

            }
    };
    cm=new CookieManager();
    function statusChangeCallback(response) {

    }
    $(document).on('click', "button.login-btn",function(){
        if($(this).attr('id')=="facebook"){
            FB.login(function(response){
                AuthStates.facebook = response;
                chooseAuthProvider();
                $user.platform="facebook";
                $user.access_token = response.authResponse.accessToken;
                saveCust(response.authResponse.userID,$user.platform,$user.access_token);
            },{scope: 'email'});//?scope='public_profile, email , user_friends'
        }
    });
    /******** TOP-MENU NAVIGATION ***********************/
    $(document).on("click",".top-menu>a",function(e) {
        e.preventDefault();
        if($(this).attr("data-target")=="#login"){
            showModal("#login");
        }
        else if($(this).attr("data-target")=="#hiw"){
            if($('.how-it-works').is(':visible')) {
                $(".how-it-works").slideUp();
            }else{
                new HowItWorks().render();
                $(".how-it-works").slideDown();
            }
        }
        else if($(this).attr("data-target")=="#faq"){
            showModal("#faq");
        }else if($(this).attr("data-target")=="#freelisting"){
            window.location="#/listing";
            return true;
        }else if($(this).attr("data-target")=="#logout"){
            new TopAccMenu().show_menu();
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
    /*$(".filter-menu>h5").click(function(e) {
     $(this).find("i").toggleClass("fa-angle-up");
     $(this).find("i").toggleClass("fa-angle-down");
     $(this).parent().find(".sub-filter").toggle("fast");
     });*/

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



    $(".screen-menu-rate").click(function(e) {
        $(".nav-list>h4").eq(3).click();
    });

    $(document).on("click","#imagebelt",function(e){
        $(e.currentTarget).empty();
        if($flag){
            $(e.currentTarget).append("Show imagery &nbsp;&nbsp;<i class=\"fa fa-angle-double-up fa-lg\" style=\"color: #fff\"></i>");
            $('#indicator').slideUp();
            $(e.currentTarget).animate({bottom: '15px'});

            $flag=false;
        }else{
            $(e.currentTarget).append("Hide imagery &nbsp;&nbsp;<i class=\"fa fa-angle-double-down fa-lg\" style=\"color: #fff\"></i>");
            $('#indicator').slideDown();
            $(e.currentTarget).animate({bottom: '108px'});
            $flag=true;
        }
    });

    /*function hideDays(){
            $(".weekdays").fadeIn(5000).addClass("hidden",5000,"easeOutBounce");
            $(".showdays>u").text("edit");
    };*/

    function getLocationSuggestion($query_location){
        $.ajax({
            type:"POST",
            url: $ROOT_URL+"/getLocation",
            cache:false,
            data:"location="+$query_location,
            dataType:"json",
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function(){
                $(".search-bar-spinner").css("display","inline-block");
            },
            success:function(data,status,jqXhr){
                $location_suggestion="";
                if(data.length>0){$.each(data,function(index,element){
                    $location_suggestion+="<div class=\"list-group-item location-item\" data-l-guid=\""+element.id+"-"+element.guid+"\">"+"<i class=\"fa fa-map-marker\" style='margin-right: 5px'></i><span>"+element.locationName+"</span></div>";
                });
                    $(".location-suggestion").html($location_suggestion).slideDown();
                }else{
                    $(".location-suggestion").html("<div class=\"list-group-item text-danger\" >No suggesstions found.</div>").slideDown();
                }
                $('#wait').addClass("hidden");
            }
        }).fail(function(){
            $(".location-suggestion").html("<div class=\"list-group-item text-danger\" >No suggesstions found.</div>").slideDown();
            $(".search-bar-spinner").fadeOut();
            console.log('failed');
        })
    }

    $suggestionInterval="";
    $suggestionTimeout="";
    $queryOld="";
    $(document).on({
        focusin :function(){
            $queryNew=$(".location").val();
            $(this).on("keydown",function(e){
                $queryNew=$(".location").val();
                if($suggestionTimeout!=""){clearTimeout($suggestionTimeout);
                }
                $suggestionTimeout=setTimeout(function(){
                        if($queryNew!=$queryOld && $queryNew.length>2){
                            $('#wait').removeClass("hidden");
                            getLocationSuggestion($queryNew);
                        }
                        else{
                            $(".location-suggestion").fadeOut();
                        }
                    }
                    ,500);
            });
        }

    },"#location");

    $(document).on({
        click : function(){
            $qo.blockname = $(this).text();
            var x = $(this).attr('data-l-guid');
            $qo.blockguid = x.split('-')[1];
            $qo.blockid = x.split('-')[0];
            $('.location-suggestion').empty();
            $('#ilocation').val($qo.blockname);
            $('#catinput').val('');
        }
    },".location-item");

    $(document).on({
        click : function(){
            $('.categories-list').removeClass('hidden');
        }
    },"#catinput");

    $(document).on({
        click : function(){
            $("#modal-search").modal("hide");
            router.navigate("#/stores/"+$qo.blockname+"-"+$qo.blockid+"-"+$qo.blockguid+"-"+$qo.catname+"-"+$qo.catid,{trigger:true});
        }
    },"#search");

    $(document).on({
        click : function(){
            $qo.catname = $(this).text();
            $qo.catid = $(this).attr('data-catid');
            $('.categories-list').addClass('hidden');
            $('#catinput').val($qo.catname);
        }
    },".list-group-item");


    /******************
     FORM HANDLER
     ********************/

    $(document).on('click','.checkbox-btn',function(){
        $(this).toggleClass('btn-default').toggleClass('btn-primary');
        $y=$(this).text();
        $z=$(this).find('input[type=hidden]');
        if($z.attr('name')=='et'|| $z.attr('name')=='hl' ){$z.toggleClass('checked');}
        if($z.attr('name')=='brand'){$('input[name=brand]').removeClass('checked');$z.toggleClass('checked');}

    });

    $(document).on('click','.overlay',
        function(){
            $(".location-suggestion").fadeOut();
            $(".categories-list").fadeOut();
            $(this).fadeOut(function(){
                $(".search-bar").removeClass('attop');
            });
            $(".a_dropdown").addClass('hidden');

        }
    );

    $.ajaxSetup({ cache: true });
    $.getScript('https://connect.facebook.net/en_US/sdk.js', function(){
        FB.init({
            appId: '793762427404557',
            version: 'v2.3' // or v2.0, v2.1, v2.0
        });
        FB.getLoginStatus(function(response) {
            AuthStates.facebook = response;
            chooseAuthProvider();
        });
    });

    /***************************/
    /** HOME SCROLLER FUNCTION **/
    /***************************/

    var currentImage = 0;

    //attach click event to slideshow buttons
    $(document).on('click','.slideshow-next', function(){
        //an image width in pixels
        var imageWidth = $('#slideshow li').width();
        //set image count
        var allImages = $('#slideshow li').length;
        //setup slideshow frame width
        $('#slideshow ul').width(allImages*imageWidth);
        if (currentImage<=allImages-5) {
            currentImage++;
            setFramePosition(currentImage,imageWidth);
            if (currentImage==1) {
                $(".slideshow-prev").css("display","block");
            }
            if (currentImage==allImages-4) {
                $(".slideshow-next").css("display","none");
            }
        }
    });

    $(document).on('click','.slideshow-prev', function(){
        //an image width in pixels
        var imageWidth = $('#slideshow li').width();
        //set image count
        var allImages = $('#slideshow li').length;
        //setup slideshow frame width
        if (currentImage>=1) {
            //decrease image counter
            currentImage--;
            //if we are at the end let set it to 0
            //if(currentImage<0) currentImage = allImages-1;
            //calcualte and set position
            setFramePosition(currentImage,imageWidth);
            if (currentImage==allImages-5) {
                $(".slideshow-next").css("display","block");
            }
            if (currentImage==0) {
                $(".slideshow-prev").css("display","none");
            }
        }
    });

    $(document).on('click','.left-arrow',function(){
        $(".slider-min-content").animate({right: '0px'});
    });

    $(document).on('click','.right-arrow',function(){
        $(".slider-min-content").animate({right: '380px'});
    });

    //calculate the slideshow frame position and animate it to the new position
    function setFramePosition(pos,imageWidth){
        //calculate position
        var px = imageWidth*pos*-1;
        //set ul left position
        $('#slideshow ul').animate({
            left: px
        }, 600);
    }



}); // END OF GLOBAL DOCUMENT READY FUNCTIONS


//socials
function clearUser(){
    $user.displayName=null,
    $user.image=null,
    $user.platform=null
}
function onSignInCallback(authResult) {
    delete authResult['g-oauth-window'];
    AuthStates.google = authResult;
    $user.access_token = authResult.access_token;
    chooseAuthProvider();
}
function chooseAuthProvider() {

    if (AuthStates.google && AuthStates.facebook) {
        if (AuthStates.google['access_token']) {
            // Signed in with Google, you can now use Google+ APIs.
            //console.log("google+");
            gapi.client.load('plus', 'v1', apiClientLoaded);

        } else if (AuthStates.facebook) {
            // Not signed in with Google, but signed in with Facebook,
            //  you can now use the Facebook SDK.
            //console.log('here : '+AuthStates.facebook.status);
            if (AuthStates.facebook.status === 'connected') {
                //console.log('Welcome!  Fetching your information.... ');
                FB.api('/me?fields=id,name,picture,gender,email', function(authResponse) {
                    // console.log('Successful login for: ' + JSON.stringify(authResponse.picture));
                    $user.displayName=authResponse.name;
                    $user.image=authResponse.picture.data.url;
                    $user.platform="facebook";
                    render_umenu();
                    $('#discard').click();
                    console.log(  'Thanks for logging in, ' + JSON.stringify(authResponse) + '!');
                });
            }
            //console.log("facebook");
        } else {
            // Not signed in with anyone, wait until the user chooses a social provider.
            //console.log("not signed in");
        }
        $(document).find("button.close")[0].click();
    }
}
function apiClientLoaded() {
    gapi.client.plus.people.get({userId: 'me'}).execute(handleResponse);
}
function handleResponse(resp) {
    $user.platform = "gplus";
    saveCust(resp.result.id,$user.platform,$user.access_token);
    $user.displayName=resp.displayName;
    $user.image=resp.image.url;
    render_umenu();
    $('#discard').click();
}
function render_umenu(){
    if($user.displayName!=null){
        var a_top=new TopAccMenu();
        a_top.render();
    }
    else{
        $(".top-menu>a[data-target=#logout]").attr({"data-target":"#login","platform":$user.platform}).html("Log In");
    }
}

// GLOBAL FUNCTIONS
var categoryParser=function(categoryList){
    switch (categoryList){
        case "sp": return "Spa-1";
        case "sa": return "Salon-2";
        case "gy": return "Gym-3";
        case "bp": return "Beauty Parlor-4";
        case "bph": return "Beauty Parlor at Home-5";
        case "skc": return "Skin Care-6";
        case "slc": return "Slimming Center-7";
        case "pbm": return "Party & Bridal Makeup-8";
        case "dt": return "Dietician-9";
        case "ya": return "Yoga & Aerobics-10";
        case "mp": return "Beauty Parlor-11";
        case "na": return "Nail Art-12";
        case "bpp": return "Body Piercing-13";
        case "md": return "Mehendi-13";
        case "ot": return "Others-14";
    }
}
var timeParser=function(t){
    var removePreZero=function(e){
        return e.substring(1);
    };
    var addColon=function(e){
        return e.substring(0,2)+":"+e.substring(2);
    };
    if(t.indexOf('am')>0 || t.indexOf('pm')>0){
        var a=t.split("-")[0];
        var b=t.split("-")[1];
        return removePreZero(addColon(a))+"-"+removePreZero(addColon(b));
    }
    else{
        return t;
    }

}
String.prototype.cFL = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
function rcp(str){
    var n= str.split(',').length;
    while(n>1){
        str=str.replace(',',' &#8226; ');
        n--;
    }
    return str.replace("sp","Spa").replace("sa","Salon").replace("gy","Gym").replace("bp","Beauty Parlour").replace("bph","Beauty Parlour At Home")
        .replace("skc","Skin Care").replace("slc","Slimming Center").replace("pbm","Party & Bridal Makeup").replace("dt","Dietician")
        .replace("ya","Yoga & Aerobics").replace("na","Nail Art").replace("bpp","Body piercing").replace("md","Mehendi").replace("tt","Tattoo").replace("ot","Others");
}
function highlight(target){
    return "<strong>"+target+"</strong>";
}
function rt(str){
    if(str == undefined || str =="" || str == "null to null" || str == null || str.indexOf("OFF")!=-1 ){
        return "Closed";
    }
    return str.replace("am"," AM").replace("pm"," PM").replace("-","  to  ");
}

function saveCust(id,platform,token){
    if(platform=="facebook"){
        userdata={fbid:id,platform:platform,token:token};
    }else{
        userdata={gpid:id,platform:platform,token:token};
    }
    $.ajax({
        url:$ROOT_URL+"/saveCust",
        type:'POST',
        contentType: 'application/x-www-form-urlencoded',
        data:userdata,
        xhrFields: {
            withCredentials: true
        },
        parse:function(response, options){
        },
        success:function(response,textStatus,xhr){
            render_umenu();
            var cookietoSet=xhr.getResponseHeader('Set-Cookie');
            if(cookietoSet !=null){
                var validone = cookietoSet.split(';');
                document.cookie = validone[0].split('=')[0] + "=" + validone[0].split('=')[1];
            }
        }
    }).fail(function(data){
        console.log(data);
    });

}
function notifications(time){
    var date = new Date();
    var notification = '';
    var times = time + '';
    if(!(times.indexOf('OFF')>=0)){
        var opentime = new Date();
        opentime.setHours(time.substr(0,2));
        opentime.setMinutes(time.substr(2,2));
        var closetime = new Date();
        var closinghour = parseInt(time.substr(7,2))+12;
        closetime.setHours(closinghour);
        closetime.setMinutes(time.substr(9,2));
        if(date < opentime){
            notification = "Opening in &nbsp;" + parseInt((opentime - date)/1000/60/60) + " Hours " + parseInt(((opentime - date)/1000/60)%60) + " Mins";
        }else if(date > opentime){
            if(date.getHours() > closetime.getHours()){
                notification = "Closed for Today";
            }else if(date.getHours() <= closetime.getHours()){
                if((closetime.getHours() - date.getHours())<1){
                    if(closetime.getMinutes()>date.getMinutes()){
                        notification = "Closing in next &nbsp;" + parseInt((closetime - date)/1000/60/60)+ " Hours " + parseInt(((closetime - date)/1000/60)%60) + " Mins" ;
                    }else{
                        notification = "Closed for Today";
                    }
                }else{
                    notification = "Open for next &nbsp;" + parseInt((closetime - date)/1000/60/60) + " Hours " + parseInt(((closetime - date)/1000/60)%60) + " Mins";
                }
            }
        }else if(date.getHours() == opentime.getHours()){
            notification = "Open Now";
        }
    }else{
        notification = "Closed Today";
    }
return notification;
}





