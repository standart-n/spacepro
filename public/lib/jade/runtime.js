jade=function(r){function e(r){return null!=r}return Array.isArray||(Array.isArray=function(r){return"[object Array]"==Object.prototype.toString.call(r)}),Object.keys||(Object.keys=function(r){var e=[];for(var t in r)r.hasOwnProperty(t)&&e.push(t);return e}),r.merge=function(r,t){var a=r["class"],n=t["class"];(a||n)&&(a=a||[],n=n||[],Array.isArray(a)||(a=[a]),Array.isArray(n)||(n=[n]),a=a.filter(e),n=n.filter(e),r["class"]=a.concat(n).join(" "));for(var s in t)"class"!=s&&(r[s]=t[s]);return r},r.attrs=function(e,t){var a=[],n=e.terse;delete e.terse;var s=Object.keys(e),i=s.length;if(i){a.push("");for(var c=0;i>c;++c){var o=s[c],u=e[o];"boolean"==typeof u||null==u?u&&(n?a.push(o):a.push(o+'="'+o+'"')):0==o.indexOf("data")&&"string"!=typeof u?a.push(o+"='"+JSON.stringify(u)+"'"):"class"==o&&Array.isArray(u)?a.push(o+'="'+r.escape(u.join(" "))+'"'):t&&t[o]?a.push(o+'="'+r.escape(u)+'"'):a.push(o+'="'+u+'"')}}return a.join(" ")},r.escape=function(r){return String(r).replace(/&(?!(\w+|\#\d+);)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},r.rethrow=function(r,e,t){if(!e)throw r;var a=3,n=require("fs").readFileSync(e,"utf8"),s=n.split("\n"),i=Math.max(t-a,0),c=Math.min(s.length,t+a),a=s.slice(i,c).map(function(r,e){var a=e+i+1;return(a==t?"  > ":"    ")+a+"| "+r}).join("\n");throw r.path=e,r.message=(e||"Jade")+":"+t+"\n"+a+"\n\n"+r.message,r},r}({});