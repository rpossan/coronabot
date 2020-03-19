'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _feature = require('./feature');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_feature).default;
  }
});

var _sparkCore = require('@ciscospark/spark-core');

var _feature2 = _interopRequireDefault(_feature);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _sparkCore.registerInternalPlugin)('feature', _feature2.default, {
  config: _config2.default
}); /*!
     * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
     */
//# sourceMappingURL=index.js.map
