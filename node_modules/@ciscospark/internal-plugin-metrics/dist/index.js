'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.default = undefined;

var _metrics = require('./metrics');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_metrics).default;
  }
});

require('@ciscospark/internal-plugin-wdm');

var _sparkCore = require('@ciscospark/spark-core');

var _metrics2 = _interopRequireDefault(_metrics);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*!
 * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
 */

(0, _sparkCore.registerInternalPlugin)('metrics', _metrics2.default, {
  config: _config2.default
});

exports.config = _config2.default;
//# sourceMappingURL=index.js.map
