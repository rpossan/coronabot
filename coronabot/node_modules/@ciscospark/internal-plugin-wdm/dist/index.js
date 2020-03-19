'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.DeviceUrlInterceptor = exports.UrlInterceptor = exports.EmbargoInterceptor = exports.ServiceModel = exports.ServiceCollection = exports.FeatureModel = exports.FeatureCollection = exports.FeaturesModel = exports.Device = exports.default = undefined;

var _device = require('./device');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_device).default;
  }
});
Object.defineProperty(exports, 'Device', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_device).default;
  }
});

var _featuresModel = require('./device/features-model');

Object.defineProperty(exports, 'FeaturesModel', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_featuresModel).default;
  }
});

var _featureCollection = require('./device/feature-collection');

Object.defineProperty(exports, 'FeatureCollection', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_featureCollection).default;
  }
});

var _featureModel = require('./device/feature-model');

Object.defineProperty(exports, 'FeatureModel', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_featureModel).default;
  }
});

var _serviceCollection = require('./device/service-collection');

Object.defineProperty(exports, 'ServiceCollection', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_serviceCollection).default;
  }
});

var _serviceModel = require('./device/service-model');

Object.defineProperty(exports, 'ServiceModel', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_serviceModel).default;
  }
});

var _embargo = require('./interceptors/embargo');

Object.defineProperty(exports, 'EmbargoInterceptor', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_embargo).default;
  }
});

var _url = require('./interceptors/url');

Object.defineProperty(exports, 'UrlInterceptor', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_url).default;
  }
});

var _deviceUrl = require('./interceptors/device-url');

Object.defineProperty(exports, 'DeviceUrlInterceptor', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_deviceUrl).default;
  }
});

var _config = require('./config');

Object.defineProperty(exports, 'config', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_config).default;
  }
});

var _sparkCore = require('@ciscospark/spark-core');

var _device2 = _interopRequireDefault(_device);

var _config2 = _interopRequireDefault(_config);

var _url2 = _interopRequireDefault(_url);

var _deviceUrl2 = _interopRequireDefault(_deviceUrl);

var _embargo2 = _interopRequireDefault(_embargo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*!
 * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
 */

(0, _sparkCore.registerInternalPlugin)('device', _device2.default, {
  interceptors: {
    UrlInterceptor: _url2.default.create,
    DeviceUrlInterceptor: _deviceUrl2.default.create,
    EmbargoInterceptor: _embargo2.default.create
  },
  config: _config2.default,
  onBeforeLogout: function onBeforeLogout() {
    return this.unregister();
  }
});
//# sourceMappingURL=index.js.map
