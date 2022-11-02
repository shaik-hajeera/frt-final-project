(function(wnd){if(wnd.minMaxify||location.href.indexOf("checkout.shopify")!=-1)
return;var mm=wnd.minMaxify={shop:'palam-silks.myshopify.com',cart:null,cartLoadTryCount:0,customer:wnd.minMaxifyCustomer,feedback:function(msg){if(path.search(/\/(account|password|\d+\/)/)==0)
return;var r=new XMLHttpRequest();r.open("POST",'https://admin.minmaxify.com/report');r.send(location.protocol+'//'+mm.shop+path+'\n'+msg);},guarded:function(f,pref){return function(){try{var r0=pref&&pref.apply(this,arguments),rv=f.apply(this,arguments);return pref?(rv||r0):rv;}
catch(ex){console.error(ex);mm.feedback("ex\n"+(ex.stack||'')+'\n'+ex.toString());}}}};var path=wnd.location.pathname;mm.guarded(function(){var $=wnd.jQuery,doc=wnd.document;var messages={"CART_UPDATE_MSG":"Limited%20to%201%20Unit%20per%20customer","CART_UPDATE_MSG2":"You%20cannot%20purchase%20more%20than%201%20unit%20of%20a%20particular%20product","GROUP_MAX_MSG":"Must have at most {{GroupMaxQuantity}} of {{GroupTitle}}.","GROUP_MIN_MSG":"Must have at least {{GroupMinQuantity}} of {{GroupTitle}}.","GROUP_MULT_MSG":"{{GroupTitle}} quantity must be a multiple of {{GroupQuantityMultiple}}.","INTRO_MSG":"Cannot%20place%20order%3A%20%0A%0A","MAX_SUBTOTAL_MSG":"Must have at most {{CartMaxAmount}} in total.","MIN_SUBTOTAL_MSG":"Must have at least {{CartMinAmount}} in total.","NOT_VALID_MSG":"Order not valid","PROD_MAX_MSG":"{{ProductName}}: Must have at most {{ProductMaxQuantity}} of this item.","PROD_MIN_MSG":"{{ProductName}}: Must have at least {{ProductMinQuantity}} of this item.","PROD_MULT_MSG":"{{ProductName}}: Quantity must be a multiple of {{ProductQuantityMultiple}}.","TOTAL_ITEMS_MAX_MSG":"Must have at most {{CartMaxQuantity}} items total.","TOTAL_ITEMS_MIN_MSG":"Must have at least {{CartMinQuantity}} items total.","TOTAL_ITEMS_MULT_MSG":"Must have a multiple of {{CartQuantityMultiple}} items total.","VERIFYING_MSG":"Verifying"};var checkoutSelector="[name='checkout'], [aria-label='Apple Pay'], [name='goto_pp'], .amazon-payments-pay-button > img, [href='/checkout'], [type=submit][value=Checkout], [onclick='window.location\\=\\'\\/checkout\\''], form[action=\\/checkout] [type=submit], .carthook_checkout, .checkout_button";var updatableCheckoutBtnSelector='[name="checkout"], .carthook_checkout';var selCartQtyAdjust='.cart-item-decrease, .cart-item-increase, .js--qty-adjuster, .js-qty__adjust, .minmaxify-quantity-button, .numberUpDown > *, .cart-item button.adjust, .cart-wrapper .quantity-selector__button';var checkoutFrames=".additional-checkout-buttons, .dynamic-checkout__content, .cart__additional_checkout, .additional_checkout_buttons, .paypal-button-context-iframe, .additional-checkout-button--apple-pay, .additional-checkout-button--google-pay";var dynamicCheckoutFrames='div.shopify-payment-button';var selMinField=".minmaxify-minfield";var selQantityField="input[name=quantity]";var selCartQtyField='input[name^="updates["], .cart__qty-input';var eXHR;var limitsJson={"minorder":"","maxorder":"","mintotalitems":"","maxtotalitems":"","multtotalitems":"","itemmin":"","itemmax":"1","itemmult":"","weightmin":"","weightmax":"","overridesubtotal":"","syncload":false,"productLimits":{"falls":{"min":"1","max":"100","multiple":"","combine":true,"name":"Falls"},"gift-wrapping":{"min":"1","max":"100","multiple":"","combine":true,"name":"Gift%20Wrapping"},"tassels":{"min":"1","max":"100","multiple":"","combine":true,"name":"Tassels"},"blouse-stitching":{"min":"1","max":"100","multiple":"","combine":true,"name":"Blouse%20stitching"}},"groupLimits":[{"field":"sku","op":"e","filter":"gift2017","title":"Gift Wrapping","combine":true,"min":1,"max":100},{"field":"product_type","op":"e","filter":"Material","title":"Material","combine":false,"min":1,"max":100}],"skus":[]};var popupCount=0;var limitsShown,isValid,qtyChanged,vstart;var originalSubmitText;var errorMessage=[];function now(){return new Date().getTime()}
function clone(o){var r={};Object.keys(o).forEach(function(k){r[k]=o[k];});return r;}
function $select(sel){var l;if(typeof sel==="string")
l=doc.querySelectorAll(sel);else if(sel.nodeType)
l=[sel];else
l=sel;return l;}
function $each(sel,func){var l=$select(sel),i;if(l&&func){for(i=0;i<l.length;++i)
func(l[i]);}
return l;}
function $first(sel,func){var l=$select(sel),f=func;if(typeof f==="string")
f=function(c){return c[func]}
if(l.length)
return f?f(l[0]):l[0];}
function $trigger(sel,event){if($)
return $(sel).trigger(event);$each(sel,function(el){el[event]();});}
function $on(sel,event,func){try{if($)
return $(sel).on(event,func);}catch(x){}
$each(sel,function(el){el.addEventListener(event,func);});}
function $create(html,parent){var r=doc.createElement('div');r.innerHTML=html;var nn=r.childNodes;if(!parent||!nn)
return nn;while(nn.length)
parent.appendChild(nn[0]);return 1;}
mm.showMessage=function(ev){var lines=errorMessage;if(isValid||!lines.length){if(limitsJson){mm.closePopup&&mm.closePopup();return true;}}
++popupCount;mm.prevented=now();if(!mm.showPopup||!mm.showPopup(lines[0],lines.slice(1)))
{var txt='';for(var i=0;i<lines.length;++i)
txt+=lines[i]+'\n';alert(txt);}
if(ev){ev.stopImmediatePropagation&&ev.stopImmediatePropagation();ev.stopPropagation&&ev.stopPropagation();ev.preventDefault&&ev.preventDefault();}
return false;}
function formatT(tag,values){var msg=unescape(messages[tag]);if(values){msg=msg.replace(/\{\{(.*?)\}\}/g,function(_,v){try{with(values)
return eval(v);}catch(x){return'"'+x.message+'"';}});}
return msg;}
function reportViolation(message,item){errorMessage.push(message);}
var css='.mfp-bg.minmaxify-popup { transition: opacity 0.3s ease-out; background: #0b0b0b; opacity: .8; z-index: 199999998;}'+
'.minmaxify-popup.mfp-wrap .mfp-content { opacity: 0; transition: all 0.3s ease-out; color: black; background-color: white; padding: 20px; padding-right:36px; max-width: 500px; margin: 20px auto; width: calc(100% - 4rem); }'+
'.minmaxify-popup .minmaxify-btn { display: inline-block; padding: 8px 20px; margin: 0; line-height: 1.42; text-decoration: none; text-align: center; vertical-align: middle; white-space: nowrap; cursor: pointer; border: 1px solid transparent; -webkit-user-select: none; user-select: none; border-radius: 2px; font-family: "Montserrat","HelveticaNeue","Helvetica Neue",sans-serif; font-weight: 400;font-size: 14px;text-transform: uppercase;transition:background-color 0.2s ease-out;background-color:#528ec1;color:#fff;}'+
'.minmaxify-popup.mfp-wrap .mfp-container { background-color: transparent !important; }'+
'.minmaxify-popup .mfp-close { margin:0px;}'+
'.minmaxify-popup ul { padding-left: 2rem; margin-bottom: 2rem; }'+
'.minmaxify-popup button { min-width:unset; }'+
'.minmaxify-popup.mfp-wrap { z-index: 199999999 !important; }'+
'.minmaxify-popup.mfp-wrap.mfp-ready .mfp-content {opacity: 1;}';function initPopups(){if(mm.showPopup)
return;if(!$){if(doc.readyState!='loading'){var jqs=doc.createElement('script');jqs.src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js";jqs.onload=mm.guarded(function(){if(wnd.jQuery){$=wnd.jQuery;initPopups();}});doc.head.appendChild(jqs);}
return;}
var curPopupText;if(!$.fn.magnificPopup){var jqver=$.fn.jquery.split(".");if(jqver[0]>1||jqver[0]==1&&jqver[1]>=7){$create('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.min.css" />',doc.head);var mps=doc.createElement('script');mps.src="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js";doc.head.appendChild(mps);}}
$('<style type="text/css">'+css+'</style>').appendTo("head");mm.showPopup=function(head,lines){if($.fn.magnificPopup){var text=head.replace(new RegExp('\n','g'),'<br/>')+'<ul>';for(var i=0;i<lines.length;++i){var ln=lines[i];if(ln)
text+='<li>'+ln+'</li>';}
text+='</ul><div><button class="minmaxify-btn" style="float:right;margin-right:-1.5em;width:auto" onclick="minMaxify.closePopup()">OK</button><div style="display:table;clear:both;"></div></div>';if(mm.popupShown()){if(curPopupText==text)
return true;$(".minmaxify-popup").magnificPopup('close');}
curPopupText=text;var mfp=$.magnificPopup;mfp.open({items:{src:'<div>'+text+'</div>',type:'inline',},focus:"nothing",mainClass:'minmaxify-popup'});$(".minmaxify-btn").click(mfp.instance.close.bind(mfp.instance));return true;}}
mm.popupShown=function(){return $select(".minmaxify-popup").length;}
mm.closePopup=function(){if($.fn.magnificPopup){$.magnificPopup.close();}};}
function formatMoney(v){return"Rs. {{amount}}".replace("{{amount}}",v);}
function getSubtotal(){var subtotal=Number(mm.cart.total_price);subtotal=subtotal/100.0;return subtotal;}
function checkSubTotal(){var subtotal=getSubtotal();var minorder=Number(limitsJson.minorder);var maxorder=Number(limitsJson.maxorder);if(subtotal<minorder){reportViolation(formatT("MIN_SUBTOTAL_MSG",{CartMinAmount:formatMoney(minorder)}));return false;}
if((maxorder>0)&&(subtotal>maxorder)){reportViolation(formatT("MAX_SUBTOTAL_MSG",{CartMaxAmount:formatMoney(maxorder)}));return false;}
return true;}
function getWeight(){var weight=Number(mm.cart.total_weight);return weight}
function checkWeight(){var weight=getWeight();var minweight=Number(limitsJson.weightmin);var maxweight=Number(limitsJson.weightmax);if(weight<minweight){reportViolation(formatT("MIN_WEIGHT_MSG",{CartWeight:weight,CartMinWeight:minweight}));return false;}
if((maxweight>0)&&(weight>maxweight)){reportViolation(formatT("MAX_WEIGHT_MSG",{CartWeight:weight,CartMaxWeight:maxweight}));return false;}
return true;}
function checkGenericLimit(title,quantity,line_price,l,refItem){var valid=true;if(quantity<Number(l.min)){valid=reportGenericViolation(refItem,title,"MIN","MinQuantity",l.min);if(refItem)
return false;}
if((Number(l.max)!=0)&&(quantity>l.max)){valid=reportGenericViolation(refItem,title,"MAX","MaxQuantity",l.max);if(refItem)
return false;}
if((Number(l.multiple)>1)&&(quantity%Number(l.multiple)>0)){valid=reportGenericViolation(refItem,title,"MULT","QuantityMultiple",l.multiple);if(refItem)
return false;}
var prc=Number(line_price)/100.0;if(prc<Number(l.minAmt||0)){valid=reportGenericViolation(refItem,title,"MIN_SUBTOTAL","MinAmount",formatMoney(l.minAmt));if(refItem)
return false;}
if((Number(l.maxAmt||0)!=0)&&(prc>l.maxAmt)){valid=reportGenericViolation(refItem,title,"MAX_SUBTOTAL","MaxAmount",formatMoney(l.maxAmt));if(refItem)
return false;}
return valid;}
function reportGenericViolation(refItem,title,msgName,fldName,fldVal){var p={};if(refItem){p.ProductName=title;p.item=refItem;p["Product"+fldName]=fldVal;msgName="PROD_"+msgName+"_MSG";}else{p.GroupTitle=title;p["Group"+fldName]=fldVal;msgName="GROUP_"+msgName+"_MSG";}
var msg=formatT(msgName,p);reportViolation(msg,refItem);return false;}
function collectProductQuantities(){var items=mm.cart.items||[];var products={};for(var i=0;i<items.length;i++){var item=items[i],handle=item.handle,prodLimit=limitsJson.productLimits[handle]||{},key,title;if(getSkuFilter(item.sku)||!prodLimit.combine){key=handle+" "+(item.sku||item.variant_id);title=item.title;}else{key=handle;title=prodLimit.name||item.title;}
var l=products[key];if(l===undefined){l=products[key]=clone(item);l.title=unescape(title);}else{l.quantity+=Number(item.quantity);l.line_price+=Number(item.line_price);}}
return products;}
function getSkuFilter(sku){if(sku){var l=limitsJson.productLimits['sku:'+sku];if(l)
return l;}}
function checkItemLimits(){var itemsValid=true;var products=collectProductQuantities();for(var h in products){var item=products[h];if(!checkGenericLimit(item.title,item.quantity,item.line_price,getItemLimit(item),item))
itemsValid=false;}
return itemsValid;}
function getItemLimit(item){var handle=item.handle||'',variant=item.sku,ll=limitsJson;var index=handle.indexOf(" ");if(index>0){variant=handle.substring(index+1);handle=handle.substring(0,index);}
var l=getSkuFilter(variant);if(!l)
l=ll.productLimits[handle];if(!l)
l=getIndividualGroupLimits(item,handle);if(!l)
l={min:Number(ll.itemmin),max:Number(ll.itemmax),multiple:Number(ll.itemmult)};return l;}
function calcItemLimit(item,h){var l=getItemLimit(item);l={max:parseInt(l.max)||0,multiple:parseInt(l.multiple)||1,min:parseInt(l.min),combine:l.combine};if(!l.min)
l.min=l.multiple;var gmax=Number(limitsJson.maxtotalitems)||0;if(!l.max||gmax&&gmax<l.max)
l.max=gmax;var groups=limitsJson.groupLimits;for(var i=0;i<groups.length;++i){var g=groups[i];if(g.combine==true&&checkGroup(item,g,h)){if(!l.max||parseInt(g.max)&&g.max<l.max)
l.max=g.max;}}
return l;}
mm.getLimitsFor=calcItemLimit;function checkTotalItems(){var maxtotalitems=Number(limitsJson.maxtotalitems);var mintotalitems=Number(limitsJson.mintotalitems);var multtotalitems=Number(limitsJson.multtotalitems);var totalItems=0;var totalItemsValid=true;var items=mm.cart.items||[];for(var i=0;i<items.length;i++){var item=items[i];var quantity=Number(item['quantity']);totalItems+=quantity;}
if((maxtotalitems!=0)&&(totalItems>maxtotalitems)){totalItemsValid=false;reportViolation(formatT("TOTAL_ITEMS_MAX_MSG",{CartMaxQuantity:maxtotalitems}));}
if(totalItems<mintotalitems){totalItemsValid=false;reportViolation(formatT("TOTAL_ITEMS_MIN_MSG",{CartMinQuantity:mintotalitems}));}
if((multtotalitems>1)&&(totalItems%multtotalitems>0)){totalItemsValid=false;reportViolation(formatT("TOTAL_ITEMS_MULT_MSG",{CartQuantityMultiple:multtotalitems}));}
return totalItemsValid;}
var filterOps={c:function(value,search){return value&&String(value).indexOf(search)>-1;},nc:function(value,search){return value&&String(value).indexOf(search)==-1;},e:function(value,search){return value==search;},g:function(value,search){return value>search;},l:function(value,search){return value<search;},ne:function(value,search){return value!=search;},be:function(value,search){return value>search[0]&&value<search[1];},oo:function(value,search){if(value){if(!(value instanceof Array))
value=[value];for(var j=0;j<value.length;++j){for(var i=0;i<search.length;++i)
if(value[j]==search[i])
return 1;}}},no:function(value,search){if(!(value instanceof Array))
value=[value];for(var j=0;j<value.length;++j){for(var i=0;i<search.length;++i)
if(value[j]==search[i])
return 0;}
return 1;}};function getIndividualGroupLimits(item,handle){var groups=limitsJson.groupLimits;for(var i=0;i<groups.length;++i){var g=groups[i];if(g.combine==true)
continue;if(checkGroup(item,g,handle))
return g;}
return null;}
function checkGroup(item,g,h){var v=item[g.field],f=g.field,op=g.op,s=g.filter;if(f=='ctags'){v=(mm.customer||{}).tags||[];if(op=='e'){op='oo';s=[s];}else if(op=='ne'){op='no';s=[s];}}else if(f=='price')
v=v/100.0;else if(f=='handle'&&h!==undefined)
v=h;return filterOps[op](v,s);}
function checkGroupLimits(){var groupTotals=[];var groupsValid=true;var groups=limitsJson.groupLimits;for(var i=0;i<groups.length;++i){var g=groups[i];if(g.combine==true){var quantity=0;var price=0;var items=mm.cart.items||[];for(var j=0;j<items.length;++j){var item=items[j];if(checkGroup(item,g)){quantity+=item.quantity;price+=item.line_price;}}
if(quantity==0)
continue;if(!checkGenericLimit(unescape(g.title),quantity,price,g))
groupsValid=false;}}
return groupsValid;}
function checkOverride(){var subtotal=getSubtotal();var overridesubtotal=Number(limitsJson.overridesubtotal);if((overridesubtotal>0)&&(subtotal>overridesubtotal)){return true;}
return false;}
mm.checkLimits=function(){var enable=true;if(!checkOverride()){enable=checkSubTotal();enable=checkItemLimits()&&enable;enable=checkGroupLimits()&&enable;enable=checkTotalItems()&&enable;enable=checkWeight()&&enable;}
return enable;}
function showLimits(){try{if(!limitsJson)
return;showLimitsInCart();if(path.indexOf('/products/')!=-1)
$each(dynamicCheckoutFrames,function(el){el.style.display="none"});if(location.pathname!=path){path=location.pathname;limitsShown=false;}
if(limitsShown)
return;var ci=getContextItem();if(!ci)
return;var l=calcItemLimit(ci),inp=$first(selQantityField);if(!inp)
return;function attr(name,val){if(arguments.length<2)
return inp.getAttribute(name);if(val==null)
inp.removeAttribute(name);else
inp.setAttribute(name,val);}
var ima=attr('mm-max'),lma=l.max||undefined,imu=attr('mm-step'),lmu=l.multiple,imi=attr('mm-min'),lmi=l.min,val=parseInt(inp.value);if(doc.readyState!='loading')
limitsShown=true;if(lmi!=imi){if(lmi>1||imi)
$&&$('.minmaxify-min').text(lmi).parent().show();if(imi?(val==imi):(val==1||!val)){$each(selMinField,function(el){el.value=lmi});inp.value=lmi;}
if(!l.combine&&lmi>1)
attr('min',lmi);else if(imi)
attr('min',null);attr('mm-min',lmi);}
if(lma!=ima){$&&$('.minmaxify-max').text(lma).parent().show();$each('.minmaxify-maxfield',function(el){el.value=lma});if(lma)
attr('max',lma);else if(ima)
attr('max',null);attr('mm-max',lma);}
if(lmu!=imu){if(lmu>1||imu)
$&&$('.minmaxify-multiple').text(lmu).parent().show();$each('.minmaxify-multfield',function(el){el.value=lmu});if(!l.combine)
attr('step',lmu);else if(imu)
attr('step',null);attr('mm-step',lmu);}}catch(x){console.error(x);}}
function showLimitsInCart(){var lines=mm.cart&&mm.cart.items;if(!lines)
return;$each(selCartQtyField,function(c){for(var i=0;i<lines.length;++i){var p=lines[i];if(p.key==c.getAttribute('data-line-id')||c.id&&c.id.search(new RegExp('updates(_large)?_'+p.id,'i'))==0){var l=calcItemLimit(p);if(l.min>1&&!l.combine)
c.min=l.min;if(l.max)
c.max=l.max;if(l.multiple&&!l.combine)
c.step=l.multiple;break;}}});}
function getContextItem(url){var h=$first('#minmaxify-product','textContent');if(!h){if(!url){try{url=decodeURIComponent(path||location.href||'')}
catch(x){url=''}}
url=url.split('/');if(url.length>2&&url[url.length-2]=='products')
h=url[url.length-1];else
return;}
var itm={handle:h,sku:''},p;try{p=JSON.parse($first('#ProductJson-product-template','textContent')
);}
catch(x){}
var meta=(wnd.ShopifyAnalytics||{}).meta;if(!p&&meta)
p=meta.product;if(p){itm.product_description=p.description;itm.product_type=p.type;itm.vendor=p.vendor;itm.price=p.price;itm.product_title=p.title;var vars=p.variants,nvars=vars.length;if(meta&&meta.selectedVariantId||nvars==1){for(var i=0;i<nvars;++i){var v=vars[i];if(nvars==1||v.id==meta.selectedVariantId){itm.variant_title=v.public_title;itm.sku=v.sku;itm.grams=v.weight;if(!itm.product_title)
itm.product_title=v.name;break;}}}}
return itm;}
function setCheckoutMsg(t,addClass,remClass){$first
(updatableCheckoutBtnSelector,function(c){c.value=t;var cl=c.classList;if(cl&&addClass)
cl.add(addClass);if(cl&&remClass)
cl.remove(remClass);});}
function reportVerifyingProgress(progress){if(progress=='start'){setCheckoutMsg(formatT("VERIFYING_MSG"),'btn--loading');if(!vstart){vstart=now();setTimeout(function(){if(vstart&&(now()-vstart)>19900){if(isCartPage())
mm.feedback("sv\n"+JSON.stringify(mm.cart));isValid=true;reportVerifyingProgress('stop');}},20000);}}
else if(progress=='stop'){setCheckoutMsg(isValid?originalSubmitText:formatT("NOT_VALID_MSG"),0,'btn--loading');vstart=0;if(mm.popupShown&&mm.popupShown())
mm.showMessage();}
else if(progress=='changed'){setCheckoutMsg(formatT("CART_UPDATE_MSG"));}
toggleCheckoutButtons();}
function toggleCheckoutButtons(){$each(checkoutFrames,function(c){var s=c.style;if(isValid){if(c.mm_hidden){s.display=c.mm_hidden;c.mm_hidden=false;}}else{if(s.display!='none'){c.mm_hidden=s.display||'block';s.display='none';}}});$each(checkoutSelector,function(c){if(isValid){if(c.mm_disabled)
c.mm_disabled=c.disabled=false;}else{if(!c.disabled)
c.mm_disabled=c.disabled=true;}});}
mm.onChange=mm.guarded(function(){reportVerifyingProgress('changed');isValid=false;errorMessage=[formatT("CART_UPDATE_MSG2")];toggleCheckoutButtons();});function hookCheckoutBtn(){bindOnce(checkoutSelector,'mousedown',mm.showMessage,true);if(!originalSubmitText){$each(updatableCheckoutBtnSelector,function(b){originalSubmitText=originalSubmitText||b.value||(b.innerText||b.textContent||'').trim();});}
return bindOnce(checkoutSelector,'click',mm.showMessage,true).length;}
function bindOnce(sel,event,f,blockNojQ){return $each(sel,function(c){if(!c['mmBound_'+event]){c['mmBound_'+event]=true;var nojQhandler=c['on'+event];if(!nojQhandler||!blockNojQ)
$on(c,event,mm.guarded(f));else{c['on'+event]=mm.guarded(function(e){if(f())
nojQhandler.apply(this,arguments);else
e.preventDefault();});}}});}
function hookQtyChangers(){bindOnce(selCartQtyField,'keydown',mm.onChange);bindOnce(selCartQtyField,'change',mm.onChange);bindOnce(selCartQtyAdjust,'click',mm.onChange);}
function updateVerificationState(forcePopup){if(!hookPageComponents()&&!forcePopup&&!mm.cart)
return;isValid=false;reportVerifyingProgress('start');if(mm.cart==null)
mm.cart=(wnd.Shopify||{}).cart||null;if(mm.cart==null)
reloadCart();else if(limitsJson){errorMessage=[formatT("INTRO_MSG")];isValid=mm.checkLimits();reportVerifyingProgress('stop');if(forcePopup)
mm.showMessage();if(!popupCount&&isCartPage())
setTimeout(mm.showMessage,100)
}}
function isCartPage(){return path.indexOf('/cart')==0;}
wnd.getLimits=updateVerificationState;wnd.mmIsEnabled=function(){return isValid};mm.handleCartUpdate=function(cart,upType,ignoreEmpty){if(typeof cart=="string")
cart=JSON.parse(cart);if(upType=='get'&&JSON.stringify(mm.cart)==JSON.stringify(cart)){if(!isValid){hookPageComponents();return 1;}}else{if(upType!='add'){if(ignoreEmpty&&!cart.item_count&&mm.cart)
return;mm.cart=cart;}else{var item=cart;cart=mm.cart;if(!cart)
cart=mm.cart={total_price:0,total_weight:0,items:[],item_count:0};for(var i=cart.items.length-1;i>=-1;--i){if(i>=0){var prev=cart.items[i];if(prev.id!=item.id)
continue;cart.total_price-=prev.line_price;cart.total_weight-=prev.grams;cart.item_count-=prev.quantity;cart.items.splice(i,1);}
cart.total_price+=item.line_price;cart.total_weight+=item.grams;cart.item_count+=item.quantity;cart.items.push(item);break;}}
qtyChanged=false;updateVerificationState();return 1;}}
function hookPageComponents(){showLimits();var f=hookCheckoutBtn();if(f){hookQtyChangers();toggleCheckoutButtons();}
return f;}
function handleCartXHR(xhr,url,method,ignoreEmpty){if(xhr.readyState==4&&xhr.status==200&&url){var t,f;try{t=xhr.responseText||'';if(url.search(/\/cart(\/update|\/change|)\.js/)==0){if(url.indexOf("callback=")!=-1)
t=t.substring(t.indexOf('{'),t.length-1);f=mm.handleCartUpdate(t,(url.indexOf('cart.js')!=-1)?'get':'update',ignoreEmpty);}else if(url.indexOf("/cart/add.js")!=-1){f=mm.handleCartUpdate(t,'add',ignoreEmpty);}else if(method=="GET"&&(!isCartPage()||url=='/cart')){updateVerificationState();f=1;}
if(eXHR)
f=eXHR(url,xhr)||f;}catch(ex){if(!t||ex.toString().indexOf('SyntaxError')==0)
return;console.error(ex);mm.feedback("ex\n"+(ex.stack||'')+'\n'+ex.toString()+'\n'+url);}
if(f)
followupCartChange(url,xhr);}}
function followupCartChange(){for(var t=200;t<=5000;t+=100)
setTimeout(hookPageComponents,t);}
function reloadCart(){var r=new XMLHttpRequest();r.open('GET','/cart.js?_='+now());r.mmUrl=null;r.onreadystatechange=function(){handleCartXHR(r,'/cart.js');};r.send();setTimeout(function(){if(mm.cart==null&&mm.cartLoadTryCount++<60)
reloadCart();},5000);}
var xhrCls=wnd.XMLHttpRequest.prototype;var xhrOpen=xhrCls.open,xhrSend=xhrCls.send;function hookXHR(){xhrCls.open=function(method,url,async,user,password){this.mmUrl=url;this.mmMethod=method;return xhrOpen.apply(this,arguments);}
xhrCls.send=function(){var r=this;if(r.addEventListener)
r.addEventListener("readystatechange",function(e){handleCartXHR(r,r.mmUrl,r.mmMethod);});else
r.onreadystatechange=mm.guarded(function(){handleCartXHR(r,r.mmUrl)},r.onreadystatechange);return xhrSend.apply(r,arguments);}
var wndFetch=wnd.fetch;if(wndFetch){wnd.fetch=function(url){var p=wndFetch.apply(this,arguments);url=(url||{}).url||url||"";if(url.indexOf("/cart")==0)
p=p.then(function(r){try{r.ok&&r.clone().text().then(mm.guarded(function(t){r.readyState=4;r.responseText=t;handleCartXHR(r,url,'POST',true);}));}catch(ex){}
return r;});return p;}}}
function hookUI(){if(!$)
$=wnd.jQuery;hookCheckoutBtn();if(doc.getElementById('minmaxify_disable'))
return;var s=(wnd.Shopify||{}).shop||location.host;if(s!=mm.shop)
return mm.feedback('ws\n'+s);errorMessage=[formatT("INTRO_MSG")];bindOnce('.js-drawer-open-right','click',function(){setTimeout(updateVerificationState,500);});initPopups();updateVerificationState();if(!mm.initialized)
mm.initialized=now();if(isCartPage()){var tm=(wnd.performance||{}).timing;if(tm&&tm.domComplete){tm=mm.initialized-tm.domComplete;if(tm>3500){mm.feedback("sl\n"+tm);}}}
var trlib=(wnd.ShopifyAnalytics||{}).lib||wnd.trekkie||{};var tTrack=trlib.track;if(tTrack&&!tTrack.minMaxify){trlib.track=function(e){if(e=='Viewed Product Variant'){limitsShown=0;setTimeout(showLimits,0);}
return tTrack.apply(this,arguments);}
trlib.track.minMaxify=1;if(trlib.ready)
trlib.ready=mm.guarded(hookUI,trlib.ready);}}
if(doc.getElementById('minmaxify_disable'))
return;hookXHR();doc.addEventListener("DOMContentLoaded",mm.guarded(hookUI));hookUI();wnd.addEventListener("beforeunload",function(){if(mm.prevented&&mm.cart&&mm.cart.items.length&&(now()-mm.prevented)<40)
mm.feedback("lb");});})();})(window);