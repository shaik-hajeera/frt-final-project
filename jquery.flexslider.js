(function(i){var O=!0;i.flexslider=function(l,w){var e=i(l);e.vars=i.extend({},i.flexslider.defaults,w);var s=e.vars.namespace,P=window.navigator&&window.navigator.msPointerEnabled&&window.MSGesture,k=("ontouchstart"in window||P||window.DocumentTouch&&document instanceof DocumentTouch)&&e.vars.touch,W="click touchend MSPointerUp keyup",f="",H,p=e.vars.direction==="vertical",d=e.vars.reverse,u=e.vars.itemWidth>0,S=e.vars.animation==="fade",M=e.vars.asNavFor!=="",r={};i.data(l,"flexslider",e),r={init:function(){e.animating=!1,e.currentSlide=parseInt(e.vars.startAt?e.vars.startAt:0,10),isNaN(e.currentSlide)&&(e.currentSlide=0),e.animatingTo=e.currentSlide,e.atEnd=e.currentSlide===0||e.currentSlide===e.last,e.containerSelector=e.vars.selector.substr(0,e.vars.selector.search(" ")),e.slides=i(e.vars.selector,e),e.container=i(e.containerSelector,e),e.count=e.slides.length,e.syncExists=i(e.vars.sync).length>0,e.vars.animation==="slide"&&(e.vars.animation="swing"),e.prop=p?"top":"marginLeft",e.args={},e.manualPause=!1,e.stopped=!1,e.started=!1,e.startTimeout=null,e.transitions=!e.vars.video&&!S&&e.vars.useCSS&&function(){var t=document.createElement("div"),a=["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var n in a)if(t.style[a[n]]!==void 0)return e.pfx=a[n].replace("Perspective","").toLowerCase(),e.prop="-"+e.pfx+"-transform",!0;return!1}(),e.ensureAnimationEnd="",e.vars.controlsContainer!==""&&(e.controlsContainer=i(e.vars.controlsContainer).length>0&&i(e.vars.controlsContainer)),e.vars.manualControls!==""&&(e.manualControls=i(e.vars.manualControls).length>0&&i(e.vars.manualControls)),e.vars.customDirectionNav!==""&&(e.customDirectionNav=i(e.vars.customDirectionNav).length===2&&i(e.vars.customDirectionNav)),e.vars.randomize&&(e.slides.sort(function(){return Math.round(Math.random())-.5}),e.container.empty().append(e.slides)),e.doMath(),e.setup("init"),e.vars.controlNav&&r.controlNav.setup(),e.vars.directionNav&&r.directionNav.setup(),e.vars.keyboard&&(i(e.containerSelector).length===1||e.vars.multipleKeyboard)&&i(document).bind("keyup",function(t){var a=t.keyCode;if(!e.animating&&(a===39||a===37)){var n=a===39?e.getTarget("next"):a===37?e.getTarget("prev"):!1;e.flexAnimate(n,e.vars.pauseOnAction)}}),e.vars.mousewheel&&e.bind("mousewheel",function(t,a,n,o){t.preventDefault();var c=a<0?e.getTarget("next"):e.getTarget("prev");e.flexAnimate(c,e.vars.pauseOnAction)}),e.vars.pausePlay&&r.pausePlay.setup(),e.vars.slideshow&&e.vars.pauseInvisible&&r.pauseInvisible.init(),e.vars.slideshow&&(e.vars.pauseOnHover&&e.hover(function(){!e.manualPlay&&!e.manualPause&&e.pause()},function(){!e.manualPause&&!e.manualPlay&&!e.stopped&&e.play()}),(!e.vars.pauseInvisible||!r.pauseInvisible.isHidden())&&(e.vars.initDelay>0?e.startTimeout=setTimeout(e.play,e.vars.initDelay):e.play())),M&&r.asNav.setup(),k&&e.vars.touch&&r.touch(),(!S||S&&e.vars.smoothHeight)&&i(window).bind("resize orientationchange focus",r.resize),e.find("img").attr("draggable","false"),setTimeout(function(){e.vars.start(e)},200)},asNav:{setup:function(){e.asNav=!0,e.animatingTo=Math.floor(e.currentSlide/e.move),e.currentItem=e.currentSlide,e.slides.removeClass(s+"active-slide").eq(e.currentItem).addClass(s+"active-slide"),P?(l._slider=e,e.slides.each(function(){var t=this;t._gesture=new MSGesture,t._gesture.target=t,t.addEventListener("MSPointerDown",function(a){a.preventDefault(),a.currentTarget._gesture&&a.currentTarget._gesture.addPointer(a.pointerId)},!1),t.addEventListener("MSGestureTap",function(a){a.preventDefault();var n=i(this),o=n.index();!i(e.vars.asNavFor).data("flexslider").animating&&!n.hasClass("active")&&(e.direction=e.currentItem<o?"next":"prev",e.flexAnimate(o,e.vars.pauseOnAction,!1,!0,!0))})})):e.slides.on(W,function(t){t.preventDefault();var a=i(this),n=a.index(),o=a.offset().left-i(e).scrollLeft();o<=0&&a.hasClass(s+"active-slide")?e.flexAnimate(e.getTarget("prev"),!0):!i(e.vars.asNavFor).data("flexslider").animating&&!a.hasClass(s+"active-slide")&&(e.direction=e.currentItem<n?"next":"prev",e.flexAnimate(n,e.vars.pauseOnAction,!1,!0,!0))})}},controlNav:{setup:function(){e.manualControls?r.controlNav.setupManual():r.controlNav.setupPaging()},setupPaging:function(){var t=e.vars.controlNav==="thumbnails"?"control-thumbs":"control-paging",a=1,n,o;if(e.controlNavScaffold=i('<ol class="'+s+"control-nav "+s+t+'"></ol>'),e.pagingCount>1)for(var c=0;c<e.pagingCount;c++){o=e.slides.eq(c),o.attr("data-thumb-alt")===void 0&&o.attr("data-thumb-alt","");var h=o.attr("data-thumb-alt")!==""?h=' alt="'+o.attr("data-thumb-alt")+'"':"";if(n=e.vars.controlNav==="thumbnails"?'<img src="'+o.attr("data-thumb")+'"'+h+"/>":'<a href="#">'+a+"</a>",e.vars.controlNav==="thumbnails"&&e.vars.thumbCaptions===!0){var m=o.attr("data-thumbcaption");m!==""&&m!==void 0&&(n+='<span class="'+s+'caption">'+m+"</span>")}e.controlNavScaffold.append("<li>"+n+"</li>"),a++}e.controlsContainer?i(e.controlsContainer).append(e.controlNavScaffold):e.append(e.controlNavScaffold),r.controlNav.set(),r.controlNav.active(),e.controlNavScaffold.delegate("a, img",W,function(C){if(C.preventDefault(),f===""||f===C.type){var x=i(this),y=e.controlNav.index(x);x.hasClass(s+"active")||(e.direction=y>e.currentSlide?"next":"prev",e.flexAnimate(y,e.vars.pauseOnAction))}f===""&&(f=C.type),r.setToClearWatchedEvent()})},setupManual:function(){e.controlNav=e.manualControls,r.controlNav.active(),e.controlNav.bind(W,function(t){if(t.preventDefault(),f===""||f===t.type){var a=i(this),n=e.controlNav.index(a);a.hasClass(s+"active")||(n>e.currentSlide?e.direction="next":e.direction="prev",e.flexAnimate(n,e.vars.pauseOnAction))}f===""&&(f=t.type),r.setToClearWatchedEvent()})},set:function(){var t=e.vars.controlNav==="thumbnails"?"img":"a";e.controlNav=i("."+s+"control-nav li "+t,e.controlsContainer?e.controlsContainer:e)},active:function(){e.controlNav.removeClass(s+"active").eq(e.animatingTo).addClass(s+"active")},update:function(t,a){e.pagingCount>1&&t==="add"?e.controlNavScaffold.append(i('<li><a href="#">'+e.count+"</a></li>")):e.pagingCount===1?e.controlNavScaffold.find("li").remove():e.controlNav.eq(a).closest("li").remove(),r.controlNav.set(),e.pagingCount>1&&e.pagingCount!==e.controlNav.length?e.update(a,t):r.controlNav.active()}},directionNav:{setup:function(){var t=i('<ul class="'+s+'direction-nav"><li class="'+s+'nav-prev"><a class="'+s+'prev" href="#">'+e.vars.prevText+'</a></li><li class="'+s+'nav-next"><a class="'+s+'next" href="#">'+e.vars.nextText+"</a></li></ul>");e.customDirectionNav?e.directionNav=e.customDirectionNav:e.controlsContainer?(i(e.controlsContainer).append(t),e.directionNav=i("."+s+"direction-nav li a",e.controlsContainer)):(e.append(t),e.directionNav=i("."+s+"direction-nav li a",e)),r.directionNav.update(),e.directionNav.bind(W,function(a){a.preventDefault();var n;(f===""||f===a.type)&&(n=i(this).hasClass(s+"next")?e.getTarget("next"):e.getTarget("prev"),e.flexAnimate(n,e.vars.pauseOnAction)),f===""&&(f=a.type),r.setToClearWatchedEvent()})},update:function(){var t=s+"disabled";e.pagingCount===1?e.directionNav.addClass(t).attr("tabindex","-1"):e.vars.animationLoop?e.directionNav.removeClass(t).removeAttr("tabindex"):e.animatingTo===0?e.directionNav.removeClass(t).filter("."+s+"prev").addClass(t).attr("tabindex","-1"):e.animatingTo===e.last?e.directionNav.removeClass(t).filter("."+s+"next").addClass(t).attr("tabindex","-1"):e.directionNav.removeClass(t).removeAttr("tabindex")}},pausePlay:{setup:function(){var t=i('<div class="'+s+'pauseplay"><a href="#"></a></div>');e.controlsContainer?(e.controlsContainer.append(t),e.pausePlay=i("."+s+"pauseplay a",e.controlsContainer)):(e.append(t),e.pausePlay=i("."+s+"pauseplay a",e)),r.pausePlay.update(e.vars.slideshow?s+"pause":s+"play"),e.pausePlay.bind(W,function(a){a.preventDefault(),(f===""||f===a.type)&&(i(this).hasClass(s+"pause")?(e.manualPause=!0,e.manualPlay=!1,e.pause()):(e.manualPause=!1,e.manualPlay=!0,e.play())),f===""&&(f=a.type),r.setToClearWatchedEvent()})},update:function(t){t==="play"?e.pausePlay.removeClass(s+"pause").addClass(s+"play").html(e.vars.playText):e.pausePlay.removeClass(s+"play").addClass(s+"pause").html(e.vars.pauseText)}},touch:function(){var t,a,n,o,c,h,m,C,x,y=!1,A=0,I=0,T=0;if(!P)m=function(b){e.animating?b.preventDefault():(window.navigator.msPointerEnabled||b.touches.length===1)&&(e.pause(),o=p?e.h:e.w,h=Number(new Date),A=b.touches[0].pageX,I=b.touches[0].pageY,n=u&&d&&e.animatingTo===e.last?0:u&&d?e.limit-(e.itemW+e.vars.itemMargin)*e.move*e.animatingTo:u&&e.currentSlide===e.last?e.limit:u?(e.itemW+e.vars.itemMargin)*e.move*e.currentSlide:d?(e.last-e.currentSlide+e.cloneOffset)*o:(e.currentSlide+e.cloneOffset)*o,t=p?I:A,a=p?A:I,l.addEventListener("touchmove",C,!1),l.addEventListener("touchend",x,!1))},C=function(b){A=b.touches[0].pageX,I=b.touches[0].pageY,c=p?t-I:t-A,y=p?Math.abs(c)<Math.abs(A-a):Math.abs(c)<Math.abs(I-a);var N=500;(!y||Number(new Date)-h>N)&&(b.preventDefault(),!S&&e.transitions&&(e.vars.animationLoop||(c=c/(e.currentSlide===0&&c<0||e.currentSlide===e.last&&c>0?Math.abs(c)/o+2:1)),e.setProps(n+c,"setTouch")))},x=function(b){if(l.removeEventListener("touchmove",C,!1),e.animatingTo===e.currentSlide&&!y&&c!==null){var N=d?-c:c,D=N>0?e.getTarget("next"):e.getTarget("prev");e.canAdvance(D)&&(Number(new Date)-h<550&&Math.abs(N)>50||Math.abs(N)>o/2)?e.flexAnimate(D,e.vars.pauseOnAction):S||e.flexAnimate(e.currentSlide,e.vars.pauseOnAction,!0)}l.removeEventListener("touchend",x,!1),t=null,a=null,c=null,n=null},l.addEventListener("touchstart",m,!1);else{var b=function(g){g.stopPropagation(),e.animating?g.preventDefault():(e.pause(),l._gesture.addPointer(g.pointerId),T=0,o=p?e.h:e.w,h=Number(new Date),n=u&&d&&e.animatingTo===e.last?0:u&&d?e.limit-(e.itemW+e.vars.itemMargin)*e.move*e.animatingTo:u&&e.currentSlide===e.last?e.limit:u?(e.itemW+e.vars.itemMargin)*e.move*e.currentSlide:d?(e.last-e.currentSlide+e.cloneOffset)*o:(e.currentSlide+e.cloneOffset)*o)},N=function(g){g.stopPropagation();var v=g.target._slider;if(!!v){var E=-g.translationX,L=-g.translationY;if(T=T+(p?L:E),c=T,y=p?Math.abs(T)<Math.abs(-E):Math.abs(T)<Math.abs(-L),g.detail===g.MSGESTURE_FLAG_INERTIA){setImmediate(function(){l._gesture.stop()});return}(!y||Number(new Date)-h>500)&&(g.preventDefault(),!S&&v.transitions&&(v.vars.animationLoop||(c=T/(v.currentSlide===0&&T<0||v.currentSlide===v.last&&T>0?Math.abs(T)/o+2:1)),v.setProps(n+c,"setTouch")))}},D=function(g){g.stopPropagation();var v=g.target._slider;if(!!v){if(v.animatingTo===v.currentSlide&&!y&&c!==null){var E=d?-c:c,L=E>0?v.getTarget("next"):v.getTarget("prev");v.canAdvance(L)&&(Number(new Date)-h<550&&Math.abs(E)>50||Math.abs(E)>o/2)?v.flexAnimate(L,v.vars.pauseOnAction):S||v.flexAnimate(v.currentSlide,v.vars.pauseOnAction,!0)}t=null,a=null,c=null,n=null,T=0}},q=b,z=N,_=D;l.style.msTouchAction="none",l._gesture=new MSGesture,l._gesture.target=l,l.addEventListener("MSPointerDown",b,!1),l._slider=e,l.addEventListener("MSGestureChange",N,!1),l.addEventListener("MSGestureEnd",D,!1)}},resize:function(){!e.animating&&e.is(":visible")&&(u||e.doMath(),S?r.smoothHeight():u?(e.slides.width(e.computedW),e.update(e.pagingCount),e.setProps()):p?(e.viewport.height(e.h),e.setProps(e.h,"setTotal")):(e.vars.smoothHeight&&r.smoothHeight(),e.newSlides.width(e.computedW),e.setProps(e.computedW,"setTotal")))},smoothHeight:function(t){if(!p||S){var a=S?e:e.viewport;t?a.animate({height:e.slides.eq(e.animatingTo).innerHeight()},t):a.innerHeight(e.slides.eq(e.animatingTo).innerHeight())}},sync:function(t){var a=i(e.vars.sync).data("flexslider"),n=e.animatingTo;switch(t){case"animate":a.flexAnimate(n,e.vars.pauseOnAction,!1,!0);break;case"play":!a.playing&&!a.asNav&&a.play();break;case"pause":a.pause();break}},uniqueID:function(t){return t.filter("[id]").add(t.find("[id]")).each(function(){var a=i(this);a.attr("id",a.attr("id")+"_clone")}),t},pauseInvisible:{visProp:null,init:function(){var t=r.pauseInvisible.getHiddenProp();if(t){var a=t.replace(/[H|h]idden/,"")+"visibilitychange";document.addEventListener(a,function(){r.pauseInvisible.isHidden()?e.startTimeout?clearTimeout(e.startTimeout):e.pause():e.started?e.play():e.vars.initDelay>0?setTimeout(e.play,e.vars.initDelay):e.play()})}},isHidden:function(){var t=r.pauseInvisible.getHiddenProp();return t?document[t]:!1},getHiddenProp:function(){var t=["webkit","moz","ms","o"];if("hidden"in document)return"hidden";for(var a=0;a<t.length;a++)if(t[a]+"Hidden"in document)return t[a]+"Hidden";return null}},setToClearWatchedEvent:function(){clearTimeout(H),H=setTimeout(function(){f=""},3e3)}},e.flexAnimate=function(t,a,n,o,c){if(!e.vars.animationLoop&&t!==e.currentSlide&&(e.direction=t>e.currentSlide?"next":"prev"),M&&e.pagingCount===1&&(e.direction=e.currentItem<t?"next":"prev"),!e.animating&&(e.canAdvance(t,c)||n)&&e.is(":visible")){if(M&&o){var h=i(e.vars.asNavFor).data("flexslider");if(e.atEnd=t===0||t===e.count-1,h.flexAnimate(t,!0,!1,!0,c),e.direction=e.currentItem<t?"next":"prev",h.direction=e.direction,Math.ceil((t+1)/e.visible)-1!==e.currentSlide&&t!==0)e.currentItem=t,e.slides.removeClass(s+"active-slide").eq(t).addClass(s+"active-slide"),t=Math.floor(t/e.visible);else return e.currentItem=t,e.slides.removeClass(s+"active-slide").eq(t).addClass(s+"active-slide"),!1}if(e.animating=!0,e.animatingTo=t,a&&e.pause(),e.vars.before(e),e.syncExists&&!c&&r.sync("animate"),e.vars.controlNav&&r.controlNav.active(),u||e.slides.removeClass(s+"active-slide").eq(t).addClass(s+"active-slide"),e.atEnd=t===0||t===e.last,e.vars.directionNav&&r.directionNav.update(),t===e.last&&(e.vars.end(e),e.vars.animationLoop||e.pause()),S)k?(e.slides.eq(e.currentSlide).css({opacity:0,zIndex:1}),e.slides.eq(t).css({opacity:1,zIndex:2}),e.wrapup(m)):(e.slides.eq(e.currentSlide).css({zIndex:1}).animate({opacity:0},e.vars.animationSpeed,e.vars.easing),e.slides.eq(t).css({zIndex:2}).animate({opacity:1},e.vars.animationSpeed,e.vars.easing,e.wrapup));else{var m=p?e.slides.filter(":first").height():e.computedW,C,x,y;u?(C=e.vars.itemMargin,y=(e.itemW+C)*e.move*e.animatingTo,x=y>e.limit&&e.visible!==1?e.limit:y):e.currentSlide===0&&t===e.count-1&&e.vars.animationLoop&&e.direction!=="next"?x=d?(e.count+e.cloneOffset)*m:0:e.currentSlide===e.last&&t===0&&e.vars.animationLoop&&e.direction!=="prev"?x=d?0:(e.count+1)*m:x=d?(e.count-1-t+e.cloneOffset)*m:(t+e.cloneOffset)*m,e.setProps(x,"",e.vars.animationSpeed),e.transitions?((!e.vars.animationLoop||!e.atEnd)&&(e.animating=!1,e.currentSlide=e.animatingTo),e.container.unbind("webkitTransitionEnd transitionend"),e.container.bind("webkitTransitionEnd transitionend",function(){clearTimeout(e.ensureAnimationEnd),e.wrapup(m)}),clearTimeout(e.ensureAnimationEnd),e.ensureAnimationEnd=setTimeout(function(){e.wrapup(m)},e.vars.animationSpeed+100)):e.container.animate(e.args,e.vars.animationSpeed,e.vars.easing,function(){e.wrapup(m)})}e.vars.smoothHeight&&r.smoothHeight(e.vars.animationSpeed)}},e.wrapup=function(t){!S&&!u&&(e.currentSlide===0&&e.animatingTo===e.last&&e.vars.animationLoop?e.setProps(t,"jumpEnd"):e.currentSlide===e.last&&e.animatingTo===0&&e.vars.animationLoop&&e.setProps(t,"jumpStart")),e.animating=!1,e.currentSlide=e.animatingTo,e.vars.after(e)},e.animateSlides=function(){!e.animating&&O&&e.flexAnimate(e.getTarget("next"))},e.pause=function(){clearInterval(e.animatedSlides),e.animatedSlides=null,e.playing=!1,e.vars.pausePlay&&r.pausePlay.update("play"),e.syncExists&&r.sync("pause")},e.play=function(){e.playing&&clearInterval(e.animatedSlides),e.animatedSlides=e.animatedSlides||setInterval(e.animateSlides,e.vars.slideshowSpeed),e.started=e.playing=!0,e.vars.pausePlay&&r.pausePlay.update("pause"),e.syncExists&&r.sync("play")},e.stop=function(){e.pause(),e.stopped=!0},e.canAdvance=function(t,a){var n=M?e.pagingCount-1:e.last;return a||M&&e.currentItem===e.count-1&&t===0&&e.direction==="prev"?!0:M&&e.currentItem===0&&t===e.pagingCount-1&&e.direction!=="next"||t===e.currentSlide&&!M?!1:e.vars.animationLoop?!0:e.atEnd&&e.currentSlide===0&&t===n&&e.direction!=="next"?!1:!(e.atEnd&&e.currentSlide===n&&t===0&&e.direction==="next")},e.getTarget=function(t){return e.direction=t,t==="next"?e.currentSlide===e.last?0:e.currentSlide+1:e.currentSlide===0?e.last:e.currentSlide-1},e.setProps=function(t,a,n){var o=function(){var c=t||(e.itemW+e.vars.itemMargin)*e.move*e.animatingTo,h=function(){if(u)return a==="setTouch"?t:d&&e.animatingTo===e.last?0:d?e.limit-(e.itemW+e.vars.itemMargin)*e.move*e.animatingTo:e.animatingTo===e.last?e.limit:c;switch(a){case"setTotal":return d?(e.count-1-e.currentSlide+e.cloneOffset)*t:(e.currentSlide+e.cloneOffset)*t;case"setTouch":return t;case"jumpEnd":return d?t:e.count*t;case"jumpStart":return d?e.count*t:t;default:return t}}();return h*-1+"px"}();e.transitions&&(o=p?"translate3d(0,"+o+",0)":"translate3d("+o+",0,0)",n=n!==void 0?n/1e3+"s":"0s",e.container.css("-"+e.pfx+"-transition-duration",n),e.container.css("transition-duration",n)),e.args[e.prop]=o,(e.transitions||n===void 0)&&e.container.css(e.args),e.container.css("transform",o)},e.setup=function(t){if(S)e.slides.css({width:"100%",float:"left",marginRight:"-100%",position:"relative"}),t==="init"&&(k?e.slides.css({opacity:0,display:"block",webkitTransition:"opacity "+e.vars.animationSpeed/1e3+"s ease",zIndex:1}).eq(e.currentSlide).css({opacity:1,zIndex:2}):e.vars.fadeFirstSlide==!1?e.slides.css({opacity:0,display:"block",zIndex:1}).eq(e.currentSlide).css({zIndex:2}).css({opacity:1}):e.slides.css({opacity:0,display:"block",zIndex:1}).eq(e.currentSlide).css({zIndex:2}).animate({opacity:1},e.vars.animationSpeed,e.vars.easing)),e.vars.smoothHeight&&r.smoothHeight();else{var a,n;t==="init"&&(e.viewport=i('<div class="'+s+'viewport"></div>').css({overflow:"hidden",position:"relative"}).appendTo(e).append(e.container),e.cloneCount=0,e.cloneOffset=0,d&&(n=i.makeArray(e.slides).reverse(),e.slides=i(n),e.container.empty().append(e.slides))),e.vars.animationLoop&&!u&&(e.cloneCount=2,e.cloneOffset=1,t!=="init"&&e.container.find(".clone").remove(),e.container.append(r.uniqueID(e.slides.first().clone().addClass("clone")).attr("aria-hidden","true")).prepend(r.uniqueID(e.slides.last().clone().addClass("clone")).attr("aria-hidden","true"))),e.newSlides=i(e.vars.selector,e),a=d?e.count-1-e.currentSlide+e.cloneOffset:e.currentSlide+e.cloneOffset,p&&!u?(e.container.height((e.count+e.cloneCount)*200+"%").css("position","absolute").width("100%"),setTimeout(function(){e.newSlides.css({display:"block"}),e.doMath(),e.viewport.height(e.h),e.setProps(a*e.h,"init")},t==="init"?100:0)):(e.container.width((e.count+e.cloneCount)*200+"%"),e.setProps(a*e.computedW,"init"),setTimeout(function(){e.doMath(),e.newSlides.css({width:e.computedW,marginRight:e.computedM,float:"left",display:"block"}),e.vars.smoothHeight&&r.smoothHeight()},t==="init"?100:0))}u||e.slides.removeClass(s+"active-slide").eq(e.currentSlide).addClass(s+"active-slide"),e.vars.init(e)},e.doMath=function(){var t=e.slides.first(),a=e.vars.itemMargin,n=e.vars.minItems,o=e.vars.maxItems;e.w=e.viewport===void 0?e.width():e.viewport.width(),e.h=t.height(),e.boxPadding=t.outerWidth()-t.width(),u?(e.itemT=e.vars.itemWidth+a,e.itemM=a,e.minW=n?n*e.itemT:e.w,e.maxW=o?o*e.itemT-a:e.w,e.itemW=e.minW>e.w?(e.w-a*(n-1))/n:e.maxW<e.w?(e.w-a*(o-1))/o:e.vars.itemWidth>e.w?e.w:e.vars.itemWidth,e.visible=Math.floor(e.w/e.itemW),e.move=e.vars.move>0&&e.vars.move<e.visible?e.vars.move:e.visible,e.pagingCount=Math.ceil((e.count-e.visible)/e.move+1),e.last=e.pagingCount-1,e.limit=e.pagingCount===1?0:e.vars.itemWidth>e.w?e.itemW*(e.count-1)+a*(e.count-1):(e.itemW+a)*e.count-e.w-a):(e.itemW=e.w,e.itemM=a,e.pagingCount=e.count,e.last=e.count-1),e.computedW=e.itemW-e.boxPadding,e.computedM=e.itemM},e.update=function(t,a){e.doMath(),u||(t<e.currentSlide?e.currentSlide+=1:t<=e.currentSlide&&t!==0&&(e.currentSlide-=1),e.animatingTo=e.currentSlide),e.vars.controlNav&&!e.manualControls&&(a==="add"&&!u||e.pagingCount>e.controlNav.length?r.controlNav.update("add"):(a==="remove"&&!u||e.pagingCount<e.controlNav.length)&&(u&&e.currentSlide>e.last&&(e.currentSlide-=1,e.animatingTo-=1),r.controlNav.update("remove",e.last))),e.vars.directionNav&&r.directionNav.update()},e.addSlide=function(t,a){var n=i(t);e.count+=1,e.last=e.count-1,p&&d?a!==void 0?e.slides.eq(e.count-a).after(n):e.container.prepend(n):a!==void 0?e.slides.eq(a).before(n):e.container.append(n),e.update(a,"add"),e.slides=i(e.vars.selector+":not(.clone)",e),e.setup(),e.vars.added(e)},e.removeSlide=function(t){var a=isNaN(t)?e.slides.index(i(t)):t;e.count-=1,e.last=e.count-1,isNaN(t)?i(t,e.slides).remove():p&&d?e.slides.eq(e.last).remove():e.slides.eq(t).remove(),e.doMath(),e.update(a,"remove"),e.slides=i(e.vars.selector+":not(.clone)",e),e.setup(),e.vars.removed(e)},r.init()},i(window).blur(function(l){O=!1}).focus(function(l){O=!0}),i.flexslider.defaults={namespace:"flex-",selector:".slides > li",animation:"fade",easing:"swing",direction:"horizontal",reverse:!1,animationLoop:!0,smoothHeight:!1,startAt:0,slideshow:!0,slideshowSpeed:7e3,animationSpeed:600,initDelay:0,randomize:!1,fadeFirstSlide:!0,thumbCaptions:!1,pauseOnAction:!0,pauseOnHover:!1,pauseInvisible:!0,useCSS:!0,touch:!0,video:!1,controlNav:!0,directionNav:!0,prevText:"Previous",nextText:"Next",keyboard:!0,multipleKeyboard:!1,mousewheel:!1,pausePlay:!1,pauseText:"Pause",playText:"Play",controlsContainer:"",manualControls:"",customDirectionNav:"",sync:"",asNavFor:"",itemWidth:0,itemMargin:0,minItems:1,maxItems:0,move:0,allowOneSlide:!0,start:function(){},before:function(){},after:function(){},end:function(){},added:function(){},removed:function(){},init:function(){}},i.fn.flexslider=function(l){if(l===void 0&&(l={}),typeof l=="object")return this.each(function(){var e=i(this),s=l.selector?l.selector:".slides > li",P=e.find(s);P.length===1&&l.allowOneSlide===!1||P.length===0?(P.fadeIn(400),l.start&&l.start(e)):e.data("flexslider")===void 0&&new i.flexslider(this,l)});var w=i(this).data("flexslider");switch(l){case"play":w.play();break;case"pause":w.pause();break;case"stop":w.stop();break;case"next":w.flexAnimate(w.getTarget("next"),!0);break;case"prev":case"previous":w.flexAnimate(w.getTarget("prev"),!0);break;default:typeof l=="number"&&w.flexAnimate(l,!0)}}})(jQuery);
//# sourceMappingURL=/s/files/1/2155/9601/t/2/assets/jquery.flexslider.js.map?v=130028856310570933051499239932
