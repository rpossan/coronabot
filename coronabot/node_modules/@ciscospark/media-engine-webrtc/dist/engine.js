'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _deleteProperty = require('babel-runtime/core-js/reflect/delete-property');

var _deleteProperty2 = _interopRequireDefault(_deleteProperty);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _weakMap = require('babel-runtime/core-js/weak-map');

var _weakMap2 = _interopRequireDefault(_weakMap);

var _defaults2 = require('lodash/defaults');

var _defaults3 = _interopRequireDefault(_defaults2);

var _dec, _dec2, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13;

var _lodashDecorators = require('lodash-decorators');

var _coreDecorators = require('core-decorators');

var _common = require('@ciscospark/common');

var _commonEvented = require('@ciscospark/common-evented');

var _commonEvented2 = _interopRequireDefault(_commonEvented);

var _ampersandEvents = require('ampersand-events');

var _ampersandEvents2 = _interopRequireDefault(_ampersandEvents);

var _sdpTransform = require('sdp-transform');

var _grammar = require('sdp-transform/lib/grammar');

var _grammar2 = _interopRequireDefault(_grammar);

var _bowser = require('bowser');

var _bowser2 = _interopRequireDefault(_bowser);

var _webrtcHelpers = require('./webrtc-helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  (0, _defineProperty2.default)(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

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

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

// Add support for our custom "content" attribute. Note: this seems to make
// parse() work correctly, but I don't think I could get write() to work.
if (!_grammar2.default.a.find(function (g) {
  return g.name === 'content';
})) {
  _grammar2.default.a.unshift({
    // name appears to be where we stick the value of this field in the parsed
    // media object
    name: 'content',
    // reg determines whether or not this line should be handled by this rule
    reg: /^content:(slides)/
  });
}

var DirectionContainer = (0, _common.make)(_weakMap2.default, _map2.default);
var targetMediaDirection = new DirectionContainer();

var capitalize = {
  audio: 'Audio',
  video: 'Video'
};

/**
 * Wrapper around targetMediaDirection.get which return `inactive` instead of
 * undefined
 * @param {WebRTCMediaEngine} target
 * @param {string} kind
 * @private
 * @returns {string}
 */
function getTargetMediaDirection(target, kind) {
  return targetMediaDirection.get(target, kind) || 'inactive';
}

/**
 * Interface for doing webrtc things
 * @protected
 */
var WebRTCMediaEngine = (_dec = (0, _common.whileInFlight)('gumming'), _dec2 = (0, _lodashDecorators.debounce)(500), (_class = function () {
  (0, _createClass3.default)(WebRTCMediaEngine, [{
    key: 'audioDirection',


    /**
     * Returns the current audio direction
     * @returns {string}
     */
    get: function get() {
      return (0, _webrtcHelpers.getMediaDirectionFromTracks)('audio', this.pc);
    }

    /**
     * Returns the current video direction
     * @returns {string}
     */

  }, {
    key: 'videoDirection',
    get: function get() {
      return (0, _webrtcHelpers.getMediaDirectionFromTracks)('video', this.pc);
    }

    /**
     * Returns the current screen direction
     * @returns {string}
     */

  }, {
    key: 'screenDirection',
    get: function get() {
      return !this.localScreenShare || this.localScreenShare.getTracks().length === 0 ? 'inactive' : 'sendonly';
    }

    /**
     * Returns the current tracks attached to senders
     * @returns {string}
     */

  }, {
    key: 'senderTracks',
    get: function get() {
      return this.pc.getSenders().reduce(function (acc, s) {
        if (s.track) {
          acc.push(s.track);
        }
        return acc;
      }, []);
    }

    /**
     * Returns the current tracks attached to receivers
     * @returns {string}
     */

  }, {
    key: 'receiverTracks',
    get: function get() {
      return this.pc.getReceivers().reduce(function (acc, r) {
        if (r.track) {
          acc.push(r.track);
        }
        return acc;
      }, []);
    }

    /**
     * Constructor
     * @param {Object} attrs
     * @param {Object} options
     * @param {Logger} options.logger (optional): defaults to console
     * @returns {WebRTCMediaEngine}
     */

  }], [{
    key: 'getUserMedia',

    /**
     * Wrapper around navigator.mediaDevices.getUserMedia
     *
     * @param {MediaStreamContraints} constraints
     * @returns {Promise<MediaStream>}
     */
    value: function getUserMedia(constraints) {
      var finalConstraints = (0, _defaults3.default)({}, constraints, { fake: process.env.NODE_ENV === 'test' });
      return navigator.mediaDevices.getUserMedia(finalConstraints);
    }
    /**
     * Represents the local party's outgoing stream. Instantiated when the class
     * is instantiated.
     * @type {MediaStream}
     */

    /**
     * Represent the remote party's incoming media. Instantiated when the class is
     * instantiated.
     * @type {MediaStream}
     */

    /**
     * Reserved for future use
     * @type {MediaStream}
     */


    /**
     * Peer Connection
     * @type {RTCPeerConnection}
     */

    /**
     * The most-recently produced offer
     * @private
     */

    /**
     * The most-recently accepted answer
     * @private
     */

  }]);

  function WebRTCMediaEngine() {
    var _this = this;

    var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, WebRTCMediaEngine);
    this.logger = console;

    _initDefineProp(this, 'localMediaStream', _descriptor, this);

    _initDefineProp(this, 'remoteMediaStream', _descriptor2, this);

    _initDefineProp(this, 'localScreenShare', _descriptor3, this);

    this.pc = new RTCPeerConnection({
      iceServers: [],
      bundlePolicy: 'max-compat'
    });

    _initDefineProp(this, 'offerSdp', _descriptor4, this);

    _initDefineProp(this, 'answerSdp', _descriptor5, this);

    _initDefineProp(this, 'sendingAudio', _descriptor6, this);

    _initDefineProp(this, 'sendingVideo', _descriptor7, this);

    _initDefineProp(this, 'receivingAudio', _descriptor8, this);

    _initDefineProp(this, 'receivingVideo', _descriptor9, this);

    _initDefineProp(this, 'ended', _descriptor10, this);

    this.negotiationNeeded = false;
    this.bandwidthLimit = {
      audioBandwidthLimit: 60000,
      videoBandwidthLimit: 1000000
    };

    _initDefineProp(this, 'constraints', _descriptor11, this);

    _initDefineProp(this, 'offerOptions', _descriptor12, this);

    _initDefineProp(this, 'gumming', _descriptor13, this);

    if (options.parent) {
      // This is a bit of weirdness to maintain amp-state compatibility
      process.nextTick(function () {
        if (options.parent.logger) {
          _this.logger = options.parent.logger;
        }
      });
    } else if (attrs.logger) {
      this.logger = attrs.logger;
    }

    this.pc.onnegotiationneeded = function () {
      _this.logger.info('peer connection emitted negotiationneeded');
      if (_this.answerSdp && !_this.negotiationNeeded) {
        _this.negotiationNeeded = true;
        _this.triggerNegotiationNeeded();
      }
    };

    // Note: adapter.js doesn't seem to fully shim the track event.
    // addEventListener doesn't appear to work for it in chrome
    this.pc.ontrack = function (event) {
      _this.logger.info('peerConnection ontrack fired, updating remoteMediaStream');
      _this.trigger('track');
      var stream = _this.remoteMediaStream || new MediaStream();
      event.streams[0].getTracks().forEach(function (track) {
        _this.logger.info('adding ' + track.kind + ' track to remoteMediaStream');
        if (stream && !stream.getTracks().includes(track)) {
          stream.addTrack(track);
        }
        track.onended = function () {
          _this.logger.info('remote ' + track.kind + ' has ended, removing track from remoteMediaStream');
          stream.removeTrack(track);
          track.onended = undefined;
          try {
            _this['receiving' + capitalize[track.kind]] = (0, _webrtcHelpers.getMediaDirectionFromTracks)(track.kind, _this.pc).includes('recv');
          } catch (err) {
            _this['receiving' + capitalize[track.kind]] = false;
          }
        };

        _this['receiving' + capitalize[track.kind]] = (0, _webrtcHelpers.getMediaDirectionFromTracks)(track.kind, _this.pc).includes('recv');
      });
      _this.remoteMediaStream = stream;
      _this.trigger('internalTrackUpdate');
    };
  }

  /* eslint-disable complexity */
  /**
   * Determines if ice gathering is necessary and sends it up when appropriate
   * @private
   * @returns {Promise|undefined}
   */


  (0, _createClass3.default)(WebRTCMediaEngine, [{
    key: '_prepareIceGatherer',
    value: function _prepareIceGatherer() {
      var _this2 = this;

      var needsIce = false;
      if (this.pc.iceGatheringState === 'new') {
        this.logger.info('ice gathering is in state "new", definitely need to block for ice gathering');
        needsIce = true;
      } else {
        var sdp = (0, _sdpTransform.parse)(this.pc.localDescription.sdp);
        ['audio', 'video', 'screen'].forEach(function (kind) {
          var directionKey = kind + 'Direction';
          if (_this2[directionKey] !== 'inactive' || getTargetMediaDirection(_this2, kind) !== _this2[directionKey] && getTargetMediaDirection(_this2, kind) !== 'inactive') {
            var media = sdp.media.find(function (m) {
              return m.type === kind;
            });
            if (media) {
              _this2.logger.info(kind + ' candidates already gathered');
            } else {
              _this2.logger.info('transitioning ' + kind + ' from inactive, ice needed');
              needsIce = true;
            }
          }
        });
      }

      var icePromise = void 0;
      if (needsIce) {
        icePromise = new _promise2.default(function (resolve) {
          _this2.logger.info('configuring ice gathering');
          _this2.pc.onicecandidate = function (event) {
            if (!event.candidate) {
              _this2.logger.info('ice gathering complete');
              _this2.pc.onicecandidate = undefined;
              resolve();
              return;
            }

            _this2.logger.info('got ice candidate');
          };
        });
      }

      return icePromise;
    }

    /* eslint-enable complexity */

    /**
     * Creates an offer SDP
     * @returns {Promise<string>}
     */

  }, {
    key: 'createOffer',
    value: function createOffer() {
      var _this3 = this;

      this.logger.info('beginning negotiation');

      var td = getTargetMediaDirection(this, 'video');
      var wantsVideo = td.includes('send') || td.includes('recv');

      var icePromise = this._prepareIceGatherer();

      return new _promise2.default(function (resolve) {
        if (_this3.gumming) {
          _this3.logger.info('gum in flight, waiting until it completes');
          // Since gum is protected by @oneflight, returning it here will block
          // until it completes but, more importantly, propagate a thrown
          // exception up the stack
          resolve(_this3._getUserMedia().then((0, _common.tap)(function () {
            return _this3.logger.info('gum completed');
          })));
          return;
        }

        resolve();
      }).then((0, _common.tap)(function () {
        return _this3.logger.info('starting create offer', _this3.offerOptions);
      })).then(function () {
        _this3.offerOptions.offerToReceiveAudio = !!_this3.offerOptions.offerToReceiveAudio;
        _this3.offerOptions.offerToReceiveVideo = !!_this3.offerOptions.offerToReceiveVideo;
        _this3.logger.info('creating REAL offer', _this3.offerOptions);
        _this3.logger.info('createOffer audioDirection: ' + _this3.audioDirection);
        _this3.logger.info('createOffer videoDirection: ' + _this3.videoDirection);
        _this3.logger.info('createOffer screenDirection: ' + _this3.screenDirection);

        // Ensure senders and receivers are in the correct state based on media direction
        _this3.updateLocalMediaToTargetDirection();
        return _this3.pc.createOffer(_this3.offerOptions);
      }).then((0, _common.tap)(function (offer) {
        offer.sdp = (0, _webrtcHelpers.limitBandwith)(_this3.bandwidthLimit, offer.sdp);
        offer.sdp = (0, _webrtcHelpers.removeExtmap)(offer.sdp);
      })).then((0, _common.tap)(function () {
        return _this3.logger.info('setting local description');
      })).then(function (offer) {
        return _this3.pc.setLocalDescription(offer);
      }).then((0, _common.tap)(function () {
        return icePromise && _this3.logger.info('blocking for ice gathering');
      })).then(function () {
        return icePromise;
      }).then((0, _common.tap)(function () {
        return _this3.logger.info('limiting bandwith');
      })).then(function () {
        return (0, _webrtcHelpers.limitBandwith)(_this3.bandwidthLimit, _this3.pc.localDescription.sdp);
      }).then((0, _common.tap)(function () {
        return wantsVideo && _this3.logger.info('confirm h264 in offer');
      })).then((0, _webrtcHelpers.ensureH264)(wantsVideo)).then(function (sdp) {
        if (_this3.localScreenShare) {
          // Add content descriptor to the local sdp
          var streamId = _this3.localScreenShare.id;
          var track = _this3.localScreenShare.getVideoTracks()[0];
          if (track) {
            var trackId = track.id;
            var msid = streamId + ' ' + trackId;
            var sections = sdp.split(msid);
            if (sections[1]) {
              sections[1] = '\r\na=content:slides' + sections[1];
              sdp = sections.join(msid);
              return sdp;
            }
          }

          sdp += 'a=content:slides\r\n';
        }
        return sdp;
      }).then((0, _common.tap)(function (sdp) {
        _this3.offerSdp = sdp;
      }));
    }

    /**
     * Receives an answer SDP
     * @param {string} sdp
     * @returns {Promise}
     */

  }, {
    key: 'acceptAnswer',
    value: function acceptAnswer(sdp) {
      var _this4 = this;

      this.logger.info('accepting answer');
      this.logger.debug('new answer sdp:', sdp);
      // Allow larger frames (this makes screenshare look *way* better, but no
      // idea what impact it's having on the camera stream - we may want to limit
      // it to just screen share at some future point)
      var defaultCodecParams = /max-mbps=27600;max-fs=920/g;
      var newCodecParams = 'max-mbps=27600;max-fs=8160';
      var newSdp = sdp.replace(defaultCodecParams, newCodecParams);

      // If the screenshare goes inactive, make sure the sdp includes a direction
      // config
      newSdp = newSdp.replace(/m=video 0(.*?\r\n)/, 'm=video 0$1a=inactive\r\n');

      // extmapFix
      newSdp = (0, _webrtcHelpers.removeExtmap)(newSdp);

      this.logger.debug('cleaned answer sdp:', newSdp);
      // Only accept answer if PeerConnection is in the correct state
      if (this.pc.signalingState === 'have-local-offer') {
        return this.pc.setRemoteDescription(new RTCSessionDescription({
          sdp: newSdp,
          type: 'answer'
        })).then(function () {
          _this4.logger.info('answer accepted');
          _this4.answerSdp = newSdp;
          _this4.sendingAudio = (0, _webrtcHelpers.getMediaDirectionFromTracks)('audio', _this4.pc).includes('send');
          _this4.sendingVideo = (0, _webrtcHelpers.getMediaDirectionFromTracks)('video', _this4.pc).includes('send');

          // Update media enabled flags in case we get extra media stream
          _this4.updateLocalMediaToTargetDirection();
          _this4.trigger('answeraccepted');
          _this4.negotiationNeeded = false;
        });
      }
      return _promise2.default.resolve();
    }
    /**
     * {@link MediaStreamConstraints} that'll be used for the next call to
     * {@link WebRTCMediaEngine.getUserMedia()}
     * @private
     * @type {MediaStreamConstraints}
     */

    /**
     * {@link RTCOfferOptions} that'll be used for the next call to
     * {@link RTCPeerConnection.createOffer}
     * @private
     * @type {RTCOfferOptions}
     */

    /**
     * Indicates whether or not a call to {@link MediaDevices#getUserMedia()} is
     * in flight
     * @private
     * @type {boolean}
     */

  }, {
    key: '_setNewMediaDirection',


    /**
     * Change media direction without consumer provided tracks or complex
     * constraints
     * @param {string} kind
     * @param {string} direction
     * @private
     * @returns {Promise}
     */
    value: function _setNewMediaDirection(kind, direction) {
      var _this5 = this;

      this.logger.info('setting ' + kind + ' direction to ' + direction);
      var isSending = direction.includes('send');
      this.constraints[kind] = isSending;

      if (isSending) {
        var senders = this.pc.getSenders().filter(function (s) {
          return s.track && s.track.kind === kind;
        });
        if (senders.length > 0) {
          this.logger.info('enabling existing ' + kind + ' sender track');
          var localTracks = this.localMediaStream.getTracks().filter(function (t) {
            return t.kind === kind;
          });
          senders.forEach(function (s) {
            s.track.enabled = localTracks.includes(s.track);
          });
          this['sending' + capitalize[kind]] = isSending;
          return _promise2.default.resolve();
        }
        if (!this[kind + 'Direction'].includes('send')) {
          // only set new constraints if we were not already sending media
          return this._setNewMediaConstraint(kind, isSending);
        }
      } else {
        this.logger.info('muting ' + kind + ' local tracks');
        if (!this.localMediaStream) {
          return _promise2.default.resolve();
        }
        return this.localMediaStream.getTracks().filter(function (t) {
          return t.kind === kind;
        }).forEach(function (track) {
          // We remove the track from localMediaStream, and disable on PeerConnection
          _this5.logger.info('muting existing ' + kind + ' track from localMediaStream');
          var sender = _this5.pc.getSenders().find(function (s) {
            return s.track === track;
          });
          if (!_bowser2.default.firefox) {
            _this5.localMediaStream.removeTrack(track);
          }
          if (sender) {
            _this5.logger.info('muting existing ' + kind + ' track on sender');
            sender.track.enabled = false;
            track.enabled = false;
            // We must remove sender track from PC when muting
            // browsers will still create SDP media field if we don't remote the track
            if (!_bowser2.default.firefox) {
              _this5.pc.removeTrack(sender);
            }
          }
          _this5.logger.info('setting sending' + capitalize[kind] + ' to ' + isSending);
          _this5['sending' + capitalize[kind]] = isSending;
        });
      }
      return _promise2.default.resolve();
    }

    /**
     * Sets or replaces current track for $kind
     * @param {string} kind
     * @param {MediaStreamTrack} track
     * @returns {Promise}
     */

  }, {
    key: '_setNewMediaTrack',
    value: function _setNewMediaTrack(kind, track) {
      this.logger.info('setting new ' + kind + ' track');
      this.constraints[kind] = false;
      return this.addOrReplaceTrack(track);
    }

    /**
     * Causes track for ${kind} to be set or replaced according to $constraint
     * @param {string} kind
     * @param {Object|boolean} constraint
     * @returns {Promise}
     */

  }, {
    key: '_setNewMediaConstraint',
    value: function _setNewMediaConstraint(kind, constraint) {
      this.logger.info('setting ' + kind + ' with new constraint');
      this.constraints[kind] = constraint;
      return this._getUserMedia();
    }

    /**
     * Starts or stops an outbound screenshare
     *
     * @param {string} direction currently only inactive or sendonly
     * @param {Object|MediaStreamTrack} trackOrConstraint
     * @returns {Promise}
     */

  }, {
    key: '_setScreenShare',
    value: function _setScreenShare(direction, trackOrConstraint) {
      var _this6 = this;

      this.logger.info('calling _setScreenShare');
      targetMediaDirection.set(this, 'screen', direction);
      if (direction.includes('send')) {
        var constraint = (0, _defaults3.default)({}, trackOrConstraint, {
          mediaSource: 'application',
          width: {
            min: '160',
            max: '1920'
          },
          height: {
            min: '90',
            max: '1080'
          },
          frameRate: {
            min: '1',
            max: '30'
          }
        });

        this._setNewMediaConstraint('screen', constraint);
        return;
      }

      this.logger.info('removing existing screenshare tracks from peer connection and localScreenShare stream');
      this.pc.getSenders().filter(function (s) {
        return s.track && _this6.localScreenShare.getTracks().includes(s.track);
      }).forEach(function (s) {
        _this6.logger.info('removing screenshare track ' + s.track.id + ' from peer connection and localScreenShare stream');
        var senderTrack = s.track;
        s.track.enabled = false;
        _this6.localScreenShare.removeTrack(senderTrack);
        _this6.pc.removeTrack(s);
        senderTrack.stop();
        _this6.logger.info('removed screenshare track ' + senderTrack.id + ' from peer connection and localScreenShare stream');
      });
      // Remove reference to screen share media stream to trigger change event
      this.localScreenShare = false;
    }

    // I don't see any further ways to reduce complexity without hurting
    // readability
    /* eslint-disable complexity */
    /**
     * Sets a media direction for a given media type. Almost certainly triggers
     * renegotiation. This is the method to use if you want to replace a track.
     * @param {string} kind audio|video
     * @param {string} direction sendonly|recvonly|sendrecv|inactive
     * @param {MediaStreamTrack|Object} trackOrConstraint
     * @returns {Promise}
     */

  }, {
    key: 'setMedia',
    value: function setMedia(kind, direction, trackOrConstraint) {
      var _this7 = this;

      this.logger.info('setMedia');
      if (kind === 'screen') {
        this.logger.info('setMedia: setting new screen direction');
        this._setScreenShare(direction, trackOrConstraint);
        return _promise2.default.resolve();
      }

      return new _promise2.default(function (resolve) {
        if (trackOrConstraint) {
          if (!direction.includes('send')) {
            throw new Error('Cannot set new ' + kind + ' track or constraint if direction does not include send');
          }

          if (trackOrConstraint instanceof MediaStreamTrack) {
            if (trackOrConstraint.kind !== kind) {
              throw new Error('track is not a valid ' + kind + ' media stream track');
            }

            resolve(_this7._setNewMediaTrack(kind, trackOrConstraint));
          } else {
            resolve(_this7._setNewMediaConstraint(kind, trackOrConstraint));
          }
        } else {
          if (direction === getTargetMediaDirection(_this7, kind)) {
            _this7.logger.info('setMedia: ' + kind + ' already transitioning to ' + direction + ', not making changes');
            resolve();
          }

          if (direction === _this7[kind + 'Direction']) {
            _this7.logger.info('setMedia: ' + kind + ' already set to ' + direction + ', not making changes');
            resolve();
          }
          resolve(_this7._setNewMediaDirection(kind, direction));
        }
      }).then(function () {
        var shouldRecv = direction.includes('recv');

        _this7.logger.info('setMedia: set targetMediaDirection for ' + kind + ' to ' + direction);
        targetMediaDirection.set(_this7, kind, direction);

        _this7.logger.info('setMedia: set offerToReceive' + (0, _webrtcHelpers.kindToPropertyFragment)(kind) + ' to ' + shouldRecv);
        _this7.offerOptions['offerToReceive' + (0, _webrtcHelpers.kindToPropertyFragment)(kind)] = shouldRecv;

        var receivers = _this7.pc.getReceivers().filter(function (r) {
          return r.track && r.track.kind === kind;
        });

        if (shouldRecv) {
          if (receivers.length > 0) {
            _this7.logger.info('setMedia: unpause existing receiving ' + kind + ' track');
            _this7.unpauseReceivingMedia(kind);
          } else if (!receivers.length && _this7.answerSdp) {
            _this7.logger.info('setMedia: no receiving ' + kind + ' track exists, trigger negotiation');
            _this7.triggerNegotiationNeeded();
          }
        } else if (receivers.length > 0) {
          _this7.logger.info('setMedia: pausing existing receiving ' + kind + ' track');
          _this7.pauseReceivingMedia(kind);
        }
      });
    }

    /* eslint-enable complexity */
    /**
     * Wrapper around {@link MediaDevices#getUserMedia()} that delays the call one
     * tick to reduce the number of permissions dialogs presented to the user.
     * @name _getUserMedia
     * @returns {Promise<MediaStream>}
     */

  }, {
    key: '_getUserMedia',
    value: function _getUserMedia() {
      var _this8 = this;

      this.logger.info('enqueing request to get user media');
      return new _promise2.default(function (resolve) {
        return process.nextTick(resolve);
      }).then(function () {
        if (_this8.constraints.audio === true && _this8.pc.getSenders().find(function (s) {
          return s.track && s.track.kind === 'audio';
        })) {
          _this8.logger.info('already have a local audio track, removing constraint for a second one');
          (0, _deleteProperty2.default)(_this8.constraints, 'audio');
        }

        if (_this8.constraints.video === true && _this8.pc.getSenders().find(function (s) {
          return s.track && s.track.kind === 'video';
        })) {
          _this8.logger.info('already have a local video track, removing constraint for a second one');
          (0, _deleteProperty2.default)(_this8.constraints, 'video');
        }

        var _constraints = _this8.constraints,
            audio = _constraints.audio,
            video = _constraints.video,
            screen = _constraints.screen;

        _this8.logger.info('getting user media with ' + (audio ? '1' : '0') + ' audio track, ' + (video ? '1' : '0') + ' video track, and ' + (screen ? '1' : '0') + ' screenshare track.');
        return _promise2.default.all([(audio || video) && WebRTCMediaEngine.getUserMedia({ audio: audio, video: video }), screen && WebRTCMediaEngine.getUserMedia({ video: screen })]);
      }).then(function (_ref) {
        var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
            userStream = _ref2[0],
            screenStream = _ref2[1];

        var p = [];
        if (userStream) {
          _this8.logger.info('got local media stream with ' + userStream.getAudioTracks().length + ' audio tracks and ' + userStream.getVideoTracks().length + ' video tracks');
          userStream.getTracks().forEach(function (t) {
            return p.push(_this8.addOrReplaceTrack(t));
          });
        }

        if (screenStream) {
          if (_this8.localScreenShare) {
            var sender = _this8.pc.getSenders().find(function (s) {
              return _this8.localScreenShare.getTracks().includes(s.track);
            });

            if (sender) {
              _this8.logger.info('removing existing screenshare track from localScreenShare stream');
              _this8.localScreenShare.removeTrack(sender.track);
              _this8.logger.info('disabling existing screenshare track on sender');
              sender.track.enabled = false;
            }

            // We hope there's only a single track from the screenshare
            screenStream.getTracks().forEach(function (t) {
              if (sender) {
                // if a sender already exists and we need to update with a new track, replace the track
                _this8.logger.info('replacing existing screenshare track on sender');
                p.push(sender.replaceTrack(t));
              } else {
                // If we've never sent, we should
                _this8.logger.info('adding new screen track to peerConnection');
                _this8.pc.addTrack(t, screenStream);
              }
            });
          } else {
            _this8.logger.info('adding localScreenShare for the first time');
            _this8.logger.info('adding new screenshare track to peer connection');
            screenStream.getVideoTracks().forEach(function (t) {
              return _this8.pc.addTrack(t, screenStream);
            });
          }

          _this8.localScreenShare = screenStream;
        }

        _this8.constraints = {};
        return _promise2.default.all(p);
      }).catch(function (err) {
        _this8.trigger('error', err);
        return _promise2.default.reject(err);
      });
    }

    /**
     * adds or replaces a local @{link MediaStreamTrack}
     * @private
     * @param {MediaStreamTrack} track
     * @returns {Promise}
     */

  }, {
    key: 'addOrReplaceTrack',
    value: function addOrReplaceTrack(track) {
      var _this9 = this;

      var p = [];
      if (!this.localMediaStream) {
        this.localMediaStream = new MediaStream();
      }
      var sender = this.pc.getSenders().find(function (s) {
        return s.track && s.track.kind === track.kind;
      });
      var existingTrack = this.localMediaStream.getTracks().find(function (t) {
        return t.kind === track.kind;
      });

      if (existingTrack !== track) {
        if (existingTrack) {
          this.logger.info('removing previous ' + existingTrack.kind + ' track from localMediaStream');
          this.localMediaStream.removeTrack(existingTrack);
        }

        this.logger.info('adding new ' + track.kind + ' track to localMediaStream');
        this.localMediaStream.addTrack(track);
      }

      if (sender) {
        if (sender.track === track) {
          this.logger.info('new track is the same as existing track, renabling ' + track.kind + ' track on sender');
          sender.track.enabled = true;
        } else {
          this.logger.info('replacing new ' + track.kind + ' on existing sender');
          p.push(sender.replaceTrack(track).then(function () {
            _this9.logger.info('successfully replace ' + track.kind + ' on existing sender');
          }).catch(function (e) {
            // replaceTrack fails silently so we need to check if track was added correctly
            _this9.logger.warn(e);
            _this9.logger.warn('was not able to replace ' + track.kind + ' track on sender');
            _this9.logger.info('adding as new ' + track.kind + ' track to peerConnection');
            _this9.pc.removeTrack(sender);
            _this9.pc.addTrack(track, _this9.localMediaStream);
          }));
        }
      } else {
        this.logger.info('adding new ' + track.kind + ' track to peerConnection');
        this.pc.addTrack(track, this.localMediaStream);
      }

      this.logger.info('setting sending' + capitalize[track.kind] + ' to true');
      this['sending' + capitalize[track.kind]] = true;
      return _promise2.default.all(p);
    }

    /**
     * Stops sending useful bits on the identified track, but does not end it (the
     * camera/mic will stay on but the remote party(s) will not see/hear anything).
     * Avoids renegotiation. Throws if `kind` does not identify a track.
     * @param {string} kind
     * @returns {Promise}
     */

  }, {
    key: 'pauseSendingMedia',
    value: function pauseSendingMedia(kind) {
      var _this10 = this;

      if (!kind) {
        throw new Error('kind is required');
      }
      var senders = this.pc.getSenders().filter(function (s) {
        return s.track && s.track.kind === kind;
      });

      if (senders.length === 0) {
        throw new Error('No ' + kind + ' media senders to pause');
      }

      senders.forEach(function (s) {
        _this10.logger.info('pausing ' + kind + ' sender');
        s.track.enabled = false;
      });

      this.logger.info('setting sending' + capitalize[kind] + ' to false');
      this['sending' + capitalize[kind]] = false;
    }

    /**
     * Compares target directions with senders and receivers and updates PC to match
     * @returns {undefined}
     */

  }, {
    key: 'updateLocalMediaToTargetDirection',
    value: function updateLocalMediaToTargetDirection() {
      var _this11 = this;

      ['audio', 'video'].forEach(function (kind) {
        // Get direction value set when updating senders and receivers
        var targetDirection = getTargetMediaDirection(_this11, kind);
        // Get direction from peer connection
        var direction = _this11[kind + 'Direction'];
        // If directions don't match, update peer connection to match target
        if (direction !== targetDirection) {
          var shouldSend = targetDirection.includes('send');
          if (direction.includes('send') !== shouldSend) {
            // Update pc senders to correct target direction
            _this11.pc.getSenders().forEach(function (s) {
              if (s.track && s.track.kind === kind) {
                s.track.enabled = shouldSend;
              }
            });
          }
          var shouldRecv = targetDirection.includes('recv');
          if (direction.includes('send') !== shouldRecv) {
            // Update pc receivers to correct target direction
            _this11.pc.getReceivers().forEach(function (r) {
              if (r.track && r.track.kind === kind) {
                r.track.enabled = shouldRecv;
              }
            });
          }
        }
      });
    }

    /**
     * Resumes sending bits on the identified track. Throws if `kind` does not
     * identify a track.
     * @param {string} kind
     * @returns {Promise}
     */

  }, {
    key: 'unpauseSendingMedia',
    value: function unpauseSendingMedia(kind) {
      var _this12 = this;

      if (!kind) {
        throw new Error('kind is required');
      }
      var senders = this.pc.getSenders().filter(function (s) {
        return s.track && s.track.kind === kind;
      });

      if (senders.length === 0) {
        throw new Error('No ' + kind + ' media senders to unpause');
      }

      senders.forEach(function (s) {
        _this12.logger.info('unpausing ' + kind + ' sender');
        s.track.enabled = true;
      });

      this.logger.info('setting sending' + capitalize[kind] + ' to true');
      this['sending' + capitalize[kind]] = true;
    }

    /**
     * Convenience function. Sets a remote track.enabled=false. Does not
     * renegotiate.Throws if `kind` does not identify a track.
     * @param {string} kind
     * @returns {Promise}
     */

  }, {
    key: 'pauseReceivingMedia',
    value: function pauseReceivingMedia(kind) {
      var _this13 = this;

      if (!kind) {
        throw new Error('kind is required');
      }
      var receivers = this.pc.getReceivers().filter(function (r) {
        return r.track && r.track.kind === kind;
      });

      if (receivers.length === 0) {
        throw new Error('No ' + kind + ' receiver media tracks to pause');
      }

      receivers.forEach(function (r) {
        _this13.logger.info('pausing remote ' + kind + ' track');
        r.track.enabled = false;
      });

      this.logger.info('setting receiving' + capitalize[kind] + ' to false');
      this['receiving' + capitalize[kind]] = false;
    }

    /**
     * Convenience function. Sets a remote track.enabled=true. Does not
     * renegotiate.Throws if `kind` does not identify a track.
     * @param {string} kind
     * @returns {Promise}
     */

  }, {
    key: 'unpauseReceivingMedia',
    value: function unpauseReceivingMedia(kind) {
      var _this14 = this;

      if (!kind) {
        throw new Error('kind is required');
      }
      var receivers = this.pc.getReceivers().filter(function (r) {
        return r.track && r.track.kind === kind;
      });

      if (receivers.length === 0) {
        throw new Error('No ' + kind + ' receiver media tracks to pause');
      }

      receivers.forEach(function (r) {
        _this14.logger.info('unpausing ' + kind + ' receiver track');
        r.track.enabled = true;
      });

      this.logger.info('setting receiving' + capitalize[kind] + ' to true from ' + this['receiving' + capitalize[kind]]);
      this['receiving' + capitalize[kind]] = true;
    }

    /**
     * Stops all tracks and streams, closes the peer connection, and removes all
     * listeners
     * @returns {undefined}
     */

  }, {
    key: 'stop',
    value: function stop() {
      if (this.pc.signalingState !== 'closed') {
        this.pc.getSenders().forEach(function (s) {
          return s.track && s.track.stop();
        });
        this.pc.close();
      }

      this.pc.onnegotiationneeded = undefined;
      this.pc.ontrack = undefined;
      this.pc.onicecandidate = undefined;
      this.ended = true;
      this.off();
    }
  }, {
    key: 'triggerNegotiationNeeded',

    /**
     * Debounced helper for triggering `negotiationneeded`.
     * @private
     * @returns {undefined}
     */
    // It's not missing, but the decorator is throwing off eslint
    // eslint-disable-next-line require-jsdoc
    value: function triggerNegotiationNeeded() {
      this.trigger('negotiationneeded');
    }

    /**
     * Returns a string when attempting to serialize object
     * @returns {string}
     */

  }, {
    key: 'serialize',
    value: function serialize() {
      return 'WebRTCMediaEngine';
    }
  }]);
  return WebRTCMediaEngine;
}(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'localMediaStream', [_commonEvented2.default], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'remoteMediaStream', [_commonEvented2.default], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'localScreenShare', [_commonEvented2.default], {
  enumerable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, 'offerSdp', [_commonEvented2.default], {
  enumerable: true,
  initializer: function initializer() {
    return '';
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, 'answerSdp', [_commonEvented2.default], {
  enumerable: true,
  initializer: function initializer() {
    return '';
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, 'sendingAudio', [_commonEvented2.default], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, 'sendingVideo', [_commonEvented2.default], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, 'receivingAudio', [_commonEvented2.default], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, 'receivingVideo', [_commonEvented2.default], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class.prototype, 'ended', [_commonEvented2.default], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class.prototype, 'constraints', [_coreDecorators.nonenumerable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class.prototype, 'offerOptions', [_coreDecorators.nonenumerable], {
  enumerable: true,
  initializer: function initializer() {
    return {};
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class.prototype, 'gumming', [_coreDecorators.nonenumerable, _commonEvented2.default], {
  enumerable: true,
  initializer: function initializer() {
    return false;
  }
}), _applyDecoratedDescriptor(_class.prototype, '_getUserMedia', [_dec, _common.oneFlight], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, '_getUserMedia'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'triggerNegotiationNeeded', [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'triggerNegotiationNeeded'), _class.prototype)), _class));
exports.default = WebRTCMediaEngine;


(0, _assign2.default)(WebRTCMediaEngine.prototype, _ampersandEvents2.default);
//# sourceMappingURL=engine.js.map
