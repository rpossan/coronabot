'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ampersandCollection = require('ampersand-collection');

var _ampersandCollection2 = _interopRequireDefault(_ampersandCollection);

var _ampersandCollectionLodashMixin = require('ampersand-collection-lodash-mixin');

var _ampersandCollectionLodashMixin2 = _interopRequireDefault(_ampersandCollectionLodashMixin);

var _callMembership = require('./call-membership');

var _callMembership2 = _interopRequireDefault(_callMembership);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class
 * @name CallMemberships
 */
var CallMemberships = _ampersandCollection2.default.extend(_ampersandCollectionLodashMixin2.default, {
  model: _callMembership2.default,

  // Long-term, this should be membership id, but we don't have that yet.
  mainIndex: '_id'
});

exports.default = CallMemberships;
//# sourceMappingURL=call-memberships.js.map
