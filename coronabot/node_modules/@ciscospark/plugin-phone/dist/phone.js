'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.events = undefined;

var _apply = require('babel-runtime/core-js/reflect/apply');

var _apply2 = _interopRequireDefault(_apply);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _defaults2 = require('lodash/defaults');

var _defaults3 = _interopRequireDefault(_defaults2);

var _sparkCore = require('@ciscospark/spark-core');

var _mediaEngineWebrtc = require('@ciscospark/media-engine-webrtc');

var _mediaEngineWebrtc2 = _interopRequireDefault(_mediaEngineWebrtc);

var _call = require('./call');

var _call2 = _interopRequireDefault(_call);

var _stateParsers = require('./state-parsers');

var _calls = require('./calls');

var _calls2 = _interopRequireDefault(_calls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var events = exports.events = {
  CALL_CREATED: 'call:created',
  CALL_INCOMING: 'call:incoming'
};

/**
 * Call Created Event
 *
 * Emitted when a call begins outside of the sdk
 *
 * @event call:created
 * @instance
 * @memberof Phone
 * @type {Object}
 * @property {Call} call The created call
 */

/**
 * Incoming Call Event
 *
 * Emitted when a call begins and when {@link Phone#register} is invoked and
 * there are active calls.
 *
 * @event call:incoming
 * @instance
 * @memberof Phone
 * @type {Object}
 * @property {Call} call The incoming call
 */

/**
 * @class
 */
/*!
 * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
 */

var Phone = _sparkCore.SparkPlugin.extend({
  collections: {
    emittedCalls: _calls2.default
  },

  session: {
    /**
     * Indicates whether or not the WebSocket is connected
     * @instance
     * @memberof Phone
     * @member {Boolean}
     * @readonly
     */
    connected: {
      default: false,
      type: 'boolean'
    },
    /**
     * Specifies the facingMode to be used by {@link Phone#dial} and
     * {@link Call#answer} when no constraint is specified. Does not apply if
     * - a {@link MediaStream} is passed to {@link Phone#dial} or
     * {@link Call#answer}
     * - constraints are passed to {@link Phone#dial} or  {@link Call#answer}
     * The only valid values are `user` and `environment`. For any other values,
     * you must provide your own constrains or {@link MediaStream}
     * @default `user`
     * @instance
     * @memberof Phone
     * @type {string}
     */
    defaultFacingMode: {
      default: 'user',
      type: 'string',
      values: ['user', 'environment']
    },
    /**
     * indicates whether or not the client is registered with the Cisco Spark
     * cloud
     * @instance
     * @memberof Phone
     * @member {Boolean}
     * @readonly
     */
    registered: {
      default: false,
      type: 'boolean'
    }
  },

  namespace: 'phone',

  /**
   * Indicates if the current browser appears to support webrtc calling. Note:
   * at this time, there's no way to determine if the current browser supports
   * h264 without asking for camera permissions
   * @instance
   * @memberof Phone
   * @returns {Promise<Boolean>}
   */
  isCallingSupported: function isCallingSupported() {
    return new _promise2.default(function (resolve) {
      // I'm not thrilled by this, but detectrtc breaks the global namespace in
      // a way that screws up the browserOnly/nodeOnly test helpers.
      // eslint-disable-next-line global-require
      var DetectRTC = require('detectrtc');
      resolve(DetectRTC.isWebRTCSupported);
    });
  },


  /**
   * Registers the client with the Cisco Spark cloud and starts listening for
   * WebSocket events.
   *
   * Subsequent calls refresh the device registration.
   * @instance
   * @memberof Phone
   * @returns {Promise}
   */
  register: function register() {
    var _this = this;

    // Ideally, we could call spark.refresh via spark-core, but it doesn't know
    // about the wdm plugin, and all of the leaky abstractions I can think of
    // seem risky.

    return this.spark.internal.device.refresh().then(function () {
      if (_this.connected) {
        return _promise2.default.resolve();
      }
      return _promise2.default.all([_this.emittedCalls.reset(), _this.spark.internal.mercury.when('event:mercury.buffer_state').then(function (_ref) {
        var _ref2 = (0, _slicedToArray3.default)(_ref, 1),
            message = _ref2[0];

        if (message.data.bufferState.locus === 'UNKNOWN') {
          return _this.listActiveCalls();
        }
        return _promise2.default.resolve();
      }), _this.spark.internal.mercury.connect()]);
    });
  },


  /**
   * Disconnects from WebSocket and unregisters from the Cisco Spark cloud.
   *
   * Subsequent calls will be a noop.
   * @instance
   * @memberof Phone
   * @returns {Promise}
   */
  deregister: function deregister() {
    var _this2 = this;

    return this.spark.internal.mercury.disconnect().then(function () {
      return _this2.spark.internal.device.unregister();
    });
  },


  /**
   * Create a MediaStream to be used for video preview.
   *
   * Note: You must explicitly pass the resultant stream to {@link Call#answer()}
   * or {@link Phone#dial()}
   * @instance
   * @memberof Phone
   * @param {Object|MediaStreamConstraints} options
   * @param {MediaStreamConstraints} options.constraints
   * @returns {Promise<MediaStream>}
   */
  createLocalMediaStream: function createLocalMediaStream() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var constraints = options.constraints || options;
    (0, _defaults3.default)(constraints, {
      audio: true,
      video: true
    });

    return _mediaEngineWebrtc2.default.getUserMedia(constraints);
  },


  /**
   * Fetches a list of all of the current user's active calls
   * @instance
   * @memberOf Phone
   * @returns {Promise<Call[]>}
   */
  listActiveCalls: function listActiveCalls() {
    var _this3 = this;

    return this.spark.internal.locus.list().then(function (loci) {
      // emittedCalls is a collection, convert to array
      var calls = _this3.emittedCalls.map(function (e) {
        return e;
      });
      if (!loci) {
        return calls;
      }
      loci.forEach(function (locus) {
        if (!_this3.emittedCalls.has(locus)) {
          var callItem = _call2.default.make({ locus: locus, parent: _this3.spark });
          calls.push(callItem);
          _this3.emittedCalls.add(callItem);
          _this3._triggerCallEvents(callItem, locus);
        }
      });
      return calls;
    });
  },


  /**
   * Initializer
   * @instance
   * @memberof Phone
   * @param {Object} attrs
   * @param {Object} options
   * @private
   * @returns {undefined}
   */
  initialize: function initialize() {
    var _this4 = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    (0, _apply2.default)(_sparkCore.SparkPlugin.prototype.initialize, this, args);

    this.listenTo(this.spark.internal.mercury, 'event:locus', function (event) {
      return _this4.onLocusEvent(event);
    });

    // Note: we need to manually wire up change:connected because derived props
    // can't read through this.parent
    this.listenTo(this.spark.internal.mercury, 'change:connected', function () {
      _this4.connected = _this4.spark.internal.mercury.connected;
      _this4.registered = !!_this4.spark.internal.device.url && _this4.connected;
    });

    // Note: we need to manually wire up change:url because derived props
    // can't read through this.parent
    this.listenTo(this.spark.internal.device, 'change:url', function () {
      _this4.registered = !!_this4.spark.internal.device.url && _this4.connected;
    });
  },


  /**
   * Determines if the {@link call:incoming} event should be emitted for the
   * specified {@link Types~MercuryEvent}
   * @emits call:incoming
   * @instance
   * @memberof Phone
   * @param {Types~MercuryEvent} event
   * @private
   * @returns {undefined}
   */
  onLocusEvent: function onLocusEvent(event) {
    // We only want to handle calls we are not aware of
    if (this.emittedCalls.has(event.data.locus)) {
      return;
    }

    // Create call object and store in emittedCalls
    var call = _call2.default.make({
      locus: event.data.locus
    }, {
      parent: this.spark
    });
    this.emittedCalls.add(call);

    // Trigger events as necessary
    this._triggerCallEvents(call, event.data.locus);
  },


  /**
   * Place a call to the specified dialString. A dial string may be an email
   * address or sip uri.
   * If you set {@link config.phone.enableExperimentalGroupCallingSupport} to
   * `true`, the dialString may also be a room id.
   * @instance
   * @memberof Phone
   * @param {string} dialString
   * @param {Object} options
   * @param {MediaStreamConstraints} options.constraints
   * @param {MediaStream} options.localMediaStream if no stream is specified, a
   * new one will be created based on options.constraints
   * @returns {Call}
   */
  dial: function dial(dialString, options) {
    var call = _call2.default.make({}, { parent: this.spark });

    call.dial(dialString, options);
    this.emittedCalls.add(call);
    return call;
  },


  /**
   * Triggers call events for a given call/locus
   * @param {Call} call
   * @param {Types~Locus} locus
   * @returns {undefined}
   */
  _triggerCallEvents: function _triggerCallEvents(call, locus) {
    this.trigger(events.CALL_CREATED, call);

    if ((0, _stateParsers.shouldRing)(locus)) {
      if ((0, _stateParsers.isCall)(locus) || !(0, _stateParsers.isCall)(locus) && (0, _get3.default)(this, 'config.enableExperimentalGroupCallingSupport')) {
        this.trigger(events.CALL_INCOMING, call);
      }
    }
  },
  version: '1.32.23'
});

exports.default = Phone;
//# sourceMappingURL=phone.js.map
