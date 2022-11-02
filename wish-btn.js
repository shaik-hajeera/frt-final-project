var app_url = "https://metizapps.com/wishlist/",
    shop_url = Shopify.shop,
    wishlist_save = '';
if (typeof jQuery === 'undefined') {
    document.write('<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>');
}
jQuery("head").append('<link rel="stylesheet" href="' + app_url + 'assets/css/mswishlist.min.css" type="text/css" />');
jQuery("head").append('<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" type="text/css" />');
jQuery("head").append('<link rel="stylesheet" href="' + app_url + 'viewlist/wishlist_css?shop=' + shop_url + '" type="text/css" />');

//get paramter from url
var getParameterByName = function (paramatername) {
    paramatername = paramatername.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + paramatername + "=([^&#]*)");
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//check vatiant exists or not
var variantExists = function (items, product_variant) {
    for (var i = 0; i < items.length; i++) {
        if ((items[i][0] == product_variant[0]) && (items[i][1] == product_variant[1]))
            return i;
    }
    return -1;
}

jQuery.ajax({
    type: 'POST',
    url: app_url + "viewlist/wishlist_setting",
    datatype: "jsonp",
    data: {shop_url: shop_url},
    success: function (data) {
        
        var metiz = jQuery;
        
        var setting = JSON.parse(data);
        var wishlist_icon = (setting.wishlist_icon) ? setting.wishlist_icon : 'fa fa-heart';
        var add_to_wishlist = (setting.add_to_wishlist) ? setting.add_to_wishlist : "Add to wishlist";
        var remove_from_wishlist = (setting.remove_from_wishlist) ? setting.remove_from_wishlist : "Remove from wishlist";
        
        //set wishlist btn
        if (metiz(".mswishlist").hasClass("mswlbtn")) {
            metiz('.mswishlist.mswlbtn').html('<div id="mswishitem"  data-status="notinwishlist" ><div class="btn"></div></div>');
        } else if (!metiz(".mswishlist").hasClass("mswlbtn")) {
            metiz('.mswishlist').html('<div id="mswishitem"  data-status="notinwishlist" ><i id="mswish_icon" class="' + wishlist_icon + '"></i><span id="mswishcount" class="mswishcount"></span></div>');
        }
        if(setting.page_custom_css != ''){
            metiz('head').append('<style>'+setting.page_custom_css+'</style>'); 
    }

        //change varation
        var oldLocation = location.href;
        setInterval(function () {
            if (location.href != oldLocation) {

                updateWishlist();
                oldLocation = location.href;
            }
        }, 100);
        //get variant id
        function get_variant_id($this)
        {

            var variant_id = '';
            urlvid = getParameterByName("variant");
            tagvid = $this.data("variant");
            selvid = metiz('select[name="id"]').val();
            if (window.location.href.indexOf("/collections/") != -1) {

                variant_id = tagvid;
                
            } else if (window.location.href.indexOf("/products/") != -1) { 

                if ((urlvid != undefined) && (urlvid != ""))
                {
                    variant_id = parseInt(urlvid);
                    
                } else if (selvid != null) {
                    variant_id = parseInt(selvid);
                
                } else if (tagvid != undefined) {
                    variant_id = tagvid;
                    
                } else {
                    variant_id = 0;
                }

            }else{
            
            if (tagvid != undefined) {
                    variant_id = tagvid;
                    // console.log('2');
                } else {
                    variant_id = 0;
                }
            }
            
            return variant_id;
        }
        
        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + "; SameSite=none; Secure; path=/";
        }
        
        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        //Cookies
        //var msCookies = Cookies.noConflict();
        
        var wishlist_token = getCookie('wishlist_token');
        // console.log(wishlist_token);
        // console.log(Shopify);
        if (wishlist_token == undefined || wishlist_token == '')
        {
            wishlist_token = (Math.random().toString(36) + '00000000000000000').slice(2, 22);
            setCookie('wishlist_token', wishlist_token, {expires: 365});
            setCookie('mswishlist', JSON.stringify({"items": []}), {expires: 365});
        }
        
        var mswishlist = getCookie('mswishlist');
        var mswishlist_json = JSON.parse(mswishlist);
        var ms_customer_id = metiz('#ms_customer_id').val();
        function mswishlist_count() {
            if (mswishlist_json.items.length > 0) {
                metiz('.mswishcount').html(mswishlist_json.items.length);
            } else {
                metiz('.mswishcount').html('');
            }
        }
        wishlist_get();
        mswishlist_count();
        updateWishlist();
        //add or remove wishlist
        metiz('.mswishlist').click(function () {
            
            var product_id = metiz(this).attr('data-product'); //product id
            var variant_id = get_variant_id(metiz(this));
            //alert(product_id+' v:'+variant_id)
            if (variant_id != 0) { 
                var product_variant = [product_id, variant_id, 1];
                if (metiz(this).find("#mswishitem").attr("data-status") == "notinwishlist") //add
                {
                    metiz(this).find("#mswishitem").removeClass('notinwishlist');
                    metiz(this).find("#mswishitem").addClass('inwishlist');
                    metiz(this).find("#mswishitem").attr("data-status", 'inwishlist');
                    //having btn
                    if (metiz(".mswishlist").hasClass("mswlbtn")) {

                        metiz(this).find(".btn").removeClass('ms-wishlist-add-btn');
                        metiz(this).find(".btn").addClass('ms-wishlist-remove-btn');
                        metiz(this).find(".btn").html(remove_from_wishlist);
                    }

                    mswishlist_json.items.push(product_variant);
                    setCookie('mswishlist', JSON.stringify(mswishlist_json), {expires: 365});
                    mswishlist_count();
                    wishlist_save();
                } else {  //remove
                    metiz(this).find("#mswishitem").removeClass('inwishlist');
                    metiz(this).find("#mswishitem").addClass('notinwishlist');
                    metiz(this).find("#mswishitem").attr("data-status", 'notinwishlist');
                    //having btn
                    if (metiz(".mswishlist").hasClass("mswlbtn")) {

                        metiz(this).find(".btn").removeClass('msws-remove-btn');
                        metiz(this).find(".btn").addClass('msws-add-btn');
                        metiz(this).find(".btn").html(add_to_wishlist);
                    }


                    mswishlist_json.items.splice(variantExists(mswishlist_json.items, product_variant), 1);
                    setCookie('mswishlist', JSON.stringify(mswishlist_json), {expires: 365});
                    mswishlist_count();
                    wishlist_save();
                }
            }

        });
        //when change variant
        function updateWishlist() {
            metiz(".mswishlist").each(function (i) {
                var product_id = metiz(this).attr('data-product'); //product id
                var variant_id = get_variant_id(metiz(this));
                var product_variant = [product_id, variant_id, 0];
                // console.log(getCookie('mswishlist'));
                if (variantExists(mswishlist_json.items, product_variant) > -1) //add
                {

                    metiz(this).find("#mswishitem").removeClass('notinwishlist');
                    metiz(this).find("#mswishitem").addClass('inwishlist');
                    metiz(this).find("#mswishitem").attr("data-status", 'inwishlist');
                    //having btn
                    if (metiz(".mswishlist").hasClass("mswlbtn")) {

                        metiz(this).find(".btn").removeClass('ms-wishlist-add-btn');
                        metiz(this).find(".btn").addClass('ms-wishlist-remove-btn');
                        metiz(this).find(".btn").html(remove_from_wishlist);
                    }



                } else  //remove
                {
                    metiz(this).find("#mswishitem").removeClass('inwishlist');
                    metiz(this).find("#mswishitem").addClass('notinwishlist');
                    metiz(this).find("#mswishitem").attr("data-status", 'notinwishlist');
                    //having btn
                    if (metiz(".mswishlist").hasClass("mswlbtn")) {

                        metiz(this).find(".btn").removeClass('msws-remove-btn');
                        metiz(this).find(".btn").addClass('msws-add-btn');
                        metiz(this).find(".btn").html(add_to_wishlist);
                    }




                }
            });
        }
        wishlist_save = function ()
        {

            if (ms_customer_id != 0 && ms_customer_id != undefined) {

                var mswishlist = getCookie('mswishlist');
                var wishlist_token  = getCookie('wishlist_token');

                metiz.ajax({
                    type: 'POST',
                    url: app_url + "viewlist/save_wishlist",
                    datatype: "jsonp",
                    data: {shop_url: shop_url, mswishlist: mswishlist, ms_customer_id: ms_customer_id, wishlist_token: wishlist_token},
                    success: function () {

                    }


                });
            }
        }


        function wishlist_get()
        {
            if (ms_customer_id != 0 && ms_customer_id != undefined) {


                metiz.ajax({
                    type: 'POST',
                    url: app_url + "viewlist/wishlist_get",
                    datatype: "jsonp",
                    data: {shop_url: shop_url, mswishlist: mswishlist, ms_customer_id: ms_customer_id},
                    success: function (data) {
                        if (data != '') {
                            var jsondata = JSON.parse(data);
                            if (jsondata.items) {


                                setCookie('mswishlist', JSON.stringify(jsondata), {expires: 365});
                                // console.log(getCookie('mswishlist'));
                                wishlist_save();
                            }
                        }
                    }

                });
            }
        }
    }
});