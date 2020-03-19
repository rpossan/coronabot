'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _deleteProperty = require('babel-runtime/core-js/reflect/delete-property');

var _deleteProperty2 = _interopRequireDefault(_deleteProperty);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _apply = require('babel-runtime/core-js/reflect/apply');

var _apply2 = _interopRequireDefault(_apply);

var _unset2 = require('lodash/unset');

var _unset3 = _interopRequireDefault(_unset2);

var _set2 = require('lodash/set');

var _set3 = _interopRequireDefault(_set2);

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var _merge2 = require('lodash/merge');

var _merge3 = _interopRequireDefault(_merge2);

var _last2 = require('lodash/last');

var _last3 = _interopRequireDefault(_last2);

var _isString2 = require('lodash/isString');

var _isString3 = _interopRequireDefault(_isString2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _has2 = require('lodash/has');

var _has3 = _interopRequireDefault(_has2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _defaults2 = require('lodash/defaults');

var _defaults3 = _interopRequireDefault(_defaults2);

var _desc, _value, _obj; /*!
                          * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
                          */

exports.registerPlugin = registerPlugin;
exports.registerInternalPlugin = registerInternalPlugin;

var _common = require('@ciscospark/common');

var _httpCore = require('@ciscospark/http-core');

var _ampersandState = require('ampersand-state');

var _ampersandState2 = _interopRequireDefault(_ampersandState);

var _auth = require('./interceptors/auth');

var _auth2 = _interopRequireDefault(_auth);

var _networkTiming = require('./interceptors/network-timing');

var _networkTiming2 = _interopRequireDefault(_networkTiming);

var _payloadTransformer = require('./interceptors/payload-transformer');

var _payloadTransformer2 = _interopRequireDefault(_payloadTransformer);

var _redirect = require('./interceptors/redirect');

var _redirect2 = _interopRequireDefault(_redirect);

var _requestEvent = require('./interceptors/request-event');

var _requestEvent2 = _interopRequireDefault(_requestEvent);

var _requestLogger = require('./interceptors/request-logger');

var _requestLogger2 = _interopRequireDefault(_requestLogger);

var _requestTiming = require('./interceptors/request-timing');

var _requestTiming2 = _interopRequireDefault(_requestTiming);

var _responseLogger = require('./interceptors/response-logger');

var _responseLogger2 = _interopRequireDefault(_responseLogger);

var _sparkHttpError = require('./lib/spark-http-error');

var _sparkHttpError2 = _interopRequireDefault(_sparkHttpError);

var _sparkTrackingId = require('./interceptors/spark-tracking-id');

var _sparkTrackingId2 = _interopRequireDefault(_sparkTrackingId);

var _sparkUserAgent = require('./interceptors/spark-user-agent');

var _sparkUserAgent2 = _interopRequireDefault(_sparkUserAgent);

var _rateLimit = require('./interceptors/rate-limit');

var _rateLimit2 = _interopRequireDefault(_rateLimit);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _storage = require('./lib/storage');

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _events = require('events');

var _sparkCorePluginMixin = require('./lib/spark-core-plugin-mixin');

var _sparkCorePluginMixin2 = _interopRequireDefault(_sparkCorePluginMixin);

var _sparkInternalCorePluginMixin = require('./lib/spark-internal-core-plugin-mixin');

var _sparkInternalCorePluginMixin2 = _interopRequireDefault(_sparkInternalCorePluginMixin);

var _sparkInternalCore = require('./spark-internal-core');

var _sparkInternalCore2 = _interopRequireDefault(_sparkInternalCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

// TODO replace the Interceptor.create with Reflect.construct (
// Interceptor.create exists because new was really hard to call on an array of
// constructors)
var interceptors = {
  SparkTrackingIdInterceptor: _sparkTrackingId2.default.create,
  RequestEventInterceptor: _requestEvent2.default.create,
  RateLimitInterceptor: _rateLimit2.default.create,
  /* eslint-disable no-extra-parens */
  RequestLoggerInterceptor: process.env.ENABLE_NETWORK_LOGGING || process.env.ENABLE_VERBOSE_NETWORK_LOGGING ? _requestLogger2.default.create : undefined,
  ResponseLoggerInterceptor: process.env.ENABLE_NETWORK_LOGGING || process.env.ENABLE_VERBOSE_NETWORK_LOGGING ? _responseLogger2.default.create : undefined,
  /* eslint-enable no-extra-parens */
  RequestTimingInterceptor: _requestTiming2.default.create,
  UrlInterceptor: undefined,
  SparkUserAgentInterceptor: _sparkUserAgent2.default.create,
  AuthInterceptor: _auth2.default.create,
  KmsDryErrorInterceptor: undefined,
  PayloadTransformerInterceptor: _payloadTransformer2.default.create,
  ConversationInterceptor: undefined,
  RedirectInterceptor: _redirect2.default.create,
  HttpStatusInterceptor: function HttpStatusInterceptor() {
    return _httpCore.HttpStatusInterceptor.create({
      error: _sparkHttpError2.default
    });
  },

  NetworkTimingInterceptor: _networkTiming2.default.create
};

var preInterceptors = ['ResponseLoggerInterceptor', 'RequestTimingInterceptor', 'RequestEventInterceptor', 'SparkTrackingIdInterceptor', 'RateLimitInterceptor'];

var postInterceptors = ['HttpStatusInterceptor', 'NetworkTimingInterceptor', 'RequestLoggerInterceptor', 'RateLimitInterceptor'];

/**
 * @class
 */
var SparkCore = _ampersandState2.default.extend((_obj = {
  version: '1.32.23',

  children: {
    internal: _sparkInternalCore2.default
  },

  constructor: function constructor() {
    var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments[1];

    if (typeof attrs === 'string') {
      attrs = {
        credentials: {
          supertoken: {
            // eslint-disable-next-line camelcase
            access_token: attrs
          }
        }
      };
    } else {
      // Reminder: order is important here
      ['credentials.authorization', 'authorization', 'credentials.supertoken.supertoken', 'supertoken', 'access_token', 'credentials.authorization.supertoken'].forEach(function (path) {
        var val = (0, _get3.default)(attrs, path);
        if (val) {
          (0, _unset3.default)(attrs, path);
          (0, _set3.default)(attrs, 'credentials.supertoken', val);
        }
      });

      ['credentials', 'credentials.authorization'].forEach(function (path) {
        var val = (0, _get3.default)(attrs, path);
        if (typeof val === 'string') {
          (0, _unset3.default)(attrs, path);
          (0, _set3.default)(attrs, 'credentials.supertoken', val);
        }
      });

      if (typeof (0, _get3.default)(attrs, 'credentials.access_token') === 'string') {
        (0, _set3.default)(attrs, 'credentials.supertoken', attrs.credentials);
      }
    }

    return (0, _apply2.default)(_ampersandState2.default, this, [attrs, options]);
  },


  derived: {
    boundedStorage: {
      deps: [],
      fn: function fn() {
        return (0, _storage.makeSparkStore)('bounded', this);
      }
    },
    unboundedStorage: {
      deps: [],
      fn: function fn() {
        return (0, _storage.makeSparkStore)('unbounded', this);
      }
    },
    ready: {
      deps: ['loaded', 'internal.ready'],
      fn: function fn() {
        var _this = this;

        return this.loaded && (0, _keys2.default)(this._children).reduce(function (ready, name) {
          return ready && _this[name] && _this[name].ready !== false;
        }, true);
      }
    }
  },

  session: {
    config: {
      type: 'object'
    },
    /**
     * When true, indicates that the initial load from the storage layer is
     * complete
     * @instance
     * @memberof SparkCore
     * @type {boolean}
     */
    loaded: {
      default: false,
      type: 'boolean'
    },
    request: {
      setOnce: true,
      // It's supposed to be a function, but that's not a type defined in
      // Ampersand
      type: 'any'
    },
    sessionId: {
      setOnce: true,
      type: 'string'
    }
  },

  /**
   * @instance
   * @memberof SparkCore
   * @param {[type]} args
   * @returns {[type]}
   */
  refresh: function refresh() {
    var _credentials;

    return (_credentials = this.credentials).refresh.apply(_credentials, arguments);
  },


  /**
   * Applies the directionally appropriate transforms to the specified object
   * @param {string} direction
   * @param {Object} object
   * @returns {Promise}
   */
  transform: function transform(direction, object) {
    var _this2 = this;

    var predicates = this.config.payloadTransformer.predicates.filter(function (p) {
      return !p.direction || p.direction === direction;
    });
    var ctx = {
      spark: this
    };
    return _promise2.default.all(predicates.map(function (p) {
      return p.test(ctx, object).then(function (shouldTransform) {
        if (!shouldTransform) {
          return undefined;
        }
        return p.extract(object)
        // eslint-disable-next-line max-nested-callbacks
        .then(function (target) {
          return {
            name: p.name,
            target: target
          };
        });
      });
    })).then(function (data) {
      return data.filter(function (d) {
        return Boolean(d);
      })
      // eslint-disable-next-line max-nested-callbacks
      .reduce(function (promise, _ref) {
        var name = _ref.name,
            target = _ref.target,
            alias = _ref.alias;
        return promise.then(function () {
          if (alias) {
            return _this2.applyNamedTransform(direction, alias, target);
          }
          return _this2.applyNamedTransform(direction, name, target);
        });
      }, _promise2.default.resolve());
    }).then(function () {
      return object;
    });
  },


  /**
   * Applies the directionally appropriate transform to the specified parameters
   * @param {string} direction
   * @param {Object} ctx
   * @param {string} name
   * @returns {Promise}
   */
  applyNamedTransform: function applyNamedTransform(direction, ctx, name) {
    for (var _len = arguments.length, rest = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      rest[_key - 3] = arguments[_key];
    }

    var _this3 = this;

    if ((0, _isString3.default)(ctx)) {
      rest.unshift(name);
      name = ctx;
      ctx = {
        spark: this,
        transform: function transform() {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return _this3.applyNamedTransform.apply(_this3, [direction, ctx].concat(args));
        }
      };
    }

    var transforms = ctx.spark.config.payloadTransformer.transforms.filter(function (tx) {
      return tx.name === name && (!tx.direction || tx.direction === direction);
    });
    // too many implicit returns on the same line is difficult to interpret
    // eslint-disable-next-line arrow-body-style
    return transforms.reduce(function (promise, tx) {
      return promise.then(function () {
        if (tx.alias) {
          var _ctx;

          return (_ctx = ctx).transform.apply(_ctx, [tx.alias].concat((0, _toConsumableArray3.default)(rest)));
        }
        return _promise2.default.resolve(tx.fn.apply(tx, [ctx].concat((0, _toConsumableArray3.default)(rest))));
      });
    }, _promise2.default.resolve()).then(function () {
      return (0, _last3.default)(rest);
    });
  },


  /**
   * @private
   * @returns {Window}
   */
  getWindow: function getWindow() {
    // eslint-disable-next-line
    return window;
  },


  /**
   * Initializer
   *
   * @emits SparkCore#loaded
   * @emits SparkCore#ready
   * @instance
   * @memberof SparkCore
   * @param {Object} attrs
   * @returns {SparkCore}
   */
  initialize: function initialize() {
    var _this4 = this;

    var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.config = (0, _merge3.default)({}, _config2.default, attrs.config);

    // There's some unfortunateness with the way {@link AmpersandState#children}
    // get initialized. We'll fire the change:config event so that
    // {@link SparkPlugin#initialize()} can use
    // `this.listenToOnce(parent, 'change:config', () => {});` to act on config
    // during initialization
    this.trigger('change:config');

    var onLoaded = function onLoaded() {
      if (_this4.loaded) {
        /**
         * Fires when all data has been loaded from the storage layer
         * @event loaded
         * @instance
         * @memberof SparkCore
         */
        _this4.trigger('loaded');

        _this4.stopListening(_this4, 'change:loaded', onLoaded);
      }
    };

    // This needs to run on nextTick or we'll never be able to wire up listeners
    process.nextTick(function () {
      _this4.listenToAndRun(_this4, 'change:loaded', onLoaded);
    });

    var onReady = function onReady() {
      if (_this4.ready) {
        /**
         * Fires when all plugins have fully initialized
         * @event ready
         * @instance
         * @memberof SparkCore
         */
        _this4.trigger('ready');

        _this4.stopListening(_this4, 'change:ready', onReady);
      }
    };

    // This needs to run on nextTick or we'll never be able to wire up listeners
    process.nextTick(function () {
      _this4.listenToAndRun(_this4, 'change:ready', onReady);
    });

    // Make nested events propagate in a consistent manner
    (0, _keys2.default)(this.constructor.prototype._children).forEach(function (key) {
      _this4.listenTo(_this4[key], 'change', function () {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        args.unshift('change:' + key);
        _this4.trigger.apply(_this4, args);
      });
    });

    var addInterceptor = function addInterceptor(ints, key) {
      var interceptor = interceptors[key];

      if (!(0, _isFunction3.default)(interceptor)) {
        return ints;
      }

      ints.push((0, _apply2.default)(interceptor, _this4, []));

      return ints;
    };

    var ints = [];
    ints = preInterceptors.reduce(addInterceptor, ints);
    ints = (0, _keys2.default)(interceptors).filter(function (key) {
      return !(preInterceptors.includes(key) || postInterceptors.includes(key));
    }).reduce(addInterceptor, ints);
    ints = postInterceptors.reduce(addInterceptor, ints);

    this.request = (0, _httpCore.defaults)({
      json: true,
      interceptors: ints
    });

    var sessionId = (0, _get3.default)(this, 'config.trackingIdPrefix', 'spark-js-sdk') + '_' + (0, _get3.default)(this, 'config.trackingIdBase', _uuid2.default.v4());
    if ((0, _has3.default)(this, 'config.trackingIdPrefix')) {
      sessionId += '_' + (0, _get3.default)(this, 'config.trackingIdPrefix');
    }

    this.sessionId = sessionId;
  },


  /**
   * @instance
   * @memberof SparkPlugin
   * @param {number} depth
   * @private
   * @returns {Object}
   */
  inspect: function inspect(depth) {
    return _util2.default.inspect((0, _omit3.default)(this.serialize({
      props: true,
      session: true,
      derived: true
    }), 'boundedStorage', 'unboundedStorage', 'request', 'config'), { depth: depth });
  },


  /**
   * Invokes all `onBeforeLogout` handlers in the scope of their plugin, clears
   * all stores, and revokes the access token
   * Note: If you're using the sdk in a server environment, you may be more
   * interested in {@link `spark.internal.mercury.disconnect()`| Mercury#disconnect()}
   * and {@link `spark.internal.device.unregister()`|Device#unregister()}
   * or {@link `spark.phone.unregister()`|Phone#unregister}
   * @instance
   * @memberof SparkCore
   * @param {Object} options Passed as the first argument to all
   * `onBeforeLogout` handlers
   * @returns {Promise}
   */
  logout: function logout(options) {
    var _this5 = this;

    for (var _len4 = arguments.length, rest = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      rest[_key4 - 1] = arguments[_key4];
    }

    // prefer the refresh token, but for clients that don't have one, fallback
    // to the access token
    var token = this.credentials.supertoken && (this.credentials.supertoken.refresh_token || this.credentials.supertoken.access_token);
    options = (0, _assign2.default)({ token: token }, options);
    // onBeforeLogout should be executed in the opposite order in which handlers
    // were registered. In that way, wdm unregister() will be above mercury
    // disconnect(), but disconnect() will execute first.
    // eslint-disable-next-line arrow-body-style
    return this.config.onBeforeLogout.reverse().reduce(function (promise, _ref2) {
      var plugin = _ref2.plugin,
          fn = _ref2.fn;
      return promise.then(function () {
        return _promise2.default.resolve((0, _apply2.default)(fn, _this5[plugin] || _this5.internal[plugin], [options].concat((0, _toConsumableArray3.default)(rest))))
        // eslint-disable-next-line max-nested-callbacks
        .catch(function (err) {
          _this5.logger.warn('onBeforeLogout from plugin ' + plugin + ': failed', err);
        });
      });
    }, _promise2.default.resolve()).then(function () {
      return _promise2.default.all([_this5.boundedStorage.clear(), _this5.unboundedStorage.clear()]);
    }).then(function () {
      var _credentials2;

      return (_credentials2 = _this5.credentials).invalidate.apply(_credentials2, (0, _toConsumableArray3.default)(rest));
    }).then(function () {
      var _authorization;

      return _this5.authorization && _this5.authorization.logout && (_authorization = _this5.authorization).logout.apply(_authorization, [options].concat((0, _toConsumableArray3.default)(rest)));
    }).then(function () {
      return _this5.trigger('client:logout');
    });
  },


  /**
   * General purpose wrapper to submit metrics via the metrics plugin (if the
   * metrics plugin is installed)
   * @instance
   * @memberof SparkCore
   * @returns {Promise}
   */
  measure: function measure() {
    if (this.metrics) {
      var _metrics;

      return (_metrics = this.metrics).sendUnstructured.apply(_metrics, arguments);
    }

    return _promise2.default.resolve();
  },
  upload: function upload(options) {
    var _this6 = this;

    if (!options.file) {
      return _promise2.default.reject(new Error('`options.file` is required'));
    }

    options.phases = options.phases || {};
    options.phases.initialize = options.phases.initialize || {};
    options.phases.upload = options.phases.upload || {};
    options.phases.finalize = options.phases.finalize || {};

    (0, _defaults3.default)(options.phases.initialize, {
      method: 'POST'
    }, (0, _omit3.default)(options, 'file', 'phases'));

    (0, _defaults3.default)(options.phases.upload, {
      method: 'PUT',
      json: false,
      withCredentials: false,
      body: options.file,
      headers: {
        'x-trans-id': _uuid2.default.v4(),
        authorization: undefined
      }
    });

    (0, _defaults3.default)(options.phases.finalize, {
      method: 'POST'
    }, (0, _omit3.default)(options, 'file', 'phases'));

    var shunt = new _events.EventEmitter();

    var promise = this._uploadPhaseInitialize(options).then(function () {
      var p = _this6._uploadPhaseUpload(options);
      (0, _common.transferEvents)('progress', p, shunt);
      return p;
    }).then(function () {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return _this6._uploadPhaseFinalize.apply(_this6, [options].concat(args));
    }).then(function (res) {
      return res.body;
    });

    (0, _common.proxyEvents)(shunt, promise);

    return promise;
  },


  _uploadPhaseInitialize: function _uploadPhaseInitialize(options) {
    var _this7 = this;

    this.logger.debug('client: initiating upload session');

    return this.request(options.phases.initialize).then(function () {
      for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      return _this7._uploadApplySession.apply(_this7, [options].concat(args));
    }).then(function (res) {
      _this7.logger.debug('client: initiated upload session');
      return res;
    });
  },

  _uploadApplySession: function _uploadApplySession(options, res) {
    var session = res.body;
    ['upload', 'finalize'].reduce(function (opts, key) {
      opts[key] = (0, _keys2.default)(opts[key]).reduce(function (phaseOptions, phaseKey) {
        if (phaseKey.startsWith('$')) {
          phaseOptions[phaseKey.substr(1)] = phaseOptions[phaseKey](session);
          (0, _deleteProperty2.default)(phaseOptions, phaseKey);
        }

        return phaseOptions;
      }, opts[key]);

      return opts;
    }, options.phases);
  },
  _uploadPhaseUpload: function _uploadPhaseUpload(options) {
    var _this8 = this;

    this.logger.debug('client: uploading file');

    var promise = this.request(options.phases.upload).then(function (res) {
      _this8.logger.debug('client: uploaded file');
      return res;
    });

    (0, _common.proxyEvents)(options.phases.upload.upload, promise);

    /* istanbul ignore else */
    if (process.env.NODE_ENV === 'test') {
      promise.on('progress', function (event) {
        _this8.logger.info('upload progress', event.loaded, event.total);
      });
    }

    return promise;
  },


  _uploadPhaseFinalize: function _uploadPhaseFinalize(options) {
    var _this9 = this;

    this.logger.debug('client: finalizing upload session');

    return this.request(options.phases.finalize).then(function (res) {
      _this9.logger.debug('client: finalized upload session');
      return res;
    });
  }
}, (_applyDecoratedDescriptor(_obj, '_uploadPhaseUpload', [_common.retry], (0, _getOwnPropertyDescriptor2.default)(_obj, '_uploadPhaseUpload'), _obj)), _obj));

SparkCore.version = '1.32.23';

(0, _sparkInternalCorePluginMixin2.default)(_sparkInternalCore2.default, _config2.default, interceptors);
(0, _sparkCorePluginMixin2.default)(SparkCore, _config2.default, interceptors);

exports.default = SparkCore;

/**
 * @method registerPlugin
 * @param {string} name
 * @param {function} constructor
 * @param {Object} options
 * @param {Array<string>} options.proxies
 * @param {Object} options.interceptors
 * @returns {null}
 */

function registerPlugin(name, constructor, options) {
  SparkCore.registerPlugin(name, constructor, options);
}

/**
 * Registers plugins used by internal products that do not talk to public APIs.
 * @method registerInternalPlugin
 * @param {string} name
 * @param {function} constructor
 * @param {Object} options
 * @param {Object} options.interceptors
 * @private
 * @returns {null}
 */
function registerInternalPlugin(name, constructor, options) {
  _sparkInternalCore2.default.registerPlugin(name, constructor, options);
}
//# sourceMappingURL=spark-core.js.map
