

/** OBSERVAÃÃES IMPORTANTES:
 * 
 * A requisiÃ§Ã£o GET Ã© realizada em 3 eventos: ao clicar na bag do carrinho, clicar em adicionar, diminuir;
 * A requisiÃ§Ã£o POST Ã© realizada em 2 eventos: ao clicar em adicionar e diminuir;
 * A requisiÃ§Ã£o DELETE, Ã© realizada em 2 eventos: ao clicar em diminuir e excluir o produto;
 * Os itens da lista sÃ£o criados atravÃ©s de uma funÃ§Ã£o, de acordo com a quantidade de itens encontrados na array de dados da requisiÃ§Ã£o;
 * Um loop realiza a inserÃ§Ã£o dos Ã­tens dentro da tag "ul", inserindo uma classe com o index do loop. (Para realizarmos a identificaÃ§Ã£o de cada item no html);
 * A atualizaÃ§Ã£o dos elementos da lista Ã© realizada apenas apÃ³s o refresh da pÃ¡gina;
 * As interaÃ§Ãµes de feedback em relaÃ§Ã£o as aÃ§Ãµes que o usuÃ¡rio realiza no front-end sÃ£o inseridas por uma funÃ§Ã£o que Ã© ativada de acordo com o feedback da  API em relaÃ§Ã£o Ã  aÃ§Ã£o solicitada.
**/ 


//REFATORANDO O CÃDIGO DA SOLUÃÃO DO CARRINHO (PROJETO: CALOR DA PELE):

//Variaveis globais:
var url = `/web_api/cart/`;
function data_session() { 
    return document.querySelector("html").attributes['data-session'].value;
}
      
//FunÃ§Ãµes globais:
function createItemList(i) {
    //criando os elementos:
    let item = document.createElement('li'), 
        id = document.createElement('div'), 
        imagemDIV = document.createElement('div'), 
        imagem = document.createElement('img'), 
        titulo = document.createElement('div'), 
        preco = document.createElement('div'), 
        board = document.createElement("div"),
        notification = document.createElement("div");
    
    //Inserindo atributos:
    item.setAttribute("class", `idx-${i}`);
    item.setAttribute("id", "cart-product");
    id.setAttribute("id", "id-product");
    imagemDIV.setAttribute("id", "img");
    imagem.setAttribute("src", "");
    imagem.setAttribute("alt","Imagem do produto");
    titulo.setAttribute("id", "text-product");
    preco.setAttribute("id", "price-product");
    board.setAttribute("id", "board-product");
    notification.setAttribute("id", "notify-status");
    
    //Montagem do elemento:
    imagemDIV.appendChild(imagem);
    item.appendChild(id);
    item.appendChild(imagemDIV);
    item.appendChild(titulo);
    item.appendChild(preco);
    item.appendChild(board);
    item.appendChild(notification);

    return item;
}

function pricing(v) {
    let value = parseInt(v.replace(/[^\d]/g,''))/100;
    return `R$${value.toLocaleString('de-DE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}


//Sequencia lÃ³gica de funÃ§Ãµes:

//Insere a lista HTML:
async function createList() {
    var data = await fetch(`${url}${data_session()}`)
    .then(response =>{
        return response.json();
    }).catch((err) => {
        console.error(err);
    });


    if (parseInt(data.length) > 0) {
        let listado = document.querySelectorAll("ul#cart-products li#cart-product");
        if (listado.length > 0) {for(r=0; r<listado.length; r++) {listado[r].remove();}}

        for(i=0; i<data.length; i++) {
            let list = document.querySelector("ul#cart-products"), 
                items = document.querySelectorAll("ul#cart-products li#cart-product"), 
                item = createItemList(i);

            if (items.length != data.length) { list.appendChild(item) };
        };

        let id = document.querySelectorAll("#id-product"), 
            img = document.querySelectorAll("ul#cart-products li#cart-product #img img"), 
            title = document.querySelectorAll("ul#cart-products li#cart-product div#text-product"), 
            price = document.querySelectorAll("ul#cart-products li#cart-product div#price-product"), 
            board = document.querySelectorAll("ul#cart-products li#cart-product div#board-product");
        
        for(e=0; e<data.length; e++) {
            id[e].innerHTML = "<div>" + data[e].Cart.product_id + "</div>" + "<span>" + data[e].Cart.variant_id + "</span>";
            img[e].setAttribute("src", data[e].Cart.product_image.https);
            title[e].innerHTML = data[e].Cart.product_name;
            price[e].innerHTML = `<span id="qnt">${data[e].Cart.quantity}</span> X ${pricing(data[e].Cart.price)}`;
            board[e].innerHTML = `<div id="board-content"><span id="menos" onclick="removeProduct(this)" class="idx-${e}">-</span><input name="quant" class="text idx-${e}" size="1" type="text" value="${data[e].Cart.quantity}"><span id="mais" onclick="addProduct(this)" class="idx-${e}">+</span></div><div onclick="deleteProduct(this)" id="trash" class="idx-${e}"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M9 3h6v-1.75c0-.066-.026-.13-.073-.177-.047-.047-.111-.073-.177-.073h-5.5c-.066 0-.13.026-.177.073-.047.047-.073.111-.073.177v1.75zm11 1h-16v18c0 .552.448 1 1 1h14c.552 0 1-.448 1-1v-18zm-10 3.5c0-.276-.224-.5-.5-.5s-.5.224-.5.5v12c0 .276.224.5.5.5s.5-.224.5-.5v-12zm5 0c0-.276-.224-.5-.5-.5s-.5.224-.5.5v12c0 .276.224.5.5.5s.5-.224.5-.5v-12zm8-4.5v1h-2v18c0 1.105-.895 2-2 2h-14c-1.105 0-2-.895-2-2v-18h-2v-1h7v-2c0-.552.448-1 1-1h6c.552 0 1 .448 1 1v2h7z"/></svg></div>`;
        }
    }

    cartItens(data.length);
    amount()
    show_cart();
}

/* AdiÃ§Ã£o, SubtraÃ§Ã£o e RemoÃ§Ã£o de produtos: */
async function addProduct(class_index) {
    let e = class_index,
        index = parseInt(e.classList[0].replace(/[^0-9]/g,'')),
        product_id = document.querySelector(`ul#cart-products li.idx-${index} div#id-product div`).innerHTML,
        product_variant = document.querySelector(`ul#cart-products li.idx-${index} div#id-product span`).innerHTML,
        currentQnt = document.querySelector(`ul#cart-products li.idx-${index} div#board-content input`),
        productData = {
            method: "POST",
            body: '{"Cart":{"session_id":"'+data_session()+'","product_id":"'+product_id+'","quantity":"1","variant_id":"'+product_variant+'"}}',
            headers: new Headers({
                'Content-Type': 'application/json; charset=utf-8'
            })
        };

    //console.log(`ID: ${product_id} | Variant: ${product_variant}`);    

    fetch(url, productData)
    .then((response) => response.json())
        .then((data) => {
            if (statusRequest(index, data.causes) == "Successful request") {
                currentQnt.value = (parseInt(currentQnt.value) + 1);
                document.querySelector(`ul#cart-products li.idx-${index} div#price-product span#qnt`).innerHTML = parseInt(currentQnt.value);
                amount();
            };
        })
    .catch((err) => {
        //console.log(err);
    });
}

async function removeProduct(class_index) {
    let e = class_index, infos;
        fetch(`${url}${data_session()}`).then(response =>{return response.json();}).then(d =>{infos = d;});
    let index = parseInt(e.classList[0].replace(/[^0-9]/g,'')),
        product_id = document.querySelector(`ul#cart-products li.idx-${index} div#id-product div`).innerHTML,
        product_variant = document.querySelector(`ul#cart-products li.idx-${index} div#id-product span`).innerHTML,
        currentQnt = document.querySelector(`ul#cart-products li.idx-${index} div#board-content input`),
        productData = {
            method: "DELETE", 
            headers: new Headers({
                "Content-Type":"application/json; charset=utf-8"
            })
        };

    if (parseInt(currentQnt.value) > 1) {
        fetch(`/web_api/carts/${data_session()}/${product_id}/${product_variant}`, productData)
        .then((response) => response.json())
        .then((data) => {
            if (statusRequest(index, data.causes) == "Successful request") {
                productData = {
                    method: "POST",
                    body: '{"Cart":{"session_id":"'+data_session()+'","product_id":"'+product_id+'","quantity":"'+ (parseInt(currentQnt.value) - 1) +'","variant_id":"'+product_variant+'"}}',
                    headers: new Headers({
                        'Content-Type': 'application/json; charset=utf-8'
                    })
                };
                
                fetch(url, productData)
                .then((response) => response.json())
                    .then((data) => {
                        if (statusRequest(index, data.causes) == "Successful request") {
                            currentQnt.value = (parseInt(currentQnt.value) - 1);
                            document.querySelector(`ul#cart-products li.idx-${index} div#price-product span#qnt`).innerHTML = parseInt(currentQnt.value);
                            amount();
                        }
                    })
                .catch((err) => {
                    //console.log(err);
                });
            }
        })
        .catch((err) => {
            //console.log(err);
        });
    } else {
        deleteProduct(class_index);
    }
}

async function deleteProduct(class_index) {
    let e = class_index,
        index = parseInt(e.classList[0].replace(/[^0-9]/g,'')),
        product_id = document.querySelector(`ul#cart-products li.idx-${index} div#id-product div`).innerHTML,
        product_variant = document.querySelector(`ul#cart-products li.idx-${index} div#id-product span`).innerHTML,
        productData = {
            method: "DELETE", 
            headers: new Headers({
                "Content-Type":"application/json; charset=utf-8"
            })
        }

        fetch(`/web_api/carts/${data_session()}/${product_id}/${product_variant}`, productData)
        .then((response) => response.json())
            .then((data) => {
                if (statusRequest(index, data.causes) == "Successful request") {
                    document.querySelector(`ul#cart-products li.idx-${index}`).remove();
                    cartItens();
                    amount();
                }
            })
        .catch((err) => {
            //console.log(err);
        });
}


//FunÃ§Ãµes de exibiÃ§Ã£o da janle do carrinho:
function show_cart() {
    let status = document.getElementById("cart-data"), infos = document.querySelector("#cart-data .data-content");
    let janela = window.screen.width;

    if (status.style.opacity != 1) {
        status.style.display = "flex";
        setTimeout(() => {
            status.style.opacity = 1;
            status.style.zIndex = 1000;
            infos.style.marginRight = 0;
        },100);

        // setTimeout(() => { 
        //     document.querySelector("#cart-data").addEventListener('click', handleClickOutside, false);
        // }, 150);
    } else { 
        status.style.opacity = 0;
        status.style.zIndex = -7;
        if(janela > 1024) {
            infos.style.marginRight = "-30%";
        } else {
            infos.style.marginRight = "-85%";
        }
        setTimeout(() => {
            status.style.display = "none";
        },350); 
    }
}


// FunÃ§Ãµes de notificaÃ§Ã£o (Front-end):

//Verifica se recebemos a variÃ¡vel "causes", no objeto data. Se tivermos recebido, entÃ£o teremos uma falha na requisiÃ§Ã£o. Se nÃ£o, 
function statusRequest(index, message = "undefined") {
    if (message != "undefined" && message != "") {
        notify(index, message);
    } else {
        return "Successful request";
    }
};

function notify(index, message) {
    let box_notifications = document.querySelector(`ul#cart-products li.idx-${index} div#notify-status`);

    box_notifications.style.maxHeight = "90px";
    box_notifications.style.padding = "4px 5px";
    box_notifications.innerHTML = message;

    setTimeout(() => {
        box_notifications.style.maxHeight = "0px";
        box_notifications.style.padding = "0";
        box_notifications.innerHTML = "";
    },3500);
};

function cartItens(e) {
    let item = document.querySelectorAll("ul#cart-products li#cart-product").length;

    if(item < 1 || e < 1) {
        document.querySelector("div#info-message").classList = "show";
        document.querySelector(".footer-preview-cart").classList = "footer-preview-cart hide";       
    } else {
        document.querySelector("div#info-message").classList = "hide";
        document.querySelector(".footer-preview-cart").classList = "footer-preview-cart";       
    }
}

function amount() {
    let prices = [], quantidade_total = 0, valor_total = 0;

    fetch(`${url}${data_session()}`).then((response) => response.json()).then((data) => {
        if(data.length > 0) {
            prices = data;
            for(i=0; i<prices.length; i++) {
                valor_total += (parseInt(prices[i].Cart.price.replace(/[^\d]/g,'')) * parseInt(prices[i].Cart.quantity))/100;
                quantidade_total += parseInt(prices[i].Cart.quantity);
            }    
            document.querySelector("#cart-data .valor strong").innerHTML = `R$${valor_total.toLocaleString('de-DE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            document.querySelector('header [data-cart="amount"]').innerHTML = quantidade_total;
        } else {
            document.querySelector('header [data-cart="amount"]').innerHTML = "0";
        }
    }).catch((err) => {console.log(err);})
}