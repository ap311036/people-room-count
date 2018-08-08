/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.CORE = undefined;
var _arguments = arguments;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _private2 = __webpack_require__(4);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Module = function () {
	function Module(obj) {
		_classCallCheck(this, Module);

		this.original = obj;
		this.edited = obj;
	}

	_createClass(Module, [{
		key: 'stringify',
		value: function stringify() {
			this.edited = CORE.stringify(this.edited);
			return this;
		}
	}, {
		key: 'parse',
		value: function parse() {
			this.edited = CORE.parse(this.edited);
			return this;
		}
	}]);

	return Module;
}();

;

var CORE = function CORE(object) {

	if (object instanceof Module) {
		return object;
	} else {}
	if (!(object instanceof Module)) {
		return new Module(object);
	}
};

var self = CORE;

CORE.VERSION = '0.0.1';

CORE.extend = __webpack_require__(5);

CORE.stringify = function (obj) {
	if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
		return JSON.stringify(obj, function (key, value) {
			var fn = void 0;
			if (value instanceof Function || typeof value == 'function') {
				fn = value.toString();

				if (fn.length < 8 || fn.substring(0, 8) !== 'function') {
					//this is ES6 Arrow Function
					return '_NuFrRa_' + fn;
				}
				return fn;
			}
			if (value instanceof RegExp) {
				return '_PxEgEr_' + value;
			}
			return value;
		}).replace(/\s|\\t|\\n|\\r/g, '');
	} else {
		throw new Error('This method requires a object');
		// console.log('This method requires a object!');
	}
};

CORE.parse = function (str, date2obj) {
	var iso8061 = date2obj ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/ : false;
	if (typeof str === 'string') {
		return JSON.parse(str, function (key, value) {
			var prefix = void 0;

			if (typeof value != 'string') {
				return value;
			}
			if (value.length < 8) {
				return value;
			}

			prefix = value.substring(0, 8);

			if (iso8061 && value.match(iso8061)) {
				return new Date(value);
			}
			if (prefix === 'function') {
				return eval('(' + value + ')');
			}
			if (prefix === '_PxEgEr_') {
				return eval(value.slice(8));
			}
			if (prefix === '_NuFrRa_') {
				return eval(value.slice(8));
			}
			return value;
		});
	} else {
		throw new Error('This method requires a string');
		// console.log('This method requires a string');
	}
};

CORE.clone = function (obj, date2obj) {
	return self.parse(self.stringify(obj), date2obj);
};

CORE.cookies = function (key, value, attributes) {
	var defaults = {};
	if (typeof document !== 'undefined') {
		return _arguments.length === 1 ? self.cookies.get(key) : self.cookies.set(key, value, attributes);
	} else {
		throw new Error('This method requires a `window` with a `document` object, or arguments length must more than 1');
		// console.log('This method requires a `window` with a `document` object, or arguments length must more than 1!');
	}
};

CORE.cookies.set = function (key, value, attributes) {
	if (typeof key === 'string') {
		attributes = self.extend(_private2._private.cookies.defaults, attributes);
		attributes.expires = _private2._private.cookies.getExpiresDate(value === undefined ? -1 : attributes.expires);
		_private2._private.cookies.document.cookie = _private2._private.cookies.generateCookieString(key, value, attributes);
		return self.cookies;
	} else {
		throw new Error('First param must be string');
	}
};

CORE.cookies.get = function (key) {
	if (typeof key === 'string') {
		if (_private2._private.cookies.cachedDocumentCookie !== _private2._private.cookies.document.cookie) {
			_private2._private.cookies.renewCache();
		}
		var value = _private2._private.cookies.cache[_private2._private.cookies.cacheKeyPrefix + key];
		return value === undefined ? undefined : decodeURIComponent(value);
	} else {
		throw new Error('First param must be string');
	}
};

CORE.cookies.getjson = function (key) {
	if (typeof key === 'string') {
		return self.parse(self.cookies(key));
	} else {
		throw new Error('First param must be string');
	}
};

CORE.cookies.remove = function (key) {
	return self.cookies.set(key, undefined);
};

CORE.isDate = function (dateString) {
	if (typeof dateString === 'string') {
		var D = new Date(dateString);
		return Object.prototype.toString.call(D) === '[object Date]' && !isNaN(D.getTime());
	} else if (Object.prototype.toString.call(dateString) === '[object Date]') {
		return !isNaN(dateString.getTime());
	} else {
		throw new Error('First param must be string or Date object');
	}
};

exports.CORE = CORE;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

__webpack_require__(3);

var _core = __webpack_require__(0);

var root = function (root) {
	if ((typeof root === 'undefined' ? 'undefined' : _typeof(root)) === 'object' && (root.self === root || root.global === global) && root) {
		return root;
	}
}(self || global || {});

root.core = _core.CORE;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports._private = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _core = __webpack_require__(0);

var _private = {
    cookies: {
        document: window.document,
        cache: null,
        cacheKeyPrefix: 'cookey.',
        cachedDocumentCookie: null,
        maxExpireDate: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
        defaults: {
            path: '/',
            secure: false
        },
        renewCache: function renewCache() {
            _private.cookies.cache = _private.cookies.getCacheFromString(_private.cookies.document.cookie);
            _private.cookies.cachedDocumentCookie = _private.cookies.document.cookie;
        },
        generateCookieString: function generateCookieString(key, value, options) {

            key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
            key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
            if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
                value = _core.CORE.stringify(value);
            }
            value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
            options = options || {};

            var cookieString = key + '=' + value;
            cookieString += options.path ? ';path=' + options.path : '';
            cookieString += options.domain ? ';domain=' + options.domain : '';
            cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
            cookieString += options.secure ? ';secure' : '';

            return cookieString;
        },
        getCacheFromString: function getCacheFromString(documentCookie) {
            var cookieCache = {};
            var cookiesArray = documentCookie ? documentCookie.split('; ') : [];

            for (var i = 0; i < cookiesArray.length; i++) {
                var cookieKvp = _private.cookies.getKeyValuePairFromCookieString(cookiesArray[i]);

                if (cookieCache[_private.cookies.cacheKeyPrefix + cookieKvp.key] === undefined) {
                    cookieCache[_private.cookies.cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
                }
            }

            return cookieCache;
        },
        getKeyValuePairFromCookieString: function getKeyValuePairFromCookieString(cookieString) {
            var separatorIndex = cookieString.indexOf('=');
            separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;
            var key = cookieString.substr(0, separatorIndex);
            var decodedKey;
            try {
                decodedKey = decodeURIComponent(key);
            } catch (e) {
                if (console && typeof console.error === 'function') {
                    console.error('Could not decode cookie with key "' + key + '"', e);
                }
            }
            return {
                key: decodedKey,
                value: cookieString.substr(separatorIndex + 1)
            };
        },
        getExpiresDate: function getExpiresDate(expires) {
            var now = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();

            var expiresDays = new Date();
            if (typeof expires === 'number') {
                expires = expires === Infinity ? _private.cookies.maxExpireDate : new Date(now.getTime() + expires * 1000);
            } else if (typeof expires === 'string' && expires.length < 4) {
                expiresDays.setMilliseconds(expiresDays.getMilliseconds() + parseInt(expires) * 864e+5);
                expires = expiresDays;
            } else {
                expires = new Date(expires);
            }

            if (expires && !_core.CORE.isDate(expires)) {
                throw new Error('`expires` parameter cannot be converted to a valid Date instance');
            }

            return expires;
        }
    }
};

exports._private = _private;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) { /**/ }

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


/***/ })
/******/ ]);