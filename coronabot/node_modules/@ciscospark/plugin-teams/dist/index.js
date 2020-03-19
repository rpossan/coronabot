'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sparkCore = require('@ciscospark/spark-core');

var _teams = require('./teams');

var _teams2 = _interopRequireDefault(_teams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*!
 * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
 */

(0, _sparkCore.registerPlugin)('teams', _teams2.default);

exports.default = _teams2.default;
//# sourceMappingURL=index.js.map
