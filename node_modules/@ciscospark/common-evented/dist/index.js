'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deleteProperty = require('babel-runtime/core-js/reflect/delete-property');

var _deleteProperty2 = _interopRequireDefault(_deleteProperty);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _weakMap = require('babel-runtime/core-js/weak-map');

var _weakMap2 = _interopRequireDefault(_weakMap);

exports.default = evented;

var _common = require('@ciscospark/common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var data = new ((0, _common.make)(_weakMap2.default, _map2.default))();

/**
 * Given a class property, this decorator changes it into a setter/getter pair;
 * the setter will trigger `change:${prop}` when invoked
 * @param {Object} target
 * @param {string} prop
 * @param {Object} descriptor
 * @returns {undefined}
 */
function evented(target, prop, descriptor) {
  var defaultValue = descriptor.initializer && descriptor.initializer();

  (0, _deleteProperty2.default)(descriptor, 'value');
  (0, _deleteProperty2.default)(descriptor, 'initializer');
  (0, _deleteProperty2.default)(descriptor, 'writable');

  descriptor.get = function get() {
    var value = data.get(this, prop);

    if (typeof value !== 'undefined') {
      return value;
    }

    return defaultValue;
  };

  descriptor.set = function set(value) {
    var previous = this[prop];
    if (previous !== value) {
      data.set(this, prop, value);
      this.trigger('change:' + prop, value, previous);
      this.trigger('change');
    }
  };
}
//# sourceMappingURL=index.js.map
