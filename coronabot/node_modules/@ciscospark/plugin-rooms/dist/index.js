'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sparkCore = require('@ciscospark/spark-core');

var _rooms = require('./rooms');

var _rooms2 = _interopRequireDefault(_rooms);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*!
 * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
 */

(0, _sparkCore.registerPlugin)('rooms', _rooms2.default);

exports.default = _rooms2.default;
//# sourceMappingURL=index.js.map
