!function(e) {
    e(document).on("ready", function() {
        document.getElementById("news-name").required,
        document.getElementById("news-email").required,
        e(".caixa-cupom").length && e(".caixa-cupom").parents("tr").addClass("cupom-wrapper"),
        e("#calculoFrete").length && e("#calculoFrete").parents("tr").addClass("frete-wrapper"),
        "1.6.2" != e.fn.jquery && e(".banner-home-slide").slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="165.116 0 369.767 700" width="50" height="50" class="slick-arrow arrow-prev"><path d="M170.965,363.918l330.214,330.214c3.814,3.961,8.948,5.868,13.937,5.868c4.987,0,10.122-2.054,13.936-5.868c7.775-7.774,7.775-20.244,0-28.019L212.92,349.981L529.051,33.85c7.775-7.775,7.775-20.244,0-28.019\tc-7.774-7.775-20.244-7.775-28.019,0L170.819,336.045C163.19,343.674,163.19,356.289,170.965,363.918z"/></svg>',
            nextArrow: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="165.116 0 369.767 700" width="50" height="50" class="slick-arrow arrow-next"><path d="M529.18,336.045L198.966,5.831c-7.774-7.775-20.244-7.775-28.019,0c-7.775,7.775-7.775,20.244,0,28.019l316.131,316.131L170.948,666.113c-7.775,7.774-7.775,20.244,0,28.019c3.813,3.814,8.948,5.868,13.936,5.868c4.988,0,10.122-1.907,13.937-5.868l330.214-330.214C536.809,356.289,536.809,343.674,529.18,336.045z"/></svg>',
            responsive: [{
                breakpoint: 768,
                settings: {
                    arrows: !1
                }
            }]
        })
    }),
    e(".page-lista, .page-print_lista").length && e(".lista-produtos").wrapAll("<div class='wrap-gifts'></div>"),
    e("img.lazy").lazyload({
        threshold: 200
    })
}(jQuery),
function() {
    var e = document.getElementsByClassName("trigger-menu")[0]
      , t = document.getElementsByClassName("close-menu")[0]
      , s = document.getElementsByTagName("html")[0]
      , a = document.getElementsByClassName("menu-mobile-backdrop")[0];
    e.addEventListener("click", function() {
        s.classList.add("menu-open")
    }),
    s.addEventListener("click", function(e) {
        e.target == a && (this.className = this.className.replace(new RegExp("(^|\\b)" + "menu-open".split(" ").join("|") + "(\\b|$)","gi"), " ")),
        e.target == t && (this.className = this.className.replace(new RegExp("(^|\\b)" + "menu-open".split(" ").join("|") + "(\\b|$)","gi"), " "))
    })
}();

function addCart(dataProductId){
    var dataSession = jQuery("html").attr("data-session");
    jQuery.ajax({
        method: "POST",
        url: "/web_api/cart/",
        contentType: "application/json; charset=utf-8",
        data: '{"Cart":{"session_id":"'+dataSession+'","product_id":"'+dataProductId+'","quantity":"1"}}'
    }).done(function( response, textStatus, jqXHR ) {
        window.location.href = response.cart_url;
    }).fail(function( jqXHR, status, errorThrown ){
        var response = jQuery.parseJSON( jqXHR.responseText );
        //console.log(response);
    });
}