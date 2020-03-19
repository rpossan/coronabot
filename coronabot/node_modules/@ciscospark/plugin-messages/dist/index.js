'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sparkCore = require('@ciscospark/spark-core');

var _messages = require('./messages');

var _messages2 = _interopRequireDefault(_messages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*!
 * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
 */

(0, _sparkCore.registerPlugin)('messages', _messages2.default);

exports.default = _messages2.default;
//# sourceMappingURL=index.js.map
