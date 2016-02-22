/**
 GLOBAL VARIABLES
 **/
$qo={};
$fixed = false;
$rate=0;
var timeoutId = false;



function resetGlobalVariables(){
    $qo={
        blockname:"",
        blockid:"",
        blockguid:"",
        catname:"",
        catid:"",
        sortby:"",
        brandname:"",
        storename:"",
        storeID:"",
        storeguid:"",
        gender:"",
        morefilters:"",
        aminities:[],
        isFiltered:0,
        latitude:"",
        longitude:"",
        cityname:"",
        cityid:"",
        cityguid:"",
        ratecards:"",
        storephotos:"",
        reviews:"",
        pagesize:10,
        numberofpages:""
    };
};
resetGlobalVariables();

function showOverlay(s){
    $(".overlay").show();
    if(s==true){$(".circle-outer").show();}
    else{$(".circle-outer").hide();}
}

function writeallvariables(){
    /*console.log("block-name: "+$qo.blockname+"\n blockid: "+$qo.blockid+"\n blockguid: "+$qo.blockguid+"\n catid: "+$qo.catid+"\n gender: "+$qo.gender+"\n brandname: "+$qo.brandname+"\n morefilters: "+$qo.morefilters);*/
}
function showFilters(){

}
function uncheckFilters(){
    $(".f-menu[name=gender]").prop('checked', false);
    $(".f-menu[name=sort]").prop('checked', false);
    $(".f-menu[name=more-filters]").prop('checked', false);
    $(".weekdays label input[type=checkbox]").prop('checked', false);
}
//********SUGGESTION CLICK HANDLER*/

$(document).on("click",".location-item",function(e) {

    $qo.blockname=$(this).text();
    $qo.blockguid=$(this).attr("data-l-guid").split('-')[1];
    $qo.blockid=$(this).attr("data-l-guid").split('-')[0];

    $(document).find("input[name=location]").val($qo.blockname).attr("data-val",$qo.blockid+"-"+$qo.blockguid);

    $(document).find("input[name=service]").focus();
    $(".location-list").slideUp();
});

$(document).on("click",".categories-list>.list-group-item",function(){
    $(".location-list").slideUp();

    $qo.catname=$(this).text();
    $qo.catid=$(this).attr("data-catid");

    $(document).find("input[name=service]").val($qo.catname).attr("data-val",$qo.catid);
    $(".categories-list").slideUp();
});

$(document).on("click",".search-bar>a",function(e){
    e.preventDefault();
    if($qo.blockguid!="" && $qo.catid!=""){
        $(".search-bar").removeClass('attop');
        router.navigate("#/stores/"+$qo.blockname+"-"+$qo.blockid+"-"+$qo.blockguid+"-"+$qo.catname+"-"+$qo.catid,{trigger:true});

    }
    else{
        if(($qo.blockguid)==""){$(".location-suggestion").html("<div class=\"list-group-item text-danger\" >please select a location</div>").slideDown();	}
        console.log("error");
    }
});

$(document).on("click",".search-bar>div>div .list-group-item",function(e){
    e.preventDefault();
    if($qo.blockguid!="" && $qo.catid!=""){
        $(".search-bar").removeClass('attop');
        router.navigate("#/stores/"+$qo.blockname+"-"+$qo.blockid+"-"+$qo.blockguid+"-"+$qo.catname+"-"+$qo.catid,{trigger:true});

    }
    else{
        if(($qo.blockguid)==""){$(".location-suggestion").html("<div class=\"list-group-item text-danger\" >please select a location</div>").slideDown();	}
        console.log("error");
    }
});
//All common AJAX calls here......
function renderstoreItemView(askedpage){
    var stores=new StoreCollection({isFiltered:$qo.isFiltered});
    stores.fetch({
        data:$datas,
        contentType: 'application/x-www-form-urlencoded',
        type:'POST',
        beforeSend: function(){showOverlay(true);},
        dataType:'json',
        xhrFields: {
            withCredentials: true
        },
        parse:function(response, options){
        },
        success:function(response){
            var stores = response ;
            if(stores.get('count')==null || stores.get('count')<=0){
                $(".overlay").fadeOut();
                $('.search-result').html("<div class='col-md-12 noresult'><center><h3><i class=\"fa fa-exclamation-triangle\"></i> No Result Found.</h3></center></div>");
            }else{
                $qo.numberofpages=Math.ceil(stores.get('count')/$qo.pagesize);
                var storeItemView=new StoreItemView({stores: stores,qo:$qo});
                storeItemView.render();
                $(".overlay").fadeOut();
                $(".page").removeClass('activepage');
                $('#page'+askedpage).addClass('activepage');
                if(askedpage<=1){
                    $('#prev').addClass('hidden');
                    $('#next').removeClass('hidden');
                }else if(askedpage>=$qo.numberofpages){
                    $('#next').addClass('hidden');
                    $('#prev').removeClass('hidden');
                }else{
                    $('#next').removeClass('hidden');
                    $('#prev').removeClass('hidden');
                }
            }

        },
        error:function(){
            $(".overlay").fadeOut();
            $('.search-result').html("<div class='col-md-12 noresult'><center><h3><i class=\"fa fa-exclamation-triangle\"></i> No Result Found.</h3></center></div>");
        }
    });
}

function getRateCard($datas){
    var data;
    $.ajax({
        url:$ROOT_URL+"/getratecard",
        type:'POST',
        async:false,
        contentType: 'application/x-www-form-urlencoded',
        data:$datas,
        dataType:'json',
        parse:function(response, options){
        },
        success:function(response){
            data = response;
        },
        error:function(msg){
            console.log("Error "+JSON.stringify(msg));
        }
    });
    return data;
}

function getStorePhoto($datas){
    var data;
    $.ajax({
        url:$ROOT_URL+"/getstorephotos",
        type:'POST',
        async:false,
        contentType: 'application/x-www-form-urlencoded',
        data:$datas,
        dataType:'json',
        parse:function(response, options){
        },
        success:function(response){
            data = response;
        },
        error:function(msg){
            console.log("Error "+JSON.stringify(msg));
        }
    });
    return data;
}

function getStoreReview($datas){
    var data;
    $.ajax({
        url:$ROOT_URL+"/getReviewForStore",
        type:'POST',
        async:false,
        contentType: 'application/x-www-form-urlencoded',
        data:{storeguid: $qo.storeguid, storeid: $qo.storeID, lkey:''},
        dataType:'json',
        parse:function(response, options){
        },
        success:function(response){
            data = response;
        },
        error:function(msg){
            console.log("Error "+JSON.stringify(msg));
        }
    });
    return data;
}

function getStoreTrust($datas){
    var data;
    $.ajax({
        url:$ROOT_URL+"/getstoredetails",
        type:'POST',
        async:false,
        contentType: 'application/x-www-form-urlencoded',
        data:{ guid: $qo.storeguid, storeid: $qo.storeID },
        dataType:'json',
        parse:function(response, options){
        },
        success:function(response){
            data = response;
        },
        error:function(msg){
            console.log("Error"+JSON.stringify(msg));
        }
    });
    return data;
}

function saveReview(data) {
    $.ajax({
        url:$ROOT_URL+"/saveReview",
        type:'POST',
        async:false,
        contentType: 'application/x-www-form-urlencoded',
        data:data,
        xhrFields: {withCredentials: true},
        dataType:'text',
        parse:function(response, options){
        },
        success:function(response){
            data = response;
            $('#reviewerror').empty().append("<center><div class=\"successmsg col-md-12\">ThankYou !! Review submitted successfully</div></center>");
        },
        error:function(msg){
            $('#reviewerror').empty().append("<center><div class=\"errormsg col-md-12\">Oh !! something went wrong, we can't take reviews for some time</div></center>");
        }
    });

    return data;
}

function saveFavourite(data) {
    $.ajax({
        url:$ROOT_URL+"/saveBookmark",
        type:'POST',
        contentType: 'application/x-www-form-urlencoded',
        data:data,
        xhrFields: {withCredentials: true},
        dataType:'text',
        parse:function(response, options){
        },
        success:function(response){
            data = response;
            console.log("------------Thank u for favourite------------"+response)
        },
        error:function(msg){
            console.log("------------Error in favourite save------------")
        }
    });
}

function saveCheckin(data) {
    $.ajax({
        url:$ROOT_URL+"/saveCheckin",
        type:'POST',
        contentType: 'application/x-www-form-urlencoded',
        data:data,
        xhrFields: {withCredentials: true},
        dataType:'text',
        parse:function(response, options){
        },
        success:function(response){
            data = response;
            console.log("------------Thank u for Check in------------"+response)
        },
        error:function(msg){
            console.log("------------Error in Chekin save------------")
        }
    });
}

function template_loader(e,f,g,h){
    /*if(!$(document).find(f).length>0){*/
        $.ajax({
            url:e,
            type:'GET',
            dataType:'text',
            beforeSend: function(){
                showOverlay(true);
                var hsb=new HeaderSearchBar();
                hsb.render();
            },
            success:function(data){
                $temp="<script type='text/template' id='"+f+"'>"+data+"</script>";
                $("body").append($temp);
                var template=_.template(data)({data:""});
                $(".main-container-top").html(template);
                $(".overlay").fadeOut();
                $('html, body').animate({scrollTop:0},1000);
                if(g!=undefined){
                    this.postrender();
                }
                return true;
            },
            postrender:function(){
                $(document).find(g).append($(document).find(h).html());
            }
        });
} ;



/******
 MODELS
 ******/
var storesSet=Backbone.Model;
var defModel=Backbone.Model;
/*******
 COLLECTION
 *******/
var StoreCollection=Backbone.Model.extend({
    initialize:function(options){
        this.options=options;
    },
    url:function(){
        if(this.options.isFiltered==1){
            return $ROOT_URL+'/geftstores'
        }
        else{
            return $ROOT_URL+'/getstores'
        }
    },
    parse: function (response) {
        return response
    }
});

var StoreAttributeCollection=Backbone.Collection.extend({
    model:defModel,
    initialize:function(options){
        this.options=options;
    },
    url:function(){return this.options.href},
    parse:function(response){
        return response;
    }

});

var RateCardCollection=Backbone.Collection.extend({
    model:defModel,
    initialize:function(options){
        this.options=options;
    },
    url:function(){return this.options.href},
    parse:function(response){
        return response;
    }

})

var SponsoredCollection=Backbone.Model.extend({
    initialize:function(options){
        this.options=options;
    },
    url:function(){
        return $ROOT_URL+'/getsponsoredlistforAdvertisement'
    },
    parse: function (response) {
        return response
    }
});
/******
 VIEWS
 *******/
var ProfileView=Backbone.View.extend({
    el:'.main-container-top',
    events:{
        'click .user-profile-menu>label':'show_details'
    },
    initialize:function(){
        resetGlobalVariables();
    },
    render:function(){
        var temp;
        var that=this;
        if($("#user-profile-template").length>0){
            temp=_.template($("#user-profile-template").html());
            that.$el.html(temp).trigger("create");
        }
        else{
            $.ajax({
                url:" /templates/userprofile.html",
                type:'GET',
                processData:false,
                async:'false',
                success:function(data){
                    $("body").append(data);
                    temp=_.template($(document).find("#user-profile-template").html());
                    that.$el.html(temp).trigger("create");
                }
            }).fail(function(data){
                console.log(data);
            });
        }
    },
    show_details:function(e){
        $(".overlay").fadeIn();
        var info;
        var data={platform:$user.platform,token:$user.access_token,lkey:''};
        switch ($(e.currentTarget).attr("id")){
            case "user-menu-profile":{
                renderTemplate("user-profile-info",info);
                break;
            }
            case "user-menu-lookplex-journey":{
                info = getCustomerInfo("getCustomerTimeline",data);
                renderTemplate("user-journey",info);
                break;
            }
            case "user-menu-bookmarks":{
                info = getCustomerInfo("getCustomerBookmark",data);
                renderTemplate("user-bookmarks",info);
                break;
            }
            case "user-menu-ratings":{
                info = getCustomerInfo("getCustomerRecommend",data);
                renderTemplate("user-bookmarks",info);
                break;
            }
            case "user-menu-reviews":{
                info = getCustomerInfo("getCustomerReview",data);
                renderTemplate("user-reviews",info);
                break;
            }
            case "user-menu-checkins":{
                info = getCustomerInfo("getCustomerCheckin",data);
                renderTemplate("user-profile-info",info);
                break;
            }
        }
        $(".overlay").fadeOut();
    }
});

var UserProfileInfo = Backbone.View.extend({
    el:'.profile-content',
    initialize:function(options){
        this.options=options;
    },
    render:function(){
        var temp=_.template($("#"+this.options.template).html());
        var html=temp({data:this.options.data});
        this.$el.html(html).trigger("create");
    }
});
function renderTemplate(e,info){
    var temp;
    $.ajax({
            url:" /templates/"+e+".html",
            type:'GET',
            processData:false,
            success:function(data){
                $("body").append(data);
                new UserProfileInfo({template:e,data:info}).render();
            }
        }).fail(function(data){
            console.log(data);
        });
}
function getCustomerInfo(e,data){
    var info;
    $.ajax({
        url:$ROOT_URL+"/"+e,
        type:'POST',
        async:false,
        contentType: 'application/x-www-form-urlencoded',
        data:data,
        dataType:'json',
        xhrFields: {
            withCredentials: true
        },
        success:function(data){
           info=data;
        },
        error:function(msg){
            console.log(JSON.stringify(msg));
        }
    });
    return info;
}
var HomeView=Backbone.View.extend({
    el:'.full-container',
    events:{
        'click #moreservice':'toggleservices',
        'click #morecity':'togglecities'
    },
    render:function(){
        var temp=_.template($("#home").html());
        var html=temp();
        this.$el.html(html).trigger("create");
        $('#tohide').slideToggle();
        $('#tohidecity').slideToggle();
    },
    toggleservices:function(e){
        $('#tohide').slideToggle(1000,function(){
            if($(e.currentTarget).text().toString()=="See Less"){
                $(e.currentTarget).text('See More');
            }else{
                $(e.currentTarget).text('See Less');
            }
        });
    },
    togglecities:function(e){
        $('#tohidecity').slideToggle(1000,function(){
            if($(e.currentTarget).text().toString()=="See Less"){
                $(e.currentTarget).text('See More');
            }else{
                $(e.currentTarget).text('See Less');
            }
        });
    }
});

var HeaderView=Backbone.View.extend({
    el:'.header',
    render:function(){
        var temp=_.template($("#header").html());
        var html=temp();
        this.$el.html(html).trigger("create");
    }
});

var FooterView=Backbone.View.extend({
    el:'.footer',
    render:function(){
        var temp=_.template($("#footer").html());
        var html=temp();
        this.$el.html(html).trigger("create");
    }
});

var HomeViewMidRibbon=Backbone.View.extend({
    el:'.full-width-container',//page-header
    initialize:function(){
    },
    render:function(){
        var temp;
        var that=this;
        if($("#home-ribbon").length>0){
            temp=_.template($("#home-ribbon").html());
            that.$el.html(temp).trigger("create");
        }
        else{
            $.ajax({
                url:" /templates/home-mid.html",
                type:'GET',
                /*cache : false,
                 */processData:false,
                success:function(data){
                    $("body").append(data);
                    temp=_.template($(document).find("#home-ribbon").html());
                    that.$el.html(temp).trigger("create");
                }
            }).fail(function(data){
                console.log(data);
            });
        }
    }
});
var TopAccMenu=Backbone.View.extend({
    el:'.top-menu>a:last',
    events:{
        'click .a_dropdown>li[data-val=logout]':'logout',
        'click .a_dropdown>li[data-val=profile]':'profile'
    },
    show_menu:function(){
        $(".top-menu>a:last>ul").toggleClass("hidden");
    },
    hide_menu:function(){
        $(".top-menu>a:last>ul").toggleClass("hidden");
    },
    logout:function(e){
        e.preventDefault();
        var currentlocation=window.location;
        if($user.platform=="facebook"){
            FB.logout(function(response){
                clearUser();
                render_umenu();
            }) ;
        }
        else if($user.platform=='gplus'){
            $.ajax({
                type: 'GET',
                url: 'https://accounts.google.com/o/oauth2/revoke?token=' + gapi.auth.getToken().access_token,
                async: false,
                contentType: 'application/json',
                dataType: 'jsonp',
                success: function(result) {
                },
                error: function(e) {
                    console.log(e);
                }
            });
        }
        window.location=currentlocation;
    },
    profile:function(e){
        e.preventDefault();
        router.navigate("#/profile");
    },
    render:function(){
        var temp=_.template($("#p_img").html());
        var html=temp({i:$user.image,j:$user.displayName});
        this.$el.html(html).trigger('create');
        $(".top-menu>a:last").attr("data-target","#logout");
    }
});

var HeaderSearchBar=Backbone.View.extend({
    el:'.page-header',
    events:{
        'focus input[name=location]':'aa'
    },
    aa:function(){
    },
    render:function(){
        var temp=_.template($("#header-search-bar").html());
        var html=temp();
        this.$el.html(html).trigger("create");
        $(".page-header").addClass("gray-bg");
        render_umenu();
    }
});
var HowItWorks=Backbone.View.extend({
    el:'#hiwdiv',
    render:function(){
        var temp=_.template($("#hiw").html());
        var html=temp();
        this.$el.html(html).trigger("create");
    }
});
var Share=Backbone.View.extend({
    el:'#ishare',
    initialize:function(){
        _.bindAll(this, 'detect_scroll');
        $(window).scroll(this.detect_scroll);
    },
    events:{
        'mouseenter #shareit':'expand',
        'mouseleave #ishared':'shrink'
    },
    render:function(){
        var temp=_.template($("#share-template").html());
        var html=temp();
        this.$el.html(html).trigger("create");
    },
    expand:function(){
        $( "#ishared" ).animate({
            height: 400,
            bottom:70
        }, 1000 );
        $flag=true;
    },
    shrink:function(){
        $( "#ishared" ).animate({
            height: 55,
            bottom:200
        }, 2000 );
        $flag=false;
    },
    detect_scroll:function(){
        if ($flag) {
            $( "#ishared" ).animate({
                height: 55,
                bottom:200
            }, 1000 );
        }
        $flag=false;
    }
});

var HeaderNoSearchBar=Backbone.View.extend({
    el:'.page-header',
    render:function(){
        var temp=_.template($("#header-no-search-bar").html());
        var html=temp();
        this.$el.html(html).trigger("create");
        $(".page-header").removeClass("gray-bg");
        render_umenu();
    }
});
var AboutView=Backbone.View.extend({
    el:'.main-container',//page-header
    initialize:function(options){ this.options=options;},
    render:function(){
        var temp=_.template($("#about").html());
        this.$el.html(temp);
    }
});

var SearchView=Backbone.View.extend({
    el:'.full-container',//page-header
    events:{
       /* 'click .fi-menu':'filter',
        'click input[name=etype0]':'brandupdate',
        'click .page':'pagewise',
        'focusin #brandsearch':'brandsearch',
        'click .showdays>u':'weekdaystoggle'*/

    },
    initialize:function(options){
       /* _.bindAll(this, 'detect_scroll');
        $(window).scroll(this.detect_scroll);
        this.options=options;*/
    },
    render:function(){
//        var hsb=new HeaderSearchBar();
//        hsb.render();
        var temp=_.template($("#searchtemplate").html());
        var html=temp({qo:$qo});
        this.$el.html(html).trigger("create");
        renderstoreItemView(1);
        /*$.ajax({
            url:$ROOT_URL+"/getbrandaminityList",
            type:'POST',
            contentType: 'application/x-www-form-urlencoded',
            data:{catid: $qo.catid},
            dataType:'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            parse:function(response, options){
            },
            success:function(data){
                $.each(data.brandlist,function(index,item){
                    $(".sub-filter:eq(2)").append("<label class='tocontinue'><input class=\" fi-menu brandname\" type=\"checkbox\" multiple name=\"brand[]\" value=\""+item.id+"\">"+item.brandName+"</label>");
                });
                showFilters();
            },
            error:function(msg){
                console.log(JSON.stringify(msg));
            }

        });
        $('.weekdays').slideUp();
        return this;*/
    }/*,
    weekdaystoggle:function(e){
        if($(e.currentTarget).text()=="edit"){
            $(".weekdays").slideDown(500);
            $(e.currentTarget).text("hide");
        }else {
            $(".weekdays").slideUp(500);
            $(e.currentTarget).text("edit");
        }
    },
    detect_scroll:function(){
        scroll = $(window).scrollTop();
        if (scroll >= 90 && scroll < 800 && !$fixed) {
            $('.parlor-screen2').addClass('fixed').addClass('psposition');
            $fixed = true;
        } else if(scroll < 90 && $fixed) {
            $('.parlor-screen2').removeClass('fixed').removeClass('psposition');
            *//*$('#leftfilter').removeClass('fixed').removeClass('fiposition');*//*
            $fixed = false;
        }else if(scroll > 800 && $fixed){
            *//*$('#leftfilter').removeClass('fixed').removeClass('fiposition');*//*
            $fixed = false;
        }
    }*/,
    filter:function(e){
        $qo.aminities=[];
        $qo.brandname=$(".brandname:checked").map(function(){ return this.value; }).get().join(',');
        $qo.gender=$("input[name=gender]:checked").val();
        if($qo.brandname==undefined){
            $qo.brandName=null;
        }
        if($qo.gender==undefined){
            $qo.gender=null;
        }else{
            $qo.aminities.push($qo.gender);
        }
        $qo.catid=$("input[name=etype0]:checked").val().split("-")[1];
        if($qo.catid==2){
            $qo.catid="2,4,5";
        }else if($qo.catid==7){
            $qo.catid="6,7";
        }else if($qo.catid==14){
            $qo.catid="12,14";
        }
        $qo.sortby=$("input[name=sort]:checked").val();
        if(typeof $qo.sortby === 'undefined'){
            $qo.sortby="none";
        };
        $qo.morefilters=$(".more-filters:checked").map(function(){ return this.value; }).get().join(',');
        if($qo.morefilters==undefined || $qo.morefilters==""){
            $qo.morefilters=null;
        }
        else{
            $qo.aminities.push($qo.morefilters);
        }
        $aminities=$qo.aminities.join(",");
        $qo.isFiltered=1;
        $datas={blockid:$qo.blockid, blockguid: $qo.blockguid, aminities: $aminities, brandname:$qo.brandname,catid: $qo.catid, startindex:1, endindex:$qo.pagesize, sortby:$qo.sortby};
        renderstoreItemView(1);

    },
    brandupdate:function(e){
        $qo.aminities = [];
        var uri = $("input[name=etype0]:checked").val();
        router.navigate("#/stores/"+$qo.blockname+"-"+$qo.blockid+"-"+$qo.blockguid+"-"+uri);
    },
    pagewise:function(e){
        showOverlay(true);
        /*$('html, body').animate({scrollTop:0},9);*/
        var ce = $(e.target);
        var askedpage=1;
        if(ce.attr('id')=='prev'){
            askedpage = parseInt($('.activepage').attr('data-value'))-1;
        }else if(ce.attr('id')=='next'){
            askedpage = parseInt($('.activepage').attr('data-value'))+1;
        }else{
            askedpage = parseInt(ce.attr('data-value'));
        }
        var startIndex = ((askedpage-1)*$qo.pagesize)+1;
        $datas={ blockid: $qo.blockid, blockguid: $qo.blockguid, catid: $qo.catid,brandname:$qo.brandname,aminities:$qo.morefilters,startindex:startIndex,endindex:startIndex+$qo.pagesize,sortby:'none'};
        renderstoreItemView(askedpage);
        $(".overlay").fadeOut();
        $('html, body').animate({scrollTop:90},500);
    },
    brandsearch:function(){
        $queryNew=$("#brandsearch").val();
        $("#brandsearch").on("keyup",function(e){
            $(".tocontinue").removeClass("hidden");
            $queryNew=$("#brandsearch").val();
                    if($queryNew.length>1){
                        $('.tocontinue').each(function(){
                            if($(this).text().toString().toLowerCase().search($queryNew.toString().toLowerCase())>-1){
                            }else{
                               $(this).addClass("hidden");
                            }
                        });
                    }
                    else{
                        $(".tocontinue").removeClass("hidden");
                    }
        });
    }

});

var StoreItemView = Backbone.View.extend({
    el:'.search-result',
    initialize:function(options){
        this.options=options;
    },
    events:{
        'mouseenter #sharestorelist':'expand',
        'mouseleave #sharestorelist':'shrink',
        'mouseover #ratecarddrop':'ratecarddrop',
        'mouseleave #ratecarddrop':'ratecardshrink',
        'mouseover #photodrop':'photodrop',
        'mouseleave #photodrop':'photoshrink',
        'mouseover #reviewdrop':'reviewdrop',
        'mouseleave #reviewdrop':'reviewshrink',
        'mouseover #trustdrop':'trustdrop',
        'mouseleave #trustdrop':'trustshrink'
    },
    render:function(){
            var temp = _.template($('#result-item').html());
            var html = temp({stores: this.options.stores, qo: this.options.qo});
            this.$el.html(html).trigger("create");
            /*$('[data-toggle="popover"]').popover();*/
            $('[data-toggle="tooltip"]').tooltip();
            /*$('[data-toggle="dropdown"]').dropdown();*/
    },
    expand:function(e){
        $(e.currentTarget).animate({
            width: 194
        }, 500 );
    },
    shrink:function(e){
                $(e.currentTarget).animate({
                    width: 35
                }, 1000 );

    },
    ratecarddrop:function(e){
        var storedetail = this.getKeys(e).attr('data-value').split('-');
        $qo.storeID = storedetail[0];
        $qo.storeguid = storedetail[1];
        if (!timeoutId) {
            timeoutId = true;
            window.setTimeout(function() {
                $datas = { gid: $qo.storeguid, id: $qo.storeID };
                var rateCardListView = new RateCardView({ratecards:getRateCard($datas),el:'#rate-'+$qo.storeID});
                $('#rate-'+$qo.storeID).append(rateCardListView.render());
                timeoutId = false;
            }, 500)
        }
    },
    ratecardshrink:function(e){
        /*timeoutId = true;
        window.setTimeout(function() {
            console.log("I am out : "+ e.currentTarget);
            timeoutId = false;
        }, 1000)*/
    },
    photodrop:function(e){
        var storedetail = this.getKeys(e).attr('data-value').split('-');
        $qo.storeID = storedetail[0];
        $qo.storeguid = storedetail[1];
        if (!timeoutId) {
            timeoutId = true;
            window.setTimeout(function() {
                $datas = { gid: $qo.storeguid, id: $qo.storeID };
                var storePhotoView = new StorePhotoView({storephotos:getStorePhoto($datas),el:'#photo-'+$qo.storeID});
                $('#photo-'+$qo.storeID).append(storePhotoView.render());
                timeoutId = false;
            }, 500)
        }
    },
    photoshrink:function(e){
        /*timeoutId = true;
        window.setTimeout(function() {
            console.log("I am out : "+ e.currentTarget);
            timeoutId = false;
        }, 1000)*/
    },
    reviewdrop:function(e){
        var storedetail = this.getKeys(e).attr('data-value').split('-');
        $qo.storeID = storedetail[0];
        $qo.storeguid = storedetail[1];
        if (!timeoutId) {
            timeoutId = true;
            window.setTimeout(function() {
                $datas = { gid: $qo.storeguid, id: $qo.storeID };
                var reviewsView = new ReviewsView({reviews:getStoreReview($datas),el:'#review-'+$qo.storeID});
                $('#review-'+$qo.storeID).append(reviewsView.render());
                timeoutId = false;
            }, 500)
        }
    },
    reviewshrink:function(e){
       /* timeoutId = true;
        window.setTimeout(function() {
            console.log("I am out : "+ e.currentTarget);
            timeoutId = false;
        }, 1000)*/
    },
    trustdrop:function(e){
        var storedetail = this.getKeys(e).attr('data-value').split('-');
        $qo.storeID = storedetail[0];
        $qo.storeguid = storedetail[1];
        if (!timeoutId) {
            timeoutId = true;
            window.setTimeout(function() {
                $datas = { gid: $qo.storeguid, id: $qo.storeID };
                var trustsView = new TrustsView({data:getStoreTrust($datas),el:'#trust-'+$qo.storeID});
                $('#trust-'+$qo.storeID).append(trustsView.render());
               timeoutId = false;
            }, 500)
        }
    },
    trustshrink:function(e){
        /*timeoutId = true;
        window.setTimeout(function() {
            console.log("I am out : "+ e.currentTarget);
            timeoutId = false;
        }, 1000)*/
    },
    getKeys:function(e){
        return	$(e.currentTarget).parent();
    }
});

var SponsoredStoreView=Backbone.View.extend({//for Service Wise Collection view
    el:'.main-container-top',
    initialize:function(options){
        this.options=options;
    },
    events:{
        'click .f-menu':'cityselect'
    },
    render:function(){
        var hsb=new HeaderSearchBar();
        hsb.render();
        var temp=_.template($("#services-collection").html());
        var html=temp({qo:this.options.qo});
        this.$el.html(html).trigger("create");
    },
    cityselect:function(){
        //
        var uri=$("input[name=etype0]:checked").val();
        router.navigate("#/stores/services/"+uri+"-"+$qo.catname+"-"+$qo.cid);

        /*TODO write proccess in case city is clicked*/
    }
});

var SponsoredCityStoreView=Backbone.View.extend({//for Service Wise Collection view
    el:'.main-container-top',
    initialize:function(options){
        this.options=options;
    },
    events:{
        'click .f-menu':'serviceselect'
    },
    render:function(){
        var hsb=new HeaderSearchBar();
        hsb.render();
        var temp=_.template($("#cities-collection").html());
        var html=temp({qo:this.options.qo});
        this.$el.html(html).trigger("create");
    },
    serviceselect:function(){
        var uri=$("input[name=etype0]:checked").val();
        router.navigate("#/stores/cities/"+$qo.cityname+"-"+$qo.cityguid+"-"+$qo.cityid+"-"+uri);
     }


});

var SponsoredStoreListView=Backbone.View.extend({
    el:'.search-result',
    initialize:function(options){
        this.options=options;
    },
    events:{
        'mouseover #ratecardsdrop':'ratecarddrop',
        'mouseleave #ratecardsdrop':'ratecardshrink',
        'mouseover #photosdrop':'photodrop',
        'mouseleave #photosdrop':'photoshrink',
        'mouseover #reviewsdrop':'reviewdrop',
        'mouseleave #reviewsdrop':'reviewshrink',
        'mouseover #trustsdrop':'trustdrop',
        'mouseleave #trustsdrop':'trustshrink'
    },
    render:function(){
        var temp=_.template($("#sponsored-store-list").html());
        var html=temp({sponsoredStores:this.options.sponsoredStores,qo:this.options.qo});
        this.$el.html(html).trigger("create");
    },
    ratecarddrop:function(e){
        var storedetail = this.getKeys(e).attr('data-value').split('-');
        $qo.storeID = storedetail[0];
        $qo.storeguid = storedetail[1];
        if (!timeoutId) {
            timeoutId = true;
            window.setTimeout(function() {
                $datas = { gid: $qo.storeguid, id: $qo.storeID };
                var rateCardListView = new RateCardView({ratecards:getRateCard($datas),el:'#rate-'+$qo.storeID});
                $('#rate-'+$qo.storeID).append(rateCardListView.render());
                timeoutId = false;
            }, 500)
        }
    },
    ratecardshrink:function(e){
        /*timeoutId = true;
         window.setTimeout(function() {
         console.log("I am out : "+ e.currentTarget);
         timeoutId = false;
         }, 1000)*/
    },
    photodrop:function(e){
        var storedetail = this.getKeys(e).attr('data-value').split('-');
        $qo.storeID = storedetail[0];
        $qo.storeguid = storedetail[1];
        if (!timeoutId) {
            timeoutId = true;
            window.setTimeout(function() {
                $datas = { gid: $qo.storeguid, id: $qo.storeID };
                var storePhotoView = new StorePhotoView({storephotos:getStorePhoto($datas),el:'#photo-'+$qo.storeID});
                $('#photo-'+$qo.storeID).append(storePhotoView.render());
                timeoutId = false;
            }, 500)
        }
    },
    photoshrink:function(e){
        /*timeoutId = true;
         window.setTimeout(function() {
         console.log("I am out : "+ e.currentTarget);
         timeoutId = false;
         }, 1000)*/
    },
    reviewdrop:function(e){
        var storedetail = this.getKeys(e).attr('data-value').split('-');
        $qo.storeID = storedetail[0];
        $qo.storeguid = storedetail[1];
        if (!timeoutId) {
            timeoutId = true;
            window.setTimeout(function() {
                $datas = { gid: $qo.storeguid, id: $qo.storeID };
                var reviewsView = new ReviewsView({reviews:getStoreReview($datas),el:'#review-'+$qo.storeID});
                $('#review-'+$qo.storeID).append(reviewsView.render());
                timeoutId = false;
            }, 500)
        }
    },
    reviewshrink:function(e){
        /* timeoutId = true;
         window.setTimeout(function() {
         console.log("I am out : "+ e.currentTarget);
         timeoutId = false;
         }, 1000)*/
    },
    trustdrop:function(e){
        var storedetail = this.getKeys(e).attr('data-value').split('-');
        $qo.storeID = storedetail[0];
        $qo.storeguid = storedetail[1];
        if (!timeoutId) {
            timeoutId = true;
            window.setTimeout(function() {
                $datas = { gid: $qo.storeguid, id: $qo.storeID };
                var trustsView = new TrustsView({data:getStoreTrust($datas),el:'#trust-'+$qo.storeID});
                $('#trust-'+$qo.storeID).append(trustsView.render());
                timeoutId = false;
            }, 500)
        }
    },
    trustshrink:function(e){
        /*timeoutId = true;
         window.setTimeout(function() {
         console.log("I am out : "+ e.currentTarget);
         timeoutId = false;
         }, 1000)*/
    },
    getKeys:function(e){
        return	$(e.currentTarget).parent();
    }
});

var StoreAdminView=Backbone.View.extend({
    el:'.main-container',
    initialize:function(options){
        this.options=options;
    },
    render:function(){
        //template_loader().load("templates/advertise.html","#advertise").postrender(".hoo>tr>td.select","#timing-options");

    }
});

var StoreProfile=Backbone.View.extend({
    el:'.full-container',//page-header
    elphotos:'.rate-card',
    initialize:function(options){this.options=options;},
    events:{
        'mouseenter .shareicons':'showshareicons',
        'mouseleave .services-header':'hideshareicons',
        'click #rate-rev-top':'reviewmenue',
        'click #gomap':'gotomap',
        'click #favourite':'favourite',
        'click #checkin':'checkin',
        'click #rateus>span':'rateus',
        'click #publish':'publishReview',
        'click #salonia':'saloni',
        'click #pba':'pb',
        'click #naa':'na'
    },
    render:function(){
        var that=this;
        var temp=_.template($("#parlor-profile-template").html());
        var html=temp({data:this.options.data,qo:this.options.qo});
        this.$el.html(html).trigger("create");

        $datas = { gid: $qo.storeguid, id: $qo.storeID };
        var rateCardListView = new RateCardView({ratecards:getRateCard($datas)});
        $('#rate-card').append(rateCardListView.render());

        var storePhotoView = new StorePhotoView({storephotos:getStorePhoto($datas)});
        $('#store-photo').append(storePhotoView.render());

        var reviewsView = new ReviewsView({reviews:getStoreReview($datas)});
        $('#store-reviews').append(reviewsView.render());

        var trustsView = new TrustsView({data:getStoreTrust($datas)});
        $('#trust').append(trustsView.render());

        $('[data-toggle="tooltip"]').tooltip();

    },
    saloni:function(e){
        console.log("----------------------1")
        e.preventDefault();
        $(".nav-tabs a").click(function(){
            $(this).tab('show');
        });
    },
    pb:function(e){
        console.log("----------------------2")
        e.preventDefault();
        $(".nav-tabs a").click(function(){
            $(this).tab('show');
        });
    },
    na:function(e){
        console.log("----------------------3")
        e.preventDefault();
        $(".nav-tabs a").click(function(){
            $(this).tab('show');
        });
    },
    publishReview:function(e){
        $('#reviewerror').empty();
        if($user.displayName == null){
            $('#login').modal("show");
        }else {
            if($rate!=0){
                var text = $('textarea#comment').val();
                if(text.length>100){
                    $data = {platform:$user.platform,token:$user.access_token,storeguid:$qo.storeguid,storeid:$qo.storeID,rating:$rate,comment:text};
                    var response = saveReview($data);
                }else{
                    $('#reviewerror').append("<center><div class=\"errormsg col-md-12\">Review is too short please provide more than 100 characters</div></center>");
                }
            }else{
                $('#reviewerror').append("<center><div class=\"errormsg col-md-12\">You need to rate us :), before submitting the review</div></center>");
            }

        }
    },
    rateus:function(e){
        if($user.displayName == null){
            $('#login').modal("show");
        }else {
            $rate= $(e.currentTarget).attr('data-value');
            for( var i = 5; i > 0 ; i-- ){
                if( $rate >= i ){
                    $('#star'+i).addClass('fa fa-star-o fa-star-active').removeClass('star');
                }else{
                    $('#star'+i).removeClass('fa fa-star-o fa-star-active').addClass('star');
                }
            }
            $data = {platform:$user.platform,token:$user.access_token,storeguid:$qo.storeguid,storeid:$qo.storeID,rating:$rate};
            var response = saveReview($data);
            console.log("----------------------Thanks for submitting the review-------------------" + response );
        }
    },
    showshareicons:function(e){
        $('.shareicons>a').removeClass("hidden");
    },
    hideshareicons:function(){
        $('.shareicons>a').addClass("hidden");
    },
    reviewmenue:function(){
        $('html, body').animate({
            scrollTop:$('#store-reviews').offset().top - 90
        }, 700);
    },
    trustmenue:function(){
        $('html, body').animate({
            scrollTop:$('#trust').offset().top - 90
        }, 700);
    },
    gotomap:function(e){
        e.preventDefault();
        $('html, body').animate({
            scrollTop:$('#googleMap').offset().top -120
        }, 700);
    },
    encapsulate:function(e){
        $(".nav-list>h4.active").removeClass("active");
        $(".nav-contents>div.active").removeClass("active").fadeOut();
        $(e.currentTarget).addClass('active');
        return $(e.currentTarget).attr("data-to");
    },
    favourite:function(e){
        if($user.displayName!=null) {
            $(e.currentTarget).css('color', '#cd0000');
            saveFavourite({platform: $user.platform, token: $user.access_token, storeguid: $qo.storeguid, storeid: $qo.storeID});
        }else{
            $('#login').modal("show");
        }
    },
    checkin:function(e){
        if($user.displayName!=null){
            $(e.currentTarget).css('color','#cd0000');
            saveCheckin({platform:$user.platform,token:$user.access_token,storeguid:$qo.storeguid,storeid:$qo.storeID});
        }else{
            $('#login').modal("show");
        }

    }
});

var RateCardView = Backbone.View.extend({
    el:'#rate-card',
    initialize:function(options){
        this.options=options;
    },
    render:function(){
        var temp=_.template($("#pp-ratecards").html());
        var html=temp({ratecards:this.options.ratecards});
        this.$el.html(html).trigger("create");
    }
});

var StorePhotoView = Backbone.View.extend({
    el:'#store-photo',
    initialize:function(options){
        this.options=options;
    },
    render:function(){
        var temp=_.template($("#pp-photos").html());
        var html=temp({storephotos:this.options.storephotos});
        this.$el.html(html).trigger("create");
    }
});

var PageOneSponsoredView = Backbone.View.extend({
    el:'#page-1-sponsored',
    initialize:function(options){
        this.options=options;
    },
    render:function(){
        var temp=_.template($("#page-1-sponsored-temp").html());
        var html=temp({stores:this.options.stores});
        this.$el.html(html).trigger("create");
    }
});

var ReviewsView = Backbone.View.extend({
    el:'#store-reviews',
    events:{
        'click .tips':'show_tips',
        'click #tooltiprev':'tip'
    },
    initialize:function(options){
        this.options=options;
    },
    render:function(){
        var temp=_.template($("#pp-reviews").html());
        var html=temp({reviews:this.options.reviews});
        this.$el.html(html).trigger("create");
        $('.tooltiprev').tooltip();
    },
    tip:function(e){
        e.preventDefault();
    },
    show_tips:function(){
        $('#tip').addClass("hoverpan").removeClass("hidden");
    }
});

var TrustsView = Backbone.View.extend({
    el:'#trust',
    initialize:function(options){
        this.options=options;
    },
    render:function(){
        var temp=_.template($("#trusts").html());
        var html=temp({data:this.options.data});
        this.$el.html(html).trigger("create");
    }
});

var ModalView=Backbone.View.extend({
    el:'.modal-container',
    initialize:function(options){
        this.options=options;
    }
});


//ROUTER
var Workspace = Backbone.Router.extend({
    initialize:function(){
        Backbone.history.start(/*{pushState: true}*/);
    },
    routes:{
        '': 'home',
        'stores/:aid-:bid-:bgid-:cid-:did':'home_stores',
        /*'stores/f/q=:aid&ids=:bid-:cid-:did-:eid':'stores_filtered',*/
        'stores/profile/:aid-:bid&:cid-:did&:eid-:sid-:guid':'store_profile',
        'stores/services/:cnm-:cgd-:cid-:snm-:sid':'stores_service_wise',
        'stores/cities/:cnm-:cgd-:cid-:snm-:sid':'stores_city_wise',
        'freelisting':'free_listing',
        'listing':'listing',
        'about':'about',
        'carrers':'carreers',
        'contactus':'contact_us',
        'advertise':'advertise',
        'storeadmin':'storeadmin',
        'privacypolicy':'privacypolicy',
        'haircare':'haircare',
        'skincare':'skincare',
        'fitness':'fitness',
        'makeup':'makeup',
        'diet':'diet',
        'termsofservice':'termsofservice',
        'profile':'profile'
    },
    home:function(){
        $(".overlay").fadeIn();
        new HomeView().render();
        new FooterView().render();
        $('html, body').animate({scrollTop:0},1000);
        $(".overlay").fadeOut();
    },
    stores_service_wise:function(cnm,cgd,cid,snm,sid){
        $('.full-width-container').empty();
        $('.main-container-bottom').empty();
        $qo.catname=snm;
        $qo.cid=sid;
        $qo.cityname=cnm;
        $qo.cityid=cid;
        $qo.cityguid=cgd;
        if($qo.cid==2){
            $qo.cid="2,4,5";
        }else if($qo.cid==7){
            $qo.cid="6,7";
        }else if($qo.cid==14){
            $qo.cid="12,14";
        }
        //TODO Views needs to be added
        var sponsoredStoreView = new SponsoredStoreView({sid:$qo.cid,snm:$qo.catname});
        sponsoredStoreView.render();
        $datas={cityid:$qo.cityid,catids:$qo.cid,sortby:"none",cityguid:$qo.cityguid,startindex:1,endindex:$qo.pagesize};
        var sponsoredStores=new SponsoredCollection();
        sponsoredStores.fetch({
            data:$datas,
            dataType:"json",
            type:'POST',
            beforeSend: function(){showOverlay(true);},
            success:function(sponsoredStores){
                if(sponsoredStores.count==0 || sponsoredStores.count==null){
                    $(document).find(".search-result").html("<div class='col-md-12 noresult'><center><h3><i class=\"fa fa-exclamation-triangle\"></i> No Result Found.</h3></center></div>");
                }
                var sponsoredStoresView = new SponsoredStoreListView({sponsoredStores:sponsoredStores,qo:$qo});
                sponsoredStoresView.render();
                $('html, body').animate({scrollTop:-200},1000);
                $(".overlay").fadeOut();
             },
            error:function(model,e){
                console.log("Error : "+ e.responseText + e + JSON.stringify(e));
                $(".overlay").fadeOut();
                $(document).find(".search-result").html("<div class='col-md-12 noresult'><center><h3><i class=\"fa fa-exclamation-triangle\"></i> No Result Found.</h3></center></div>");
            }
        });
    },
    stores_city_wise:function(cnm,cgd,cid,snm,sid){
        $('.full-width-container').empty();
        $('.main-container-bottom').empty();
        $qo.cityname=cnm;
        $qo.catname=snm;
        $qo.cid=sid;
        $qo.cityid=cid;
        $qo.cityguid=cgd;
        if($qo.cid==2){
            $qo.cid="2,4,5";
        }else if($qo.cid==7){
            $qo.cid="6,7";
        }else if($qo.cid==14){
            $qo.cid="12,14";
        }
        var sponsoredCityStoreView = new SponsoredCityStoreView({cnm:$qo.cityname,cid:$qo.cityid});
        sponsoredCityStoreView.render();
        var sponsoredStores=new SponsoredCollection();
        sponsoredStores.fetch({
            data:{cityid:$qo.cityid,catids:$qo.cid,sortby:"none",cityguid:$qo.cityguid,startindex:1,endindex:$qo.pagesize},
            dataType:"json",
            type:'POST',
            beforeSend: function(){showOverlay(true);},
            success:function(sponsoredStores){
                console.log(JSON.stringify(sponsoredStores)+" ---------------- ");
                if(sponsoredStores.count<=0){
                    console.log("-------------inside if")
                    $(document).find(".search-result").html("<div class='col-md-12 noresult'><center><h3><i class=\"fa fa-exclamation-triangle\"></i> No Result Found.</h3></center></div>");
                }else {
                    var sponsoredStoresView = new SponsoredStoreListView({sponsoredStores: sponsoredStores, qo: $qo});
                    sponsoredStoresView.render();
                }
                $('html, body').animate({scrollTop: -200}, 1000);
                $(".overlay").fadeOut();
            },
            error:function(model,e){
                console.log("Error : "+ e.responseText + e + JSON.stringify(e));
                $(".overlay").fadeOut();
                $(document).find(".search-result").html("<div class='col-md-12 noresult'><center><h3><i class=\"fa fa-exclamation-triangle\"></i> No Result Found.</h3></center></div>");
            }
        });
    },
    home_stores:function(aid,bid,bgid,cid,did,eid){
        $(".overlay").fadeIn();
        $qo.blockname=aid;
        $qo.blockid=bid;
        $qo.blockguid=bgid;
        $qo.catname=cid;
        $qo.catid=did;
        writeallvariables();
        $morefilters=eid;
        $datas="";
        if($qo.catid==2){
            $qo.catid="2,4,5";
        }else if($qo.catid==7){
            $qo.catid="6,7";
        }else if($qo.catid==14){
            $qo.catid="12,14";
        }
        if($qo.isFiltered==1){
            $datas={ blockid: $qo.blockid, blockguid: $qo.blockguid, catid: $qo.catid,brandname:$qo.brandname,aminities:$qo.morefilters,startindex: 1,endindex:$qo.pagesize};
        }
        else{
            $datas={ blockid: $qo.blockid, blockguid: $qo.blockguid, catid: $qo.catid, sortby: "none",startindex: 1,endindex:$qo.pagesize};
        }
        new HeaderView().render();
        var searchView=new SearchView({qo:$qo});
        searchView.render();
        new FooterView().render();
        $(".overlay").fadeOut();
    },//end
    store_profile:function(aid,bid,cid,did,eid,sid,guid){
        new HeaderView().render();
        $qo.blockname=aid;
        $qo.blockguid=bid;
        $qo.catname=cid;
        $qo.catid=did;
        $qo.storename=eid;
        $qo.storeguid=guid;
        $qo.storeID=sid;
        $.ajax({
            data:{guid:guid,storeid:sid},
            type:'POST',
            cache : false,
            url:$ROOT_URL+"/getstoredetails",
            dataType:"json",
            beforeSend: function(){
                $(".overlay").fadeIn();
            },
            success: function(data){
                $(".overlay").fadeOut();
                var lat = 28.60659;
                var log = 77.29368;
                if(data.coordinate != null || data.coordinate != undefined) {
                    lat = parseFloat(data.coordinate.toString().split(',')[0]);
                    log = parseFloat(data.coordinate.toString().split(',')[1]);
                }
                var storeView=new StoreProfile({data:data,qo:$qo});
                storeView.render();
                var mapProp = {
                    center: new google.maps.LatLng(lat,log),
                    zoom:14,
                    mapTypeControl: true,
                    mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
                    navigationControl: true,
                    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
                var companyPos = new google.maps.LatLng(lat, log);
                var companyMarker = new google.maps.Marker({
                    position: companyPos,
                    map: map,
                    title:"LookPlex Store"
                });
                new FooterView().render();
            },
            error: function(msg){
                $(".overlay").fadeOut();
            }
        });
    },
    profile:function(){
    new HeaderSearchBar().render();
    if($user.displayName!=null) {
        $(".overlay").fadeIn();
        $('.full-width-container').empty();
        $('.main-container-bottom').empty();
        new ProfileView().render();
        renderTemplate("user-profile-info",null);
        $(".overlay").fadeOut();
    }else{
        $('#login').modal("show");
    }
    },
    free_listing:function(){
        $('.main-container-top').empty();
        $('.full-width-container').empty();
        $('.main-container-bottom').empty();
        template_loader("templates/listing.html","#free-listing-template",".hoo>tbody>tr>td>select","#timing-options");
    },
    listing:function(){
        $('#hiwdiv').empty();
        $('.full-width-container').empty();
        $('.main-container-bottom').empty();
        template_loader("templates/freelisting.html","#listing-template",".hoo>tbody>tr>td>select","#timing-options");
    },
    carreers:function(){
        $('.full-width-container').empty();
        $('.main-container-bottom').empty();
        template_loader("templates/carreers.html","#carreers");
    },
    about:function(){
        $('.full-width-container').empty();
        $('.main-container-bottom').empty();
        template_loader("/templates/about.html","#about");
    },
    contact_us:function(){
        $('.full-width-container').empty();
        $('.main-container-bottom').empty();
        template_loader("templates/contactus.html","#contact_us");
    },
    advertise:function(){
        $('.full-width-container').empty();
        $('.main-container-bottom').empty();
        template_loader("templates/advertise.html","#advertise");
    },
    storeadmin:function(){
        $('.full-width-container').empty();
        $('.main-container-bottom').empty();
        var storeadminview=new StoreAdminView();
        storeadminview.render();
    },
    termsofservice:function(){
        $("#login").modal("hide");
        $('.full-width-container').empty();
        $('.main-container-bottom').empty();
        template_loader("templates/tos.html","#tos");
    },
    privacypolicy:function(){
        $("#login").modal("hide");
        $('.full-width-container').empty();
        $('.main-container-bottom').empty();
        template_loader("templates/privacypolicy.html","#privacypolicy");
    }

});

var router=new Workspace();


