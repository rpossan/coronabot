'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sparkPlugin = require('../lib/spark-plugin');

var _sparkPlugin2 = _interopRequireDefault(_sparkPlugin);

var _sparkCore = require('../spark-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*!
 * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
 */

var precedence = {
  error: ['log'],
  warn: ['error', 'log'],
  info: ['log'],
  debug: ['info', 'log'],
  trace: ['debug', 'info', 'log']
};

/**
 * Assigns the specified console method to Logger; uses `precedence` to fallback
 * to other console methods if the current environment doesn't provide the
 * specified level.
 * @param {string} level
 * @returns {Function}
 */
function wrapConsoleMethod(level) {
  /* eslint no-console: [0] */
  var impls = precedence[level];
  if (impls) {
    impls = impls.slice();
    while (!console[level]) {
      level = impls.pop();
    }
  }

  return function wrappedConsoleMethod() {
    var _console;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    /* eslint no-invalid-this: [0] */
    /* istanbul ignore if */
    if (process.env.NODE_ENV === 'test' && this.spark && this.spark.internal.device && this.spark.internal.device.url) {
      args.unshift(this.spark.internal.device.url.slice(-3));
    }
    (_console = console)[level].apply(_console, args);
  };
}

var Logger = _sparkPlugin2.default.extend({
  namespace: 'Logger',
  error: wrapConsoleMethod('error'),
  warn: wrapConsoleMethod('warn'),
  log: wrapConsoleMethod('log'),
  info: wrapConsoleMethod('info'),
  debug: wrapConsoleMethod('debug'),
  trace: wrapConsoleMethod('trace'),
  version: '1.32.23'
});

(0, _sparkCore.registerPlugin)('logger', Logger);

exports.default = Logger;
//# sourceMappingURL=logger.js.map
