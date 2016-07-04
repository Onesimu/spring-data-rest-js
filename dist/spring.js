/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

"use strict";
"use strict";
function buildHttpMethodFunction(method) {
    /**
     * make http request user fetch API.
     * if path param is a complete url then fetch ues path as url,
     * else path is not a complete url string but just a path then fetch url=requestConfig.baseURL+path
     * url string will been auto revised, etc: http://localhost/api//user///id/ will convert to http://localhost/api/user/id
     * @param path url path
     */
    function httpRequest(path) {
        var url = path;
        if (!/^https?:\/\/.+$/g.test(path)) {
            url = exports.requestConfig.baseURL + '/' + path;
        }
        url = url.replace(/\/{2,}/g, '/').replace(/:\//g, '://');
        return new Request({ url: url, method: method });
    }
    return httpRequest;
}
/**
 * Object.assign like function to assign fetch options
 * @param args
 * @returns {SpringRequestInit}
 */
function assignFetchOption() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    var orgOption = args[0];
    if (args.length > 1) {
        for (var i = 1; i < args.length; i++) {
            var options = args[i];
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    if (key == 'headers') {
                        for (var key_1 in options.headers) {
                            if (options.headers.hasOwnProperty(key_1)) {
                                orgOption.headers[key_1] = options.headers[key_1];
                            }
                        }
                    }
                    else {
                        orgOption[key] = options[key];
                    }
                }
            }
        }
    }
    return orgOption;
}
var Request = (function () {
    /**
     * @param fetchOptions
     */
    function Request(fetchOptions) {
        /**
         * store fetch options
         */
        this.options = {
            headers: {}
        };
        /**
         * has this request been send
         */
        this.hasSend = false;
        /**
         * The Response interface of the Fetch API represents the response to a request.
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Response
         */
        this.response = null;
        /**
         * if error happen during request error will store in there,else this will be null
         */
        this.error = null;
        assignFetchOption(this.options, exports.requestConfig.globalFetchOptions, fetchOptions);
    }
    /**
     * reset query param in request url by append ? and query param to end of url
     * @param obj
     */
    Request.prototype.queryParam = function (obj) {
        if (obj != null) {
            var arr = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    arr.push(key + "=" + obj[key]);
                }
            }
            this.options.url = this.options.url.split('?')[0] + '?' + arr.join('&');
        }
        return this;
    };
    /**
     * set request body use json
     * HTTP Header Content-Type will set as application/json
     * @param obj
     */
    Request.prototype.jsonBody = function (obj) {
        this.options.body = JSON.stringify(obj);
        this.options.headers['Content-Type'] = 'application/json';
        return this;
    };
    /**
     * set request body as form type
     * parse obj to form string
     * HTTP Header Content-Type will set as application/x-www-form-urlencoded
     * @param obj
     */
    Request.prototype.formBody = function (obj) {
        var arr = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                arr.push(key + "=" + obj[key]);
            }
        }
        this.options.body = arr.join('&');
        this.options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        return this;
    };
    /**
     * send fetch request
     * get response's data
     * resolve:
     *      if response content-type is null,then resolve null
     *      if response content-type has string json,then read response data as json and resolve pure json
     *      else read response data as text and resolve plain text
     */
    Request.prototype.send = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.hasSend) {
                if (_this.error == null) {
                    resolve(_this.responseData);
                }
                else {
                    reject(_this.error);
                }
            }
            else {
                _this.hasSend = true;
                var fetchStartHook = exports.requestConfig.fetchStartHook, fetchEndHook_1 = exports.requestConfig.fetchEndHook;
                fetchStartHook && fetchStartHook(_this);
                fetch(_this.options.url, _this.options).then(function (response) {
                    _this.response = response;
                    var contentType = response.headers.get('content-type');
                    if (contentType == null) {
                        return Promise.resolve();
                    }
                    else {
                        if (/.*json.*/.test(contentType)) {
                            //noinspection JSUnresolvedFunction
                            return response.json();
                        }
                        else {
                            return response.text();
                        }
                    }
                }).then(function (data) {
                    _this.responseData = data;
                    if (_this.response.ok) {
                        return Promise.resolve(data);
                    }
                    else {
                        return Promise.reject(data);
                    }
                }).then(function (data) {
                    fetchEndHook_1 && fetchEndHook_1(_this);
                    resolve(data);
                }).catch(function (err) {
                    _this.error = err;
                    fetchEndHook_1 && fetchEndHook_1(_this);
                    reject(_this);
                });
            }
        });
    };
    /**
     * send request follow _links's href
     * resolve:
     *      if response content-type is null,then resolve null
     *      if response content-type has string json,then read response data as json and resolve pure json
     *      else read response data as text and resolve plain text
     */
    Request.prototype.follow = function (keys) {
        var _this = this;
        var self = this;
        return new Promise(function (resolve, reject) {
            function doFollow(data) {
                var key = keys.shift();
                if (key) {
                    var links = data['_links'];
                    var url = links[key];
                    if (url != null) {
                        url = url['href'];
                        exports.get(url).send().then(function (data) {
                            doFollow(data);
                        }).catch(function (self) {
                            reject(self);
                        });
                    }
                    else {
                        self.error = "no key=" + key + " in links " + JSON.stringify(links, null, 4);
                        reject(this);
                    }
                }
                else {
                    resolve(data);
                }
            }
            _this.send().then(function (data) {
                doFollow(data);
            }).catch(function (self) {
                reject(self);
            });
        });
    };
    return Request;
}());
exports.Request = Request;
exports.requestConfig = {
    globalFetchOptions: {},
    baseURL: '/',
    fetchStartHook: null,
    fetchEndHook: null
};
/**
 * make http get request
 * @param path url path
 */
exports.get = buildHttpMethodFunction('GET');
/**
 * make http post request
 * @param path url path
 */
exports.post = buildHttpMethodFunction('POST');
/**
 * make http patch request
 * @param path url path
 */
exports.patch = buildHttpMethodFunction('PATCH');
/**
 * make http put request
 * @param path url path
 */
exports.put = buildHttpMethodFunction('PUT');
//noinspection ReservedWordAsName
/**
 * make http remove request
 * @param path url path
 */
exports.deleteMethod = buildHttpMethodFunction('DELETE');
/**
 * mockRequest a request with data
 * @param {object} data
 */
function mockRequest(data) {
    var url = data['_links']['self']['href'];
    var req = new Request({ url: url, method: 'GET' });
    req.responseData = data;
    req.hasSend = true;
    return req;
}
exports.mockRequest = mockRequest;
//# sourceMappingURL=request.js.map

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(__webpack_require__(0));
__export(__webpack_require__(3));
//# sourceMappingURL=index.js.map

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var spring = __webpack_require__(1);
window['spring'] = spring;
__export(__webpack_require__(1));
//# sourceMappingURL=browser.js.map

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var request = __webpack_require__(0);
exports.entityConfig = {
    restBaseURL: '/'
};
/**
 * any is an instanceof Entity
 * @param any
 * @returns {boolean}
 */
function isEntity(any) {
    if (any instanceof Object) {
        var prototype = any.constructor.prototype.__proto__;
        while (prototype instanceof Object) {
            if (prototype.constructor === Entity) {
                return true;
            }
            else {
                prototype = prototype.__proto__;
            }
        }
    }
    return false;
}
exports.isEntity = isEntity;
/**
 * object deep equal,optimize for Entity
 * @param a
 * @param b
 * @returns {boolean} is equal ?
 */
function equal(a, b) {
    if (typeof a === typeof b) {
        if (isEntity(a) && isEntity(b)) {
            if (a.id == b.id) {
                return true;
            }
            else {
                return equal(a.data(), b.data());
            }
        }
        else if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length === b.length) {
                var re_1 = true;
                a.forEach(function (aV, i) {
                    re_1 = re_1 && equal(aV, b[i]);
                });
                return re_1;
            }
        }
        else if ((a instanceof Object) && (b instanceof Object)) {
            for (var key in a) {
                var re = true;
                if (a.hasOwnProperty(key) && b.hasOwnProperty(key)) {
                    re = re && equal(a[key], b[key]);
                }
                else {
                    return false;
                }
            }
        }
        else {
            return a == b;
        }
    }
    return false;
}
exports.equal = equal;
var Entity = (function () {
    /**
     * mock an entity instance with init data
     * @param initData
     */
    function Entity(initData) {
        /**
         * store one entity's data
         */
        this._data = {};
        /**
         * track modify field
         */
        this.modifyFields = [];
        this.patchData(initData);
    }
    /**
     * get this entity's spring data rest resource uri.
     * if this entity's has data and data has _link properties,use _data['_links']['self']['href']
     * else use config.restBaseURL + entityName + '/' + self.id
     */
    Entity.prototype.href = function () {
        var links = this._data['_links'];
        if (links != null) {
            return links['self']['href'];
        }
        else {
            if (this.id) {
                return this.constructor.entityBaseURL() + "/" + this.id;
            }
            else {
                throw new Error("entity without id can't map to backend service:\n" + JSON.stringify(this));
            }
        }
    };
    /**
     * get entity properties value by key
     * @param key properties name
     */
    Entity.prototype.get = function (key) {
        return this._data[key];
    };
    /**
     * set entity properties value by key
     * will compare olaValue and newValue,if value is equal then not append filed name to modifyFields
     * @param key properties name
     * @param value
     */
    Entity.prototype.set = function (key, value) {
        var oldValue = this.get(key);
        if (!equal(oldValue, value)) {
            this.modifyFields.push(key);
        }
        this._data[key] = value;
    };
    /**
     * get entity data ref
     */
    Entity.prototype.data = function () {
        return this._data;
    };
    /**
     * assign a patchData object to entity's properties
     * if patchData has self link, then id will update by parseIdFromData
     * @param patchData
     */
    Entity.prototype.patchData = function (patchData) {
        for (var key in patchData) {
            if (patchData.hasOwnProperty(key)) {
                this.set(key, patchData[key]);
            }
        }
        try {
            var id = patchData['_links']['self']['href'].split(/\//);
            id = id[id.length - 1];
            if (id != null) {
                this.id = id;
            }
        }
        catch (_) {
        }
    };
    /**
     * create an new entity
     * send HTTP POST request to create an entity
     */
    Entity.prototype.create = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.constructor.translateRelationEntity(_this.data()).then(function (body) {
                return request.post(_this.constructor.entityBaseURL()).jsonBody(body).send();
            }).then(function (json) {
                _this.patchData(json);
                _this.modifyFields = [];
                resolve(json);
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * update an entity
     * send HTTP PATCH request to update an entity(will watch change in data properties to track change fields)
     * @returns {Promise} resolve(json), reject(Request)
     * @private
     */
    Entity.prototype.update = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var pureChange = {};
            if (_this.modifyFields.length == 0) {
                resolve();
                return;
            }
            _this.modifyFields.forEach(function (key) {
                if (pureChange.hasOwnProperty(key) || key[0] === '_') {
                    return;
                }
                else if (_this._data.hasOwnProperty(key)) {
                    pureChange[key] = _this.get(key);
                }
            });
            _this.constructor.translateRelationEntity(pureChange).then(function (json) {
                return request.patch(_this.href()).jsonBody(json).send();
            }).then(function (json) {
                _this.patchData(json);
                _this.modifyFields = [];
                resolve(json);
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * create or update entity
     * if id properties is set update change to service,
     * else create an new entity to service.
     *
     * if entity.properties is an instance of Entity or Entity[],then entity.properties.save() will also call,which mean entity's all Entity attr will auto save()
     */
    Entity.prototype.save = function () {
        if (this.id != null) {
            return this.update();
        }
        else {
            return this.create();
        }
    };
    /**
     * remove this entity
     */
    Entity.prototype.remove = function () {
        return this.constructor.remove(this.id);
    };
    /**
     * fetch entity data to keep updated to newest
     * @returns {Promise} resolve(json), reject(Request)
     */
    Entity.prototype.fetch = function () {
        var _this = this;
        return new Promise(function (resole, reject) {
            _this.constructor.findOne(_this.id).then(function (entity) {
                var json = entity.data();
                _this.patchData(json);
                _this.modifyFields = [];
                resole(json);
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * send request follow this entity's _links's href
     * @param {string[]} keys links href in order
     * @returns {Promise} resolve(json), reject(Request)
     */
    Entity.prototype.follow = function (keys) {
        var _this = this;
        return new Promise(function (resole, reject) {
            function doFollow(data) {
                request.mockRequest(data).follow(keys).then(function (json) {
                    resole(json);
                }).catch(function (err) {
                    reject(err);
                });
            }
            //fetch data before doFollow
            if (_this._data['_links'] != null) {
                doFollow(_this.data());
            }
            else {
                _this.fetch().then(function () {
                    doFollow(_this.data());
                });
            }
        });
    };
    /**
     * fetch relation property and store response value in entity's data attr,relation property is an instance of Entity.
     * after fetch you can get relation property by get(propertyName)
     * @param propertyName Entity relation property name in _links
     * @param T relation property's type(extend Entity class)
     * @returns {Promise<T>} resolve Entity relation property instance
     */
    Entity.prototype.fetchProperty = function (propertyName, T) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.follow([propertyName]).then(function (json) {
                var entity = T.jsonToEntity(json);
                _this.data()[propertyName] = entity;
                resolve(entity);
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * fetch relation property and store response value in entity's data attr,relation property is an Entity array
     * after fetch you can get relation property by get(propertyName)
     * @param propertyName Entity relation property name in _links
     * @param T relation property's type(extend Entity class)
     * @returns {Promise<T>}
     */
    Entity.prototype.fetchArrayProperty = function (propertyName, T) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.follow([propertyName]).then(function (json) {
                var entities = T.jsonToEntityList(json);
                _this.data()[propertyName] = entities;
                resolve(entities);
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * spring data rest entity base url
     */
    Entity.entityBaseURL = function () {
        return exports.entityConfig.restBaseURL + "/" + this.entityName;
    };
    /**
     * read spring data rest's response json data then parse and return entity array
     * @param json
     */
    Entity.jsonToEntityList = function (json) {
        var _this = this;
        var re = [];
        var arr = json['_embedded'][this.entityName];
        arr.forEach(function (json) {
            re.push(_this.jsonToEntity(json));
        });
        re['page'] = json['page']; //add page info
        return re;
    };
    /**
     * read spring data rest's response json data then parse and return an entity
     * @param json
     */
    Entity.jsonToEntity = function (json) {
        var entity = new this(json);
        //json data from server is fresh,so entity modifyFields should be empty
        entity.modifyFields = [];
        return entity;
    };
    /**
     * this method use before send request to service to create or update entity
     * translate entity's data properties which contain Relation Entity instance value to text-uri list
     * if data has Entity attr,this Entity attr will be replace by is href() value,and if this entity has't be store in service will store this entity first.
     * @param data entity's data properties can has Entity attr
     *
     * resolve: pure json data can send to spring data rest service as request body
     * reject: Request with error prop
     */
    Entity.translateRelationEntity = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (isEntity(data)) {
                data.save().then(function () {
                    resolve(data.href());
                }).catch(function (err) {
                    reject(err);
                });
            }
            else if (Array.isArray(data)) {
                var promiseList_1 = [];
                data.forEach(function (one) { return promiseList_1.push(_this.translateRelationEntity(one)); });
                Promise.all(promiseList_1).then(function (arr) {
                    resolve(arr);
                }).catch(function (err) {
                    reject(err);
                });
            }
            else if (data != null && data.constructor === Object) {
                var promiseList = [];
                var indexKeyMap_1 = {};
                var nowIndex = 0;
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        indexKeyMap_1[nowIndex++] = key;
                        promiseList.push(_this.translateRelationEntity(data[key]));
                    }
                }
                Promise.all(promiseList).then(function (arr) {
                    var json = {};
                    for (var i = 0; i < arr.length; i++) {
                        json[indexKeyMap_1[i]] = arr[i];
                    }
                    resolve(json);
                }).catch(function (err) {
                    reject(err);
                });
            }
            else {
                resolve(data);
            }
        });
    };
    /**
     * get entity json data by id
     * @param {string|number} id entity id
     * @param {object?} queryParam
     * @param {string} queryParam.projection the name of the projection you set with @Projection annotation name attributes
     */
    Entity.findOne = function (id, queryParam) {
        var _this = this;
        if (id != null) {
            return new Promise(function (resolve, reject) {
                request.get(_this.entityBaseURL() + "/" + id).queryParam(queryParam).send().then(function (json) {
                    resolve(_this.jsonToEntity(json));
                }).catch(function (err) {
                    reject(err);
                });
            });
        }
        else {
            throw new Error('require id');
        }
    };
    /**
     * collection resource with page and sort.
     * Returns all entities the repository servers through its findAll(…) method. If the repository is a paging repository we include the pagination links if necessary and additional page metadata.*
     * @param {object} queryParam
     * @param {number} queryParam.page the page number to access (0 indexed, defaults to 0).
     * @param {number} queryParam.size the page size requested (defaults to 20).
     * @param {string} queryParam.sort a collection of sort directives in the format ($propertyName,)+[asc|desc]?
     * etc:name,age,desc
     */
    Entity.findAll = function (queryParam) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            request.get(_this.entityBaseURL()).queryParam(queryParam).send().then(function (json) {
                var re = _this.jsonToEntityList(json);
                resolve(re);
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * search resource if the backing repository exposes query methods.
     * call query methods exposed by a repository. The path and name of the query method resources can be modified using @RestResource on the method declaration.
     *
     * @param {string} searchPath spring data rest searchMethod path string
     *
     * @param {Object} queryParam search params
     * If the query method has pagination capabilities (indicated in the URI template pointing to the resource) the resource takes the following parameters:
     * @param {number} queryParam.page the page number to access (0 indexed, defaults to 0).
     * @param {number} queryParam.size the page size requested (defaults to 20).
     * @param {string} queryParam.sort a collection of sort directives in the format ($propertyName,)+[asc|desc]?
     *
     * @returns {Promise} resolve(Entity|Entity[]) reject(Request)
     * resolve:
     *      if response json data has _embedded attr then resolve Entity array,
     *      else resolve one Entity
     */
    Entity.search = function (searchPath, queryParam) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            request.get(_this.entityBaseURL() + "/search/" + searchPath).queryParam(queryParam).send().then(function (json) {
                try {
                    resolve(_this.jsonToEntityList(json));
                }
                catch (_) {
                    resolve(_this.jsonToEntity(json));
                }
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * remove entity by id
     */
    Entity.remove = function (id) {
        return request.deleteMethod(this.entityBaseURL() + "/" + id).send();
    };
    /**
     * expose entity instance properties in _data to entity itself use Object.defineProperty getter and setter
     * after expose,you can access property in entity by entity.property rather than access by entity.data().property
     * @param propertyName property name in entity.data() object.
     */
    Entity.exposeProperty = function (propertyName) {
        Object.defineProperty(this.prototype, propertyName, {
            get: function () {
                return this.get(propertyName);
            },
            set: function (value) {
                this.set(propertyName, value);
            },
            enumerable: true
        });
    };
    return Entity;
}());
exports.Entity = Entity;
/**
 * build an Entity Entity
 * @param entity_name spring data rest entity path
 */
function extend(entity_name) {
    var Class = (function (_super) {
        __extends(Class, _super);
        function Class() {
            _super.apply(this, arguments);
        }
        return Class;
    }(Entity));
    /**
     * spring data rest entity path
     */
    Class.entityName = entity_name;
    return Class;
}
exports.extend = extend;
//# sourceMappingURL=entity.js.map

/***/ },
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ }
/******/ ]);