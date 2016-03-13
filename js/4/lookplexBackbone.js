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
        numberofpages:"",
        pageid:1
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
            },
            success:function(data){
                $temp="<script type='text/template' id='"+f+"'>"+data+"</script>";
                $("body").append($temp);
                var template=_.template(data)({data:""});
                $(".full-container").html(template);
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
    el:'.full-container',
    events:{
        'click .user-':'show_details'
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
    el:'.full-container',/*
    initialize:function(){
        _.bindAll(this, 'detect_scroll');
        $(window).scroll(this.detect_scroll);
    },*/
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
                $('html, body').animate({
                    scrollTop:$('#eyecandy').offset().top - 90
                }, 0);
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
        if($user.displayName!=null){
            new UserMenueView().render();
        }
    }
});
var UserMenueView=Backbone.View.extend({
    el:'#userinfo',
    events:{
      'click #logout':'logout'
    },
    render:function(){
        var temp=_.template($("#usermenue").html());
        var html=temp();
        this.$el.html(html).trigger("create");
    },
    logout:function(e){
        e.preventDefault();
        $user.access_token = null;
        $user.displayName = null;
        $user.image = null;
        $user.platform = null;
        $('#userinfo').empty();
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
var SponsoredCityView=Backbone.View.extend({
    el:'.full-container',
    events:{
        'click .f-menu':'servicechange'
    },
    initialize:function(options){ this.options=options;},
    render:function(){
        var temp=_.template($("#citytemplate").html());
        var html=temp({qo:$qo});
        this.$el.html(html).trigger("create");
    },
    servicechange:function(e){
        router.navigate("#/stores/cities/"+$qo.cityname+"-"+$qo.cityguid+"-"+$qo.cityid+"-"+$(e.currentTarget).val());
    }
});
var SponsoredServiceView=Backbone.View.extend({
    el:'.full-container',
    events:{
        'click .f-menu':'citychange'
    },
    initialize:function(options){ this.options=options;},
    render:function(){
        var temp=_.template($("#servicetemplate").html());
        var html=temp({qo:$qo});
        this.$el.html(html).trigger("create");
    },
    citychange:function(e){
        router.navigate("#/stores/services/"+$(e.currentTarget).val()+"-"+$qo.catname+"-"+$qo.catid);
    }
});

var SearchView=Backbone.View.extend({
    el:'.full-container',//page-header
    events:{
        'click .f-menu':'servicechange',
        'click #next':'next',
        'click #previ':'prev'
    },
    render:function(){
        var temp=_.template($("#searchtemplate").html());
        var html=temp({qo:$qo});
        this.$el.html(html).trigger("create");
        $('#filter2').removeClass('hidden');
        renderstoreItemView($qo.pageid);
        $.ajax({
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
                $(".sub-filter:eq(1)").empty();
                $.each(data.brandlist,function(index,item){
                    $(".sub-filter:eq(1)").append("<label class='tocontinue'><input class=\"fi-menu brandname\" type=\"checkbox\" multiple name=\"brand[]\" value=\""+item.id+"\">"+item.brandName+"</label>");
                });
                showFilters();
            },
            error:function(msg){
                console.log(JSON.stringify(msg));
            }

        });
        $('.weekdays').slideUp();
        return this;
    },
    servicechange:function(e){
        $qo.aminities = [];
        $qo.brandname = null;
        $qo.gender = null;
        $qo.morefilters = null;
        $('.fi-menu').prop('checked', false);
        router.navigate("#/stores/"+$qo.blockname+"-"+$qo.blockid+"-"+$qo.blockguid+"-"+$(e.currentTarget).val() + "-" + 1);
    },
    brandupdate:function(e){
        $qo.aminities = [];
        var uri = $("input[name=etype0]:checked").val();
        router.navigate("#/stores/"+$qo.blockname+"-"+$qo.blockid+"-"+$qo.blockguid+"-"+uri);
    },
    next:function(e){
        $qo.isFiltered=1;
        router.navigate("#/stores/" + $qo.blockname + "-" + $qo.blockid + "-" + $qo.blockguid + "-" + $qo.catname + "-" + $qo.catid + "-" + (parseInt($qo.pageid) + 1));
    },
    prev:function(e){
        $qo.isFiltered=1;
        router.navigate("#/stores/" + $qo.blockname + "-" + $qo.blockid + "-" + $qo.blockguid + "-" + $qo.catname + "-" + $qo.catid + "-" + (parseInt($qo.pageid) - 1));
    }

});

var StoreItemView = Backbone.View.extend({
    el:'.search-result',
    initialize:function(options){
        this.options=options;
    },
    events:{
        'click #ratecardsdrop':'ratecarddrop',
        'click #photosdrop':'photodrop',
        'click #reviewsdrop':'reviewdrop',
        'click #trustsdrop':'trustdrop'
    },
    render:function(){
            var temp = _.template($('#result-item').html());
            var html = temp({stores: this.options.stores, qo: this.options.qo});
            this.$el.html(html).trigger("create");
            /*$('[data-toggle="popover"]').popover();*/
            $('[data-toggle="tooltip"]').tooltip();
            /*$('[data-toggle="dropdown"]').dropdown();*/
    },
    ratecarddrop:function(e){
        var storedetail = this.getKeys(e).attr('data-value').split('-');
        $qo.storeID = storedetail[0];
        $qo.storeguid = storedetail[1];
        router.navigate("#/stores/profile/" + $qo.storeID + "-" + $qo.storeguid);
        $('html, body').animate({scrollTop:700},1000);
    },
    photodrop:function(e){
        var storedetail = this.getKeys(e).attr('data-value').split('-');
        $qo.storeID = storedetail[0];
        $qo.storeguid = storedetail[1];
        router.navigate("#/stores/profile/" + $qo.storeID + "-" + $qo.storeguid);
        $('html, body').animate({scrollTop:900},1000);

    },
    reviewdrop:function(e){
        var storedetail = this.getKeys(e).attr('data-value').split('-');
        $qo.storeID = storedetail[0];
        $qo.storeguid = storedetail[1];
        router.navigate("#/stores/profile/" + $qo.storeID + "-" + $qo.storeguid);
        $('html, body').animate({scrollTop:1300},1000);

    },
    trustdrop:function(e){
        var storedetail = this.getKeys(e).attr('data-value').split('-');
        $qo.storeID = storedetail[0];
        $qo.storeguid = storedetail[1];
        router.navigate("#/stores/profile/" + $qo.storeID + "-" + $qo.storeguid);
        $('html, body').animate({scrollTop:1600},1000);

    },
    getKeys:function(e){
        return	$(e.currentTarget).parent();
    }
});



var StoreProfile=Backbone.View.extend({
    el:'.full-container',//page-header
    elphotos:'.rate-card',
    initialize:function(options){this.options=options;},
    events:{
        'click #rate-rev-top':'reviewmenue',
        'click #gomap':'gotomap',
        'click #favourite':'favourite',
        'click #checkin':'checkin',
        'click #rateus>span':'rateus',
        'click #publish':'publishReview'
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

        $('[data-toggle="tooltip"]').tooltip();

        $('html, body').animate({scrollTop:0},700);

    },
    publishReview:function(e){
        $('#reviewerror').empty();
        if($user.displayName == null){
            $('#modallogin').modal("show");
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
            $('#modallogin').modal("show");
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
        }
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
            $('#modallogin').modal("show");
        }
    },
    checkin:function(e){
        if($user.displayName!=null){
            $(e.currentTarget).css('color','#cd0000');
            saveCheckin({platform:$user.platform,token:$user.access_token,storeguid:$qo.storeguid,storeid:$qo.storeID});
        }else{
            $('#modallogin').modal("show");
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


//ROUTERS
var Workspace = Backbone.Router.extend({
    initialize:function(){
        Backbone.history.start(/*{pushState: true}*/);
    },
    routes:{
        '': 'home',
        'stores/:aid-:bid-:bgid-:cid-:did-:pid':'home_stores',
        'stores/profile/:sid-:guid':'store_profile',
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
        'profile':'profile',
        'journey':'journey',
        'ratings':'ratings',
        'reviews':'reviews',
        'bookmarks':'bookmarks',
        'checkins':'checkins'
    },
    home:function(){
        $(".overlay").fadeIn();
        new HeaderView().render();
        $('#logo').removeClass("hidden");
        $('#search-bar0').addClass("hidden");
        new HomeView().render();
        new FooterView().render();
        $('html, body').animate({scrollTop:0},1000);
        $(".overlay").fadeOut();
    },
    stores_service_wise:function(cnm,cgd,cid,snm,sid){
        $(".overlay").fadeIn();
        $qo.catname=snm;
        $qo.catid = sid;
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
        new HeaderView().render();
        new SponsoredServiceView({qo:$qo}).render();
        $datas={cityid:$qo.cityid,catids:$qo.catid ,sortby:$qo.sortby,cityguid:$qo.cityguid,startindex:1,endindex:$qo.pagesize};
        var sponsoredStores=new SponsoredCollection();
        sponsoredStores.fetch({
            data:$datas,
            dataType:"json",
            type:'POST',
            beforeSend: function(){showOverlay(true);},
            success:function(stores){
                if(stores.count==0 || stores.count==null){
                    $(document).find(".search-result").html("<div class='col-md-12 noresult'><center><h3><i class=\"fa fa-exclamation-triangle\"></i> No Result Found.</h3></center></div>");
                }
                var storeItemView=new StoreItemView({stores: stores,qo:$qo});
                storeItemView.render();
                $('html, body').animate({scrollTop:-200},1000);
                $(".overlay").fadeOut();
            },
            error:function(model,e){
                console.log("Error : "+ e.responseText + e + JSON.stringify(e));
                $(".overlay").fadeOut();
                $(document).find(".search-result").html("<div class='col-md-12 noresult'><center><h3><i class=\"fa fa-exclamation-triangle\"></i> No Result Found.</h3></center></div>");
            }
        });
        new FooterView().render();
        $(".overlay").fadeOut();
    },
    stores_city_wise:function(cnm,cgd,cid,snm,sid){
        $(".overlay").fadeIn();
        $qo.cityname=cnm;
        $qo.catname=snm;
        $qo.catid = sid;
        $qo.cityid=cid;
        $qo.cityguid=cgd;
        if($qo.cid==2){
            $qo.cid="2,4,5";
        }else if($qo.cid==7){
            $qo.cid="6,7";
        }else if($qo.cid==14){
            $qo.cid="12,14";
        }
        new HeaderView().render();
        new SponsoredCityView({qo:$qo}).render();
        new SponsoredCollection().fetch({
            data:{cityid:$qo.cityid,catids:$qo.catid,sortby:"none",cityguid:$qo.cityguid,startindex:1,endindex:$qo.pagesize},
            dataType:"json",
            type:'POST',
            beforeSend: function(){showOverlay(true);},
            success:function(stores){
                if(stores.count<=0){
                    $(document).find(".search-result").html("<div class='col-md-12 noresult'><center><h3><i class=\"fa fa-exclamation-triangle\"></i> No Result Found.</h3></center></div>");
                }else {
                    var storeItemView=new StoreItemView({stores: stores,qo:$qo});
                    storeItemView.render();
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
        new FooterView().render();
    },
    home_stores:function(aid,bid,bgid,cid,did,pid){
        $(".overlay").fadeIn();
        $qo.pageid = pid;
        $qo.blockname = aid;
        $qo.blockid = bid;
        $qo.blockguid = bgid;
        $qo.catname = cid;
        $qo.catid = did;
        writeallvariables();
        $datas = "";
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
        if($qo.isFiltered==1){
            $datas={ blockid: $qo.blockid, blockguid: $qo.blockguid,sortby: $qo.sortby, catid: $qo.catid,brandname:$qo.brandname,aminities:$qo.morefilters,startindex: (($qo.pageid - 1) * $qo.pagesize ) + 1 ,endindex: $qo.pageid * $qo.pagesize};
        }
        else{
            $datas={ blockid: $qo.blockid, blockguid: $qo.blockguid, catid: $qo.catid, sortby: $qo.sortby,startindex: (($qo.pageid - 1) * $qo.pagesize ) + 1 ,endindex: $qo.pageid * $qo.pagesize};
        }
        new HeaderView().render();
        var searchView=new SearchView({qo:$qo});
        searchView.render();
        new FooterView().render();
        $(".overlay").fadeOut();
    },
    store_profile:function(sid,guid){
        new HeaderView().render();
        $qo.storeguid = guid;
        $qo.storeID = sid;
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
        if($user.displayName!=null) {
            $(".overlay").fadeIn();
            new HeaderView().render();
            new ProfileView().render();
            /*renderTemplate("user-profile-info",null);*/
            $(".overlay").fadeOut();
        }else{
            $('#modallogin').modal("show");
        }
    },
    journey:function(){
        if($user.displayName!=null) {
        $(".overlay").fadeIn();
        new HeaderView().render();
        new ProfileView().render();
        renderTemplate("user-journey",null);
        $(".overlay").fadeOut();
        }else{
         $('#modallogin').modal("show");
         }
    },
    ratings:function(){
        if($user.displayName!=null) {
        $(".overlay").fadeIn();
        new HeaderView().render();
        new ProfileView().render();
        renderTemplate("user-bookmarks",null);
        $(".overlay").fadeOut();
        }else{
         $('#modallogin').modal("show");
         }
    },
    reviews:function(){
        if($user.displayName!=null) {
        $(".overlay").fadeIn();
        new HeaderView().render();
        new ProfileView().render();
        renderTemplate("user-reviews",null);
        $(".overlay").fadeOut();
        }else{
         $('#modallogin').modal("show");
         }
    },
    bookmarks:function(){
        if($user.displayName!=null) {
        $(".overlay").fadeIn();
        new HeaderView().render();
        new ProfileView().render();
        renderTemplate("user-bookmarks",null);
        $(".overlay").fadeOut();
        }else{
         $('#modallogin').modal("show");
         }
    },
    checkins:function(){
        if($user.displayName!=null) {
        $(".overlay").fadeIn();
        new HeaderView().render();
        new ProfileView().render();
        $(".overlay").fadeOut();
        }else{
         $('#modallogin').modal("show");
         }
    },
    free_listing:function(){
        template_loader("templates/listing.html","#free-listing-template",".hoo>tbody>tr>td>select","#timing-options");
        new FooterView().render();
    },
    listing:function(){
        template_loader("templates/freelisting.html","#listing-template",".hoo>tbody>tr>td>select","#timing-options");
        new FooterView().render();
    },
    carreers:function(){
        template_loader("templates/carreers.html","#carreers");
        new FooterView().render();
    },
    about:function(){
        template_loader("/templates/about.html","#about");
        new FooterView().render();
    },
    contact_us:function(){
        template_loader("templates/contactus.html","#contact_us");
        new FooterView().render();
    },
    advertise:function(){
        template_loader("templates/advertise.html","#advertise");
        new FooterView().render();
    },
    storeadmin:function(){
        var storeadminview=new StoreAdminView();
        storeadminview.render();
    },
    termsofservice:function(){
        template_loader("templates/tos.html","#tos");
        new FooterView().render();
    },
    privacypolicy:function(){
        template_loader("templates/privacypolicy.html","#privacypolicy");
        new FooterView().render();
    }

});

var router=new Workspace();


