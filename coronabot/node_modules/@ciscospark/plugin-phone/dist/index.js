'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatsStream = exports.StatsFilter = exports.remoteParticipant = exports.boolToStatus = exports.Call = exports.phoneEvents = undefined;

var _phone = require('./phone');

Object.defineProperty(exports, 'phoneEvents', {
  enumerable: true,
  get: function get() {
    return _phone.events;
  }
});

var _call = require('./call');

Object.defineProperty(exports, 'Call', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_call).default;
  }
});

var _boolToStatus = require('./bool-to-status');

Object.defineProperty(exports, 'boolToStatus', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_boolToStatus).default;
  }
});

var _stateParsers = require('./state-parsers');

Object.defineProperty(exports, 'remoteParticipant', {
  enumerable: true,
  get: function get() {
    return _stateParsers.remoteParticipant;
  }
});

var _filter = require('./stats/filter');

Object.defineProperty(exports, 'StatsFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_filter).default;
  }
});

var _stream = require('./stats/stream');

Object.defineProperty(exports, 'StatsStream', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_stream).default;
  }
});

require('@ciscospark/internal-plugin-locus');

require('@ciscospark/internal-plugin-metrics');

require('@ciscospark/plugin-people');

var _sparkCore = require('@ciscospark/spark-core');

var _phone2 = _interopRequireDefault(_phone);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*!
 * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
 */

exports.default = _phone2.default;


(0, _sparkCore.registerPlugin)('phone', _phone2.default, { config: _config2.default });
//# sourceMappingURL=index.js.map
