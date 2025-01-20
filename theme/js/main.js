(($) => {
    $.fn.changeElementType = function (newType) {
        var attrs = {};

        $.each(this[0].attributes, function (idx, attr) {
            attrs[attr.nodeName] = attr.nodeValue;
        });

        this.replaceWith(function () {
            return $('<' + newType + '/>', attrs).append($(this).contents());
        });
    };

    window.theme = {
        ...window.theme,

        settings: {
            lastScrollPosition: 0,
            storeId: 0,
            productThumbs: null,
            productGallery: null,
        },

        /* Beginning General Functions */
        openApplyOverlayClose: function () {
            const buttonClose = $('[data-toggle="close"]');
            const divOverlay = $('[data-overlay="shadow"]');
            const buttonToOpen = $('[data-toggle="closed"]');

            buttonToOpen.on('click', function () {
                let target = $($(this).data('target'));
                target.addClass('u-show').attr('data-toggle', 'open');

                divOverlay.addClass('u-show');
                $('body').addClass('overflowed');
            });

            divOverlay.on('click', function () {
                $('.video iframe').attr('src', '');
                const modal = $('[data-toggle="open"]');

                modal.removeClass('u-show').removeAttr('data-toggle');
                divOverlay.removeClass('u-show');
                $('body').removeClass('overflowed');
            });

            buttonClose.on('click', function () {
                divOverlay.trigger('click');
            });
        },

        scrollHidesMenu: function () {
            const header = $('[data-header="scroll"]');
            let headerHeight = $('[data-header="scroll"]').outerHeight() + 20;
            let position = $(window).scrollTop() - 20;

            if (position > this.settings.lastScrollPosition && position > headerHeight) {
                header.addClass('u-effectHeader');
                header.addClass('u-shadow');
            } else if (position > headerHeight && position < this.settings.lastScrollPosition) {
                header.removeClass('u-effectHeader');
                header.addClass('u-shadow');
            } else if (position < headerHeight) {
                header.removeClass('u-shadow');
            }

            this.settings.lastScrollPosition = position;
        },

        getScroll: function () {
            let internal = this;

            $(window).on('scroll', function () {
                internal.scrollHidesMenu();
            });
        },

        mainMenuMobile: function () {
            $('[data-toggle="account"]').on('click', function (event) {
                let item = $(this).parent();

                item.toggleClass('u-show');
                event.preventDefault();
            });
        },

        libMaskInit: function () {
            let phoneMaskBehavior = function (val) {
                return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
            };

            let phoneMaskOptions = {
                onKeyPress: function (val, e, field, options) {
                    field.mask(phoneMaskBehavior.apply({}, arguments), options);
                },
            };

            $('.mask-phone').mask(phoneMaskBehavior, phoneMaskOptions);
            $('.mask-cep').mask('00000-000');
        },
        /* --- End General Functions --- */

        bannerSlides: function () {
            const targetElement = '[data-slides="banner"]';
            if ($(targetElement).length) {
                const slideshow = $(targetElement);
                let size = $('.swiper-slide', slideshow).length;
                let settings = slideshow.data('settings');

                if (size > 0) {
                    new Swiper(`${targetElement} .swiper`, {
                        preloadImages: false,
                        loop: true,
                        autoHeight: true,
                        effect: 'slide',
                        autoplay: {
                            delay: settings.timer,
                            disableOnInteraction: false,
                        },
                        lazy: {
                            loadPrevNext: true,
                        },
                        pagination: {
                            el: `${targetElement} .swiper-pagination`,
                            bulletClass: 'icon-circle',
                            bulletActiveClass: 'icon-circle-empty',
                            clickable: !settings.isMobile,
                        },

                        navigation: {
                            prevEl: '.swiper-button-prev.banner-slide-arrow',
                            nextEl: '.swiper-button-next.banner-slide-arrow',
                        },
                    });

                    if (settings.stopOnHover) {
                        $(`${targetElement} .swiper`).on('mouseenter', function () {
                            this.swiper.autoplay.stop();
                        });

                        $(`${targetElement} .swiper`).on('mouseleave', function () {
                            this.swiper.autoplay.start();
                        });
                    }
                }
            }
        },

        productsSlides: function () {
            if($(".slidesProducts") && ($(".slidesProducts .swiper-slide").length > 3)) {
                const sectionsSlides = document.querySelectorAll(".slidesProducts");

                $(sectionsSlides).each((index, el) => {
                    $(el).before(`
                        <div class="swiper-button-prev ${theme.numberCarousels(index)}"></div>
                        <div class="swiper-button-next ${theme.numberCarousels(index)}"></div>
                    `);

                    new Swiper(el, {
                        slidesPerView: 4,
                        loop: true,
                        breakpoints: {
                            0: {
                                slidesPerView: 2,
                            },
                            680: {
                                slidesPerView: 3,
                            },
                            900: {
                                slidesPerView: 4,
                            },
                        },
    
                        navigation: {
                            prevEl: `.swiper-button-prev.${theme.numberCarousels(index)}`,
                            nextEl: `.swiper-button-next.${theme.numberCarousels(index)}`,
                        },
                    });
                });
            } else {
                $(".showcase-listProduct").removeClass("swiper-wrapper");
            }

            
        },

        numberCarousels: function (n) {
            const numbers = [
                "zero", "um", "dois", "tres", "quatro", "cinco", "seis", "sete", "oito", "nove",
                "dez", "onze", "doze", "treze", "catorze", "quinze", "dezesseis", "dezessete", 
                "dezoito", "dezenove", "vinte", "vinte e um", "vinte e dois", "vinte e tres", 
                "vinte e quatro", "vinte e cinco", "vinte e seis", "vinte e sete", "vinte e oito", 
                "vinte e nove", "trinta"
            ];
        
            return numbers[n] || "error"; // Retorna o número por índice ou "error" para valores inválidos
        },        

        slidesCategoryImages: function() {
            if($("#categories")) {
                
                $("#categories").before(`
                    <div class="swiper-button-prev cat"></div>
                    <div class="swiper-button-next cat"></div>
                `);

                new Swiper("#categories", {
                    slidesPerView: 6,
                    loop: true,
                    breakpoints: {
                        0: {
                            slidesPerView: 3,
                            spaceBetween: 15
                        },
                        680: {
                            slidesPerView: 4,
                        },
                        900: {
                            slidesPerView: 6,
                            spaceBetween: 30
                        },
                    },

                    navigation: {
                        prevEl: `.swiper-button-prev.cat`,
                        nextEl: `.swiper-button-next.cat`,
                    },
                });
            }
        },

        productGridShowMore: function() {
            const products = document.querySelectorAll('#show-more-function .listProduct-item');
            const showMoreBtn = document.getElementById('showMore');

            if((products != null) && (showMoreBtn != null)) {
                
                let visibleProducts = (window.screen.width  > 768) ? 4 : 2 ;

                for (let i = visibleProducts; i < products.length; i++) {
                    products[i].style.display = 'none';
                }

                showMoreBtn.addEventListener('click', function() {
                visibleProducts += (window.screen.width  > 768) ? 4 : 2 ;

                if (visibleProducts >= products.length) {
                    showMoreBtn.innerHTML = 'Ver mais';
                    showMoreBtn.addEventListener('click', function() {
                    window.location.href = $("#showMore").attr("data-href");
                    });
                }

                for (let i = 0; i < visibleProducts; i++) {
                    products[i].style.display = 'block';
                }           
                });
            }
        },

        clickOneVariation: function() {
            let divMonitorada = $('.pageProduct-variants');
            let hasClicked = false; // Flag para verificar se o clique já foi feito
        
            let observer = new MutationObserver(function(mutations) {
                if (hasClicked) return; // Verifica se o clique já ocorreu
        
                const variacoes = $(".passo2 .lista_cor_variacao img");
        
                // Se houver exatamente uma variação, clica nela e desativa o observer
                if (variacoes.length === 1) {
                    variacoes.click();
                    hasClicked = true; // Define a flag para impedir novos cliques
                    observer.disconnect(); // Desativa o MutationObserver
                    theme.clickOneVariation();
                }
            });
        
            let options = {
                childList: true,
                subtree: true
            };
        
            // Inicia a observação da div
            if (divMonitorada.length) {
                observer.observe(divMonitorada[0], options);
            }
        },

        observePrice: function() {
            
            // Seleciona a div que ser&aacute; monitorada
            let divMonitorada = $('.pageProduct-price.serverTray-content#observer');

            if(!$('.pageProduct-price.serverTray-content #produto_preco [data-app="product.price"]').length || $("#nao_disp").length) {
                $("#form_comprar div#observer").show();
                $(".pageProduct-name + .pageProduct-price.serverTray-content").hide();
            }

            // Cria uma nova inst&acirc;ncia do MutationObserver
            let observer = new MutationObserver(function(mutations) {
                if(!$('.pageProduct-price.serverTray-content #produto_preco [data-app="product.price"]').length || $("#nao_disp").length) {
                    $("#form_comprar div#observer").show();
                    $(".pageProduct-name + .pageProduct-price.serverTray-content").hide();
                    return;
                }

                $("#form_comprar div#observer").hide();
                $(".pageProduct-name + .pageProduct-price.serverTray-content").show();

                $(".pageProduct-name + .pageProduct-price.serverTray-content .PrecoPrincipal").text("");
                
                if($('.pageProduct-price.serverTray-content #produto_preco #precoDe').length) {
                    $(".pageProduct-name + .pageProduct-price.serverTray-content #produto_preco s").text(`
                        ${$('.pageProduct-price.serverTray-content #produto_preco #precoDe').text().replace('De',  '').trim()}
                    `);
                }

                $(".pageProduct-name + .pageProduct-price.serverTray-content .PrecoPrincipal").text(`
                    R$ ${$('.pageProduct-price.serverTray-content #produto_preco [data-app="product.price"]').text()}
                `);
                
                $(".pageProduct-name + .pageProduct-price.serverTray-content .PrecoPrincipal + .parcelamento").html($('.pageProduct-price.serverTray-content #produto_preco #info_preco').html());
            });

            // Configura as op&ccedil;&otilde;es do MutationObserver
            let options = {
                childList: true, // Observar altera&ccedil;&otilde;es na lista de elementos filhos
                subtree: true // Observar altera&ccedil;&otilde;es em todos os elementos descendentes
            };

            // Inicia a observa&ccedil;&atilde;o da div
            observer.observe(divMonitorada[0], options);
        },

        videoPopup: function() {
            if (!$("div#popup-video iframe").length) {
                return;
            }

            const src = $("div#popup-video iframe").data("src");
            const frameSizes = $("div#popup-video [data-frame-sizes]").data("frame-sizes");
            const proporcoes = (() => {                
                if (frameSizes === "16x9") {
                    return 16 / 9;
                } else if (frameSizes === "9x16") {
                    return 9 / 16;
                } else {
                    return 0.6;
                }
            })();
            
            const altura = (window.screen.width < 900 && frameSizes === "16x9") ? window.screen.height * 0.225 : window.screen.height * 0.7;
            const largura = altura * proporcoes;

            $("div#popup-video iframe").css({
                height: altura,
                width: largura
            });

            $(".video-button").on("click", function() {
                $("div#popup-video iframe").attr("src", src);
                $("div#popup-video").css("display", "flex");
            });

            $("div#popup-video").on("click", function(event) {
                if (!$(event.target).closest("div#content-popup").length) {
                    $("div#popup-video").hide();
                    $("div#popup-video iframe").removeAttr("src");
                }
            });

            $("div#popup-video #btn-close").on("click", function() {
                $("div#popup-video").hide();
                $("div#popup-video iframe").removeAttr("src");
            });
        },

        vipListPopup: function() {
            const sessao = $('[data-session]').data("session");

            function addLocalStorage() {
                localStorage.setItem("visualized", "true");
            }

            function addLocalStorageSession() {
                localStorage.setItem("session", sessao);
            }

            if(!localStorage.visualized || !localStorage.session || localStorage.session !== sessao) {
                $("div#lista-vip").css("display", "flex");
            }

            $("#lista-vip").on("click", function(event) {
                if (!$(event.target).closest("div#content-popup").length) {
                  $("div#lista-vip").hide();
                  addLocalStorageSession();
                  addLocalStorage();
                }
            });

            $("#btn-close").on("click", function() {
                $("div#lista-vip").hide();
                addLocalStorage();
                addLocalStorageSession();
            });

            $("#vip-list").on("submit", function() {
                addLocalStorage();
                addLocalStorageSession();                
            }); 
        },

        eventsFormListPopup: function() {
            function copiaCupom() {
                $("#cupom").on("click", function() {
                    // Texto a ser copiado
                    const texto = "PRIMEIRA15";
    
                    // Cria um elemento de input temporÃÂ¡rio para armazenar o texto
                    const inputTemp = $('<input>');
                    $('body').append(inputTemp);
                    inputTemp.val(texto).trigger("select");
    
                    // Copia o texto selecionado para a ÃÂ¡rea de transferÃÂªncia
                    document.execCommand('copy');
    
                    // Remove o input temporÃÂ¡rio
                    inputTemp.remove();
    
                    // Atualiza a mensagem de status
                    const status = $('#cupom');
                    status.text('COPIADO!').addClass('copiado');
    
                    // Remove a mensagem de status apÃÂ³s 2 segundos
                    setTimeout(function() {
                        status.html(`
                            <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m6 18h-3c-.48 0-1-.379-1-1v-14c0-.481.38-1 1-1h14c.621 0 1 .522 1 1v3h3c.621 0 1 .522 1 1v14c0 .621-.522 1-1 1h-14c-.48 0-1-.379-1-1zm1.5-10.5v13h13v-13zm9-1.5v-2.5h-13v13h2.5v-9.5c0-.481.38-1 1-1z" fill-rule="nonzero"/></svg>
                            PRIMEIRA15
                        `).removeClass('copiado');
                    }, 2000);
                });
            }

            function redireciona() {
                const sessao = $('[data-session]').data("session");
                localStorage.setItem("session", sessao);
                localStorage.setItem("visualized", "true");
                $("#real-form .revendedor-button.button2").trigger("click");
            }

            function contagemRegressiva(time) {
                if (time == 0) {
                    redireciona();
                    return;
                }
            
                const text = `Em <b>${time} segundos</b> voc&ecirc; ser&aacute; redirecionado para <br>confirmar o seu cadastro`;
                $('#redirecionamento').html(text);
            
                setTimeout(function() {
                    contagemRegressiva(time - 1);
                }, 1000);
            }

            //preenchendo nome:
            $('form#vip-list [name="name"]').on("input", function() {
                const nome = $(this).val();
                $('#real-form [name="name"]').val(nome);
            });

            //preenchendo e-mail:
            $('form#vip-list [name="email"]').on("input", function() {
                const email = $(this).val();
                $('#real-form [name="email"]').val(email);
            });

            //pegando o evento de submissÃÂ£o e comunicando:
            $("#vip-list").on("submit", function(e) {
                e.preventDefault();
                $('form#vip-list [name="name"]').css("pointer-events", "none");
                $('form#vip-list [name="email"]').css("pointer-events", "none");

                const html =  `
                    <div id="notifica-cupom">
                        <div id="cupom" title="Clique para copiar o cupom!">
                            <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m6 18h-3c-.48 0-1-.379-1-1v-14c0-.481.38-1 1-1h14c.621 0 1 .522 1 1v3h3c.621 0 1 .522 1 1v14c0 .621-.522 1-1 1h-14c-.48 0-1-.379-1-1zm1.5-10.5v13h13v-13zm9-1.5v-2.5h-13v13h2.5v-9.5c0-.481.38-1 1-1z" fill-rule="nonzero"/></svg>
                            PRIMEIRA15
                        </div>
                        <p class="text">Clique para copiar o cupom</p>
                        <div id="redirecionamento"></div>
                    </div>
                `;

                if(!$("notifica-cupom").length) {
                    $("#vip-list .revendedor-button.button2").after(html);
                    contagemRegressiva(10);
                    copiaCupom();
                }                
            });
        },

        cookiesInteracion: function () {
            const consent = "I accept";

            if(!localStorage.consentCookiesMessage) {
                $("#popup-de-cookies").removeClass("hide");
            }

            $("#close-popup-cookies").on("click", function() {
                $("#popup-de-cookies").addClass("hide");
                localStorage.setItem("consentCookiesMessage", consent);
            });
        },

        brandsSlides: function () {
            const targetElement = '[data-slides="brands"]';
            if (!$(targetElement).length) {
                $(`${targetElement} .brands-content`).remove();
            } else {
                new Swiper(`${targetElement} .swiper`, {
                    slidesPerView: 5,
                    lazy: {
                        loadPrevNext: true,
                    },
                    loop: false,
                    breakpoints: {
                        0: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        680: {
                            slidesPerView: 3,
                            spaceBetween: 10,
                        },
                        900: {
                            slidesPerView: 4,
                            spaceBetween: 20,
                        },
                        1000: {
                            slidesPerView: 5,
                            spaceBetween: 20,
                        },
                    },
                    pagination: {
                        el: `${targetElement} .swiper-pagination`,
                        bulletClass: 'icon-circle',
                        bulletActiveClass: 'icon-circle-empty',
                        clickable: true,
                    },
                    on: {
                        init: function () {
                            $(targetElement).addClass('show');
                        },
                    },
                });
            }
        },

        colorDiferentials: function() {
            const imgs = document.querySelectorAll(".differential .image img");
            imgs.forEach(function(img, index) {
            const title = document.querySelectorAll(".differential .text-differential strong")[index];
            const imgSrc = img.src;
            const imgObj = new Image();
            imgObj.crossOrigin = 'Anonymous';
            imgObj.src = imgSrc;
                imgObj.addEventListener('load', function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = this.width;
                    canvas.height = this.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(this, 0, 0);

                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                    const pixelCount = imageData.length / 4;
                    const colorMap = {};

                    for (let i = 0; i < pixelCount; i++) {
                        const r = imageData[i * 4];
                        const g = imageData[i * 4 + 1];
                        const b = imageData[i * 4 + 2];
                        const a = imageData[i * 4 + 3];
                        if (a === 0 || (r === 255 && g === 255 && b === 255)) { // ignora pixels transparentes e brancos
                            continue;
                        }
                        const rgba = r + ',' + g + ',' + b + ',' + a;
                        if (colorMap[rgba]) {
                            colorMap[rgba]++;
                        } else {
                            colorMap[rgba] = 1;
                        }
                    }                 

                    let maxCount = 0;
                    let predominantColor = '';
                    for (let rgba in colorMap) {
                        if (colorMap[rgba] > maxCount) {
                            maxCount = colorMap[rgba];
                            predominantColor = rgba;
                        }
                    }

                    const hex = theme.rgbaToHex(predominantColor);
                    $(title).css('color', hex);
                });
            });
        },

        rgbaToHex: function(rgba) {
            const values = rgba.split(',');
            const r = parseInt(values[0]);
            const g = parseInt(values[1]);
            const b = parseInt(values[2]);
            const a = parseInt(values[3]);
            const alpha = Math.round((a / 255) * 100) / 100;
            return '#' + theme.componentToHex(r) + theme.componentToHex(g) + theme.componentToHex(b) + theme.componentToHex(alpha * 255);
        },

        componentToHex: function(c) {
            const hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        },

        customerReviewsSlidesOnHome: function () {
            const targetElement = '[data-slides="reviews"]';

            if (!$(targetElement).length) {
                $(`${targetElement} .dep_lista`).remove();
            } else {
                $('.dep_lista').changeElementType('div');
                $('.dep_item').changeElementType('div');

                $('.dep_item').addClass('swiper-slide');
                $(`${targetElement} .dep_lista`).addClass('swiper-wrapper').wrap('<div class="swiper"></div>');
                $(`${targetElement} .swiper`).append(`           
                    <div class="swiper-pagination"></div>
                `);

                const swiper = new Swiper(`${targetElement} .swiper`, {
                    slidesPerView: 3,
                    loop: false,
                    breakpoints: {
                        0: {
                            slidesPerView: 1,
                        },
                        600: {
                            slidesPerView: 2,
                        },
                        1000: {
                            slidesPerView: 3,
                        },
                    },
                    pagination: {
                        el: `${targetElement} .swiper-pagination`,
                        bulletClass: 'icon-circle',
                        bulletActiveClass: 'icon-circle-empty',
                        clickable: false,
                    },
                    on: {
                        init: function () {
                            $(targetElement).addClass('show');
                        },
                    },
                });

                $(`${targetElement} .dep_dados`).wrap('<div class="review"></div>');
                $(`${targetElement} .dep_lista li:hidden`).remove();
            }
        },

        footerInteraction: function() {
            if(window.screen.width < 960) {
                $(".footer-stg-theme .footer-stg-theme-info .info-list").slideUp("fast");
                $(".footer-stg-theme .footer-stg-theme-info .info-title").css({
                    backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMTYuODQzIDEwLjIxMWMuMTA4LS4xNDEuMTU3LS4zLjE1Ny0uNDU2IDAtLjM4OS0uMzA2LS43NTUtLjc0OS0uNzU1aC04LjUwMWMtLjQ0NSAwLS43NS4zNjctLjc1Ljc1NSAwIC4xNTcuMDUuMzE2LjE1OS40NTcgMS4yMDMgMS41NTQgMy4yNTIgNC4xOTkgNC4yNTggNS40OTguMTQyLjE4NC4zNi4yOS41OTIuMjkuMjMgMCAuNDQ5LS4xMDcuNTkxLS4yOTEgMS4wMDItMS4yOTkgMy4wNDQtMy45NDUgNC4yNDMtNS40OTh6Ii8+PC9zdmc+)",
                    backgroundRepeat: "no-repeat",
                    backgroundPositionY: "center",
                    backgroundPositionX: "96%",
                    cursor: "pointer"
                });

                $(".footer-stg-theme .footer-stg-theme-info .info-title").on("click", function() {
                const infoList = $(this).next(".info-list");
                if (infoList.css("display") == "none") {
                    $(this).css({
                        backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMTYuODQzIDEzLjc4OWMuMTA4LjE0MS4xNTcuMy4xNTcuNDU2IDAgLjM4OS0uMzA2Ljc1NS0uNzQ5Ljc1NWgtOC41MDFjLS40NDUgMC0uNzUtLjM2Ny0uNzUtLjc1NSAwLS4xNTcuMDUtLjMxNi4xNTktLjQ1NyAxLjIwMy0xLjU1NCAzLjI1Mi00LjE5OSA0LjI1OC01LjQ5OC4xNDItLjE4NC4zNi0uMjkuNTkyLS4yOS4yMyAwIC40NDkuMTA3LjU5MS4yOTEgMS4wMDIgMS4yOTkgMy4wNDQgMy45NDUgNC4yNDMgNS40OTh6Ii8+PC9zdmc+)",
                        backgroundRepeat: "no-repeat",
                        backgroundPositionY: "center",
                        backgroundPositionX: "96%",
                        cursor: "pointer"
                    });

                    infoList.slideDown("fast");
                } else {
                    $(this).css({
                        backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMTYuODQzIDEwLjIxMWMuMTA4LS4xNDEuMTU3LS4zLjE1Ny0uNDU2IDAtLjM4OS0uMzA2LS43NTUtLjc0OS0uNzU1aC04LjUwMWMtLjQ0NSAwLS43NS4zNjctLjc1Ljc1NSAwIC4xNTcuMDUuMzE2LjE1OS40NTcgMS4yMDMgMS41NTQgMy4yNTIgNC4xOTkgNC4yNTggNS40OTguMTQyLjE4NC4zNi4yOS41OTIuMjkuMjMgMCAuNDQ5LS4xMDcuNTkxLS4yOTEgMS4wMDItMS4yOTkgMy4wNDQtMy45NDUgNC4yNDMtNS40OTh6Ii8+PC9zdmc+)",
                        backgroundRepeat: "no-repeat",
                        backgroundPositionY: "center",
                        backgroundPositionX: "96%",
                        cursor: "pointer"
                    });

                    infoList.slideUp("fast");
                }
                });
            }
        },

        loadNewsPageOnHome: function () {
            if ($('.news').length) {
                let dataFiles = $('html').data('files');

                $.ajax({
                    url: `/loja/busca_noticias.php?loja=${this.settings.storeId}&${dataFiles}`,
                    method: 'get',
                    success: function (response) {
                        let target;
                        let pageNews;

                        if (!$(response).find('.noticias').length) {
                            $('.section.news').remove();
                            return;
                        }

                        target = $('.section.news .news-content');
                        pageNews = $($(response).find('.noticias'));

                        pageNews.find('li:nth-child(n+4)').remove();
                        pageNews.find('li').wrapInner('<div class="news-item"></div>');
                        pageNews = pageNews.contents();

                        // pageNews.each(function (index, pageNews) {
                        //     const removeImage = $(pageNews).find('img').closest('div').remove();
                        // });

                        target.append(pageNews);
                    },
                });
            }
        },

        resizeImageMobile: function () {
            if(window.screen.width > 900) {
                return;
            }

            const currentSize = Number($(".pageProduct-gallery  .gallery-image").css("height").replace(/\d/g, ""));
            $(".pageProduct-gallery").css("height", `${currentSize + 20}px`);
        },

        /* Beginning Product Page */
        gallerySlidesOnProductPage: function () {
            const targetGallery = '[data-slides="gallery"]';
            const targetThumbs = '[data-slides="gallery-thumbs"]';
            let zoomActive = $('.pageProduct-gallery').hasClass('zoom-true');

            theme.settings.productThumbs = new Swiper(targetThumbs, {
                direction: "vertical",
                spaceBetween: 10,
                lazy: {
                    loadPrevNext: true,
                },
                breakpoints: {
                    0: {
                        slidesPerView: 3,
                    },
                    350: {
                        slidesPerView: 4,
                    },
                    768: {
                        slidesPerView: 5,
                    },
                    1280: {
                        slidesPerView: 5,
                    },
                },
            });

            theme.settings.productGallery = new Swiper(targetGallery, {
                spaceBetween: 10,
                lazy: {
                    loadPrevNext: true,
                },
                navigation: {
                    prevEl: '.slides-buttonPrev--gallery',
                    nextEl: '.slides-buttonNext--gallery',
                },
                thumbs: {
                    swiper: this.settings.productThumbs,
                },
                on: {
                    init: function () {
                        if(!zoomActive) return;

                        if(this.slides.length === 1){
                            this.unsetGrabCursor();
                            this.allowTouchMove = false;
                        }

                        let wrapper = $('.pageProduct-gallery.zoom-true').find(`[data-index="1"] .zoom`);

                        if(!wrapper.find('img:first').next().length){
                            wrapper.zoom({
                                touch : false,
                                url   : wrapper.find('img').attr('src')
                            });
                        }

                    },
                    slideChange: function () {
                        if(!zoomActive) return;
                        let index = this.activeIndex + 1;
                        let wrapper = $('.pageProduct-gallery.zoom-true').find(`[data-index="${index}"] .zoom`);

                        if(!wrapper.find('img:first').next().length){
                            wrapper.zoom({
                                touch : false,
                                url   : wrapper.find('img').attr('src')
                            });
                        }

                    }
                },
            });

            theme.resizeImageMobile();
        },

        openProductVideoModal: function () {
            const video = $('[data-button="video"]');
            const modal = $('[data-modal="video"]');

            video.on('click', function () {
                modal.find('iframe').addClass('lazyload').attr('src', $(this).data('url'));
            });
        },

        getQuantityChangeOnProductPage: function () {
            const buttonQtd = $('[data-quantity]');
            let inputQtd = $('[data-buy-product="box"] #quantidade input#quant');

            if (
                !$('[data-has-variations]')[0] ||
                ($('[data-buy-product="box"] div#quantidade label')[0] && !$('[data-has-variations]')[0])
            ) {
                $('[data-quantity]').addClass('u-show');
            }

            buttonQtd.on('click', function (event) {
                event.preventDefault();

                let valueQtd = parseInt(inputQtd.val());
                const operator = $(event.target).val();
                const number = parseInt(`${operator}1`);
                valueQtd += number;

                if (valueQtd < 1 || Number.isNaN(valueQtd)) {
                    inputQtd.val(1);
                } else {
                    inputQtd.val(valueQtd);
                }
            });
        },

        generateShippingToProduct: function () {
            const shippingForm = $('[data-shipping="form"]');
            const resultBox = $('[data-shipping="result"]');

            shippingForm.on('submit', function (event) {
                event.preventDefault();
                let variant = $('#form_comprar').find('input[type="hidden"][name="variacao"]');
                let url = $('#shippingSimulatorButton').data('url');
                let inputQtd = $('#quant:visible');
                let cep = $('input', this).val().split('-');

                if (inputQtd.is(':visible')) {
                    inputQtd = inputQtd.val();
                }

                if (variant.length && variant.val() === '') {
                    resultBox
                        .addClass('loaded')
                        .html(
                            `<p class="error-block">Por favor, selecione as varia&ccedil;&otilde;es antes de calcular o frete.</p>`
                        );
                    return;
                }

                variant = variant.val() || 0;

                url = url
                    .replace('cep1=%s', `cep1=${cep[0]}`)
                    .replace('cep2=%s', `cep2=${cep[1]}`)
                    .replace('acao=%s', `acao=${variant}`)
                    .replace('dade=%s', `dade=${inputQtd}`);

                resultBox.removeClass('loaded').addClass('loading');

                function insertShippingInTable(shippingResult) {
                    shippingResult.find('table:first-child, p, table tr td:first-child').remove();
                    shippingResult
                        .find('table, table th, table td')
                        .removeAttr('align class width border cellpadding cellspacing height colspan');

                    shippingResult.find('table').addClass('shipping-table');

                    var frete = shippingResult.find('table th:first-child').text();
                    if (frete == 'Forma de Envio:') {
                        shippingResult.find('table th:first-child').html('Frete');
                    }

                    var valor = shippingResult.find('table th:nth-child(2)').text();
                    if (valor == 'Valor:') {
                        shippingResult.find('table th:nth-child(2)').html('Valor');
                    }

                    var prazo = shippingResult.find('table th:last-child').text();
                    if (prazo == 'Prazo de Entrega e Observa&ccedil;&otilde;es:') {
                        shippingResult.find('table th:last-child').html('Prazo');
                    }
                    shippingResult = shippingResult.children();
                }

                const errorMessage =
                    'N&atilde;o foi poss&iacute;vel obter os pre&ccedil;os e prazos de entrega. Tente novamente mais tarte.';

                /* Validate zip code first using viacep web service */
                $.ajax({
                    url: `https://viacep.com.br/ws/${cep[0] + cep[1]}/json/`,
                    method: 'get',
                    dataType: 'json',
                    success: function (viacepResponse) {
                        if (viacepResponse.erro) {
                            const message = 'CEP inv&aacute;lido. Verifique e tente novamente.';
                            resultBox
                                .removeClass('loading')
                                .addClass('loaded')
                                .html(`<p class="error-block">${message}</p>`);

                            return;
                        }

                        $.ajax({
                            url: url,
                            method: 'get',
                            success: function (response) {
                                if (response.includes('N&atilde;o foi poss&iacute;vel estimar o valor do frete')) {
                                    resultBox
                                        .removeClass('loading')
                                        .addClass('loaded')
                                        .html(`<p class="error-block">${errorMessage}</p>`);

                                    return;
                                }

                                let shippingRates = $(response.replace(/Prazo de entrega: /gi, ''));
                                insertShippingInTable(shippingRates);

                                resultBox.removeClass('loading').addClass('loaded').html('').append(shippingRates);
                            },
                            error: function (request, status, error) {
                                console.error(`[Theme] Could not recover shipping rates. Error: ${error}`);

                                if (request.responseText !== '') {
                                    console.error(`[Theme] Error Details: ${request.responseText}`);
                                }

                                resultBox
                                    .removeClass('loading')
                                    .addClass('loaded')
                                    .html(`<p class="error-block">${errorMessage}</p>`);
                            },
                        });
                    },
                    error: function (request, status, error) {
                        console.error(`[Theme] Could not validate cep. Error: ${error}`);
                        console.error(`[Theme] Error Details: ${request.responseJSON}`);

                        resultBox
                            .removeClass('loading')
                            .addClass('loaded')
                            .html(`<p class="error-block">${errorMessage}</p>`);
                    },
                });

                return false;
            });
        },

        addImageShipping: function() {
            $(".shipping-form").prepend(`
                <svg width="60" height="54" viewBox="0 0 60 54" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <mask id="mask0_215_952" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="60" height="54">
                <rect x="0.00976562" y="0.716003" width="59.1985" height="52.4556" fill="url(#pattern0)"/>
                </mask>
                <g mask="url(#mask0_215_952)">
                <rect x="0.00976562" y="5.37872" width="59.1985" height="50.1243" fill="var(--c_general_main)"/>
                </g>
                <defs>
                <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlink:href="#image0_215_952" transform="matrix(0.00886097 0 0 0.01 0.0569514 0)"/>
                </pattern>
                <image id="image0_215_952" width="100" height="100" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAJeklEQVR4nO2de4wdVR3Hv2dBK3arPKJsgWKVdFvAKC1oEdDyUB5abasGbDRpsJTYBgr/mRifMf7jP0oiBNTGhFcoicVAi7RRgWgjxYptFYGCEB59UXD72D53ux//OLPh7rkzd+acM3Pv3TifZJPu7Tnf8/3N786cmfOYlWpqampqampqampqampqampqampqampqampqampqampqamp8MTGVgYmSPi3pM5I+Kqlf0gcl9UoakbRP0tuSXpD0rKQ/S3rCGHM4pt2aBgADXAU8ABzCnwPAg8BlQNQX4v8eYAHwj4AkZLEZ+Hyn4xp3AB8BHisxES5rgTM7Hee4ALgW2NviYG4FfgF8DZgJnAy8K/k5JflsIXA78GILnQHg2k7H29UAP8o4eEPA3cDsAM0LgXsSDZcR4HtVxDLuAW7LSMZq4KwW9eYBbyY/X2pRbhrwaEYbt1UT1Tgl48wYBBYVqLutoc4bBcpfj73zcvlhOdGMc7B9hssO4LyC9cdQsM5MYGfG2RLLUeAl4KfAKXFHp81g76bcDnwHMM1DwzshSb1pFSZllO3Ax8OOTgeg+dZ2kIJnRoNGUEKSurNIv3yVyWvAiX5HpgNgH/pccvuMFJ3ghCT1F1ecEIAf+PpqK9jhEPcJfHWgVlRCEg33TH06RCfRmgjc5ehtCdVrC9ixqUaGaHFrm6NVRkKmA8OO1CUhWoneSY7WoVCttoAdKGzk7git6IQkOvc5UveFapXpq3KAXppHbb2fwBv0ykrIRY7UHuDdnfZVOcDVjtetkXplJcQA/3Hkruy0r6rpkZ1camRdJ4y4GGNQs5dPdcJLO+mRnelrZH0njGTwF+f3j5UlDKzHPmfFMgj8Czv2d24Zxp53GvB6EHS0+lIM90XozXK0no3QagcjwK+BSaE+BbzliAaP9wCPp5j8U4TeBxytHRFa7WQL8KEQnwY4Iqnx7mWCMeZoQMB9krIOWJ8xZleA5gRJjQsiDhtjTvDVSbTa3ZHvkjTHGPOCT6UeScMlGbgm43M09qDGUOaiiJcknW8ikXSmpFsk7Xb0T5W0FjjNyxXwqnO6eV+ygOtInwEEWOOr16DrXrLcoH20XGaFamXon4xdG+CyAZ/nJ+DvjsBMTyNZyRgB1gCnekf3jvb5jua/I7TGEKqT08Zx2Kltl5/7iDziVF7oUTctGUPAIuD9QVGN1f+Go/27CK3KE5K0czzwcMqXc0FRge84lW8vWG9eRjKui4pobBt3Ovo/idAKSggwAbgJeIq455YB4MNFGrzEqfhiQaOvVZwMA7zitPG5CD3vhACnA89EJMHlafL6E+w3wJ2lu7CA2cbFDKUmI9G/2PF0AHhvhN4YCpSfAGwqKxMN5PcnwG+cSvcUqDMPe4f2MjCv4HEpDHC/4+n+SL0xFCi/vIJkgO1P5uc1PtupNITHwoayAWbQPEEVfLlKNMdQoPwGp8rfgOkB7Z6E/dI2kt+fABudSo/6Nl4WwDrHy0YiV8oHJGSfU6U/ou1PAkccvdbPJ8AVrmng+lAToQBLUnzMLUHXNyFe5Qvo3ZIS18/yKj3oVDiA54NiDMAFwEHHQ9BiixTtTifEAA85sq37E2BKShZ30ob+BOgHdjltDwBTS9LvaEISzRNp7k/+S6utGCkJGU1KqWM/TpsXpCQD4CslttHxhCS6n6C5P/ltYSMNHAQWl2Wsob0lNF+mAL5fcjtdkZBE+9sp8V5WyEgKjxFw+5fSzgya76ZGKX07Qpcl5D3AG04TfyxkJINh7Lqpi/C4HcV2bBdjH/rc54xRSj0zsuIqu3yAn5tTYu9vOpgpjX9V0gpJWaO3r0haK7sg4TlJr0ran/zfJElTJc2Q3T59VfJ7Gnsk3WCMyb6eRuDGlUwulVY+wM/7JG2T3UI+yndTjbjfDGAq8Pvc8yac1ZR0N9XiADTFlVPe3ZZxdgWe7nXaWOtlHPgi5Q64baSEh76CwWfGlVH+SafKM8A5JXta5LTRvOMszzi2H7gCWEnY/MABbP8TNTblS0BC3MmxdnAktw9pde0ETpB0qeyKwvMknSVpsux1EUmDsqsvtsq+WuMJSeuNMQcLH8mS8IkrKW8krVH24o1KiErIeCIkLuyCtwckte1tEz3tamg8YozZL2mupK9LelLS3srbdD+oz5D24vqqz5Auo05Il1EnpMuoE9Jl1AnpMuqEdBl1QrqM46sQBaZI+rKkKyVNlzS6rW2npOdlN3OuMsbkvr6pG2gRz+uy0w+rJT1cSTzuaJdn3TOAFdhXIuUOpCVlTy89iHRv3nF5xjOEfYXH5FJ9hSYEmA+8XcC4y1vkLa0sAd+4IuLZi8ebVnN9+RpP6twAHAswP8oxKlhAERpXCfEMA0tL8eVjPCm/IMP8Juy88dnYN/JMBM7BLmLenFL+GBUs2vaNq8R4hilwpuT6Kmo8KTuZ5m3Vh7BLezLv4IAe4EbgsFN3NxH72nO85sZVQTx78uIpOyG/SjHvvqqjVf05KUHcVbS+DwUTUkU8d0b5KpoQ7LfJbXxJUfMNOktTDkLpZ0leXBXGM0SLO8kiCdnvlEldQordd9fIJlqc1i0M9WDffNDIMl+dnDZ63cCBGU6ZKuNJ7eBpfnXIvrQG3a3HKzOScrnz+wpjzIhvAEmdFc7Hn/XVyQLolZS2WfRexi7tqTKeL6T4miVppfNx87tcSN/HUITgdUvYu5Vuo8x4nivY5k1pU7gTJG2Q5Pt+20nGmMHAACbJ/vGXbqLMePbLruJsxSZJs5suWcaYI7IT+5tDzHQ5r8sue+02Nkmaa4w5mtppJYNksyUtl/SU7PqqPKZEGKryb4cclR3Q/LHsWX+NpIWSHlfrs7LMeLallBmU9FdJN0uabYxJK1McYJVz/VseoXWro7UqylyYhyrjeaRo3Zj5EHc/w2LCbhOPk+SOY/0h2FU4VcZT/Y5m0h+kbgzQWeZoVPJgWMBHVfEM4fvOrFBoHmo4DMzxqH9pykGoZOikoJ8q4rmjSs+ugT7sgKAbxFLyB+OWpZh/k4j3a8VSQTwDbY8HO5GTNly9BfuQeS52qLo3+fetwD9Tyh+jxZ9IGofxDANtXTnfGMTijCCKcgz4ZkfMp1BCPMPAtzodxHya5xKKsJsKJ6ZCiYhnALi60/4lScBp2I7R3RifxhHgl7TrDiQAz3iGgDuI7DMqWZIPnCFpgeyu235Jowd9u+wfKl4n6aFxtAwoLR5kh2Je1jvLgLbHtvU/aEk0K4xefqIAAAAASUVORK5CYII="/>
                </defs>
                </svg>            
            `);
        },

        organizeProductPage: function () {
            const additionalFieldSelector = $('.varCont .dd .ddTitle');

            additionalFieldSelector.attr('tabindex', 0);
        },

        adjustOpenTabs: function (content, linksDesk, linksMobile) {
            const openContent = $('.tabs .tabs-content.active');

            if ($(window).width() < 768 && openContent.length > 0) {
                openContent.hide().removeClass('active');
                linksDesk.removeClass('active');
                linksMobile.removeClass('active');
                content.slideUp().removeClass('active');
            } else if ($(window).width() >= 768) {
                const firstLink = linksDesk.first();
                const target = firstLink.attr('href').split('#')[1];

                openContent.hide().removeClass('active');
                firstLink.addClass('active');
                linksMobile.removeClass('active');
                $(`#${target}`).show().addClass('active');
            }
        },

        goToProductReviews: function () {
            const ratingStars = $('.pageProduct .pageProduct-nameAndInformation .product-rating');
            const internal = this;

            ratingStars.on('click', function () {
                let target;
                let adjust;

                if ($(window).width() < 768) {
                    target = '.pageProduct-tabs .tabs .tabs-navMobile.tabs-linkComments';
                    adjust = 60;
                } else {
                    target = '.pageProduct-tabs .tabs-nav .nav-link.tabs-linkComments';
                    adjust = 120;
                }

                $(target).trigger('click');

                if (target && target !== '#') {
                    $('html,body').animate(
                        {
                            scrollTop: Math.round($(target).offset().top) - adjust,
                        },
                        600
                    );
                }
            });

            setTimeout(() => {
                $('#form-comments .submit-review').on('click', function (e) {
                    if (!$('#form-comments .stars .starn.icon-star').length) {
                        const textError = 'Avalia&ccedil;&atilde;o do produto obrigat&oacute;ria, d&ecirc; sua avalia&ccedil;&atilde;o por favor';
                        $('#div_erro .blocoAlerta').text(textError).show();
                        setTimeout(() => {
                            $('#div_erro .blocoAlerta').hide();
                        }, 5000);
                    }
                });
            }, 3000);
        },

        quantityProducts: function() {
            if(!$(".pageProduct-buy #product-form-box #quantidade") && $(".pageProduct-buy #button-buy")) {
                $(".pageProduct-buy #product-form-box").prepend(`
                    <div data-app="product.quantity" id="quantidade">
                        <label class="color">
                            Quantidade: 
                            <input id="quant" name="quant" class="text" size="1" type="text" value="1" maxlength="5" onkeyup="mascara(this,numeros,event);">
                        </label>
                        <span id="estoque_variacao">&nbsp;</span>
                    </div>
                `);
            }
        },

        chooseProductReview: function () {
            $('#form-comments .rateBlock .starn').on('click', function () {
                const message = $(this).data('message');
                const rating = $(this).data('id');

                $(this).parent().find('#rate').html(message);
                $(this).closest('form').find('#nota_comentario').val(rating);

                $(this).parent().find('.starn').removeClass('icon-star');

                $(this).prevAll().addClass('icon-star');

                $(this).addClass('icon-star');
            });
        },

        sendProductReview: function () {
            $('#form-comments').on('submit', function (event) {
                const form = $(this);

                $.ajax({
                    url: form.attr('action'),
                    method: 'post',
                    dataType: 'json',
                    data: form.serialize(),
                    success: function (response) {
                        form.closest('.tabs-content.comments').find('.blocoAlerta').hide();
                        form.closest('.tabs-content.comments').find('.blocoSucesso').show();

                        setTimeout(function () {
                            form.closest('.tabs-content.comments').find('.blocoSucesso').hide();
                            $('#form-comments #mensagem_coment').val('');

                            form.find('#nota_comentario').val('');
                            form.find('#rate').html('');

                            form.find('.starn').removeClass('icon-star');
                        }, 8000);
                    },
                    error: function (response) {
                        const error = JSON.stringify(response);

                        form.closest('.tabs-content.comments').find('.blocoSucesso').hide();
                        form.closest('.tabs-content.comments').find('.blocoAlerta').html(error).show();
                    },
                });

                event.preventDefault();
            });
        },

        reviewsOnProductPage: function () {
            let commentsBlock = $(`<div class="tabs-reviews">${window.commentsBlock}</div>`);
            const buttonReview =
                '<button type="submit" class="submit-review button2">Enviar Avalia&ccedil;&atilde;o</button>';
            const star = '<span class="icon-star-empty" aria-hidden="true"></span>';
            const starEmpty = '<span class="icon-star" aria-hidden="true"></span>';

            commentsBlock.find('.hreview-comentarios + .tray-hide').remove();

            $.ajax({
                url: '/mvc/store/greeting',
                method: 'get',
                dataType: 'json',
                success: function (response) {
                    if (!Array.isArray(response.data)) {
                        commentsBlock.find('#comentario_cliente form.tray-hide').removeClass('tray-hide');

                        commentsBlock.find('#form-comments #nome_coment').val(response.data.name);
                        commentsBlock.find('#form-comments #email_coment').val(response.data.email);

                        commentsBlock.find('#form-comments [name="ProductComment[customer_id]"]').val(response.data.id);
                    } else {
                        commentsBlock.find('#comentario_cliente a.tray-hide').removeClass('tray-hide');
                    }

                    $('#tray-comment-block').before(commentsBlock);

                    $('#form-comments #bt-submit-comments').before(buttonReview).remove();

                    $('.ranking .rating').each(function () {
                        let review = Number(
                            $(this)
                                .attr('class')
                                .replace(/[^0-9]/g, '')
                        );

                        for (i = 1; i <= 5; i++) {
                            if (i <= review) {
                                $(this).append(star);
                            } else {
                                $(this).append(starEmpty);
                            }
                        }
                    });

                    $('#tray-comment-block').remove();

                    theme.chooseProductReview();
                    theme.sendProductReview();
                },
            });
        },

        buyTogetherOnProductPage: function () {
            const boxImages = $('.compreJunto form .fotosCompreJunto');
            const image = $('.compreJunto .produto img');
            const qtd = $('.compreJunto .precoCompreJunto .unidades_preco .unidades_valor');
            const spansLinksRemove = $(
                '.compreJunto .precoCompreJunto div:first-child> span, .compreJunto .precoCompreJunto div:first-child> a, .compreJunto .precoCompreJunto div:first-child > br'
            );
            let listQtd = [];

            boxImages.append('<div class="plus color to">=</div>');

            qtd.each(function () {
                const value = $(this).text();
                listQtd.push(value);
            });

            spansLinksRemove.each((i, span) => span.remove());

            image.each(function (index) {
                let bigImgUrl = $(this).attr('src').replace('/90_', '/180_');
                const link = $(this).parent().attr('href') || '';
                const name = $(this).attr('alt');

                $(this).addClass('buyTogether-img lazyload').attr('src', '').attr('src', bigImgUrl);

                if (link !== '') {
                    $(this).unwrap();
                    $(this).parents('span').after(`<a class="buyTogether-nameProduct" href="${link}">${name}</a>`);
                } else {
                    $(this).parents('span').after(`<p class="buyTogether-nameProduct">${name}</p>`);
                }

                if (listQtd[index] == 1) {
                    $(this).after(`<p class="buyTogether-text">${listQtd[index]} unidade</p>`);
                } else {
                    $(this).after(`<p class="buyTogether-text">${listQtd[index]} unidades</p>`);
                }
            });
        },

        tabNavigationOnProductPage: function () {
            const internal = this;
            const customTab = $('tabs-navMobile[href*="AbaPersonalizada"]');
            const urlTabs = $('.pageProduct .tabs .tabs-content[data-url]');
            const linkNavTabs = $('.pageProduct .tabs-nav .nav-link');
            const linkNavMobileTabs = $('.pageProduct .tabs .tabs-navMobile');
            const content = $('.pageProduct .tabs .tabs-content');

            customTab.each(function () {
                let target = $(this).attr('href').split('#')[1];
                target = $(`#${target}`);

                $(target).detach().insertAfter(this);
            });

            urlTabs.each(function () {
                let tab = $(this);
                let url = tab.data('url');

                $.ajax({
                    url: url,
                    method: 'get',
                    success: function (response) {
                        tab.html(response);
                        $('#atualizaFormas li table').css('display', 'none');
                        openPaymentMethod();
                    },
                });
            });

            const openPaymentMethod = () => {
                $('#formasPagto #linkPagParcelado').remove();

                return $('#atualizaFormas li a').on('click', function () {
                    $(this).toggleClass('u-visible');
                });
            };

            linkNavTabs.on('click', function (event) {
                const tabs = $(this).closest('.pageProduct-tabs');

                if (!$(this).hasClass('active')) {
                    let target = $(this).attr('href').split('#')[1];
                    target = $(`#${target}`);

                    $(linkNavTabs, tabs).removeClass('active');
                    $(this).addClass('active');
                    $(content, tabs).fadeOut();

                    setTimeout(function () {
                        target.fadeIn();
                    }, 300);
                }

                event.preventDefault();
                event.stopPropagation();
                return false;
            });

            linkNavMobileTabs.on('click', function (event) {
                let target = $(this).attr('href').split('#')[1];
                target = $(`#${target}`);

                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    target.removeClass('active').slideUp();
                } else {
                    linkNavMobileTabs.removeClass('active');
                    content.removeClass('active').slideUp();

                    $(this).addClass('active');
                    target.addClass('active').slideDown();
                }

                event.preventDefault();
                event.stopPropagation();
                return false;
            });

            internal.adjustOpenTabs(content, linkNavTabs, linkNavMobileTabs);

            /*$(window).on('resize', function () {
                internal.adjustOpenTabs(content, linkNavTabs, linkNavMobileTabs);
            });*/
        },

        recreateGalleryProductVariationImage: function (newVariationImages) {
            const allImages = $('[data-gallery="image"]');
            const boxImages = $('[data-gallery="box-images"]');
            const boxThumbs = $('[data-gallery="box-thumbs"]');
            const productName = $('.pageProduct .pageProduct-name').text();
            let htmlThumbs = ``;
            let htmlImages = ``;

            $.each(newVariationImages, function (index, item) {
                let slideIndex = index + 1;

                htmlImages += `
                    <div class="swiper-slide gallery-image" data-gallery="image" data-index="${slideIndex}">
                        <div class="zoom">
                            <img class="gallery-img${slideIndex === 1 ? ' swiper-lazy' : ' lazyload'}" data-src="${item.https}" src="${item.https}" alt="${productName}">
                        </div>
                    </div>
                `;

                htmlThumbs += `
                    <div class="swiper-slide gallery-thumb" data-gallery="image">
                        <img class="gallery-img${slideIndex === 1 ? ' swiper-lazy' : ' lazyload'}" data-src="${
                    item.thumbs[90].https
                }" src="${ item.thumbs[90].https }" alt="${productName}" width="90px" height="90px">
                    </div>
                `;
            });

            if (theme.settings.productThumbs) {
                theme.settings.productThumbs.destroy();
            }

            if (theme.settings.productGallery) {
                theme.settings.productGallery.destroy();
            }

            allImages.remove();
            boxImages.html(htmlImages);
            boxThumbs.html(htmlThumbs);

            theme.gallerySlidesOnProductPage();
        },

        loadProductVariantImage: function (id) {
            $.ajax({
                url: `/web_api/variants/${id}`,
                method: 'get',
                success: function (response) {
                    const newVariationImages = response.Variant.VariantImage;

                    if (newVariationImages.length) {
                        theme.recreateGalleryProductVariationImage(newVariationImages);
                    }
                },
                error: function (request, status, error) {
                    console.log(`[Theme] An error occurred while retrieving product variant image. Details: ${error}`);
                },
            });
        },

        initProductVariationImageChange: function () {
            const productVariationBox = $('.pageProduct-variants');
            const internal = this;

            productVariationBox.on('click', '.lista_cor_variacao li[data-id]', function () {
                internal.loadProductVariantImage($(this).data('id'));
            });

            productVariationBox.on('click', '.lista-radios-input', function () {
                internal.loadProductVariantImage($(this).find('input').val());
            });

            productVariationBox.on('change', 'select', function () {
                internal.loadProductVariantImage($(this).val());
            });
        },
        /* --- End Product Page Organization --- */
        /* Beginning Pages Tray Organization */
        processRteVideoAndTable: function () {
            $(`.col-panel .tablePage, 
               .page-extra .page-content table, 
               .page-extras .page-content table, 
               .board_htm table,
               .rte table,
               .page-noticia table
            `).wrap('<div class="table-overflow"></div>');

            $(`.page-noticia iframe[src*="youtube.com/embed"], 
               .page-noticia iframe[src*="player.vimeo"],
               .board_htm iframe[src*="youtube.com/embed"],
               .board_htm iframe[src*="player.vimeo"],
               .rte iframe[src*="youtube.com/embed"],
               .rte iframe[src*="player.vimeo"]
            `).wrap('<div class="rte-video-wrapper"></div>');
        },

        insertBreadcrumbNavigationInPage: function (local = '', customName = false) {
            let items;
            let breadcrumb = '';
            let pageName = document.title.split(' - ')[0].split(' | ')[0];

            if (local === 'listNews') {
                if (!window.location.href.includes('busca_noticias')) {
                    items = [
                        { text: 'Home', link: '/' },
                        { text: 'Not&iacute;cias', link: '/noticias' },
                    ];
                } else {
                    items = [
                        { text: 'Home', link: '/' },
                        { text: 'Not&iacute;cias', link: '/noticias' },
                        { text: 'Todas as Not&iacute;cias', link: '/busca_noticias' },
                    ];
                }
            } else if (local === 'news') {
                items = [
                    { text: 'Home', link: '/' },
                    { text: 'Not&iacute;cias', link: '/noticias' },
                    { text: pageName },
                ];
            } else if (local === 'wishlist') {
                items = [
                    { text: 'Home', link: '/' },
                    { text: 'Lista de Desejos', link: '/listas' },
                ];
            } else if (local != '' && customName === true) {
                items = [{ text: 'Home', link: '/' }, { text: local }];
            } else {
                items = [{ text: 'Home', link: '/' }, { text: pageName }];
            }

            $.each(items, function (index, item) {
                if (this.link) {
                    breadcrumb += `                       
                        <li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                            <a itemprop="item" class="breadcrumb-link" href="${item.link}">
                                <span itemprop="name">${item.text}</span>
                            </a>
                            <meta itemprop="position" content="${index + 1}" />
                        </li>   
                        `;
                } else {
                    breadcrumb += `
                        <li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                            <span itemprop="name">${item.text}</span>
                            <meta itemprop="position" content="${index + 1}" />
                        </li>          
                    `;
                }
            });

            $('.default-content > .container').prepend(`
                <ol class="breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
                    ${breadcrumb}
                </ol>
            `);
        },

        toggleShowReviewsForm: function () {
            $('[data-toggle="reviews"]').on('click', function (event) {
                let item = $(this).parent();

                item.toggleClass('u-show');
                event.preventDefault();
            });
        },

        validateFormFieldsToSendCustomerReview: function () {
            const formToSendReview = $('.page-depoimentos .container3 #depoimento');
            const buttonToSendReview = $('.page-depoimentos .container3 #depoimento .btn_submit');

            formToSendReview.validate({
                rules: {
                    nome_depoimento: {
                        required: true,
                    },
                    email_depoimento: {
                        required: true,
                        email: true,
                    },
                    msg_depoimento: {
                        required: true,
                    },
                    input_captcha: {
                        required: true,
                    },
                },
                messages: {
                    nome_depoimento: {
                        required: 'Por favor, informe seu nome completo',
                    },
                    email_depoimento: {
                        required: 'Por favor, informe seu e-mail',
                        email: 'Por favor, preencha com um e-mail v&aacute;lido',
                    },
                    msg_depoimento: {
                        required: 'Por favor, escreva uma mensagem no seu depoimento',
                    },
                    input_captcha: {
                        required: 'Por favor, preencha com o c&oacute;digo da imagem de verifica&ccedil;&atilde;o',
                    },
                },
                errorElement: 'span',
                errorClass: 'error-block',
            });

            buttonToSendReview.on('click', function () {
                const button = $(this);

                if (formToSendReview.valid()) {
                    button.html('Enviando...').attr('disabled', true);
                }
            });

            /* Create observer to detect Tray return */

            let target = $('#aviso_depoimento').get(0);
            let config = { attributes: true };

            let observerReviewMessage = new MutationObserver(function () {
                buttonToSendReview.html('Enviar Depoimento').removeAttr('disabled');
            });

            observerReviewMessage.observe(target, config);
        },

        organizeContactUsPage: function () {
            const textPageContact = $('.page-contact .default-content > .container');
            const buttonPageContact = $('.page-contact #btn_submit img.image');
            const inputTelPageContact = $('.page-contact #telefone_contato');
            const textEmailPageContact = $('.page-contact .email-texto');
            const tel01PageContact = $('.page-contact .contato-telefones .block:nth-child(1)');
            const tel02PageContact = $('.page-contact .contato-telefones .block:nth-child(2)');

            textPageContact.prepend(`
                <h1>Fale conosco</h1>
                <p class="contactUs-description">Precisa falar com a gente? Utilize uma das op&ccedil;&otilde;es abaixo para entrar em contato conosco.</p>
            `);
            buttonPageContact.parent().text('Enviar Mensagem').addClass('button2').children().remove();
            inputTelPageContact.removeAttr('onkeypress maxlength').addClass('mask-phone');
            textEmailPageContact.parent().wrap('<div class="contactUs-email"></div>');

            if (tel01PageContact.length) {
                let phoneNumberFormatted = tel01PageContact.text();
                let phoneNumber = phoneNumberFormatted.replace(/\D/g, '');

                tel01PageContact.unwrap().parent().addClass('contactUs-phone')
                    .html(`<h3>Central de Atendimento ao Cliente</h3>
                    <a href="tel:${phoneNumber}" title="Ligue para n&oacute;s">${phoneNumberFormatted}</a>`);
            }

            if (tel02PageContact.length) {
                let phoneNumberFormatted = tel02PageContact.text();
                let phoneNumber = phoneNumberFormatted.replace(/\D/g, '');

                tel02PageContact
                    .wrap('<div class="contactUs-whats"></div>')
                    .parent()
                    .insertAfter('.page-contact .contactUs-phone').html(`<h3>WhatsApp</h3>
                        <a target="_blank" rel="noopener noreferrer" href="https://api.whatsapp.com/send?l=pt&phone=55${phoneNumber}" title="Fale conosco no WhatsApp">${phoneNumberFormatted}</a>`);
            }
        },

        validateFormFieldsToSendContactEmail: function () {
            const formToSendContact = $('.page-contact .container2 .formulario-contato');
            const buttonToSendContact = $('.page-contact .container2 .formulario-contato .btn_submit');

            formToSendContact.validate({
                rules: {
                    nome_contato: {
                        required: true,
                    },
                    email_contato: {
                        required: true,
                        email: true,
                    },
                    mensagem_contato: {
                        required: true,
                    },
                },
                messages: {
                    nome_contato: {
                        required: 'Por favor, informe seu nome completo',
                    },
                    email_contato: {
                        required: 'Por favor, informe seu e-mail',
                        email: 'Por favor, preencha com um e-mail v&aacute;lido',
                    },
                    mensagem_contato: {
                        required: 'Por favor, escreva uma mensagem para entrar em contato',
                    },
                },
                errorElement: 'span',
                errorClass: 'error-block',
            });
            buttonToSendContact.on('click', function () {
                const button = $(this);

                if (formToSendContact.valid()) {
                    button.html('Enviando...').attr('disabled', true);
                }
            });
        },

        organizeNewsletterRegistrationPage: function () {
            if ($('.page-newsletter .formulario-newsletter').length) {
                $(
                    '.page-newsletter .formulario-newsletter .box-captcha input, .page-newsletter .formulario-newsletter .box-captcha-newsletter input'
                )
                    .attr('placeholder', 'Digite o c&oacute;digo ao lado')
                    .trigger('focus');
                $('.formulario-newsletter .newsletterBTimg').html('Enviar').removeClass().addClass('button2');
            } else {
                $('.page-newsletter .default-content').addClass('success-message-newsletter');
                $('.page-newsletter .default-content.success-message-newsletter .board p:first-child a')
                    .addClass('button2')
                    .html('Voltar para p&aacute;gina inicial');
            }

            setTimeout(function () {
                $('.page-newsletter .default-content').addClass('u-show');
            }, 200);
        },

        tabMedidas: function() {
            const imageTab = $("#tabelaImg img");

            $("#b-tab-medidas").on("click", function() {
                $(".pageProduct div#popup-tab-medidas").css("display", "flex");
            });

            $(".pageProduct div#popup-tab-medidas .content #fechar-popup").on("click", function() {
                $(".pageProduct div#popup-tab-medidas").hide();
            });

            $(".pageProduct div#popup-tab-medidas").click(function(event) {
                const popup = $(".pageProduct div#popup-tab-medidas .content");

                // Verifica se o clique ocorreu fora do popup
                if (!popup.is(event.target) && popup.has(event.target).length === 0) {
                    $(".pageProduct div#popup-tab-medidas").hide();
                }
            });

            $("#tab1").on("click", function() {
                imageTab.attr({"src": `${imageTab.attr("tab1-src")}`, "alt": `${imageTab.attr("tab1-alt")}`, "title": `${imageTab.attr("tab1-title")}`});
            });
            $("#tab2").on("click", function() {
                imageTab.attr({"src": `${imageTab.attr("tab2-src")}`, "alt": `${imageTab.attr("tab2-alt")}`, "title": `${imageTab.attr("tab2-title")}`});
            });
            $("#tab3").on("click", function() {
                imageTab.attr({"src": `${imageTab.attr("tab3-src")}`, "alt": `${imageTab.attr("tab3-alt")}`, "title": `${imageTab.attr("tab3-title")}`});
            });
        },

        organizeNewsPage: function () {
            const titleButtonPage = $('.page-busca_noticias #listagemCategorias b');
            if (!window.location.href.includes('busca_noticias')) {
                titleButtonPage.replaceWith('<h1>Not&iacute;cias</h1>');
            }
        },

        organizePagesTray: function () {
            const login = $('.caixa-cadastro #email_cadastro');
            const buttonReviewPage = $('.page-depoimentos .container .btn_submit');
            const titleReviewPage = $('.page-depoimentos .container #comentario_cliente');
            const buttonAdvancedSearch = $('.page-search #Vitrine input[type="image"]');

            login.attr('placeholder', 'Digite seu e-mail*');
            buttonReviewPage.html('Enviar Depoimento').addClass('button2 review-button');
            titleReviewPage.prepend(
                '<button class="review-form" data-toggle="reviews">Deixei seu depoimento sobre n&oacute;s <span class="icon-arrow-simple" aria-hidden="true"></span></button>'
            );
            buttonAdvancedSearch.after('<button type="submit" class="button2">BUSCAR</button>');
            buttonAdvancedSearch.remove();
        },

        /* --- End Pages Tray Organization --- */

        /* To Action in ajax.html */
        updateCartTotal: function () {
            $('[data-cart="amount"]').text($('.cart-preview-item').length);
        },

        updatePriceShowCaseProducts: function() {
            const pattern1 = /\s+/;
            const pattern2 = "R$";

            $(".product-price").each(function() {
                const precoAvista = $(this).find("span.preco-avista.precoAvista");

                if (precoAvista.length && precoAvista.text() !== "") {
                    let preco = precoAvista.text();
                    
                    // Remove espaÃÂ§os em branco
                    preco = preco.replace(pattern1, "");
                    preco = preco.replace(pattern2, pattern2 + " ");

                    // Atualiza o texto do elemento
                    $(this).find(".price-current .value").text(` ${preco} `);
                }
            });
        },

        getVariation: function(id) {
            return new Promise(function(resolve, reject) {
                const variationID = id;
                const dataVariation = {};
        
                $.ajax({
                    method: "GET",
                    url: `/web_api/variants/${variationID}`
                }).done(function(response, textStatus, jqXHR) {
                    const variation = response.Variant;
        
                    if(variation.hasOwnProperty("Sku") && variation.Sku.length > 0) {
                        const inforVar = variation.Sku;
                        inforVar.forEach((v) => {
                            if(v.type == "Tamanho" && v.value) {
                                dataVariation.size = v.value;
                            }

                            if(v.type == "Cor" && v.value) {
                                dataVariation.color = v.value;
                                dataVariation.thumbColor = v.image_secure;
                            }
                        });
                    }
                    
                    dataVariation.id = variationID;
                    dataVariation.productImage1 = variation.VariantImage && variation.VariantImage[0] && variation.VariantImage[0].https ? variation.VariantImage[0].https : null;
                    dataVariation.productImage2 = variation.VariantImage && variation.VariantImage[1] && variation.VariantImage[1].https ? variation.VariantImage[1].https : null;
        
                    resolve(dataVariation);
                }).fail(function(jqXHR, status, errorThrown) {
                    var response = $.parseJSON(jqXHR.responseText);
                    console.log(response);
                    reject(errorThrown);
                });
            });
        },

        consultVariations: async function(id, type = "color", name) {
            const productID = id;
            let list = [];
            let html = "";
        
            function getVariationWithPromise(variation) {
                return new Promise(function(resolve, reject) {
                    theme.getVariation(variation.id)
                        .then(resolve)
                        .catch(reject);
                });
            }

            function compararTamanhosLoja(a, b) {
                const ordemTamanhos = ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","UN","PP","P","M","G","GG","XG","XGG","EG","32A","34A","36A","38A","40A","42A","44A","46A","48A","50A","52A","54A","56A","58A","60A","32B","34B","36B","38B","40B","42B","44B","46B","48B","50B","52B","54B","56B","58B","60B","32C","34C","36C","38C","40C","42C","44C","46C","48C","50C","52C","54C","56C","58C","60C","32D","34D","36D","38D","40D","42D","44D","46D","48D","50D","52D","54D","56D","58D","60D","32E","34E","36E","38E","40E","42E","44E","46E","48E","50E","52E","54E","56E","58E","60E","32F","34F","36F","38F","40F","42F","44F","46F","48F","50F","52F","54F","56F","58F","60F","32G","34G","36G","38G","40G","42G","44G","46G","48G","50G","52G","54G","56G","58G","60G","32H","34H","36H","38H","40H","42H","44H","46H","48H","50H","52H","54H","56H","58H","60H","32I","34I","36I","38I","40I","42I","44I","46I","48I","50I","52I","54I","56I","58I","60I","32J","34J","36J","38J","40J","42J","44J","46J","48J","50J","52J","54J","56J","58J","60J","32K","34K","36K","38K","40K","42K","44K","46K","48K","50K","52K","54K","56K","58K","60K","32L","34L","36L","38L","40L","42L","44L","46L","48L","50L","52L","54L","56L","58L","60L","32M","34M","36M","38M","40M","42M","44M","46M","48M","50M","52M","54M","56M","58M","60M","32N","34N","36N","38N","40N","42N","44N","46N","48N","50N","52N","54N","56N","58N","60N","32O","34O","36O","38O","40O","42O","44O","46O","48O","50O","52O","54O","56O","58O","60O","32P","34P","36P","38P","40P","42P","44P","46P","48P","50P","52P","54P","56P","58P","60P","32Q","34Q","36Q","38Q","40Q","42Q","44Q","46Q","48Q","50Q","52Q","54Q","56Q","58Q","60Q","32R","34R","36R","38R","40R","42R","44R","46R","48R","50R","52R","54R","56R","58R","60R","32S","34S","36S","38S","40S","42S","44S","46S","48S","50S","52S","54S","56S","58S","60S","32T","34T","36T","38T","40T","42T","44T","46T","48T","50T","52T","54T","56T","58T","60T","32U","34U","36U","38U","40U","42U","44U","46U","48U","50U","52U","54U","56U","58U","60U","32V","34V","36V","38V","40V","42V","44V","46V","48V","50V","52V","54V","56V","58V","60V","32W","34W","36W","38W","40W","42W","44W","46W","48W","50W","52W","54W","56W","58W","60W","32X","34X","36X","38X","40X","42X","44X","46X","48X","50X","52X","54X","56X","58X","60X","32Y","34Y","36Y","38Y","40Y","42Y","44Y","46Y","48Y","50Y","52Y","54Y","56Y","58Y","60Y","32Z","34Z","36Z","38Z","40Z","42Z","44Z","46Z","48Z","50Z","52Z","54Z","56Z","58Z","60Z"];
            
                const indiceA = a && a.size ? ordemTamanhos.indexOf(a.size.toUpperCase()) : -1;
                const indiceB = b && b.size ? ordemTamanhos.indexOf(b.size.toUpperCase()) : -1;
            
                return indiceA - indiceB;
            }            
        
            const promises = [];
        
            try {
                const response = await $.ajax({
                    method: "GET",
                    url: `/web_api/products/${productID}`
                });
        
                const variationList = response.Product.Variant;
        
                if (variationList.length == 0) {
                    return false;
                }

                variationList.forEach((variation) => {
                    const promise = getVariationWithPromise(variation);
                    promises.push(promise);
        
                    promise
                    .then(function(dataVariation) {
                        if (
                            dataVariation.color && 
                            !list.some((v) => v.color && v.color.toLowerCase() === dataVariation.color.toLowerCase()) &&
                            type === "color"
                        ) {
                            list.push(dataVariation);
                        } else if (
                            (!dataVariation.color && dataVariation.size) || 
                            (name && (name.toLowerCase() === dataVariation.color.toLowerCase()) && type === "sizes")
                        ) {
                            list.push(dataVariation);
                        }                                                         
                    })
                    .catch(function(error) {
                        console.error(error);
                    });
                });

                await Promise.all(promises);
        
                console.log(list);
                
                if (
                    list.length > 0 && 
                    type === "color" && 
                    (list[0] && list[0].hasOwnProperty("color")) || 
                    (list[0] && !list[0].hasOwnProperty("size") && list[0].hasOwnProperty("color"))
                ) {
                    const simple = !list[0].hasOwnProperty("size") && list[0].hasOwnProperty("color");
                    html += `<div class="swiper"><ul class='variations-list ${simple ? "simple" : "compound"} swiper-wrapper' data-type='color'>`;
                    list.sort(compararTamanhosLoja);
                    list.forEach((variation) => {
                        html += `
                            <li class="variation swiper-slide" 
                                title="Selecionar cor: ${variation.color}" 
                                data-id="${variation.id}" 
                                data-size="${variation.size}" 
                                data-color="${variation.color}"
                                data-thumb-color="${variation.thumbColor}"
                                ${variation.productImage1 ? 'data-images1="' + variation.productImage1 + '"' : ''}
                                ${variation.productImage2 ? 'data-images2="' + variation.productImage2 + '"' : ''}
                            >
                                <img src="${variation.thumbColor}" alt="Cor: ${variation.color}" title="Cor: ${variation.color}"/>
                            </li>
                        `;
                    });
                    html += '</ul></div>';
                    return html;
                }
        
                if (
                    type === "sizes" && 
                    list.length > 0 && 
                    (list[0] && list[0].hasOwnProperty("size")) || 
                    (list[0] && !list[0].hasOwnProperty("color") && list[0].hasOwnProperty("size"))
                ) {
                    const simple = !list[0].hasOwnProperty("color") && list[0].hasOwnProperty("size");
                    html += `<div class="swiper"><ul class='variations-list ${simple ? "simple" : "compound"} swiper-wrapper' data-type='sizes'>`;
                    list.sort(compararTamanhosLoja);
                    list.forEach((variation) => {
                        html += `
                            <li class="variation swiper-slide" 
                                title="Selecionar tamanho: ${variation.size}" 
                                data-id="${variation.id}" 
                                data-size="${variation.size}" 
                                data-color="${variation.color}"
                                data-thumb-color="${variation.thumbColor}"
                                ${variation.productImage1 ? 'data-images1="' + variation.productImage1 + '"' : ''}
                                ${variation.productImage2 ? 'data-images2="' + variation.productImage2 + '"' : ''}
                            >
                                <div>
                                    ${variation.size}
                                </div>
                            </li>
                        `;
                    });
                    html += '</ul></div>';
                }
                return html;
            } catch (error) {
                html = "NÃÂ£o foi possÃÂ­vel carregar as variaÃÂ§ÃÂµes."
                console.error(error);
                throw error;
            }
        },

        alertClient: function(reference, success, text) {
            const status = success ? "#0cb570" : "#b50c0c";
            const message = text;

            function cleanFields() {
                $(reference).find(".alert-client").text("");
                $(reference).find(".alert-client").css({
                    fontSize: "14px",
                    backgroundColor: "transparent",
                    marginTop: "0rem",
                    padding: "0",
                    borderRadius: "5px",
                    color: "#fff",
                    textAlign: "center",
                });
            }

            cleanFields();

            $(reference).find(".alert-client").text(message);
            $(reference).find(".alert-client").css({
                fontSize: "14px",
                backgroundColor: status,
                padding: "0.35rem 0",
                marginTop: "0.75rem",
                borderRadius: "5px",
                color: "#fff",
                textAlign: "center",
            });

            setTimeout(cleanFields, 7000);
        },

        insertToCart: function() {

            $(".product-info .add-cart .button2").off("click").on("click", function() {
                const dataSession = $("html").data("session");
                const productID = $(this).data("id");
                const quantity = 1;
                const generalContainer = $(this).closest(".product-info");
            
                const hasVariations = $(generalContainer).find(".variations").hasClass("variationsEmpty");
                const simple = $(this).closest(".product-info").find(".variations-list").hasClass("simple");
            
                let variantID = null;
            
                if (!hasVariations) {
                    const colorSelected = $(this).closest(".product-info").find('[data-type="color"] .variation.selected').length > 0;
                    const $selectedSize = $(this).closest(".product-info").find('[data-type="sizes"] .variation.selected').length > 0;
                
                    if (simple) {
                        const type = $(generalContainer).find(".variations-list").data("type");
                
                        if (type === "color") {
                            if (colorSelected > 0) {
                                variantID = $(this).closest(".product-info").find('[data-type="color"] .variation.selected').data("id");
                            } else {
                                theme.alertClient(generalContainer, false, "Selecione a cor do produto.");
                                return;
                            }
                        } else if (type === "sizes") {
                            if ($selectedSize > 0) {
                                variantID = $(this).closest(".product-info").find('[data-type="sizes"] .variation.selected').data("id");
                            } else {
                                theme.alertClient(generalContainer, false, "Selecione o tamanho do produto.");
                                return;
                            }
                        }
                    } else {
                        // Se não for um produto simples, aplica a lógica padrão
                        if (!colorSelected) {
                            theme.alertClient(generalContainer, false, "Selecione a cor do produto.");
                            return;
                        }
                
                        if ($selectedSize > 0) {
                            variantID = $(this).closest(".product-info").find('[data-type="sizes"] .variation.selected').data("id");
                        } else {
                            theme.alertClient(generalContainer, false, "Selecione o tamanho do produto.");
                            return;
                        }
                    }
                }
                            
                if (quantity <= 0) {
                    theme.alertClient(generalContainer, false, "Selecione uma quantidade acima de zero para adicionar o produto na sacola.");
                    return;
                }
            
                const $productBuy = $(this).closest(".product-info");
                $.ajax({
                    method: "POST",
                    url: "/web_api/cart/",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        Cart: {
                            session_id: dataSession,
                            product_id: productID,
                            quantity: quantity,
                            variant_id: variantID
                        }
                    })
                }).done(function(response, textStatus, jqXHRH) {
                    if (response.code === 201 || response.code === 200) {
                        amount();
                        theme.alertClient(generalContainer, true, "Produto adicionado na sacola.");
                        $productBuy.find('[data-type="color"] .variation, [data-type="sizes"] .variation').removeClass("selected");
                        
                        if(simple) {
                            return;
                        }

                        $productBuy.find('[data-type="sizes"]').closest(".swiper").remove();
                        return;
                    }
                    console.log(response);
                }).fail(function(jqXHR, status, errorThrown) {
                    const response = $.parseJSON(jqXHR.responseText);
            
                    if (response.code === 400) {
                        theme.alertClient(generalContainer, false, response.causes[0]);
                        return;
                    }
                    console.log(response);
                });
            });
        },

        slideVariationsProduct: function (product, globalIndex) {
            const $products = $(product).find(".swiper");
        
            $products.each(function (localIndex, element) {
                const $product = $(element);
        
                // Evitar reinicialização do Swiper
                if ($product.hasClass("swiper-initialized")) {
                    return;
                }
        
                const carouselClass = `color-swiper-${globalIndex + localIndex}`;
        
                // Adicionar botões de navegação para cores
                if (!$product.siblings(`.swiper-button-prev.var.${carouselClass}`).length) {
                    $product.before(`
                        <div class="swiper-button-prev var ${carouselClass}"></div>
                        <div class="swiper-button-next var ${carouselClass}"></div>
                    `);
                }
                
        
                // Inicializar Swiper
                new Swiper($product[0], {
                    slidesPerView: 4,
                    spaceBetween: 12,
                    loop: false,
                    breakpoints: {
                        0: { slidesPerView: 2 },
                        680: { slidesPerView: 3 },
                        900: { slidesPerView: 4 },
                    },
                    navigation: {
                        prevEl: `.swiper-button-prev.var.${carouselClass}`,
                        nextEl: `.swiper-button-next.var.${carouselClass}`,
                    },
                });
            });
        },
        
        addCartFast: function () {
            $(".product-button.add-cart-fast").each(async function (index) {
                const $button = $(this);
                const $product = $button.closest(".product");
                const productId = $button.find('[data-id]').data("id");
        
                // Obtém as variações
                const variationsHtml = await theme.consultVariations(productId);
        
                // Atualiza ou marca como vazio
                const $variationsContainer = $product.find(".variations");
                if (!variationsHtml) {
                    $variationsContainer.closest(".product-buy").attr("style", "margin-bottom: 0 !important");
                    $variationsContainer.empty().addClass("variationsEmpty");
                    return;
                }
                $variationsContainer.html(variationsHtml).removeClass("variationsEmpty");
        
                // Configurações para variações simples
                theme.configureVariationClick(
                    $variationsContainer.find('.variations-list.simple .variation'),
                    theme.insertToCart
                );
        
                // Configurações para variações compostas (cor)
                $product
                    .find('.compound[data-type="color"] .variation')
                    .off("click")
                    .on("click", async function () {
                        const $color = $(this);
        
                        // Atualiza imagens do produto com base na cor selecionada
                        theme.updateProductImages($color);
        
                        // Alterna a seleção da cor
                        $product.find('.compound[data-type="color"] .variation.selected')
                            .not($color)
                            .removeClass('selected');
                        $color.toggleClass('selected');
        
                        // Remove tamanhos e carrossel existente se deselecionado ou mudar de cor
                        $product.find('[data-type="sizes"]').parent().remove();
                        $product.find('.swiper-button-prev.var2, .swiper-button-next.var2').remove();
        
                        if (!$color.hasClass('selected')) {
                            // Nenhuma cor está selecionada
                            theme.enableVariationClick($product);
                            return;
                        }
        
                        // Adiciona carregando enquanto busca tamanhos
                        theme.addLoadingElement($product);
        
                        const colorData = $color.data("color");
                        const sizesHtml = await theme.consultVariations(productId, "sizes", colorData);
        
                        // Remove carregando e adiciona os tamanhos correspondentes
                        $product.find('.sizes-loading').remove();
                        const $sizesContainer = $(sizesHtml).addClass('swiper');
                        $variationsContainer.append($sizesContainer);
        
                        // Configura Swiper para tamanhos
                        const sizeCarouselClass = `size-swiper-${index}`;
                        $sizesContainer.parent().before(`
                            <div class="swiper-button-prev var2 ${sizeCarouselClass}"></div>
                            <div class="swiper-button-next var2 ${sizeCarouselClass}"></div>
                        `);
        
                        new Swiper($sizesContainer[0], {
                            slidesPerView: 3,
                            spaceBetween: 12,
                            loop: false,
                            breakpoints: {
                                0: { slidesPerView: 2 },
                                680: { slidesPerView: 3 },
                                900: { slidesPerView: 4 },
                            },
                            navigation: {
                                prevEl: `.swiper-button-prev.var2.${sizeCarouselClass}`,
                                nextEl: `.swiper-button-next.var2.${sizeCarouselClass}`,
                            },
                        });
        
                        // Configura evento de clique nos tamanhos
                        theme.configureSizeClickEvent($sizesContainer.find('.variation'));
        
                        // Habilita as interações
                        theme.enableVariationClick($product);
                        theme.insertToCart();
                    });
        
                // Configurações finais
                theme.insertToCart();
                theme.slideVariationsProduct($product, index);
            });
        },           
        
        configureVariationClick: function($elements, callback) {
            $elements.off("click").on("click", function() {
                const $variation = $(this);
                theme.updateVariation($variation);
                callback($elements);
            });
        },
        
        disableVariationClick: function ($button) {
            $button.find('.variation').css({"pointer-events": "none", "opacity": "0.5"});
        },
        
        enableVariationClick: function ($button) {
            $button.find('.variation').css({"pointer-events": "all", "opacity": "1"});
        },
        
        updateProductImages: function ($color) {
            const urlImg1 = $color.attr("data-images1");
            const urlImg2 = $color.attr("data-images2");
            const img1 = $color.closest(".product-image").find(".product-img:first-child");
            const img2 = $color.closest(".product-image").find(".product-img:last-child");
        
            if (urlImg1 && urlImg1 !== "" && img1) {
                img1.attr("src", urlImg1);
            }
        
            if (urlImg2 && urlImg2 !== "" && img2) {
                img2.attr("src", urlImg2);
            }
        },
        
        removeExistingElements: function ($button) {
            $button.find('.sizes-loading').empty();
            $button.find('[data-type="sizes"]').closest(".swiper").empty();
        },
        
        addLoadingElement: function ($button) {
            $button.find('[data-type="color"]').after(`<p class="sizes-loading" style="text-align: center; padding: 0.5rem 0;">Carregando...</p>`);
        },
        
        configureSizeClickEvent: function ($sizes) {
            $sizes.off("click").on("click", function () {
                $sizes.parent().find('.variation.selected').not($(this)).removeClass('selected');
                $(this).toggleClass('selected');
            });
        },
        
        updateVariation: function ($variation) {
            $variation.closest('.product-info').find('.variation.selected').not($variation).removeClass('selected');
            $variation.toggleClass('selected');
        },      

        slideDifferentials: function() {
            const larguraDaTela = window.screen.width;

            if(larguraDaTela > 1024 && $("section.differentials .content").length) {
                return;
            }

            $("section.differentials").addClass("swiper");
            $("section.differentials .content").addClass("swiper-wrapper");
            $("section.differentials .content .differential").addClass("swiper-slide");
            $("section.differentials .content").after(`
                <div class="swiper-pagination"></div>
            `);

            new Swiper('.differentials.swiper', {
                slidesPerView: 2,
                loop: true,
                autoplay: {
                    delay: 2500,
                    disableOnInteraction: false,
                },
                
                breakpoints: {
                    0: {
                        slidesPerView: 1,
                    },
                    680: {
                        slidesPerView: 2,
                    },
                    900: {
                        slidesPerView: 2,
                    },
                },

                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });
        },

        getVideoId: function(url) {
            // Express&atilde;o regular para URLs no formato youtube.com/watch?v=ID, youtu.be/ID ou youtube.com/shorts/ID
            const pattern = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

            const match = url.match(pattern);
            if (match) {
                return match[1];
            } else {
                return null;
            }
        },

        extractVimeoVideoId: function(url) {
            const pattern = /vimeo\.com\/(?:video\/|channels\/\w+\/|)(\d+)/;

            const match = url.match(pattern);
            if (match) {
                return match[1];
            } else {
                return null;
            }
        },

        getVimeoVideoThumbnail: async function (videoId) {
            const apiUrl = `https://vimeo.com/api/v2/video/${videoId}.json`;
            
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
            
                // A resposta ÃÂ© uma matriz, pois a API retorna um array de informa&ccedil;ÃÂµes do vÃÂ­deo
                // Aqui, pegamos o primeiro elemento, pois estamos solicitando apenas um vÃÂ­deo
                const videoInfo = data[0];
                
                // A URL da thumbnail estar&aacute; disponÃÂ­vel na propriedade "thumbnail_large"
                const thumbnailUrl = videoInfo.thumbnail_large;
                
                // Agora vocÃÂª pode usar a URL da thumbnail para exibi-la em sua p&aacute;gina ou onde for necess&aacute;rio
                return thumbnailUrl;
            } catch (error) {
                console.error('Ocorreu um erro ao obter a thumbnail do vÃÂ­deo:', error);
                return null; // ou trate o erro de acordo com a necessidade
            }
        },
        
        seeEventsVideo: function(id) {
            // Seleciona a div que ser&aacute; monitorada
            let divMonitorada = $('.gallery-images');

            const iframe =  `
                <div class="swiper-slide video-frame" data-gallery="image">
                    <iframe id="iframe-video" src="${$('#product-video').data("video")}" frameborder="0"></iframe>
                </div>
            `;

            const thumb = `
                <div class="swiper-slide gallery-thumb" data-gallery="image" video-thumb="">
                    <img class="gallery-img swiper-lazy" src="${$('#product-video').data("image")}" video-image="" alt="${$('.pageProduct-name').text()}" width="90px" height="90px" style="object-fit: contain !important; padding: 1em;"/>
                    <span class="icon-youtube-simple">
                        <span class="path1"></span>
                        <span class="path2"></span>
                    </span>
                </div>
            `;

            // Cria uma nova inst&acirc;ncia do MutationObserver
            let observer = new MutationObserver(function(mutations) {
                if(
                    !$(".video-frame").length &&
                    !$("[video-thumb]").length &&
                    $("#product-video").length
                ) {
                    $('[data-gallery="box-images"]').append(iframe);
                    $('[data-gallery="box-thumbs"]').append(thumb);
                    theme.productVideo();
                }
            });

            // Configura as op&ccedil;&otilde;es do MutationObserver
            let options = {
                childList: true, // Observar altera&ccedil;&otilde;es na lista de elementos filhos
                subtree: true // Observar altera&ccedil;&otilde;es em todos os elementos descendentes
            };

            // Inicia a observa&ccedil;&atilde;o da div
            observer.observe(divMonitorada[0], options);

            if(window.screen.width < 768) {
                $('[video-thumb]').on("click", function() {
                    if($(this).hasClass("clicked")) {
                        return;
                    }
                    
                    theme.productVideo();
                    $(this).addClass("clicked");
                });
            }
        },
        
        clickSingleVariations: function() {
            $(window).on("load", function() {
                if(!$('[data-type="color"]').length) {
                    return;
                }

                $('[data-type="color"]').each(function() {
                    const variations = $(this).find("li.variation");
                
                    if(!variations.length || variations.length > 1) {
                        return;
                    }
                
                    variations.click();
                })
            });
        },

        productVideo: async function() {
            const videoTag = $("#product-video");

            if(videoTag.length) {
                const url = videoTag.data("video");
                let videoId = theme.getVideoId(url);

                //Ajustando iframe ÃÂ  largura:
                $("#iframe-video").attr("height", $(".gallery-images").css("height"));
                $("#iframe-video").attr("width", $(".gallery-images").css("width"));

                if(videoId != null) {
                    //definindo iframe:
                    $("#iframe-video").attr("src", `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&loop=1&modestbranding=1`);

                    setTimeout(() => {
                        //definindo imagem:
                        $("[video-image]").attr("src", `
                            https://img.youtube.com/vi/${videoId}/0.jpg
                        `).css({
                            padding: "0 0.45em",
                            objectFit: "cover"
                        });
                    }, 2000);
                } else {
                    videoId = theme.extractVimeoVideoId(url);
                    let thumbVimeo = await theme.getVimeoVideoThumbnail(videoId);

                    $("#iframe-video").attr("src", `https://player.vimeo.com/video/${videoId}?autoplay=1&amp;loop=1&amp;title=0&amp;byline=0&amp;portrait=0`);

                    setTimeout(() => {
                        $("[video-image]").attr("src", thumbVimeo).css({
                            padding: "0 0.45em",
                            objectFit: "cover"
                        });
                    }, 2000);                        
                }

                theme.seeEventsVideo(videoId);
            }
        },

        popupImageView: function() {
            function changeImage(imageSrc) {
                $("#image-view .gallery-images .gallery-img").attr("src", imageSrc);
            }

            $('[data-slides="gallery"] .gallery-image').on("click", function () {
                const image = $(this).find("img").attr("src");
                $("#image-view").css("display", "flex");
                changeImage(image);
            });

            $("#image-view #btn-close").on("click", function () {
                $("#image-view").hide();
            });

            $("#image-view .gallery-thumbs .gallery-img").on("click", function() {
                const image = $(this).attr("src");
                changeImage(image);
            });

            $("#image-view").on("click", function(event) {
                if (!$(event.target).closest("div#content-popup").length) {
                  $("#image-view").hide();
                }
            });
        },

        scrollToComments: function() {
            $(window).on("load", function() {
                if(window.location.hash === "#coments") {
                    $('.pageProduct-price + a>div').trigger("click");
                }
            });
        },
        
        searchOrder: function() {
            if(!$("form.rastrear").length) {
                return;
            }

            const baseURI = 'https://app.melhorrastreio.com.br/app/';

            $("form.rastrear").on("submit", function(e) {
                e.preventDefault();

                const codigo = $("form.rastrear input").val();
                const url = baseURI + codigo;
                window.open(url, '_blank');
            });
        },
    };

    // Execution of Functions
    $(() => {
        const lazyLoadImages = new LazyLoad({
            elements_selector: '.lazyload',
        });
        theme.organizePagesTray();
        theme.getScroll();
        theme.cookiesInteracion();

        setTimeout(() => {
            theme.searchOrder();
            theme.addCartFast();
            theme.clickSingleVariations();
            theme.updatePriceShowCaseProducts();
            theme.videoPopup();
            theme.vipListPopup();
            theme.processRteVideoAndTable();
            theme.openApplyOverlayClose();
            theme.scrollHidesMenu();
            theme.mainMenuMobile();
            theme.libMaskInit();
            //theme.footerInteraction();
        }, 20);

        if ($('html').hasClass('page-home')) {
            setTimeout(function () {
                theme.bannerSlides();
                theme.slideDifferentials();
                theme.productsSlides();
                theme.slidesCategoryImages();
                theme.productGridShowMore();
                theme.loadNewsPageOnHome();
                theme.eventsFormListPopup();
            }, 40);
            theme.customerReviewsSlidesOnHome();
            theme.brandsSlides();
            //theme.colorDiferentials();
        } else if ($('html').hasClass('page-product')) {
            theme.productsSlides();
            theme.gallerySlidesOnProductPage();
            //theme.quantityProducts();
            theme.getQuantityChangeOnProductPage();
            theme.initProductVariationImageChange();
            theme.popupImageView();
            theme.tabMedidas();
            theme.observePrice();
            theme.clickOneVariation();
            theme.productVideo();
            theme.scrollToComments();
            theme.generateShippingToProduct();
            theme.addImageShipping();
            theme.goToProductReviews();
            theme.reviewsOnProductPage();
            theme.tabNavigationOnProductPage();
            theme.buyTogetherOnProductPage();
            setTimeout(() => {
                theme.organizeProductPage();
            }, 20);
        } else if ($('html').hasClass('page-contact')) {
            theme.organizeContactUsPage();
            theme.validateFormFieldsToSendContactEmail();
        } else if ($('html').hasClass('page-newsletter')) {
            theme.organizeNewsletterRegistrationPage();
        } else if ($('html').hasClass('page-depoimentos')) {
            theme.toggleShowReviewsForm();
            theme.validateFormFieldsToSendCustomerReview();
        } else if ($('html').hasClass('page-busca_noticias')) {
            theme.organizeNewsPage();
            theme.insertBreadcrumbNavigationInPage('listNews');
        } else if ($('html').hasClass('page-noticia')) {
            theme.insertBreadcrumbNavigationInPage('news');
        } else if ($('html').hasClass('page-company')) {
            theme.insertBreadcrumbNavigationInPage('Sobre n&oacute;s', true);
        } else if (
            $('html').hasClass('page-listas_index') ||
            $('html').hasClass('page-listas_evento') ||
            $('html').hasClass('page-listas_criar')
        ) {
            theme.insertBreadcrumbNavigationInPage('wishlist');
        } else if ($('html').hasClass('page-extra')) {
            theme.insertBreadcrumbNavigationInPage('Sistema de Afiliados', true);
        } else if (!$('html').hasClass('page-product') && !$('html').hasClass('page-catalog') && !$('html').hasClass('page-search')){
            theme.insertBreadcrumbNavigationInPage();
        }
    });
})(jQuery);