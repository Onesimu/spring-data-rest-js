parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"zjTA":[function(require,module,exports) {
"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function n(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}function o(e){return function(t){var n=t;return/^https?:\/\/.+$/g.test(t)||(n=exports.requestConfig.baseURL+"/"+t),n=n.replace(/\/{2,}/g,"/").replace(/:\//g,"://"),new s({url:n,method:e})}}function r(){var e=arguments.length<=0?void 0:arguments[0];if(arguments.length>1)for(var t=1;t<arguments.length;t++){var n=t<0||arguments.length<=t?void 0:arguments[t];for(var o in n)if(n.hasOwnProperty(o))if("headers"==o)for(var r in n.headers)n.headers.hasOwnProperty(r)&&(e.headers[r]=n.headers[r]);else e[o]=n[o]}return e}Object.defineProperty(exports,"__esModule",{value:!0});var s=function(){function t(n){e(this,t),this.options={headers:{}},this.hasSend=!1,this.response=null,this.error=null,r(this.options,exports.requestConfig.globalFetchOptions,n)}return n(t,[{key:"queryParam",value:function(e){if(null!=e){var t=[];for(var n in e)e.hasOwnProperty(n)&&t.push("".concat(n,"=").concat(e[n]));this.options.url=this.options.url.split("?")[0]+"?"+t.join("&")}return this}},{key:"jsonBody",value:function(e){return this.options.body=JSON.stringify(e),this.options.headers["Content-Type"]="application/json",this}},{key:"formBody",value:function(e){var t=[];for(var n in e)e.hasOwnProperty(n)&&t.push("".concat(n,"=").concat(e[n]));return this.options.body=t.join("&"),this.options.headers["Content-Type"]="application/x-www-form-urlencoded",this}},{key:"send",value:function(){var e=this;return new Promise(function(t,n){if(e.hasSend)null==e.error?t(e.responseData):n(e.error);else{e.hasSend=!0;var o=exports.requestConfig,r=o.fetchStartHook,s=o.fetchEndHook;r&&r(e),fetch(e.options.url,e.options).then(function(t){e.response=t;var n=t.headers.get("content-type");return null==n?Promise.resolve():/.*json.*/.test(n)?t.json():t.text()}).then(function(t){return e.responseData=t,e.response.ok?Promise.resolve(t):Promise.reject(t)}).then(function(n){s&&s(e),t(n)}).catch(function(t){e.error=t,s&&s(e),n(e)})}})}},{key:"follow",value:function(e){var t=this,n=this;return new Promise(function(o,r){t.send().then(function(t){!function t(s){var i=e.shift();if(i){var a=s._links,u=a[i];null!=u?(u=u.href,exports.get(u).send().then(function(e){t(e)}).catch(function(e){r(e)})):(n.error="no key=".concat(i," in links ").concat(JSON.stringify(a,null,4)),r(this))}else o(s)}(t)}).catch(function(e){r(e)})})}}]),t}();function i(e){var t=e._links.self.href,n=new s({url:t,method:"GET"});return n.responseData=e,n.hasSend=!0,n}exports.SpringRequest=s,exports.requestConfig={globalFetchOptions:{headers:{"Content-Type":"application/json"},credentials:"same-origin"},baseURL:"/",fetchStartHook:null,fetchEndHook:null},exports.get=o("GET"),exports.post=o("POST"),exports.patch=o("PATCH"),exports.put=o("PUT"),exports.deleteMethod=o("DELETE"),exports.mockRequest=i;
},{}],"q6cI":[function(require,module,exports) {
"use strict";function t(t,e){return!e||"object"!==u(e)&&"function"!=typeof e?n(t):e}function n(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function e(t){return(e=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function r(t,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(n&&n.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),n&&o(t,n)}function o(t,n){return(o=Object.setPrototypeOf||function(t,n){return t.__proto__=n,t})(t,n)}function i(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}function a(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function c(t,n,e){return n&&a(t.prototype,n),e&&a(t,e),t}function u(t){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var s=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var e in t)Object.hasOwnProperty.call(t,e)&&(n[e]=t[e]);return n.default=t,n};Object.defineProperty(exports,"__esModule",{value:!0});var f=s(require("./request"));function h(t){if(t instanceof Object)for(var n=t.constructor.prototype.__proto__;n instanceof Object;){if(n.constructor===y)return!0;n=n.__proto__}return!1}function l(t,n){if(u(t)===u(n)){if(h(t)&&h(n))return t.id==n.id||l(t.data(),n.data());if(Array.isArray(t)&&Array.isArray(n)){if(t.length===n.length){var e=!0;return t.forEach(function(t,r){e=e&&l(t,n[r])}),e}}else{if(!(t instanceof Object&&n instanceof Object))return t==n;for(var r in t){var o=!0;if(!t.hasOwnProperty(r)||!n.hasOwnProperty(r))return!1;o=o&&l(t[r],n[r])}}}return!1}exports.entityConfig={restBaseURL:"/"},exports.isEntity=h,exports.equal=l;var y=function(){function t(n){i(this,t),this._data={},this.modifyFields=[],this.patchData(n)}return c(t,[{key:"href",value:function(){var t=this._data._links;if(null!=t)return t.self.href;if(this.id)return"".concat(this.constructor.entityBaseURL(),"/").concat(this.id);throw new Error("entity without id can't map to backend service:\n".concat(JSON.stringify(this)))}},{key:"get",value:function(t){return this._data[t]}},{key:"set",value:function(t,n){l(this.get(t),n)||this.modifyFields.push(t),this._data[t]=n}},{key:"data",value:function(){return this._data}},{key:"patchData",value:function(t){for(var n in t)t.hasOwnProperty(n)&&this.set(n,t[n]);try{var e=t._links.self.href.split(/\//);null!=(e=e[e.length-1])&&(this.id=e)}catch(r){}}},{key:"create",value:function(){var t=this;return new Promise(function(n,e){t.constructor.translateRelationEntity(t.data()).then(function(n){return f.post(t.constructor.entityBaseURL()).jsonBody(n).send()}).then(function(e){t.patchData(e),t.modifyFields=[],n(e)}).catch(function(t){e(t)})})}},{key:"update",value:function(){var t=this;return new Promise(function(n,e){var r={};0!=t.modifyFields.length?(t.modifyFields.forEach(function(n){r.hasOwnProperty(n)||"_"===n[0]||t._data.hasOwnProperty(n)&&(r[n]=t.get(n))}),t.constructor.translateRelationEntity(r).then(function(n){return f.patch(t.href()).jsonBody(n).send()}).then(function(e){t.patchData(e),t.modifyFields=[],n(e)}).catch(function(t){e(t)})):n()})}},{key:"save",value:function(){return null!=this.id?this.update():this.create()}},{key:"remove",value:function(){return this.constructor.remove(this.id)}},{key:"fetch",value:function(){var t=this;return new Promise(function(n,e){t.constructor.findOne(t.id).then(function(e){var r=e.data();t.patchData(r),t.modifyFields=[],n(r)}).catch(function(t){e(t)})})}},{key:"follow",value:function(t){var n=this;return new Promise(function(e,r){function o(n){f.mockRequest(n).follow(t).then(function(t){e(t)}).catch(function(t){r(t)})}null!=n._data._links?o(n.data()):n.fetch().then(function(){o(n.data())})})}},{key:"fetchProperty",value:function(t,n){var e=this;return new Promise(function(r,o){e.follow([t]).then(function(o){var i=n.jsonToEntity(o);e.data()[t]=i,r(i)}).catch(function(t){o(t)})})}},{key:"fetchArrayProperty",value:function(t,n){var e=this;return new Promise(function(r,o){e.follow([t]).then(function(o){var i=n.jsonToEntityList(o);e.data()[t]=i,r(i)}).catch(function(t){o(t)})})}}],[{key:"entityBaseURL",value:function(){return"".concat(exports.entityConfig.restBaseURL,"/").concat(this.entityName)}},{key:"jsonToEntityList",value:function(t){var n=this,e=[];return t._embedded[this.entityName].forEach(function(t){e.push(n.jsonToEntity(t))}),e.page=t.page,e}},{key:"jsonToEntity",value:function(t){var n=new this(t);return n.modifyFields=[],n}},{key:"translateRelationEntity",value:function(t){var n=this;return new Promise(function(e,r){if(h(t))t.save().then(function(){e(t.href())}).catch(function(t){r(t)});else if(Array.isArray(t)){var o=[];t.forEach(function(t){return o.push(n.translateRelationEntity(t))}),Promise.all(o).then(function(t){e(t)}).catch(function(t){r(t)})}else if(null!=t&&t.constructor===Object){var i=[],a={},c=0;for(var u in t)t.hasOwnProperty(u)&&(a[c++]=u,i.push(n.translateRelationEntity(t[u])));Promise.all(i).then(function(t){for(var n={},r=0;r<t.length;r++)n[a[r]]=t[r];e(n)}).catch(function(t){r(t)})}else e(t)})}},{key:"findOne",value:function(t,n){var e=this;if(null!=t)return new Promise(function(r,o){f.get("".concat(e.entityBaseURL(),"/").concat(t)).queryParam(n).send().then(function(t){r(e.jsonToEntity(t))}).catch(function(t){o(t)})});throw new Error("require id")}},{key:"findAll",value:function(t){var n=this;return new Promise(function(e,r){f.get(n.entityBaseURL()).queryParam(t).send().then(function(t){var r=n.jsonToEntityList(t);e(r)}).catch(function(t){r(t)})})}},{key:"search",value:function(t,n){var e=this;return new Promise(function(r,o){f.get("".concat(e.entityBaseURL(),"/search/").concat(t)).queryParam(n).send().then(function(t){try{r(e.jsonToEntityList(t))}catch(n){r(e.jsonToEntity(t))}}).catch(function(t){o(t)})})}},{key:"remove",value:function(t){return f.deleteMethod("".concat(this.entityBaseURL(),"/").concat(t)).send()}},{key:"saveAll",value:function(t){var n=this;return new Promise(function(e,r){f.post(n.entityBaseURL()+"/batch").jsonBody(t).send().then(function(t){e(t)}).catch(function(t){r(t)})})}},{key:"exposeProperty",value:function(t){Object.defineProperty(this.prototype,t,{get:function(){return this.get(t)},set:function(n){this.set(t,n)},enumerable:!0})}},{key:"init",value:function(){var t=this,n=this.entityName.substring(0,this.entityName.length-1).replace(/([A-Z])/g,"_$1").toLowerCase(),e=alasql("SHOW TABLES").find(function(t){return t.tableid==n}),r=alasql("SHOW COLUMNS FROM ".concat(n));e&&r&&r[0]?r.forEach(function(n){return t.exposeProperty(toHump(n.columnid))}):f.get(exports.entityConfig.restBaseURL+"profile/"+this.entityName).send().then(function(n){return n.alps.descriptor[0].descriptor.map(function(t){return t.name}).forEach(function(n){return t.exposeProperty(n)})})}}]),t}();function p(n){var o=function(n){function o(){return i(this,o),t(this,e(o).apply(this,arguments))}return r(o,y),o}();return o.entityName=n,o.init(),o}exports.Entity=y,exports.extend=p;
},{"./request":"zjTA"}],"7QCb":[function(require,module,exports) {
"use strict";function e(e){for(var r in e)exports.hasOwnProperty(r)||(exports[r]=e[r])}Object.defineProperty(exports,"__esModule",{value:!0}),e(require("./request")),e(require("./entity"));
},{"./request":"zjTA","./entity":"q6cI"}],"YnW4":[function(require,module,exports) {
"use strict";function r(r){for(var e in r)exports.hasOwnProperty(e)||(exports[e]=r[e])}var e=this&&this.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(null!=r)for(var t in r)Object.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e.default=r,e};Object.defineProperty(exports,"__esModule",{value:!0});var t=e(require("./index"));window.spring=t,r(require("./index"));
},{"./index":"7QCb"}]},{},["YnW4"], null)
//# sourceMappingURL=/browser.map