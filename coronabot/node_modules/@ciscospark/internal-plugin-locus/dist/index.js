'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DESYNC = exports.LESS_THAN = exports.GREATER_THAN = exports.FETCH = exports.EQUAL = exports.USE_CURRENT = exports.USE_INCOMING = exports.eventKeys = undefined;

var _eventKeys = require('./event-keys');

Object.defineProperty(exports, 'eventKeys', {
  enumerable: true,
  get: function get() {
    return _eventKeys.locusEventKeys;
  }
});

var _locus = require('./locus');

Object.defineProperty(exports, 'USE_INCOMING', {
  enumerable: true,
  get: function get() {
    return _locus.USE_INCOMING;
  }
});
Object.defineProperty(exports, 'USE_CURRENT', {
  enumerable: true,
  get: function get() {
    return _locus.USE_CURRENT;
  }
});
Object.defineProperty(exports, 'EQUAL', {
  enumerable: true,
  get: function get() {
    return _locus.EQUAL;
  }
});
Object.defineProperty(exports, 'FETCH', {
  enumerable: true,
  get: function get() {
    return _locus.FETCH;
  }
});
Object.defineProperty(exports, 'GREATER_THAN', {
  enumerable: true,
  get: function get() {
    return _locus.GREATER_THAN;
  }
});
Object.defineProperty(exports, 'LESS_THAN', {
  enumerable: true,
  get: function get() {
    return _locus.LESS_THAN;
  }
});
Object.defineProperty(exports, 'DESYNC', {
  enumerable: true,
  get: function get() {
    return _locus.DESYNC;
  }
});

require('@ciscospark/internal-plugin-mercury');

var _sparkCore = require('@ciscospark/spark-core');

var _locus2 = _interopRequireDefault(_locus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _sparkCore.registerInternalPlugin)('locus', _locus2.default); /*!
                                                                   * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
                                                                   */

exports.default = _locus2.default;
//# sourceMappingURL=index.js.map
