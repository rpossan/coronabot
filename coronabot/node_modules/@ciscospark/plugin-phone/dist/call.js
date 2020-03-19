'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _apply = require('babel-runtime/core-js/reflect/apply');

var _apply2 = _interopRequireDefault(_apply);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _wrap2 = require('lodash/wrap');

var _wrap3 = _interopRequireDefault(_wrap2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

var _defaults2 = require('lodash/defaults');

var _defaults3 = _interopRequireDefault(_defaults2);

var _dec, _dec2, _dec3, _dec4, _desc, _value, _obj; /*!
                                                     * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
                                                     */

/* eslint-env browser: true */

var _lodashDecorators = require('lodash-decorators');

var _sdpTransform = require('sdp-transform');

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _sparkCore = require('@ciscospark/spark-core');

var _common = require('@ciscospark/common');

var _internalPluginLocus = require('@ciscospark/internal-plugin-locus');

var _mediaEngineWebrtc = require('@ciscospark/media-engine-webrtc');

var _mediaEngineWebrtc2 = _interopRequireDefault(_mediaEngineWebrtc);

var _stateParsers = require('./state-parsers');

var _boolToStatus = require('./bool-to-status');

var _boolToStatus2 = _interopRequireDefault(_boolToStatus);

var _callMemberships = require('./call-memberships');

var _callMemberships2 = _interopRequireDefault(_callMemberships);

var _filter = require('./stats/filter');

var _filter2 = _interopRequireDefault(_filter);

var _stream = require('./stats/stream');

var _stream2 = _interopRequireDefault(_stream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var boolToDirection = _mediaEngineWebrtc.webrtcHelpers.boolToDirection;


var deprecatedCallEventNames = ['ringing', 'connected', 'disconnected', 'replaced'];

/**
 * Pulls the direction line for the specified media kind from an sdp
 * @param {string} kind
 * @param {string} sdp
 * @private
 * @returns {string}
 */
function getMediaDirectionFromSDP(kind, sdp) {
  var parsed = typeof sdp === 'string' ? (0, _sdpTransform.parse)(sdp) : sdp;

  var media = void 0;
  if (kind === 'screen') {
    media = parsed.media.find(function (m) {
      return m.type === 'video' && m.content;
    });
  } else {
    media = parsed.media.find(function (m) {
      return m.type === kind;
    });
  }
  if (!media || !media.direction) {
    return 'inactive';
  }

  return media.direction;
}

/**
 * Reverses a media direction from offer to answer (e.g. sendonly -> recvonly)
 * @param {string} dir
 * @private
 * @returns {string}
 */
function reverseMediaDirection(dir) {
  switch (dir) {
    case 'inactive':
    case 'sendrecv':
      return dir;
    case 'sendonly':
      return 'recvonly';
    case 'recvonly':
      return 'sendonly';
    default:
      throw new Error('direction "' + dir + '" is not valid');
  }
}

var capitalize = {
  audio: 'Audio',
  video: 'Video'
};

/**
 * @event ringing
 * @instance
 * @memberof Call
 * @deprecated with {@link PhoneConfig.enableExperimentalGroupCallingSupport}
 * enabled; instead, listen for {@link Call.membership:notified}
 */

/**
 * @event connected
 * @instance
 * @memberof Call
 * @deprecated with {@link PhoneConfig.enableExperimentalGroupCallingSupport}
 * enabled; instead, listen for {@link Call.active}
 */

/**
 * @event disconnected
 * @instance
 * @memberof Call
 * @deprecated with {@link PhoneConfig.enableExperimentalGroupCallingSupport}
 * enabled; instead, listen for {@link Call.inactive}
 */

/**
 * @event active
 * @instance
 * @memberof Call
 * @description only emitted if enableExperimentalGroupCallingSupport is enabled
 */

/**
 * @event initializing
 * @instance
 * @memberof Call
 * @description only emitted if enableExperimentalGroupCallingSupport is enabled
 */

/**
 * @event inactive
 * @instance
 * @memberof Call
 * @description only emitted if enableExperimentalGroupCallingSupport is enabled
 */

/**
 * @event terminating
 * @instance
 * @memberof Call
 * @description only emitted if enableExperimentalGroupCallingSupport is enabled
 */

/**
 * @event localMediaStream:change
 * @instance
 * @memberof Call
 */

/**
 * @event remoteMediaStream:change
 * @instance
 * @memberof Call
 */

/**
 * @event error
 * @instance
 * @memberof Call
 */

/**
 * @event membership:notified
 * @instance
 * @memberof Call
 * @type {CallMembership}
 * @description This replaces the {@link Call.ringing} event, but note that it's
 * subtly different. {@link Call.ringing} is emitted when the remote party calls
 * {@link Call#acknowledge()} whereas {@link Call.membership:notified} emits
 * shortly after (but as a direct result of) locally calling
 * {@link Phone#dial()}
 */

/**
 * @event membership:connected
 * @instance
 * @memberof Call
 * @type {CallMembership}
 */

/**
 * @event membership:declined
 * @instance
 * @memberof Call
 * @type {CallMembership}
 */

/**
 * @event membership:disconnected
 * @instance
 * @memberof Call
 * @type {CallMembership}
 */

/**
 * @event membership:waiting
 * @instance
 * @memberof Call
 * @type {CallMembership}
 */

/**
 * @event membership:change
 * @instance
 * @memberof Call
 * @type {CallMembership}
 */

/**
 * @event memberships:add
 * @instance
 * @memberof Call
 * @description Emitted when a new {@link CallMembership} is added to
 * {@link Call#memberships}. Note that {@link CallMembership#state} still needs
 * to be read to determine if the instance represents someone actively
 * participating the call.
 */

/**
 * @event memberships:remove
 * @instance
 * @memberof Call
 * @description Emitted when a {@link CallMembership} is removed from
 * {@link Call#memberships}.
 */

/**
 * Payload for {@link Call#sendFeedback}
 * @typedef {Object} FeedbackObject
 * @property {number} userRating Number between 1 and 5 (5 being best) to let
 * the user score the call
 * @property {string} userComments Freeform feedback from the user about the
 * call
 * @property {Boolean} includeLogs set to true to submit client logs to the
 * Cisco Spark cloud. Note: at this time, all logs, not just call logs,
 * generated by the sdk will be uploaded to the Spark Cloud. Care has been taken
 * to avoid including PII in these logs, but if you've taken advantage of the
 * SDK's logger, you should make sure to avoid logging PII as well.
 */

/**
 * @class
 */
var Call = _sparkCore.SparkPlugin.extend((_dec = (0, _common.whileInFlight)('locusJoinInFlight'), _dec2 = (0, _common.deprecated)('Please use Call#reject()'), _dec3 = (0, _common.whileInFlight)('locusLeaveInFlight'), _dec4 = (0, _lodashDecorators.debounce)(), (_obj = {
  namespace: 'Phone',

  children: {
    media: _mediaEngineWebrtc2.default
  },

  collections: {
    /**
     * @instance
     * @memberof Call
     * @type CallMemberships
     */
    memberships: _callMemberships2.default
  },

  session: {
    activeParticipantsCount: {
      default: 0,
      required: true,
      type: 'number'
    },
    /**
     * Indicates if the other party in the call has turned off their microphone.
     * `undefined` for multiparty calls
     * @instance
     * @memberof Call
     * @readonly
     * @type {boolean}
     */
    remoteAudioMuted: {
      default: false,
      required: false,
      type: 'boolean'
    },

    /**
     * Indicates if the other party in the call has turned off their camera.
     * `undefined` for multiparty calls
     * @instance
     * @memberof Call
     * @readonly
     * @type {boolean}
     */
    remoteVideoMuted: {
      default: false,
      required: false,
      type: 'boolean'
    },

    correlationId: 'string',
    /**
     * @instance
     * @memberof Call
     * @readonly
     * @type {string}
     */
    facingMode: {
      type: 'string',
      values: ['user', 'environment']
    },
    /**
     * Derived from locus.id and locus.fullState.lastActive. Not actually a
     * "derived" property because it shouldn't be reset in event a locus
     * replacement. Marked as private because this isn't necessarily the callId
     * that we'll eventually expose as a first-class feature.
     * @instance
     * @memberof Call
     * @private
     * @readonly
     * @type {string}
     */
    internalCallId: {
      setOnce: true,
      type: 'string'
    },
    locus: 'object',
    /**
     * Returns the local MediaStream for the call. May initially be `null`
     * between the time @{Phone#dial is invoked and the  media stream is
     * acquired if {@link Phone#dial} is invoked without a `localMediaStream`
     * option.
     *
     * This property can also be set mid-call in which case the streams sent to
     * the remote party are replaced by this stream. On success, the
     * {@link Call}'s {@link localMediaStream:change} event fires, notifying any
     * listeners that we are now sending media from a new source.
     * @instance
     * @memberof Call
     * @type {MediaStream}
     */
    localMediaStream: 'object',

    locusJoinInFlight: {
      default: false,
      type: 'boolean'
    },
    locusLeaveInFlight: {
      default: false,
      type: 'boolean'
    },
    /**
     * Test helper. Shortcut to the current user's membership object. not
     * official for now, but may get published at some point
     * @instance
     * @memberof Call
     * @private
     * @type {CallMembership}
     */
    me: {
      type: 'object'
    }
  },

  // Note, in its current form, any derived property that is an object will emit
  // a change event everytime a locus gets replaced, even if no values change.
  // For the moment, this is probably ok; once we have multi-party, regular
  // change events on activeParticipants may be a problem.
  derived: {
    id: {
      deps: ['locus'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        return (0, _get3.default)(this, 'locus.url');
      }
    },
    isActive: {
      deps: ['locus'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        return !!(this.locus && (0, _stateParsers.isActive)(this.locus));
      }
    },
    joinedOnThisDevice: {
      deps: ['locus'],
      default: false,
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        return !!(this.locus && (0, _stateParsers.joinedOnThisDevice)(this.spark, this.locus));
      }
    },
    locusUrl: {
      deps: ['locus'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        return (0, _get3.default)(this, 'locus.url');
      }
    },
    device: {
      deps: ['locus'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        return (0, _stateParsers.getThisDevice)(this.spark, this.locus);
      }
    },
    mediaConnection: {
      deps: ['locus'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        var device = (0, _stateParsers.getThisDevice)(this.spark, this.locus);
        return (0, _get3.default)(device, 'mediaConnections[0]');
      }
    },
    mediaId: {
      deps: ['locus'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        var device = (0, _stateParsers.getThisDevice)(this.spark, this.locus);
        return (0, _get3.default)(device, 'mediaConnections[0].mediaId');
      }
    },
    /**
     * The other participant in a two-party call. `undefined` for multiparty
     * calls
     * @instance
     * @memberof Call
     * @readyonly
     * @type {CallMembership}
     */
    remoteMember: {
      deps: ['memberships', 'locus'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        if ((0, _stateParsers.isCall)(this.locus)) {
          return this.memberships.find(function (m) {
            return !m.isSelf;
          });
        }

        return undefined;
      }
    },
    direction: {
      deps: ['locus'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        // This seems brittle, but I can't come up with a better way. The only
        // way we should have a Call without a locus is if we just initiated a
        // call but haven't got the response from locus yet.
        if (!this.locus) {
          return 'out';
        }
        return (0, _stateParsers.direction)(this.locus);
      }
    },
    from: {
      deps: ['memberships'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        if (this.isCall) {
          return this.memberships.find(function (m) {
            return m.isInitiator;
          });
        }
        return undefined;
      }
    },
    to: {
      deps: ['memberships'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        if (this.isCall) {
          return this.memberships.find(function (m) {
            return !m.isInitiator;
          });
        }
        return undefined;
      }
    },
    /**
     * <b>active</b> - At least one person (not necessarily this user) is
     * participating in the call<br/>
     * <b>inactive</b> - No one is participating in the call<br/>
     * <b>initializing</b> - reserved for future use<br/>
     * <b>terminating</b> - reserved for future use<br/>
     * Only defined if
     * {@link PhoneConfig.enableExperimentalGroupCallingSupport} has been
     * enabled
     * @instance
     * @memberof Call
     * @member {string}
     * @readonly
     */
    state: {
      deps: ['locus'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        if (this.config.enableExperimentalGroupCallingSupport) {
          return (0, _stateParsers.getState)(this.locus);
        }

        return undefined;
      }
    },
    /**
     * <b>initiated</b> - Offer was sent to remote party but they have not yet
     * accepted <br>
     * <b>ringing</b> - Remote party has acknowledged the call <br>
     * <b>connected</b> - At least one party is still on the call <br>
     * <b>disconnected</b> - All parties have dropped <br>
     * <b>replaced</b> - In (hopefully) rare cases, the underlying data backing
     * a Call instance may change in such a way that further interaction with
     * that Call is handled by a different instance. In such cases, the first
     * Call's status, will transition to `replaced`, which is almost the same
     * state as `disconnected`. Generally speaking, such a transition should not
     * happen for a Call instance that is actively sending/receiving media.
     * @deprecated The {@link Call#status} attribute will likely be replaced by
     * the {@link Call#state}.
     * @instance
     * @memberof Call
     * @member {string}
     * @readonly
     */
    status: {
      deps: ['locus'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        return (0, _stateParsers.getStatus)(this.spark, this.locus, this.previousAttributes().locus);
      }
    },
    /**
     * Access to the remote party’s `MediaStream`.
     * @instance
     * @memberof Call
     * @member {MediaStream}
     * @readonly
     */
    remoteMediaStream: {
      deps: ['media.remoteMediaStream'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        return this.media.remoteMediaStream;
      }
    },
    /**
     * Access to the local party’s screen share `MediaStream`.
     * @instance
     * @memberof Call
     * @member {MediaStream}
     * @readonly
     */
    localScreenShare: {
      deps: ['media.localScreenShare'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        return this.media.localScreenShare;
      }
    },
    receivingAudio: {
      deps: ['media.receivingAudio'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        return this.media.receivingAudio;
      }
    },
    receivingVideo: {
      deps: ['media.receivingVideo'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        return this.media.receivingVideo;
      }
    },
    sendingAudio: {
      deps: ['media.sendingAudio'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        return this.media.sendingAudio;
      }
    },
    sendingVideo: {
      deps: ['media.sendingVideo'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        return this.media.sendingVideo;
      }
    },
    isCall: {
      deps: ['locus'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        return (0, _stateParsers.isCall)(this.locus);
      }
    },
    supportsDtmf: {
      deps: ['locus'],
      /**
       * @private
       * @returns {mixed}
       */
      fn: function fn() {
        return (0, _get3.default)(this, 'locus.self.enableDTMF');
      }
    }
  },

  /**
   * Use to acknowledge (without answering) an incoming call. Will cause the
   * initiator's Call instance to emit the ringing event.
   * @instance
   * @memberof Call
   * @returns {Promise}
   */
  acknowledge: function acknowledge() {
    var _this = this;

    this.logger.info('call: acknowledging');
    return this.spark.internal.locus.alert(this.locus).then(function (locus) {
      return _this.setLocus(locus);
    }).then((0, _common.tap)(function () {
      return _this.logger.info('call: acknowledged');
    }));
  },

  // Note: the `whileInFlight` decorator screws up name inferrence, so we need
  // to include @name below.
  /**
   * Answers an incoming call.
   * @instance
   * @name answer
   * @memberof Call
   * @param {Object} options
   * @param {MediaStreamConstraints} options.constraints
   * @returns {Promise}
   */
  answer: function answer(options) {
    var _this2 = this;

    this.logger.info('call: answering');
    if (!this.locus) {
      this.logger.info('call: no locus provided, answer() is a noop');
      return _promise2.default.resolve();
    }
    // Locus may think we're joined on this device if we e.g. reload the page,
    // so, we need to check if we also have a working peer connection
    // this.media.pc.remoteDescription.sdp is a temporary proxy for
    // pc.connectionState until chrome catches up to the spec
    if (this.joinedOnThisDevice && this.media.pc.remoteDescription && this.media.pc.remoteDescription.sdp) {
      this.logger.info('call: already joined on this device');
      return _promise2.default.resolve();
    }
    return this.createOrJoinLocus(this.locus, options).then((0, _common.tap)(function () {
      return _this2.logger.info('call: answered');
    }));
  },


  /**
   * Change the receiving media state. may induce a renegoatiation
   * @instance
   * @memberof Call
   * @param {string} kind one of "audio" or "video"
   * @param {boolean} value
   * @private
   * @returns {Promise}
   */
  changeReceivingMedia: function changeReceivingMedia(kind, value) {
    var _this3 = this;

    return new _promise2.default(function (resolve) {
      var sdp = (0, _sdpTransform.parse)(_this3.media.offerSdp);
      var section = (0, _find3.default)(sdp.media, { type: kind });
      // If the current offer is going to trigger a renegotiation, then we don't
      // need to renegotiate here.
      if (!section || !section.direction.includes('recv')) {
        _this3.logger.info('changeReceivingMedia: expecting to renegotiate, waiting for media to emit "answeraccepted"');
        _this3.media.once('answeraccepted', function () {
          return resolve();
        });
      } else {
        _this3.logger.info('changeReceivingMedia: expecting to renegotiate, waiting for call to emit "change:receiving' + capitalize[kind] + '"');
        _this3.once('change:receiving' + capitalize[kind], function () {
          return resolve();
        });
      }

      var newDirection = (0, _boolToStatus2.default)(_this3.media['sending' + capitalize[kind]], value);
      console.warn('starting to setMedia ' + kind + ' to ' + newDirection);
      _this3.media.setMedia(kind, newDirection);
    });
  },


  /**
   * Change the receiving media state. may induce a renegoatiation
   * @instance
   * @memberof Call
   * @param {string} kind one of "audio" or "video"
   * @param {boolean} value
   * @private
   * @returns {Promise}
   */
  changeSendingMedia: function changeSendingMedia(kind, value) {
    var _this4 = this;

    // Changing media direction only should not trigger renegotiation as long as a new
    // track is not introduced. If that is the case we would expect renegotiation to happen.
    this.logger.info('changeSendingMedia: changing sending "' + kind + '" to "' + value + '"');
    if (['audio', 'video'].includes(kind)) {
      var tracks = this.media.senderTracks.filter(function (t) {
        return t.kind === kind;
      });
      var newDirection = (0, _boolToStatus2.default)(value, this.media['receiving' + capitalize[kind]]);

      if (tracks.length > 0) {
        // track already exists, we only need to toggle direction
        return this.media.setMedia(kind, newDirection).then(function () {
          return _this4.updateMuteToggles(kind, value);
        });
      }

      // adding a new track and needs renegotiation
      return new _promise2.default(function (resolve) {
        _this4.once('mediaNegotiationCompleted', function () {
          return resolve();
        });
        _this4.media.setMedia(kind, newDirection);
      });
    }

    return _promise2.default.reject(new Error('kind must be one of "audio" or "video"'));
  },


  /**
   * Does the cleanup after a call has ended
   * @instance
   * @memberof Call
   * @private
   * @returns {Promise}
   */
  cleanup: function cleanup() {
    var _this5 = this;

    return new _promise2.default(function (resolve) {
      // need to do this on next tick otherwise this.off() prevents remaining
      // events from being received (e.g. other listeners for `disconnected`
      // won't execute)
      process.nextTick(function () {
        _this5.media.stop();
        _this5.stopListening(_this5.spark.internal.mercury);
        _this5.off();
        resolve();
      });
    });
  },

  /**
   * Call and answer require nearly identical logic, so this method unifies them.
   * @instance
   * @memberof Call
   * @param {Object|locus} target
   * @param {Object} options
   * @todo remove 'locusMethodName' and move that logic to locus plugin
   * @todo move options and target processing to separate function
   * @todo rename to join()?
   * @returns {Promise}
   */
  createOrJoinLocus: function createOrJoinLocus(target) {
    var _this6 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (options.localMediaStream) {
      this.localMediaStream = options.localMediaStream;
    } else {
      if (!options.constraints) {
        options.constraints = {
          audio: true,
          video: {
            facingMode: {
              ideal: this.spark.phone.defaultFacingMode
            }
          }
        };
      }

      var mode = (0, _get3.default)(options, 'constraints.video.facingMode.ideal', (0, _get3.default)(options, 'constraints.video.facingMode.exact'));
      if (mode === 'user' || mode === 'environment') {
        this.facingMode = mode;
      }

      var recvOnly = !options.constraints.audio && !options.constraints.video;
      options.offerOptions = (0, _defaults3.default)(options.offerOptions, {
        offerToReceiveAudio: recvOnly || !!options.constraints.audio,
        offerToReceiveVideo: recvOnly || !!options.constraints.video
      });

      if (options.constraints.fake) {
        this.media.constraints.fake = true;
      }

      this.media.setMedia('audio', (0, _boolToStatus2.default)(options.constraints.audio, options.offerOptions.offerToReceiveAudio), options.constraints.audio);
      if ((0, _get3.default)(options, 'constraints.video.mediaSource') === 'screen' || (0, _get3.default)(options, 'constraints.video.mediaSource') === 'application') {
        this.media.setMedia('screen', 'sendonly');
      } else {
        this.media.setMedia('video', (0, _boolToStatus2.default)(options.constraints.video, options.offerOptions.offerToReceiveVideo), options.constraints.video);
      }
    }

    if (!target.correlationId) {
      options.correlationId = _uuid2.default.v4();
      this.correlationId = options.correlationId;
    }

    if (!this.correlationId) {
      this.correlationId = target.correlationId;
    }

    // reminder: not doing this copy in initialize() because config may not yet
    // be available
    this.media.bandwidthLimit = {
      audioBandwidthLimit: this.config.audioBandwidthLimit,
      videoBandwidthLimit: this.config.videoBandwidthLimit
    };

    return this.media.createOffer().then((0, _common.tap)(function () {
      return _this6.logger.info('created offer');
    })).then(function () {
      return _this6.spark.internal.locus.createOrJoin(target, (0, _assign2.default)({
        localSdp: _this6.media.offerSdp,
        correlationId: _this6.correlationId
      }, options));
    }).then((0, _common.tap)(function () {
      return _this6.logger.info('sent offer to locus');
    })).then((0, _common.tap)(function () {
      return _this6.logger.info('setting locus');
    })).then(function (locus) {
      return _this6.setLocus(locus);
    }).then((0, _common.tap)(function () {
      return _this6.logger.info('successfully set locus');
    })).then(function () {
      var answer = JSON.parse(_this6.mediaConnection.remoteSdp).sdp;
      _this6.logger.info('accepting answer');
      _this6.logger.info('peer state', _this6.media.pc && _this6.media.pc.signalingState);
      if (!_this6.media.ended) {
        return _this6.media.acceptAnswer(answer).then(function () {
          return _this6.logger.info('answer accepted');
        }).catch(function (err) {
          _this6.logger.error('failed to accept answer', err);
          return _promise2.default.reject(err);
        });
      }
      _this6.logger.info('call: already ended, not accepting answer');
      return _promise2.default.resolve();
    });
  },

  /**
   * Alias of {@link Call#reject}
   * @see {@link Call#reject}
   * @instance
   * @memberof Call
   * @returns {Promise}
   */
  decline: function decline() {
    return this.reject();
  },

  /**
   * Used by {@link Phone#dial} to initiate an outbound call
   * @instance
   * @memberof Call
   * @param {[type]} invitee
   * @param {[type]} options
   * @private
   * @returns {[type]}
   */
  dial: function dial(invitee, options) {
    var _this7 = this;

    this.locusJoinInFlight = true;
    this.logger.info('call: dialing');

    var target = invitee;

    if (_common.base64.validate(invitee)) {
      // eslint-disable-next-line no-unused-vars
      var parsed = _common.base64.decode(invitee).split('/');
      var resourceType = parsed[3];
      var id = parsed[4];
      if (resourceType === 'PEOPLE') {
        target = id;
      }

      if (resourceType === 'ROOM') {
        if (!(0, _get3.default)(this, 'config.enableExperimentalGroupCallingSupport')) {
          throw new Error('Group calling is not enabled. Please enable config.phone.enableExperimentalGroupCallingSupport');
        }

        target = {
          url: this.spark.internal.device.services.conversationServiceUrl + '/conversations/' + id + '/locus'
        };
      }
    }

    // Note: mercury.connect() will call device.register() if needed. We're not
    // using phone.register() here because it guarantees a device refresh, which
    // is probably unnecessary.
    this.spark.internal.mercury.connect().then(function () {
      return _this7.createOrJoinLocus(target, options);
    }).then((0, _common.tap)(function () {
      return _this7.logger.info('call: dialed');
    })).catch(function (reason) {
      _this7.trigger('error', reason);
    }).then(function () {
      _this7.locusJoinInFlight = false;
    });

    return this;
  },


  /**
   * Returns a {@link Readable} that emits {@link Call#media.pc}'s
   * {@link RTCStatsReport} every second.
   * @instance
   * @memberof Call
   * @returns {StatsStream}
   */
  getRawStatsStream: function getRawStatsStream() {
    return new _stream2.default(this.media.pc);
  },


  /**
   * Returns a {@link StatsStream} piped through a {@link StatsFilter}
   * @instance
   * @memberof Call
   * @returns {Readable}
   */
  getStatsStream: function getStatsStream() {
    return this.getRawStatsStream().pipe(new _filter2.default());
  },


  /**
   * Disconnects the active call. Applies to both incoming and outgoing calls.
   * This method may be invoked in any call state and the SDK should take care
   * to tear down the call and free up all resources regardless of the state.
   * @instance
   * @memberof Call
   * @returns {Promise}
   */
  hangup: function hangup() {
    var _this8 = this;

    // Note: not a @oneFlight because this function must call itself
    if (this.direction === 'in' && !this.joinedOnThisDevice) {
      return this.reject();
    }

    this.logger.info('call: hanging up');

    this.media.stop();

    if (this.locusJoinInFlight) {
      this.logger.info('call: locus join in flight, waiting for rest call to complete before hanging up');
      return this.when('change:locusJoinInFlight').then(function () {
        return _this8.hangup();
      });
    }

    if (!this.locus) {
      return this.cleanup().then(function () {
        return _this8.logger.info('call: hang up complete, call never created');
      });
    }

    return this.leave();
  },


  /**
   * Initializer
   * @instance
   * @memberof Call
   * @private
   * @param {Object} attrs
   * @param {Object} options
   * @returns {undefined}
   */
  initialize: function initialize() {
    var _this9 = this;

    for (var _len = arguments.length, initArgs = Array(_len), _key = 0; _key < _len; _key++) {
      initArgs[_key] = arguments[_key];
    }

    (0, _apply2.default)(_sparkCore.SparkPlugin.prototype.initialize, this, initArgs);

    this.on('change:activeParticipantsCount', function () {
      return _this9.onChangeActiveParticipantsCount.apply(_this9, arguments);
    });
    // This handler is untested because there's no way to provoke it. It's
    // probably actually only relevant for group calls.
    this.on('change:isActive', function () {
      return _this9.onChangeIsActive.apply(_this9, arguments);
    });
    this.on('change:localMediaStream', function () {
      return _this9.onChangeLocalMediaStream.apply(_this9, arguments);
    });
    // Reminder: this is not a derived property so that we can reassign the
    // stream midcall
    this.on('change:media.localMediaStream', function () {
      _this9.localMediaStream = _this9.media.localMediaStream;
    });
    this.on('change:remoteMember', function () {
      return _this9.onChangeRemoteMember.apply(_this9, arguments);
    });
    ['localMediaStream', 'remoteAudioMuted', 'remoteMediaStream', 'remoteVideoMuted', 'localScreenShare'].forEach(function (key) {
      _this9.on('change:' + key, function () {
        return _this9.trigger(key + ':change');
      });
    });
    this.on('replaced', function () {
      return _this9.cleanup();
    });

    this.listenTo(this.memberships, 'add', function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _this9.trigger.apply(_this9, ['memberships:add'].concat(args));
    });
    this.listenTo(this.memberships, 'change', function () {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return _this9.trigger.apply(_this9, ['membership:change'].concat(args));
    });
    this.listenTo(this.memberships, 'change:audioMuted', function () {
      return _this9.onMembershipsAudioMuted.apply(_this9, arguments);
    });
    this.listenTo(this.memberships, 'change:state', function () {
      return _this9.onMembershipsChangeState.apply(_this9, arguments);
    });
    this.listenTo(this.memberships, 'change:videoMuted', function () {
      return _this9.onMembershipsVideoMuted.apply(_this9, arguments);
    });
    this.listenTo(this.memberships, 'remove', function () {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return _this9.trigger.apply(_this9, ['memberships:remove'].concat(args));
    });

    this.listenTo(this.spark.internal.mercury, 'event:locus', function (event) {
      return _this9.onLocusEvent(event);
    });
    this.listenTo(this.spark.internal.mercury, 'event:locus.difference', function (event) {
      return _this9.onLocusEvent(event);
    });

    this.listenTo(this.media, 'error', function (error) {
      return _this9.trigger('error', error);
    });
    this.listenTo(this.media, 'internalTrackUpdate', function () {
      _this9.trigger('remoteMediaStream:change');
    });
    this.listenTo(this.media, 'negotiationneeded', function () {
      return _this9.onMediaNegotiationNeeded.apply(_this9, arguments);
    });

    if (this.locus) {
      this.internalCallId = (0, _stateParsers.makeInternalCallId)(this.locus);
    } else {
      this.once('change:locus', function () {
        _this9.internalCallId = (0, _stateParsers.makeInternalCallId)(_this9.locus);
      });
    }

    this.memberships.listenToAndRun(this, 'change:locus', function () {
      if (_this9.locus && _this9.locus.participants) {
        // Reminder: we're parsing here instead of CallMembership(s) so that we
        // can avoid making those classes spark aware and therefore keep them a
        // lot simpler
        _this9.memberships.set((0, _stateParsers.participantsToCallMemberships)(_this9.spark, _this9.locus));
        _this9.me = _this9.memberships.find(function (m) {
          return m.isSelf;
        });
      }
    });

    if (this.config.enableExperimentalGroupCallingSupport) {
      this.on('inactive', function () {
        return _this9.hangup();
      });
      this.on('inactive', function () {
        return _this9.cleanup();
      });

      this.on('change:state', function () {
        process.nextTick(function () {
          return _this9.trigger(_this9.state);
        });
      });
      this.on = (0, _wrap3.default)(this.on, function (fn, eventName) {
        for (var _len5 = arguments.length, rest = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
          rest[_key5 - 2] = arguments[_key5];
        }

        if (deprecatedCallEventNames.includes(eventName)) {
          throw new Error('The "' + eventName + '" event is no longer valid with "enableExperimentalGroupCallingSupport===true"');
        }

        return (0, _apply2.default)(fn, _this9, [eventName].concat(rest));
      });
    } else {
      this.on('disconnected', function () {
        return _this9.hangup();
      });
      this.on('disconnected', function () {
        return _this9.cleanup();
      });

      this.on('change:status', function () {
        process.nextTick(function () {
          return _this9.trigger(_this9.status);
        });
      });
    }
  },

  /**
   * Does the internal work necessary to end a call while allowing hangup() to
   * call itself without getting stuck in promise change because of oneFlight
   * The name of this function is temporary to address the no-underscore-dangle
   * rule. A future commit in this PR will rename all of the
   * reject/end/hangup/finish functions to be more meaningful and not just be
   * synonyms the same word.
   * @private
   * @instance
   * @memberof Call
   * @returns {Promise}
   */
  leave: function leave() {
    var _this10 = this;

    this.logger.info('leave: attempting to leave locus');
    var status = (0, _get3.default)(this, this.config.enableExperimentalGroupCallingSupport ? 'me.state' : 'status');
    if (status === 'disconnected') {
      this.logger.info('already hung up, not calling locus again');
      return _promise2.default.resolve();
    }

    if (status === 'declined') {
      this.logger.info('call was declined, not leaving again');
      return _promise2.default.resolve();
    }

    if (status !== 'connected') {
      this.logger.info('call is neither connected, disconnected, or declined, declining instead of leaving');
      return this.decline();
    }

    this.logger.info('leave: leaving locus');
    return this.spark.internal.locus.leave(this.locus).catch(function (err) {
      _this10.logger.error('leave: locus leave error: ', err.stack || err.toString());
      return _promise2.default.reject(err);
    }).then((0, _common.tap)(function () {
      return _this10.logger.info('leave ' + _this10.locus.id + ': finished leaving via locus');
    })).then((0, _common.tap)(function () {
      return _this10.logger.info('leave ' + _this10.locus.id + ': setting locus');
    })).then(function (locus) {
      return _this10.setLocus(locus);
    }).then((0, _common.tap)(function () {
      return _this10.logger.info('leave ' + _this10.locus.id + ': finished setting locus');
    }))
    // Note: not stopping event-listening here; that'll happening
    // automatically when `disconnected` fires.
    .then((0, _common.tap)(function () {
      return _this10.logger.info('call: hung up');
    }));
  },


  /**
   * Handles an incoming mercury event if relevant to this call.
   * @instance
   * @memberof Call
   * @param {Types~MercuryEvent} event
   * @private
   * @returns {undefined}
   */
  onLocusEvent: function onLocusEvent(event) {
    var _this11 = this;

    var devices = (0, _get3.default)(event, 'data.locus.self.devices');
    var device = devices && (0, _find3.default)(devices, function (item) {
      return item.url === _this11.spark.internal.device.url;
    });

    var internalCallId = this.locus && (0, _stateParsers.makeInternalCallId)(event.data.locus);
    if (internalCallId === this.internalCallId || device && this.correlationId === device.correlationId) {
      this.logger.info('locus event: ' + event.data.eventType);
      this.setLocus(event.data.locus);
    }

    if (event.data.locus.replaces) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(event.data.locus.replaces), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var replaced = _step.value;

          if (replaced.locusUrl + '_' + replaced.lastActive === this.internalCallId) {
            this.setLocus(event.data.locus);
            this.logger.info('locus replacement event: ' + event.data.eventType, this.locusUrl, '->', event.data.locus.url);
            return;
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
  },


  /**
   * Event handler
   * @instance
   * @memberof Call
   * @private
   * @returns {undefined}
   */
  onMembershipsAudioMuted: function onMembershipsAudioMuted() {
    this.logger.info('onMembershipsAudioMuted');
    if (this.remoteMember) {
      this.remoteAudioMuted = this.remoteMember.audioMuted;
    }
  },


  /**
   * Event handler
   * @instance
   * @memberof Call
   * @private
   * @returns {undefined}
   */
  onMembershipsVideoMuted: function onMembershipsVideoMuted() {
    this.logger.info('onMembershipsVideoMuted');
    if (this.remoteMember) {
      this.remoteVideoMuted = this.remoteMember.videoMuted;
    }
  },


  /**
   * Event handler
   * @instance
   * @memberof Call
   * @private
   * @returns {undefined}
   */
  onChangeRemoteMember: function onChangeRemoteMember() {
    if (this.remoteMember) {
      this.remoteAudioMuted = this.remoteMember.audioMuted;
      this.remoteVideoMuted = this.remoteMember.videoMuted;
    } else {
      this.remoteAudioMuted = undefined;
      this.remoteVideoMuted = undefined;
    }
  },


  /**
   * Event handler
   * @instance
   * @memberof Call
   * @param {Membership} model
   * @private
   * @returns {undefined}
   */
  onMembershipsChangeState: function onMembershipsChangeState(model) {
    this.activeParticipantsCount = this.memberships.filter(function (m) {
      return m.state === 'connected';
    }).length;

    this.trigger('membership:' + model.state, model);
  },

  /**
   * Event handler
   * @instance
   * @memberof Call
   * @private
   * @returns {undefined}
   */
  onMediaNegotiationNeeded: function onMediaNegotiationNeeded() {
    var _this12 = this;

    this.logger.info('onMediaNegotiationNeeded');
    this.media.createOffer().then(function () {
      // Determine mute state for locus from sdp
      var offer = (0, _sdpTransform.parse)(_this12.media.offerSdp);
      var audioOfferDir = getMediaDirectionFromSDP('audio', offer);
      var audioMuted = !audioOfferDir.includes('send');
      var videoOfferDir = getMediaDirectionFromSDP('video', offer);
      var videoMuted = !videoOfferDir.includes('send');
      var screenOfferDir = getMediaDirectionFromSDP('screen', offer);
      _this12.logger.info('onMediaNegotiationNeeded: audioOfferDir=' + audioOfferDir + ' videoOfferDir=' + videoOfferDir + ' screenOfferDir=' + screenOfferDir);
      _this12.logger.info('onMediaNegotiationNeeded: audioMuted=' + audioMuted + ' videoMuted=' + videoMuted);
      var updateMediaOptions = {
        sdp: _this12.media.offerSdp,
        mediaId: _this12.mediaId,
        audioMuted: audioMuted,
        videoMuted: videoMuted
      };
      return _this12.updateMedia(updateMediaOptions);
    }).then(function () {
      return _this12.pollForExpectedLocusAndSdp();
    }).then(function () {
      var _JSON$parse = JSON.parse(_this12.mediaConnection.remoteSdp),
          sdp = _JSON$parse.sdp;

      return _this12.media.acceptAnswer(sdp);
    }).then(function () {
      return _this12.emit('mediaNegotiationCompleted');
    }).catch(function (reason) {
      return _this12.emit('error', reason);
    });
  },


  /**
   * Event handler
   * @instance
   * @memberof Call
   * @private
   * @returns {undefined}
   */
  onChangeLocalMediaStream: function onChangeLocalMediaStream() {
    var _this13 = this;

    if (this.localMediaStream && this.localMediaStream !== this.media.localMediaStream) {
      ['audio', 'video'].forEach(function (kind) {
        // eslint-disable-next-line max-nested-callbacks
        var track = _this13.localMediaStream.getTracks().find(function (t) {
          return t.kind === kind;
        });
        if (track) {
          _this13.media.setMedia(kind, (0, _boolToStatus2.default)(track.enabled, _this13['receiving' + capitalize[kind]]), track);
        } else {
          _this13.media.setMedia(kind, (0, _boolToStatus2.default)(false, _this13['receiving' + capitalize[kind]]));
        }
      });
      this.localMediaStream = this.media.localMediaStream;
    }
  },


  /**
   * Event handler
   * @instance
   * @memberof Call
   * @private
   * @returns {undefined}
   */
  onChangeIsActive: function onChangeIsActive() {
    if (!this.isActive) {
      if (this.joinedOnThisDevice) {
        this.logger.info('call: hanging up due to locus going inactive');
        this.hangup();
      }
    }
  },


  /**
   * Event handler
   * @instance
   * @memberof Call
   * @private
   * @returns {undefined}
   */
  onChangeActiveParticipantsCount: function onChangeActiveParticipantsCount() {
    if (!this.joinedOnThisDevice) {
      return;
    }

    if (this.activeParticipantsCount !== 1) {
      return;
    }

    if (this.isCall && !this.config.hangupIfLastActive.call) {
      return;
    }

    if (!this.isCall && !this.config.hangupIfLastActive.meeting) {
      return;
    }

    var previousLocus = this.previousAttributes().locus;
    if (!previousLocus) {
      return;
    }

    if ((0, _stateParsers.activeParticipants)(previousLocus).length > 1) {
      this.logger.info('call: hanging up due to last participant in call');
      this.hangup();
    }
  },

  /**
   * The response to a PUT to LOCUS/media may not be fully up-to-date when we
   * receive it. This method polls locus until we get a locus with the status
   * properties we expect (or three errors occur)
   * @instance
   * @memberof Call
   * @private
   * @returns {Promise<Types~Locus>}
   */
  pollForExpectedLocusAndSdp: function pollForExpectedLocusAndSdp() {
    var _this14 = this;

    return new _promise2.default(function (resolve, reject) {
      var offer = (0, _sdpTransform.parse)(_this14.media.offerSdp);

      var audioOfferDir = getMediaDirectionFromSDP('audio', offer);
      var videoOfferDir = getMediaDirectionFromSDP('video', offer);
      var screenOfferDir = getMediaDirectionFromSDP('screen', offer);

      var self = _this14;
      var count = 0;
      var validate = function validate() {
        count += 1;
        try {
          _this14.logger.info('iteration ' + count + ': checking if current locus sdp has the expected audio and video directions');
          if (isExpectedDirection(JSON.parse(_this14.mediaConnection.remoteSdp).sdp)) {
            _this14.logger.info('iteration ' + count + ': the current locus sdp has the expected audio and video directions');
            try {
              _this14.logger.info('iteration ' + count + ': checking if current locus has the expected audio and video directions');
              _this14.validateLocusMediaState(_this14.locus);
              _this14.logger.info('iteration ' + count + ': the current locus has the expected audio and video directions; not syncing');
              resolve();
              return;
            } catch (err) {
              _this14.logger.info('iteration ' + count + ': the current locus does not have the expected audio and video directions; syncing');
            }
          } else {
            _this14.logger.info('iteration ' + count + ': the current locus sdp does not have the expected audio and video directions; syncing');
          }

          if (count > 4) {
            reject(new Error('After ' + count + ' attempts polling locus'));
            return;
          }

          setTimeout(function () {
            return _this14.spark.internal.locus.sync(_this14.locus).then(function (locus) {
              return _this14.setLocus(locus);
            }).then(validate).catch(reject);
          }, 1000 * Math.pow(2, count));
        } catch (err) {
          reject(err);
        }
      };

      validate();
      /**
       * Determine if the incoming sdp has the expected media directions
       * @private
       * @param {string} sdp
       * @returns {boolean}
       */
      function isExpectedDirection(sdp) {
        var answer = (0, _sdpTransform.parse)(sdp);

        var audioAnswerDir = getMediaDirectionFromSDP('audio', answer);
        var videoAnswerDir = getMediaDirectionFromSDP('video', answer);
        var screenAnswerDir = getMediaDirectionFromSDP('screen', answer);

        var expectedAudioAnswerDir = reverseMediaDirection(audioOfferDir);
        var expectedVideoAnswerDir = reverseMediaDirection(videoOfferDir);
        var expectedScreenAnswerDir = reverseMediaDirection(screenOfferDir);

        self.logger.info('audio: ' + audioOfferDir + ', ' + audioAnswerDir + ', ' + expectedAudioAnswerDir);
        self.logger.info('video: ' + videoOfferDir + ', ' + videoAnswerDir + ', ' + expectedVideoAnswerDir);
        self.logger.info('screen: ' + screenOfferDir + ', ' + screenAnswerDir + ', ' + expectedScreenAnswerDir);

        // eslint-disable-next-line max-len
        return audioAnswerDir === expectedAudioAnswerDir && videoAnswerDir === expectedVideoAnswerDir && screenAnswerDir === expectedScreenAnswerDir;
      }
    });
  },


  /**
   * Tells locus we're done sharing some or all of our screen.
   * @instance
   * @memberof Call
   * @private
   * @returns {Promise}
   */
  releaseFloor: function releaseFloor() {
    var _this15 = this;

    this.logger.info('call: releasing floor grant');
    return _promise2.default.resolve().then((0, _stateParsers.waitForMediaShare)(this)).then(function (mediaShare) {
      return _this15.spark.internal.locus.releaseFloorGrant(_this15.locus, mediaShare);
    });
  },

  /**
   * Rejects an incoming call. Only applies to incoming calls. Invoking this
   * method on an outgoing call is a no-op.
   * @instance
   * @memberof Call
   * @returns {Promise}
   */
  reject: function reject() {
    var _this16 = this;

    if (this.direction === 'out') {
      return _promise2.default.resolve();
    }

    this.logger.info('call: rejecting');
    /* eslint no-invalid-this: [0] */
    return this.spark.internal.locus.decline(this.locus).then(function (locus) {
      return _this16.setLocus(locus);
    }).then((0, _common.tap)(function () {
      return _this16.cleanup();
    })).then((0, _common.tap)(function () {
      return _this16.logger.info('call: rejected');
    }));
  },


  /**
   * Tells locus we'd like to share some or all of our screen.
   * @instance
   * @memberof Call
   * @private
   * @returns {Promise}
   */
  requestFloor: function requestFloor() {
    var _this17 = this;

    this.logger.info('call: requesting floor grant');
    return _promise2.default.resolve().then((0, _stateParsers.waitForMediaShare)(this)).then(function (mediaShare) {
      return _this17.spark.internal.locus.requestFloorGrant(_this17.locus, mediaShare);
    });
  },


  /**
   * Assigns a new locus to this.locus according to locus sequencing rules
   * @instance
   * @memberof Call
   * @param {Types~Locus} incoming
   * @param {boolean} recursing - when true, indicates that this method has
   * called itself and we should fall back to {@link locus.get()} instead of
   * calling {@link locus.sync()}
   * @private
   * @returns {Promise}
   */
  setLocus: function setLocus(incoming) {
    var _this18 = this;

    var recursing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var current = this.locus;
    if (!current) {
      this.locus = incoming;
      return _promise2.default.resolve();
    }
    var action = this.spark.internal.locus.compare(current, incoming);

    switch (action) {
      case _internalPluginLocus.USE_INCOMING:
        this.locus = this.spark.internal.locus.merge(this.locus, incoming);
        if (this.device) {
          this.correlationId = this.device.correlationId;
        }
        break;
      case _internalPluginLocus.FETCH:
        if (recursing) {
          this.logger.info('call: fetching locus according to sequencing algorithm');
          return this.spark.internal.locus.get(current).then(function (locus) {
            return _this18.setLocus(locus, true);
          });
        }

        this.logger.info('call: syncing locus according to sequencing algorithm');

        return this.spark.internal.locus.sync(current).then(function (locus) {
          return _this18.setLocus(locus, true);
        });

      default:
      // do nothing
    }

    return _promise2.default.resolve();
  },


  /**
   * Send DTMF tones to the current call
   * @instance
   * @memberof Call
   * @param {string} tones
   * @returns {Promise}
   */
  sendDtmf: function sendDtmf(tones) {
    if (!this.supportsDtmf) {
      return _promise2.default.reject(new Error('this call does not support dtmf'));
    }

    return this.spark.internal.locus.sendDtmf(this.locus, tones);
  },


  /**
   * Sends feedback about the call to the Cisco Spark cloud
   * @instance
   * @memberof Call
   * @param {FeedbackObject} feedback
   * @returns {Promise}
   */
  sendFeedback: function sendFeedback(feedback) {
    return this.spark.internal.metrics.submit('meetup_call_user_rating', feedback);
  },


  /**
   * Shares a particular application as a second stream in the call
   * @returns {Promise}
   */
  startApplicationShare: function startApplicationShare() {
    var _this19 = this;

    this.logger.info('call: sharing application');
    return new _promise2.default(function (resolve) {
      _this19.media.once('answeraccepted', resolve);
      _this19.media.setMedia('screen', 'sendonly', {
        mediaSource: 'application'
      });
    }).then(function () {
      return _this19.requestFloor();
    });
  },


  /**
   * Shares the whole screen as a second stream in the call
   * @returns {Promise}
   */
  startScreenShare: function startScreenShare() {
    var _this20 = this;

    this.logger.info('call: sharing screen');

    return new _promise2.default(function (resolve) {
      _this20.media.once('answeraccepted', resolve);
      _this20.media.setMedia('screen', 'sendonly', {
        mediaSource: 'screen'
      });
    }).then(function () {
      return _this20.requestFloor();
    });
  },


  /**
   * Start receiving audio
   * @instance
   * @memberof Call
   * @returns {Promise}
   */
  startReceivingAudio: function startReceivingAudio() {
    return this.changeReceivingMedia('audio', true);
  },


  /**
   * Start receiving video
   * @instance
   * @memberof Call
   * @returns {Promise}
   */
  startReceivingVideo: function startReceivingVideo() {
    return this.changeReceivingMedia('video', true);
  },


  /**
   * Starts sending audio to the Cisco Spark Cloud
   * @instance
   * @memberof Call
   * @returns {Promise}
   */
  startSendingAudio: function startSendingAudio() {
    return this.changeSendingMedia('audio', true);
  },


  /**
   * Starts sending video to the Cisco Spark Cloud
   * @instance
   * @memberof Call
   * @returns {Promise}
   */
  startSendingVideo: function startSendingVideo() {
    return this.changeSendingMedia('video', true);
  },


  /**
   * Stops sharing an application or whole screen media stream
   * @returns {Promise}
   */
  stopScreenShare: function stopScreenShare() {
    var _this21 = this;

    this.logger.info('call: stopping screen/application share');

    return this.releaseFloor().then(function () {
      return new _promise2.default(function (resolve) {
        _this21.media.once('answeraccepted', resolve);
        _this21.media.setMedia('screen', 'inactive');
      });
    });
  },


  /**
   * Stop receiving audio
   * @instance
   * @memberof Call
   * @returns {Promise}
   */
  stopReceivingAudio: function stopReceivingAudio() {
    return this.changeReceivingMedia('audio', false);
  },


  /**
   * Stop receiving video
   * @instance
   * @memberof Call
   * @returns {Promise}
   */
  stopReceivingVideo: function stopReceivingVideo() {
    return this.changeReceivingMedia('video', false);
  },


  /**
   * Stops sending audio to the Cisco Spark Cloud. (stops broadcast immediately,
   * even if renegotiation has not completed)
   * @instance
   * @memberof Call
   * @returns {Promise}
   */
  stopSendingAudio: function stopSendingAudio() {
    return this.changeSendingMedia('audio', false);
  },


  /**
   * Stops sending video to the Cisco Spark Cloud. (stops broadcast immediately,
   * even if renegotiation has not completed)
   * @instance
   * @memberof Call
   * @returns {Promise}
   */
  stopSendingVideo: function stopSendingVideo() {
    return this.changeSendingMedia('video', false);
  },


  /**
   * Replaces the current mediaStrem with one with identical constraints, except
   * for an opposite facing mode. If the current facing mode cannot be
   * determined, the facing mode will be set to `user`. If the call is audio
   * only, this function will throw.
   * @instance
   * @memberof Call
   * @returns {undefined}
   */
  toggleFacingMode: function toggleFacingMode() {
    var _this22 = this;

    if (!this.sendingVideo) {
      throw new Error('Cannot toggle facingMode if we\'re not sending video');
    }

    if (this.facingMode !== 'user' && this.facingMode !== 'environment') {
      throw new Error('Cannot determine current facing mode; specify a new localMediaStream to change cameras');
    }

    var constraint = {
      facingMode: {
        ideal: this.facingMode === 'user' ? 'environment' : 'user'
      }
    };

    // Constraint changes that don't result in a new sender does not trigger renegotiate
    // We now use replaceTrack to swap in a new media
    return this.media.setMedia('video', (0, _boolToStatus2.default)(this.sendingAudio, this.sendingVideo), constraint).then(function () {
      _this22.facingMode = constraint.facingMode.ideal;
    });
  },


  /**
   * Toggles receiving audio from the Cisco Spark Cloud
   * @instance
   * @memberof Call
   * @returns {Promise}
   */
  toggleReceivingAudio: function toggleReceivingAudio() {
    return this.receivingAudio ? this.stopReceivingAudio() : this.startReceivingAudio();
  },


  /**
   * Toggles receiving video from the Cisco Spark Cloud
   * @instance
   * @memberof Call
   * @returns {Promise}
   */
  toggleReceivingVideo: function toggleReceivingVideo() {
    return this.receivingVideo ? this.stopReceivingVideo() : this.startReceivingVideo();
  },


  /**
   * Toggles sending audio to the Cisco Spark Cloud
   * @instance
   * @memberof Call
   * @returns {Promise}
   */
  toggleSendingAudio: function toggleSendingAudio() {
    return this.sendingAudio ? this.stopSendingAudio() : this.startSendingAudio();
  },


  /**
   * Toggles sending video to the Cisco Spark Cloud
   * @instance
   * @memberof Call
   * @returns {Promise}
   */
  toggleSendingVideo: function toggleSendingVideo() {
    return this.sendingVideo ? this.stopSendingVideo() : this.startSendingVideo();
  },


  /**
   * Changes the status of media
   * @instance
   * @memberof Call
   * @param {Object} payload
   * @private
   * @returns {Promise}
   */
  updateMedia: function updateMedia(payload) {
    var _this23 = this;

    this.logger.info('updateMedia');
    if (payload.sdp && !payload.sdp.includes('b=')) {
      throw new Error('outbound sdp should always have a \'b=\' line');
    }
    return this.spark.internal.locus.updateMedia(this.locus, payload).then(function (locus) {
      return _this23.setLocus(locus);
    });
  },


  /**
   * Updates sdp with correct video status
   * @instance
   * @memberof Call
   * @param {string} sdp
   * @param {boolean} isMuted
   * @private
   * @returns {Promise}
   */
  updateVideoMuteSdp: function updateVideoMuteSdp(sdp, isMuted) {
    var newDir = boolToDirection(!isMuted, this.receivingVideo);
    var oldDir = boolToDirection(isMuted, this.receivingVideo);
    return sdp.replace(new RegExp('a=mid:video[^a]+a=' + oldDir, 'gi'), 'a=mid:video\na=' + newDir);
  },

  /**
   * Tells locus we've got a new media direction
   * @instance
   * @memberof Call
   * @param {string} kind of 'audio' or 'video'
   * @param {boolean} value
   * @private
   * @returns {Promise}
   */
  updateMuteToggles: function updateMuteToggles(kind, value) {
    this.logger.info('updating mute toggles: ' + kind + '=' + value);
    var payload = {
      mediaId: this.mediaId,
      audioMuted: !this.sendingAudio,
      videoMuted: !this.sendingVideo
    };
    if (kind === 'audio') {
      payload.audioMuted = !value;
    } else if (kind === 'video') {
      payload.videoMuted = !value;
      payload.sdp = this.updateVideoMuteSdp(this.media.offerSdp, !value);
    }

    return this.updateMedia(payload);
  },


  /**
   * Checks that this.locus has the expected state
   * @instance
   * @memberof Call
   * @param {Types~Locus} locus
   * @private
   * @returns {Promise}
   */
  validateLocusMediaState: function validateLocusMediaState(locus) {
    var locusAudio = locus.self.status.audioStatus.toLowerCase();
    var mediaAudio = this.media.audioDirection;

    if (locusAudio !== mediaAudio) {
      this.logger.warn('locus: expected audio ' + locusAudio + ' (locus) to equal ' + mediaAudio + ' (local media)');
      throw new Error('locus.self.status.audioStatus indicates the received DTO is out of date');
    }

    var locusVideo = locus.self.status.videoStatus.toLowerCase();
    var mediaVideo = this.media.videoDirection;
    if (locusVideo !== mediaVideo) {
      this.logger.warn('locus: expected video ' + locusVideo + ' (locus) to equal ' + mediaVideo + ' (local media)');
      throw new Error('locus.self.status.videoStatus indicates the received DTO is out of date');
    }

    return locus;
  },


  /**
   * Waits until this.locus describes the expected state
   * @instance
   * @memberof Call
   * @private
   * @returns {Promise}
   */
  waitForExpectedLocus: function waitForExpectedLocus() {
    var _this24 = this;

    return new _promise2.default(function (resolve) {
      var listener = function listener() {
        try {
          _this24.validateLocusMediaState(_this24.locus);
          _this24.off('change:locus', listener);
          resolve();
        } catch (err) {
          _this24.logger.warn('locus: current locus not in expected state; waiting for next locus');
        }
      };
      _this24.on('change:locus', listener);
      listener();
    });
  },
  version: '1.32.23'
}, (_applyDecoratedDescriptor(_obj, 'acknowledge', [_common.oneFlight], (0, _getOwnPropertyDescriptor2.default)(_obj, 'acknowledge'), _obj), _applyDecoratedDescriptor(_obj, 'answer', [_common.oneFlight, _dec], (0, _getOwnPropertyDescriptor2.default)(_obj, 'answer'), _obj), _applyDecoratedDescriptor(_obj, 'createOrJoinLocus', [_common.oneFlight], (0, _getOwnPropertyDescriptor2.default)(_obj, 'createOrJoinLocus'), _obj), _applyDecoratedDescriptor(_obj, 'decline', [_dec2], (0, _getOwnPropertyDescriptor2.default)(_obj, 'decline'), _obj), _applyDecoratedDescriptor(_obj, 'dial', [_common.oneFlight], (0, _getOwnPropertyDescriptor2.default)(_obj, 'dial'), _obj), _applyDecoratedDescriptor(_obj, 'leave', [_common.oneFlight, _dec3], (0, _getOwnPropertyDescriptor2.default)(_obj, 'leave'), _obj), _applyDecoratedDescriptor(_obj, 'onMediaNegotiationNeeded', [_dec4], (0, _getOwnPropertyDescriptor2.default)(_obj, 'onMediaNegotiationNeeded'), _obj), _applyDecoratedDescriptor(_obj, 'pollForExpectedLocusAndSdp', [_common.retry], (0, _getOwnPropertyDescriptor2.default)(_obj, 'pollForExpectedLocusAndSdp'), _obj), _applyDecoratedDescriptor(_obj, 'reject', [_common.oneFlight], (0, _getOwnPropertyDescriptor2.default)(_obj, 'reject'), _obj), _applyDecoratedDescriptor(_obj, 'updateMuteToggles', [_common.oneFlight], (0, _getOwnPropertyDescriptor2.default)(_obj, 'updateMuteToggles'), _obj)), _obj)));

Call.make = function make(attrs, options) {
  return new Call(attrs, options);
};

exports.default = Call;
//# sourceMappingURL=call.js.map
