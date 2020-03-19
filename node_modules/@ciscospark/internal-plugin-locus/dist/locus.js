'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DESYNC = exports.LESS_THAN = exports.GREATER_THAN = exports.FETCH = exports.EQUAL = exports.USE_CURRENT = exports.USE_INCOMING = undefined;

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _memoize2 = require('lodash/memoize');

var _memoize3 = _interopRequireDefault(_memoize2);

var _last2 = require('lodash/last');

var _last3 = _interopRequireDefault(_last2);

var _first2 = require('lodash/first');

var _first3 = _interopRequireDefault(_first2);

var _difference2 = require('lodash/difference');

var _difference3 = _interopRequireDefault(_difference2);

var _cloneDeep2 = require('lodash/cloneDeep');

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _sparkCore = require('@ciscospark/spark-core');

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*!
 * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
 */

var USE_INCOMING = exports.USE_INCOMING = 'USE_INCOMING';
var USE_CURRENT = exports.USE_CURRENT = 'USE_CURRENT';
var EQUAL = exports.EQUAL = 'EQUAL';
var FETCH = exports.FETCH = 'FETCH';
var GREATER_THAN = exports.GREATER_THAN = 'GREATER_THAN';
var LESS_THAN = exports.LESS_THAN = 'LESS_THAN';
var DESYNC = exports.DESYNC = 'DESYNC';

/**
 * Transates the result of a sequence comparison into an intended behavior
 * @param {string} result
 * @private
 * @returns {string}
 */
function compareToAction(result) {
  switch (result) {
    case EQUAL:
    case GREATER_THAN:
      return USE_CURRENT;
    case LESS_THAN:
      return USE_INCOMING;
    case DESYNC:
      return FETCH;
    default:
      throw new Error(result + ' is not a recognized sequence comparison result');
  }
}

/**
 * @class
 */
var Locus = _sparkCore.SparkPlugin.extend({
  namespace: 'Locus',

  /**
   * Alert the specified locus that the local user has been notified of the
   * locus's active state
   * @instance
   * @memberof Locus
   * @param {Types~Locus} locus
   * @returns {Promise}
   */
  alert: function alert(locus) {
    return this.request({
      method: 'PUT',
      uri: locus.url + '/participant/alert',
      body: {
        deviceUrl: this.spark.internal.device.url,
        sequence: locus.sequence
      }
    }).then(function (res) {
      return res.body;
    });
  },


  /**
   * Compares two loci to determine which one contains the most recent state
   * @instance
   * @memberof Locus
   * @param {Types~Locus} current
   * @param {Types~Locus} incoming
   * @returns {string} one of USE_INCOMING, USE_CURRENT, or FETCH
   */
  compare: function compare(current, incoming) {
    /**
     * Determines if a paricular locus's sequence is empty
     * @param {Types~Locus} locus
     * @private
     * @returns {bool}
     */
    function isEmpty(locus) {
      var sequence = locus.sequence;

      return (!sequence.entries || !sequence.entries.length) && sequence.rangeStart === 0 && sequence.rangeEnd === 0;
    }

    if (isEmpty(current) || isEmpty(incoming)) {
      return USE_INCOMING;
    }

    if (incoming.baseSequence) {
      return this.compareDelta(current, incoming);
    }

    return compareToAction(this.compareSequence(current.sequence, incoming.sequence));
  },


  /**
   * Compares two loci sequences (with delta params) and indicates what action
   * to take.
   * @instance
   * @memberof Locus
   * @param {Types~Locus} current
   * @param {Types~Locus} incoming
   * @private
   * @returns {string} one of USE_INCOMING, USE_CURRENT, or FETCH
   */
  compareDelta: function compareDelta(current, incoming) {
    var ret = this.compareSequence(current.sequence, incoming.sequence);
    if (ret !== LESS_THAN) {
      return compareToAction(ret);
    }

    ret = this.compareSequence(current.sequence, incoming.baseSequence);

    switch (ret) {
      case GREATER_THAN:
      case EQUAL:
        return USE_INCOMING;
      default:
        return FETCH;
    }
  },


  /**
   * Compares two Locus sequences
   * @instance
   * @memberof Locus
   * @param {LocusSequence} current
   * @param {LocusSequence} incoming
   * @returns {string} one of LESS_THAN, GREATER_THAN, EQUAL, or DESYNC
   */
  compareSequence: function compareSequence(current, incoming) {
    if (!current) {
      throw new Error('`current` is required');
    }

    if (!incoming) {
      throw new Error('`incoming` is required');
    }
    // complexity here is unavoidable
    /* eslint complexity: [0] */
    /* eslint max-statements: [0] */

    // must pick one of arrow-body-style or no-confusing-arrow to disable
    /* eslint arrow-body-style: [0] */

    // after running the #compare() test suite in a loop, there doesn't seem to
    // be any appreciable difference when used with or without memoize; since
    // real locus sequences are likely to contain more sequence numbers than
    // those in the test suite, I have to assume memoize can only help and the
    // overhead of memoizing these methods is not a problem.

    var getEntriesFirstValue = (0, _memoize3.default)(function (sequence) {
      return sequence.entries.length === 0 ? 0 : (0, _first3.default)(sequence.entries);
    });
    var getEntriesLastValue = (0, _memoize3.default)(function (sequence) {
      return sequence.entries.length === 0 ? 0 : (0, _last3.default)(sequence.entries);
    });
    var getCompareFirstValue = (0, _memoize3.default)(function (sequence) {
      return sequence.rangeStart || getEntriesFirstValue(sequence);
    });
    var getCompareLastValue = (0, _memoize3.default)(function (sequence) {
      return getEntriesLastValue(sequence) || sequence.rangeEnd;
    });
    /**
     * @param {number} entry
     * @param {LocusSequence} sequence
     * @private
     * @returns {Boolean}
     */
    function inRange(entry, sequence) {
      return entry >= sequence.rangeStart && entry <= sequence.rangeEnd;
    }

    if (getCompareFirstValue(current) > getCompareLastValue(incoming)) {
      return GREATER_THAN;
    }

    if (getCompareLastValue(current) < getCompareFirstValue(incoming)) {
      return LESS_THAN;
    }

    var currentOnlyEntries = (0, _difference3.default)(current.entries, incoming.entries);
    var incomingOnlyEntries = (0, _difference3.default)(incoming.entries, current.entries);
    var currentOnly = [];
    var incomingOnly = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator3.default)(currentOnlyEntries), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var i = _step.value;

        if (!inRange(i, incoming)) {
          currentOnly.push(i);
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

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = (0, _getIterator3.default)(incomingOnlyEntries), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _i = _step2.value;

        if (!inRange(_i, current)) {
          incomingOnly.push(_i);
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    if (!currentOnly.length && !incomingOnly.length) {
      if (current.rangeEnd - getCompareFirstValue(current) > incoming.rangeEnd - getCompareFirstValue(incoming)) {
        return GREATER_THAN;
      }

      if (current.rangeEnd - getCompareFirstValue(current) < incoming.rangeEnd - getCompareFirstValue(incoming)) {
        return LESS_THAN;
      }

      return EQUAL;
    }

    if (currentOnly.length && !incomingOnly.length) {
      return GREATER_THAN;
    }

    if (!currentOnly.length && incomingOnly.length) {
      return LESS_THAN;
    }

    if (!current.rangeStart && !current.rangeEnd && !incoming.rangeStart && !incoming.rangeEnd) {
      return DESYNC;
    }

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = (0, _getIterator3.default)(currentOnly), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _i2 = _step3.value;

        if (getCompareFirstValue(incoming) < _i2 && _i2 < getCompareLastValue(incoming)) {
          return DESYNC;
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = (0, _getIterator3.default)(incomingOnly), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var _i3 = _step4.value;

        if (getCompareFirstValue(current) < _i3 && _i3 < getCompareLastValue(current)) {
          return DESYNC;
        }
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    if (currentOnly[0] > incomingOnly[0]) {
      return GREATER_THAN;
    }

    return LESS_THAN;
  },


  /**
   * Calls the specified invitee and offers the specified media via
   * options.localSdp
   * @instance
   * @memberof Locus
   * @param {string} invitee
   * @param {Object} options
   * @param {Object} options.localSdp
   * @returns {Promise<Types~Locus>}
   */
  create: function create(invitee) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var correlationId = options.correlationId;


    if (!correlationId) {
      throw new Error('options.correlationId is required');
    }

    return this.request({
      method: 'POST',
      service: 'locus',
      resource: 'loci/call',
      body: {
        correlationId: correlationId,
        deviceUrl: this.spark.internal.device.url,
        invitee: {
          invitee: invitee
        },
        localMedias: [{
          localSdp: (0, _stringify2.default)({
            type: 'SDP',
            sdp: options.localSdp
          })
        }],
        sequence: {
          entries: [],
          rangeStart: 0,
          rangeEnd: 0
        }
      }
    })
    // res.body.mediaConnections is deprecated so just return the locus
    .then(function (res) {
      return res.body.locus;
    });
  },


  /**
   * This is mostly an internal function to simplify the phone plugin. Decides
   * which path to call based on the type of the thing being joined.
   * @instance
   * @memberof Locus
   * @param {Object|Types~Locus} target
   * @param {Object} options
   * @private
   * @returns {Promise<Types~Locus>}
   */
  createOrJoin: function createOrJoin(target, options) {
    if (target.url) {
      return this.join(target, options);
    }
    return this.create(target, options);
  },


  /**
   * Decline to join the specified Locus
   * @instance
   * @memberof Locus
   * @param {Types~Locus} locus
   * @returns {Promise<Types~Locus>}
   */
  decline: function decline(locus) {
    var _this = this;

    return this.request({
      method: 'PUT',
      uri: locus.url + '/participant/decline',
      body: {
        deviceUrl: this.spark.internal.device.url,
        sequence: locus.sequence
      }
    }).then(function (res) {
      return res.body;
    }).catch(function (reason) {
      if (reason instanceof _sparkCore.SparkHttpError.Conflict) {
        return _this.get(locus);
      }
      return _promise2.default.reject(reason);
    });
  },


  /**
   * Retrieves a single Locus
   * @instance
   * @memberof Locus
   * @param {Types~Locus} locus
   * @returns {Types~Locus}
   */
  get: function get(locus) {
    return this.request({
      method: 'GET',
      uri: '' + locus.url
    }).then(function (res) {
      return res.body;
    });
  },


  /**
   * Retrieves the call history for the current user
   * @instance
   * @memberof Locus
   * @param {Object} options
   * @param {Date|number} options.from
   * @returns {Promise<Object>}
   */
  getCallHistory: function getCallHistory() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var from = new Date(options.from || Date.now()).toISOString();

    return this.request({
      method: 'GET',
      service: 'janus',
      resource: 'history/userSessions',
      qs: { from: from }
    }).then(function (res) {
      return res.body;
    });
  },


  /**
   * Join the specified Locus and offer to send it media
   * @instance
   * @memberof Locus
   * @param {Types~Locus} locus
   * @param {Object} options
   * @param {Object} options.localSdp
   * @returns {Types~Locus}
   */
  join: function join(locus) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var correlationId = locus.correlationId || options.correlationId;

    if (!correlationId) {
      throw new Error('locus.correlationId or options.correlationId is required');
    }

    return this.request({
      method: 'POST',
      uri: locus.url + '/participant',
      body: {
        correlationId: correlationId,
        deviceUrl: this.spark.internal.device.url,
        localMedias: [{
          localSdp: (0, _stringify2.default)({
            type: 'SDP',
            sdp: options.localSdp
          })
        }],
        sequence: locus.sequence || {
          entries: [],
          rangeStart: 0,
          rangeEnd: 0
        }
      }
    })
    // The mediaConnections object is deprecated, so just return the locus
    .then(function (res) {
      return res.body.locus;
    });
  },


  /**
   * Leave the specified Locus
   * @instance
   * @memberof Locus
   * @param {Types~Locus} locus
   * @returns {Promise<Types~Locus>}
   */
  leave: function leave(locus) {
    var _this2 = this;

    return this.request({
      method: 'PUT',
      uri: locus.self.url + '/leave',
      body: {
        deviceUrl: this.spark.internal.device.url,
        sequence: locus.sequence
      }
    }).then(function (res) {
      return res.body.locus;
    }).catch(function (reason) {
      if (reason instanceof _sparkCore.SparkHttpError.Conflict) {
        return _this2.get(locus);
      }
      return _promise2.default.reject(reason);
    });
  },


  /**
   * Lists active loci
   * @instance
   * @memberof Locus
   * @returns {Promise<Array<Types~Locus>>}
   */
  list: function list() {
    return this.request({
      method: 'GET',
      service: 'locus',
      resource: 'loci'
    }).then(function (res) {
      return res.body.loci;
    });
  },


  /**
   * Merges two locus DTOs (for the same locus)
   * @instance
   * @memberof Locus
   * @param {Types~Locus} current
   * @param {Types~Locus|Types~LocusDelta} incoming
   * @returns {Type~Locus}
   */
  merge: function merge(current, incoming) {
    // if incoming is not a delta event, treat it as a new full locus.
    if (!incoming.baseSequence) {
      return incoming;
    }

    var next = (0, _cloneDeep3.default)(current);

    // 1. All non-null elements in the delta event except the "baseSequence" and
    // the "participants" collection should be used to replace their existing
    // values.
    (0, _keys2.default)(incoming).forEach(function (key) {
      if (key === 'baseSequence' || key === 'participants') {
        return;
      }

      next[key] = incoming[key] || next[key];
    });

    // 2. The "baseSequence" in the delta event can be discarded (it doesn't
    // need to be maintained in the local working copy).

    if (incoming.participants || incoming.participants.length) {
      var toRemove = new _set2.default();
      var toUpsert = new _map2.default();

      incoming.participants.forEach(function (p) {
        if (p.removed) {
          // Elements of the delta event's "participants" list with the
          // attribute `removed=true` should be removed from the working copy's
          // "participants" collection.
          toRemove.add(p.url);
        } else {
          // Elements of the delta events "participants" list that are absent
          // from the local working copy should be added to that collection.
          toUpsert.set(p.url, p);
        }
      });

      // The "participants" collection in the delta event should be merged with
      // that of the local working copy of the Locus such that elements in the
      // delta event's "participants" replace those with the same url value in
      // the working copy "participants" collection.
      var participants = next.participants.reduce(function (acc, p) {
        if (!toRemove.has(p.url)) {
          acc[p.url] = p;
        }
        return acc;
      }, {});

      toUpsert.forEach(function (value, key) {
        participants[key] = value;
      });

      next.participants = (0, _values2.default)(participants);
    }

    return next;
  },


  /**
   * Signals to locus that the current user is done sharing their additional
   * media stream
   * @param {Types~Locus} locus
   * @param {Types~MediaShare} share
   * @returns {Promise}
   */
  releaseFloorGrant: function releaseFloorGrant(locus, share) {
    return this.spark.request({
      uri: share.url,
      method: 'PUT',
      body: {
        floor: {
          disposition: 'RELEASED'
        }
      }
    }).then(function (_ref) {
      var body = _ref.body;
      return body;
    });
  },


  /**
   * Signals to locus that the current user would like to share an additional
   * media stream
   * @param {Types~Locus} locus
   * @param {Types~MediaShare} share
   * @returns {Promise}
   */
  requestFloorGrant: function requestFloorGrant(locus, share) {
    return this.spark.request({
      uri: share.url,
      method: 'PUT',
      body: {
        floor: {
          beneficiary: {
            url: locus.self.url,
            devices: [{ url: this.spark.internal.device.url }]
          },
          disposition: 'GRANTED'
        }
      }
    }).then(function (_ref2) {
      var body = _ref2.body;
      return body;
    });
  },


  /**
   * Sends a string of DTMF tones to the locus
   * @instance
   * @memberof Locus
   * @param {Types~Locus} locus
   * @param {string} tones
   * @returns {Promise}
   */
  sendDtmf: function sendDtmf(locus, tones) {
    return this.request({
      method: 'POST',
      uri: locus.self.url + '/sendDtmf',
      body: {
        deviceUrl: this.spark.internal.device.url,
        dtmf: {
          correlationId: _uuid2.default.v4(),
          tones: tones
        }
      }
    });
  },


  /**
   * Fetches the delta for the locus from its syncUrl. *Does not merge*
   * @instance
   * @memberof Locus
   * @param {Types~Locus} locus
   * @returns {Types~LocusDelta}
   */
  sync: function sync(locus) {
    return this.request({
      method: 'GET',
      uri: locus.syncUrl
    })
    // the api may return a 204 no content, so we'll give back an empty
    // object in that case.
    .then(function (res) {
      return res.body || {};
    });
  },


  /**
   * Send a new sdp to Linus via the Locus API to update media state (e.g. to
   * start or stop sending audio or video)
   * @instance
   * @memberof Locus
   * @param {Types~Locus} locus
   * @param {Object} options
   * @param {string} options.localSdp
   * @param {string} options.mediaId
   * @param {Boolean} options.audioMuted
   * @param {Boolean} options.videoMuted
   * @returns {Promise<Types~Locus>}
   */
  updateMedia: function updateMedia(locus, _ref3) {
    var sdp = _ref3.sdp,
        audioMuted = _ref3.audioMuted,
        videoMuted = _ref3.videoMuted,
        mediaId = _ref3.mediaId;

    var localSdp = {
      audioMuted: audioMuted,
      videoMuted: videoMuted
    };
    if (sdp) {
      localSdp.type = 'SDP';
      localSdp.sdp = sdp;
    }

    return this.request({
      method: 'PUT',
      uri: locus.self.url + '/media',
      body: {
        deviceUrl: this.spark.internal.device.url,
        localMedias: [{
          localSdp: (0, _stringify2.default)(localSdp),
          mediaId: mediaId
        }],
        sequence: locus.sequence
      }
    }).then(function (res) {
      return res.body.locus;
    });
  },
  version: '1.32.23'
});

exports.default = Locus;
//# sourceMappingURL=locus.js.map
