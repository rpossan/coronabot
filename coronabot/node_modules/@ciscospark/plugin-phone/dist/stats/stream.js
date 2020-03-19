'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _weakMap = require('babel-runtime/core-js/weak-map');

var _weakMap2 = _interopRequireDefault(_weakMap);

var _stream = require('stream');

var _events = require('events');

var _commonTimers = require('@ciscospark/common-timers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emittersByPc = new _weakMap2.default(); /* eslint-disable require-jsdoc */

var pcsByEmitter = new _weakMap2.default();
var emittersByStream = new _weakMap2.default();
var timersByEmitter = new _weakMap2.default();

/**
 * Helper function that ensures no matter how many stats streams we create, we
 * don't poll the PeerConnection more than once per interval.
 * @param {EventEmitter} emitter
 * @private
 * @returns {undefined}
 */
function schedule(emitter) {
  var timer = (0, _commonTimers.safeSetTimeout)(function () {
    var pc = pcsByEmitter.get(emitter);
    pc.getStats().then(function (stats) {
      emitter.emit('data', stats);
      // "closed" is supposed to be part of the {@link RTCPeerConnectionState}
      // enum according to spec, but at time of writing, was still implemented
      // in the {@link RTCSignalingState} enum.
      if (!(pc.signalingState === 'closed' || pc.connectionState === 'closed')) {
        schedule(emitter);
      }
    }).catch(function (err) {
      emitter.emit('error', err);
    });
  }, 1000);

  timersByEmitter.set(emitter, timer);
}

/**
 * Polls an {@link RTCPeerConnection} once per second and emits its
 * {@link RTCStatsReport}
 */

var StatsStream = function (_Readable) {
  (0, _inherits3.default)(StatsStream, _Readable);

  /**
   * @private
   * @param {RTCPeerConnection} pc
   */
  function StatsStream(pc) {
    (0, _classCallCheck3.default)(this, StatsStream);

    var _this = (0, _possibleConstructorReturn3.default)(this, (StatsStream.__proto__ || (0, _getPrototypeOf2.default)(StatsStream)).call(this, { objectMode: true }));

    if (!emittersByPc.has(pc)) {
      emittersByPc.set(pc, new _events.EventEmitter());
    }
    var emitter = emittersByPc.get(pc);

    if (!emittersByStream.has(_this)) {
      emittersByStream.set(_this, emitter);
    }
    if (!pcsByEmitter.has(emitter)) {
      pcsByEmitter.set(emitter, pc);
    }

    emitter.once('error', function (err) {
      _this.emit('error', err);
    });
    return _this;
  }

  /**
   * See NodeJS Docs
   * @private
   * @returns {undefined}
   */


  (0, _createClass3.default)(StatsStream, [{
    key: '_read',
    value: function _read() {
      var _this2 = this;

      var emitter = emittersByStream.get(this);

      emitter.once('data', function (data) {
        if (!_this2.isPaused()) {
          _this2.push(data);
        }
      });

      if (!timersByEmitter.has(emitter)) {
        schedule(emitter);
      }
    }
  }]);
  return StatsStream;
}(_stream.Readable);

exports.default = StatsStream;
//# sourceMappingURL=stream.js.map
