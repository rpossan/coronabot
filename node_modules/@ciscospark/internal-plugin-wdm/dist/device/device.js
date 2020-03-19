'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _apply = require('babel-runtime/core-js/reflect/apply');

var _apply2 = _interopRequireDefault(_apply);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _desc, _value, _obj; /*!
                                                                                        * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
                                                                                        */

var _common = require('@ciscospark/common');

var _commonTimers = require('@ciscospark/common-timers');

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _featuresModel = require('./features-model');

var _featuresModel2 = _interopRequireDefault(_featuresModel);

var _serviceCollection = require('./service-collection');

var _serviceCollection2 = _interopRequireDefault(_serviceCollection);

var _sparkCore = require('@ciscospark/spark-core');

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

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

/**
 * Decides if this device should be persisted to boundedStorage, based on
 * this.config.ephemeral.
 * @returns {Boolean}
 */
function decider() {
  return !this.config.ephemeral;
}

var Device = _sparkCore.SparkPlugin.extend((_dec = (0, _sparkCore.waitForValue)('@'), _dec2 = (0, _sparkCore.waitForValue)('@'), _dec3 = (0, _sparkCore.persist)('@', decider), _dec4 = (0, _sparkCore.waitForValue)('@'), _dec5 = (0, _sparkCore.waitForValue)('@'), _dec6 = (0, _sparkCore.waitForValue)('@'), _dec7 = (0, _sparkCore.waitForValue)('@'), _dec8 = (0, _sparkCore.waitForValue)('@'), _dec9 = (0, _sparkCore.waitForValue)('@'), (_obj = {
  children: {
    features: _featuresModel2.default
  },

  collections: {
    serviceCatalog: _serviceCollection2.default
  },

  idAttribute: 'url',

  namespace: 'Device',

  props: {
    // deviceType doesn't have any real value, but we need to send it during
    // device refresh to make sure we don't get back an ios device url
    deviceType: 'string',
    intranetInactivityDuration: 'number',
    intranetInactivityCheckUrl: 'string',
    modificationTime: 'string',
    searchEncryptionKeyUrl: 'string',
    services: {
      // Even though @jodykstr will tell you the docs claim you don't need to
      // initialize `object` properties, the docs lie.
      default: function _default() {
        return {};
      },

      type: 'object'
    },
    serviceHostMap: {
      default: function _default() {
        return {
          serviceLinks: {},
          hostCatalog: {}
        };
      },

      type: 'object'
    },
    url: 'string',
    userId: 'string',
    /**
     * Notifies the client if file sharing is disabled.
     * Currently, the values for it are:
     * - BLOCK_BOTH
     * - BLOCK_UPLOAD
     * @instance
     * @memberof Device
     * @type {string}
     */
    webFileShareControl: 'string',
    webSocketUrl: 'string'
  },

  derived: {
    registered: {
      deps: ['url'],
      fn: function fn() {
        return Boolean(this.url);
      }
    }
  },

  session: {
    // Fun Fact: setTimeout returns a Timer object instead of a Number in Node 6
    // or later
    logoutTimer: 'any',
    lastUserActivityDate: 'number'
  },

  determineService: function determineService(url) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(this.services)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        var serviceUrl = this.services[key];
        if (url.startsWith(serviceUrl)) {
          // "ServiceUrl" is 10 characters
          return _promise2.default.resolve(key.substr(0, key.length - 10));
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return _promise2.default.reject(new Error(url + ' does not reflect a known service'));
  },
  getServiceUrl: function getServiceUrl(service) {
    var _this = this;

    return this._getServiceUrl(this.services, service).then(function (isServiceUrl) {
      return isServiceUrl || _this.getPreDiscoveryServiceUrl(service);
    });
  },
  getPreDiscoveryServiceUrl: function getPreDiscoveryServiceUrl(service) {
    // The Promise.resolve here is temporary. A future PR will make the
    // corresponding _ method async to allow for lazy device registration
    return _promise2.default.resolve(this._getServiceUrl(this.config.preDiscoveryServices, service));
  },
  getWebSocketUrl: function getWebSocketUrl() {
    return this.useServiceCatalogUrl(this.webSocketUrl);
  },
  useServiceCatalogUrl: function useServiceCatalogUrl(uri) {
    return this.serviceCatalog.inferServiceFromUrl(uri).then(function (s) {
      return s.replaceUrlWithCurrentHost(uri);
    });
  },
  markUrlFailedAndGetNew: function markUrlFailedAndGetNew(url) {
    var _this2 = this;

    if (!url) {
      return _promise2.default.reject(new Error('`url` is a required parameter'));
    }

    this.logger.info('device: marking ' + url + ' as failed');
    return this.serviceCatalog.markFailedAndCycleUrl(url).then(function (uri) {
      _this2.spark.internal.metrics.submitClientMetrics('web-ha', {
        tags: {
          action: 'replace_url',
          failedUrl: url,
          newUrl: uri
        }
      });
      return uri;
    })
    // it's likely we fail here because we've cycled though all hosts,
    // reset all hosts and then retry connecting
    .catch(function () {
      return _this2._resetAllAndRetry(url);
    });
  },
  _resetAllAndRetry: function _resetAllAndRetry(url) {
    if (!url) {
      return _promise2.default.reject(new Error('`url` is a required parameter'));
    }

    this.logger.info('device: reset available hosts and retry ' + url);
    return this.serviceCatalog.resetAllAndRetry(url);
  },


  // this function is exposed beyond the device file
  fetchNewUrls: function fetchNewUrls(url) {
    var _this3 = this;

    // we want to get the current service first, just in case the
    // refreshed catalog has different host names
    return new _promise2.default(function (resolve) {
      return _this3.serviceCatalog.inferServiceFromUrl(url).then(function (s) {
        _this3.logger.info('device: refresh to ' + s.service + ' get new urls');
        _this3.refresh();
        _this3.on('serviceCatalogUpdated', function () {
          return resolve(s.url);
        });
      });
    });
  },
  initialize: function initialize() {
    var _this4 = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    (0, _apply2.default)(_sparkCore.SparkPlugin.prototype.initialize, this, args);

    // Propagate change(:[attribute]) events from collections
    ['developer', 'entitlement', 'user'].forEach(function (collectionName) {
      _this4.features.on('change:' + collectionName, function (model, value, options) {
        _this4.trigger('change', _this4, options);
        _this4.trigger('change:features', _this4, _this4.features, options);
      });
    });

    this.on('change:serviceHostMap', this._updateServiceCatalog);

    this.listenToAndRun(this, 'change:intranetInactivityCheckUrl', function () {
      return _this4._resetLogoutTimer();
    });
    this.listenToAndRun(this, 'change:intranetInactivityDuration', function () {
      return _this4._resetLogoutTimer();
    });
    this.listenTo(this.spark, 'user-activity', function () {
      _this4.lastUserActivityDate = Date.now();
    });
  },


  /**
   * Don't log the features object
   * @param {number} depth
   * @returns {Object}
   */
  inspect: function inspect(depth) {
    return _util2.default.inspect((0, _omit3.default)(this.serialize(), 'features'), { depth: depth });
  },
  isPreDiscoveryService: function isPreDiscoveryService(service) {
    // The Promise.resolve here is temporary. A future PR will make the
    // corresponding _ method async to allow for lazy device registration
    return _promise2.default.resolve(this._isService(this.config.preDiscoveryServices, service));
  },
  isPreDiscoveryServiceUrl: function isPreDiscoveryServiceUrl(uri) {
    // The Promise.resolve here is temporary. A future PR will make the
    // corresponding _ method async to allow for lazy device registration
    return _promise2.default.resolve(this._isServiceUrl(this.config.preDiscoveryServices, uri));
  },
  isService: function isService(service) {
    var _this5 = this;

    return this._isService(this.services, service).then(function (_isService) {
      return _isService || _this5.isPreDiscoveryService(service);
    });
  },
  isServiceUrl: function isServiceUrl(uri) {
    // The Promise.resolve here is temporary. A future PR will make the
    // corresponding _ method async to allow for lazy device registration
    return _promise2.default.resolve(this._isServiceUrl(this.services, uri));
  },
  isSpecificService: function isSpecificService(service, key) {
    if (key === service) {
      return _promise2.default.resolve(true);
    }

    return this.getServiceUrl(service).then(function (serviceUrl) {
      return key.includes(serviceUrl);
    });
  },
  _getServiceUrl: function _getServiceUrl(target, service) {
    /* istanbul ignore if */
    if (!target) {
      return _promise2.default.reject(new Error('`target` is a required parameter'));
    }

    if (!service) {
      return _promise2.default.reject(new Error('`service` is a required parameter'));
    }

    var feature = this.features.developer.get('web-ha-messaging');
    if (feature && feature.value) {
      var s = this.serviceCatalog.get(service + 'ServiceUrl');
      if (s) {
        return _promise2.default.resolve(s.url);
      }
    }

    return _promise2.default.resolve(target[service + 'ServiceUrl']);
  },
  _isService: function _isService(target, service) {
    return this._getServiceUrl(target, service).then(function (url) {
      return Boolean(url);
    });
  },
  _isServiceUrl: function _isServiceUrl(target, uri) {
    if (!uri) {
      return _promise2.default.reject(new Error('`uri` is a required parameter'));
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = (0, _getIterator3.default)((0, _values2.default)(target)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var value = _step2.value;

        if (value && uri.startsWith(value)) {
          return _promise2.default.resolve(true);
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return _promise2.default.resolve(false);
  },
  refresh: function refresh() {
    var _this6 = this;

    this.logger.info('device: refreshing');

    if (!this.registered) {
      this.logger.info('device: device not registered, registering');
      return this.register();
    }

    var body = (0, _omit3.default)(this.serialize(), 'features', 'mediaClusters');
    if (this.config.ephemeral) {
      body.ttl = this.config.ephemeralDeviceTTL;
    }

    return this.request({
      method: 'PUT',
      uri: this.url,
      body: body
    }).then(function (res) {
      return _this6._processRegistrationSuccess(res);
    }).catch(function (reason) {
      if (reason.statusCode === 404) {
        // If we get a 404, it means the device is no longer valid and we need
        // to register a new one.
        _this6.logger.info('device: refresh failed with 404, attempting to register new device');
        _this6.clear();
        return _this6.register();
      }
      return _promise2.default.reject(reason);
    });
  },
  register: function register() {
    var _this7 = this;

    /* eslint no-invalid-this: [0] */
    this.logger.info('device: registering');

    if (this.registered) {
      this.logger.info('device: device already registered, refreshing');
      return this.refresh();
    }

    var body = this.config.defaults;
    if (this.config.ephemeral) {
      body.ttl = this.config.ephemeralDeviceTTL;
    }

    return this.request({
      method: 'POST',
      service: 'wdm',
      resource: 'devices',
      body: body
    }).then(function (res) {
      return _this7._processRegistrationSuccess(res);
    });
  },
  unregister: function unregister() {
    var _this8 = this;

    this.logger.info('device: unregistering');

    if (!this.url) {
      this.logger.warn('device: not registered');
      return _promise2.default.resolve();
    }

    return this.request({
      uri: this.url,
      method: 'DELETE'
    }).then(function () {
      return _this8.clear();
    });
  },
  clear: function clear() {
    clearTimeout(this.refreshTimer);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    (0, _apply2.default)(_sparkCore.SparkPlugin.prototype.clear, this, args);
  },
  _processRegistrationSuccess: function _processRegistrationSuccess(res) {
    var _this9 = this;

    this.logger.info('device: received registration payload');
    this.set(res.body);
    if (this.config.ephemeral) {
      this.logger.info('device: enqueing device refresh');
      var delay = (this.config.ephemeralDeviceTTL / 2 + 60) * 1000;
      this.refreshTimer = (0, _commonTimers.safeSetTimeout)(function () {
        return _this9.refresh();
      }, delay);
    }
  },
  _updateServiceCatalog: function _updateServiceCatalog(newRegistration) {
    var _this10 = this;

    var feature = this.features.developer.get('web-ha-messaging');
    if (feature && feature.value) {
      if (newRegistration.serviceHostMap && newRegistration.serviceHostMap.hostCatalog) {
        (0, _keys2.default)(newRegistration.services).forEach(function (service) {
          var uri = newRegistration.services[service];
          var u = _url2.default.parse(uri);
          var hosts = newRegistration.serviceHostMap.hostCatalog[u.host];
          _this10.serviceCatalog.set({
            service: service,
            defaultUrl: uri,
            availableHosts: hosts || []
          }, { remove: false });
        });
        this.trigger('serviceCatalogUpdated');
      } else {
        // if user has old device in localStorage, refresh device
        this.refresh();
      }
    }
  },
  _resetLogoutTimer: function _resetLogoutTimer() {
    var _this11 = this;

    clearTimeout(this.logoutTimer);
    this.unset('logoutTimer');
    if (this.config.enableInactivityEnforcement && this.intranetInactivityCheckUrl && this.intranetInactivityDuration) {
      this.once('change:lastUserActivityDate', function () {
        return _this11._resetLogoutTimer();
      });

      var timer = (0, _commonTimers.safeSetTimeout)(function () {
        _this11.spark.request({
          headers: {
            'cisco-no-http-redirect': null,
            'spark-user-agent': null,
            trackingid: null
          },
          method: 'GET',
          uri: _this11.intranetInactivityCheckUrl
        }).catch(function () {
          _this11.logger.info('device: did not reach internal ping endpoint; logging out after inactivity on a public network');
          return _this11.spark.logout();
        }).catch(function (reason) {
          _this11.logger.warn('device: logout failed', reason);
        });
      }, this.intranetInactivityDuration * 1000);

      this.logoutTimer = timer;
    }
  },
  version: '1.32.23'
}, (_applyDecoratedDescriptor(_obj, 'determineService', [_dec], (0, _getOwnPropertyDescriptor2.default)(_obj, 'determineService'), _obj), _applyDecoratedDescriptor(_obj, 'getServiceUrl', [_dec2], (0, _getOwnPropertyDescriptor2.default)(_obj, 'getServiceUrl'), _obj), _applyDecoratedDescriptor(_obj, 'initialize', [_dec3], (0, _getOwnPropertyDescriptor2.default)(_obj, 'initialize'), _obj), _applyDecoratedDescriptor(_obj, 'isService', [_dec4], (0, _getOwnPropertyDescriptor2.default)(_obj, 'isService'), _obj), _applyDecoratedDescriptor(_obj, 'isServiceUrl', [_dec5], (0, _getOwnPropertyDescriptor2.default)(_obj, 'isServiceUrl'), _obj), _applyDecoratedDescriptor(_obj, 'isSpecificService', [_dec6], (0, _getOwnPropertyDescriptor2.default)(_obj, 'isSpecificService'), _obj), _applyDecoratedDescriptor(_obj, 'refresh', [_common.oneFlight, _dec7], (0, _getOwnPropertyDescriptor2.default)(_obj, 'refresh'), _obj), _applyDecoratedDescriptor(_obj, 'register', [_common.oneFlight, _dec8], (0, _getOwnPropertyDescriptor2.default)(_obj, 'register'), _obj), _applyDecoratedDescriptor(_obj, 'unregister', [_common.oneFlight, _dec9], (0, _getOwnPropertyDescriptor2.default)(_obj, 'unregister'), _obj)), _obj)));

exports.default = Device;
//# sourceMappingURL=device.js.map
