'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.Page = exports.Batcher = exports.RateLimitInterceptor = exports.SparkUserAgentInterceptor = exports.SparkTrackingIdInterceptor = exports.RequestTimingInterceptor = exports.RequestLoggerInterceptor = exports.RequestEventInterceptor = exports.ResponseLoggerInterceptor = exports.RedirectInterceptor = exports.PayloadTransformerInterceptor = exports.NetworkTimingInterceptor = exports.AuthInterceptor = exports.SparkPlugin = exports.SparkHttpError = exports.registerInternalPlugin = exports.registerPlugin = exports.default = exports.children = exports.waitForValue = exports.StorageError = exports.persist = exports.NotFoundError = exports.MemoryStoreAdapter = exports.makeSparkPluginStore = exports.makeSparkStore = exports.Token = exports.sortScope = exports.grantErrors = exports.filterScope = exports.Credentials = undefined;

var _credentials = require('./lib/credentials');

Object.defineProperty(exports, 'Credentials', {
  enumerable: true,
  get: function get() {
    return _credentials.Credentials;
  }
});
Object.defineProperty(exports, 'filterScope', {
  enumerable: true,
  get: function get() {
    return _credentials.filterScope;
  }
});
Object.defineProperty(exports, 'grantErrors', {
  enumerable: true,
  get: function get() {
    return _credentials.grantErrors;
  }
});
Object.defineProperty(exports, 'sortScope', {
  enumerable: true,
  get: function get() {
    return _credentials.sortScope;
  }
});
Object.defineProperty(exports, 'Token', {
  enumerable: true,
  get: function get() {
    return _credentials.Token;
  }
});

var _storage = require('./lib/storage');

Object.defineProperty(exports, 'makeSparkStore', {
  enumerable: true,
  get: function get() {
    return _storage.makeSparkStore;
  }
});
Object.defineProperty(exports, 'makeSparkPluginStore', {
  enumerable: true,
  get: function get() {
    return _storage.makeSparkPluginStore;
  }
});
Object.defineProperty(exports, 'MemoryStoreAdapter', {
  enumerable: true,
  get: function get() {
    return _storage.MemoryStoreAdapter;
  }
});
Object.defineProperty(exports, 'NotFoundError', {
  enumerable: true,
  get: function get() {
    return _storage.NotFoundError;
  }
});
Object.defineProperty(exports, 'persist', {
  enumerable: true,
  get: function get() {
    return _storage.persist;
  }
});
Object.defineProperty(exports, 'StorageError', {
  enumerable: true,
  get: function get() {
    return _storage.StorageError;
  }
});
Object.defineProperty(exports, 'waitForValue', {
  enumerable: true,
  get: function get() {
    return _storage.waitForValue;
  }
});

var _sparkCore = require('./spark-core');

Object.defineProperty(exports, 'children', {
  enumerable: true,
  get: function get() {
    return _sparkCore.children;
  }
});
Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_sparkCore).default;
  }
});
Object.defineProperty(exports, 'registerPlugin', {
  enumerable: true,
  get: function get() {
    return _sparkCore.registerPlugin;
  }
});
Object.defineProperty(exports, 'registerInternalPlugin', {
  enumerable: true,
  get: function get() {
    return _sparkCore.registerInternalPlugin;
  }
});

var _sparkHttpError = require('./lib/spark-http-error');

Object.defineProperty(exports, 'SparkHttpError', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_sparkHttpError).default;
  }
});

var _sparkPlugin = require('./lib/spark-plugin');

Object.defineProperty(exports, 'SparkPlugin', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_sparkPlugin).default;
  }
});

var _auth = require('./interceptors/auth');

Object.defineProperty(exports, 'AuthInterceptor', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_auth).default;
  }
});

var _networkTiming = require('./interceptors/network-timing');

Object.defineProperty(exports, 'NetworkTimingInterceptor', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_networkTiming).default;
  }
});

var _payloadTransformer = require('./interceptors/payload-transformer');

Object.defineProperty(exports, 'PayloadTransformerInterceptor', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_payloadTransformer).default;
  }
});

var _redirect = require('./interceptors/redirect');

Object.defineProperty(exports, 'RedirectInterceptor', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_redirect).default;
  }
});

var _responseLogger = require('./interceptors/response-logger');

Object.defineProperty(exports, 'ResponseLoggerInterceptor', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_responseLogger).default;
  }
});

var _requestEvent = require('./interceptors/request-event');

Object.defineProperty(exports, 'RequestEventInterceptor', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_requestEvent).default;
  }
});

var _requestLogger = require('./interceptors/request-logger');

Object.defineProperty(exports, 'RequestLoggerInterceptor', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_requestLogger).default;
  }
});

var _requestTiming = require('./interceptors/request-timing');

Object.defineProperty(exports, 'RequestTimingInterceptor', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_requestTiming).default;
  }
});

var _sparkTrackingId = require('./interceptors/spark-tracking-id');

Object.defineProperty(exports, 'SparkTrackingIdInterceptor', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_sparkTrackingId).default;
  }
});

var _sparkUserAgent = require('./interceptors/spark-user-agent');

Object.defineProperty(exports, 'SparkUserAgentInterceptor', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_sparkUserAgent).default;
  }
});

var _rateLimit = require('./interceptors/rate-limit');

Object.defineProperty(exports, 'RateLimitInterceptor', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_rateLimit).default;
  }
});

var _batcher = require('./lib/batcher');

Object.defineProperty(exports, 'Batcher', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_batcher).default;
  }
});

var _page = require('./lib/page');

Object.defineProperty(exports, 'Page', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_page).default;
  }
});

var _config = require('./config');

Object.defineProperty(exports, 'config', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_config).default;
  }
});

require('./plugins/logger');

require('./lib/credentials');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map
