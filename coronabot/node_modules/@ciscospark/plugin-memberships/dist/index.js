'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sparkCore = require('@ciscospark/spark-core');

var _memberships = require('./memberships');

var _memberships2 = _interopRequireDefault(_memberships);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*!
 * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
 */

(0, _sparkCore.registerPlugin)('memberships', _memberships2.default);

exports.default = _memberships2.default;
//# sourceMappingURL=index.js.map
