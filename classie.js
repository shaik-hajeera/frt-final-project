/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */(function(i){"use strict";function c(s){return new RegExp("(^|\\s+)"+s+"(\\s+|$)")}var n,t,e;"classList"in document.documentElement?(n=function(s,a){return s.classList.contains(a)},t=function(s,a){s.classList.add(a)},e=function(s,a){s.classList.remove(a)}):(n=function(s,a){return c(a).test(s.className)},t=function(s,a){n(s,a)||(s.className=s.className+" "+a)},e=function(s,a){s.className=s.className.replace(c(a)," ")});function l(s,a){var o=n(s,a)?e:t;o(s,a)}i.classie={hasClass:n,addClass:t,removeClass:e,toggleClass:l,has:n,add:t,remove:e,toggle:l}})(window);
//# sourceMappingURL=/s/files/1/2155/9601/t/2/assets/classie.js.map?v=25538760349974051281499239928
