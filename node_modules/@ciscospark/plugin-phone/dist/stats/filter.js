'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

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

var _stream = require('stream');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Reforms the interesting data from an RTCStatsReport into something grokkable
 */
var StatsFilter = function (_Transform) {
  (0, _inherits3.default)(StatsFilter, _Transform);

  /**
   * Tells the Stream we're operating in objectMode
   * @private
   */
  function StatsFilter() {
    (0, _classCallCheck3.default)(this, StatsFilter);
    return (0, _possibleConstructorReturn3.default)(this, (StatsFilter.__proto__ || (0, _getPrototypeOf2.default)(StatsFilter)).call(this, { objectMode: true }));
  }

  /**
   * Filters out just the interesting part of a RTCStatsReport
   * @param {RTCStatsReport} report
   * @param {*} encoding
   * @param {Function} callback
   * @private
   * @returns {undefined}
   */


  (0, _createClass3.default)(StatsFilter, [{
    key: '_transform',
    value: function _transform(report, encoding, callback) {
      if (!report) {
        callback();
        return;
      }

      var incomingAudio = {
        local: null,
        remote: null
      };
      var incomingVideo = {
        local: null,
        remote: null
      };
      var outgoingAudio = {
        local: null,
        remote: null
      };
      var outgoingVideo = {
        local: null,
        remote: null
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(report.values()), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          if (['outbound-rtp', 'outboundrtp'].includes(item.type) && !item.isRemote) {
            if (item.mediaType === 'audio') {
              outgoingAudio.local = item;
              outgoingAudio.remote = report.get(item.remoteId);
            }

            if (item.mediaType === 'video') {
              outgoingVideo.local = item;
              outgoingVideo.remote = report.get(item.remoteId);
            }
          }

          if (['inbound-rtp', 'inboundrtp'].includes(item.type) && !item.isRemote) {
            if (item.mediaType === 'audio') {
              incomingAudio.local = item;
              incomingAudio.remote = report.get(item.remoteId);
            }

            if (item.mediaType === 'video') {
              incomingVideo.local = item;
              incomingVideo.remote = report.get(item.remoteId);
            }
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

      this.push({
        incomingAudio: incomingAudio,
        incomingVideo: incomingVideo,
        outgoingAudio: outgoingAudio,
        outgoingVideo: outgoingVideo,
        report: report
      });

      callback();
    }
  }]);
  return StatsFilter;
}(_stream.Transform);

exports.default = StatsFilter;
//# sourceMappingURL=filter.js.map
