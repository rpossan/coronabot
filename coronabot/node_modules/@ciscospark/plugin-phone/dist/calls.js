'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _apply = require('babel-runtime/core-js/reflect/apply');

var _apply2 = _interopRequireDefault(_apply);

var _ampersandCollection = require('ampersand-collection');

var _ampersandCollection2 = _interopRequireDefault(_ampersandCollection);

var _call = require('./call');

var _call2 = _interopRequireDefault(_call);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*!
 * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
 */

var Calls = _ampersandCollection2.default.extend({
  model: _call2.default,

  mainIndex: 'internalCallId',

  indexes: ['correlationId'],

  /**
   * Initializer
   * @private
   * @param {Object} attrs
   * @param {Object} options
   * @returns {undefined}
   */
  initialize: function initialize() {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    (0, _apply2.default)(_ampersandCollection2.default.prototype.initialize, this, args);

    this.on('add', function (call) {
      _this.listenTo(call, 'change:state', function () {
        if (call.config.enableExperimentalGroupCallingSupport) {
          if (call.state === 'inactive') {
            _this.remove(call);
          }
        } else if (call.status === 'disconnected') {
          _this.remove(call);
        }
      });
    });
  },


  /**
   * Indicates if this collection already contains the specified locus
   * @param {Types~Locus} locus
   * @returns {boolean}
   */
  has: function has(locus) {
    var found = this.get(locus.url + '_' + locus.fullState.lastActive);
    if (found) {
      return true;
    }

    if (locus.replaces) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(locus.replaces), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var replaced = _step.value;

          if (this.get(replaced.locusUrl + '_' + replaced.lastActive)) {
            return true;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    return false;
  }
});

exports.default = Calls;
//# sourceMappingURL=calls.js.map
