'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sparkCore = require('@ciscospark/spark-core');

var _webhooks = require('./webhooks');

var _webhooks2 = _interopRequireDefault(_webhooks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*!
 * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
 */

(0, _sparkCore.registerPlugin)('webhooks', _webhooks2.default);

exports.default = _webhooks2.default;
//# sourceMappingURL=index.js.map
