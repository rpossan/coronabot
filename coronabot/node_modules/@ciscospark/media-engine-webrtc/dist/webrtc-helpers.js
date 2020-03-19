'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureH264 = undefined;

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

var _curry2 = require('lodash/curry');

var _curry3 = _interopRequireDefault(_curry2);

exports.getMediaDirectionFromSDP = getMediaDirectionFromSDP;
exports.getMediaFromSDP = getMediaFromSDP;
exports.reverseMediaDirection = reverseMediaDirection;
exports.limitBandwith = limitBandwith;
exports.kindToPropertyFragment = kindToPropertyFragment;
exports.getMediaDirectionFromSDPForAnswer = getMediaDirectionFromSDPForAnswer;
exports.boolToDirection = boolToDirection;
exports.getMediaDirectionFromTracks = getMediaDirectionFromTracks;
exports.removeExtmap = removeExtmap;

require('./webrtc-adapter-adapter');

var _sdpTransform = require('sdp-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Pulls the direction line for the specified media kind from an sdp
 * @param {string} kind
 * @param {string} sdp
 * @protected
 * @returns {string}
 */
// we need to import the webrtc adapter before anything else happens
/* eslint-disable import/first */

function getMediaDirectionFromSDP(kind, sdp) {
  var query = kind === 'screen' ? {
    content: 'slides',
    type: 'video'
  } : {
    type: kind
  };

  var media = (0, _find3.default)((0, _sdpTransform.parse)(sdp).media, query);
  if (!media) {
    return 'inactive';
  }

  return media.direction;
}

/**
 *
 * @param {string} kind
 * @param {string} sdp
 * @param {string} direction
 * @protected
 * @returns {object}
 */
function getMediaFromSDP(kind, sdp, direction) {
  var query = kind === 'screen' ? {
    content: 'slides',
    type: 'video'
  } : {
    type: kind
  };

  var media = (0, _filter3.default)((0, _sdpTransform.parse)(sdp).media, query);

  var mediaTypes = {};

  if (direction) {
    if (direction === 'sendrecv') {
      media.forEach(function (m) {
        mediaTypes[m.direction] = m;
      });
      // This adds support for when Firefox splits a sendrecv media connection into
      // separate sendonly and recvonly connections. This is ok as long as both
      // connections exist and are in the correct direction. Possibly a FF bug that
      // will be resolved in the future.
      if (mediaTypes.sendrecv && !mediaTypes.recvonly && !mediaTypes.sendonly) {
        media = mediaTypes.sendrecv;
      } else if (!mediaTypes.sendrecv && mediaTypes.recvonly && mediaTypes.sendonly) {
        media = [mediaTypes.recvonly, mediaTypes.sendonly];
      }
    } else {
      media = media.filter(function (m) {
        return m.direction === direction;
      });
    }
  }

  return media;
}

/**
 * Reverses a media direction from offer to answer (e.g. sendonly -> recvonly)
 * @param {string} direction
 * @protected
 * @returns {string}
 */
function reverseMediaDirection(direction) {
  switch (direction) {
    case 'inactive':
    case 'sendrecv':
      return direction;
    case 'sendonly':
      return 'recvonly';
    case 'recvonly':
      return 'sendonly';
    default:
      throw new Error('direction "' + direction + '" is not valid');
  }
}

/**
 * Checks a given sdp to ensure it contains an offer for the h264 codec
 * @param {boolean} wantsVideo
 * @param {string} offer
 * @protected
 * @returns {string} returns the offer to simplify use in promise chains
 */
var ensureH264 = exports.ensureH264 = (0, _curry3.default)(function (wantsVideo, offer) {
  if (wantsVideo) {
    if (!offer.includes('m=video')) {
      throw new Error('No video section found in offer');
    }
    if (!/[hH]264/.test(offer)) {
      throw new Error('Offer does not include h264 codec');
    }
  }
  return offer;
});

/**
 * Adds a bandwith limit line to the sdp; without this line, calling fails
 * @param {Object} bandwidthLimit
 * @param {string} sdp SDP
 * @protected
 * @returns {string} The modified SDP
 */
function limitBandwith(_ref, sdp) {
  var audioBandwidthLimit = _ref.audioBandwidthLimit,
      videoBandwidthLimit = _ref.videoBandwidthLimit;

  return sdp.split('\r\n').reduce(function (lines, line) {
    lines.push(line);
    if (line.startsWith('m=')) {
      lines.push('b=TIAS:' + (line.includes('audio') ? audioBandwidthLimit : videoBandwidthLimit));
    }
    return lines;
  }, []).join('\r\n');
}

/**
 * Helper for dealing wait capitalization
 * @param {string} kind audio|video
 * @protected
 * @returns {string} Audio|Video
 */
function kindToPropertyFragment(kind) {
  return kind === 'audio' ? 'Audio' : 'Video';
}

/**
 * Like get getMediaDirectionFromSDP, but reverses the the result
 * @param {string} kind
 * @param {string} offerSdp
 * @protected
 * @returns {string}
 */
function getMediaDirectionFromSDPForAnswer(kind, offerSdp) {
  return reverseMediaDirection(getMediaDirectionFromSDP(kind, offerSdp));
}

/**
 * Converts a pair of booleans to a SDP direction string
 * @param {boolean} send
 * @param {boolean} recv
 * @protected
 * @returns {string}
 */
function boolToDirection(send, recv) {
  if (send && recv) {
    return 'sendrecv';
  }

  if (send) {
    return 'sendonly';
  }

  if (recv) {
    return 'recvonly';
  }

  return 'inactive';
}

/**
 * Determines the flow of media for a given kind of media on a peer connection
 * @param {string} kind
 * @param {RTCPeerConnection} pc
 * @protected
 * @returns {string}
 */
function getMediaDirectionFromTracks(kind, pc) {
  if (pc.signalingState === 'closed') {
    return 'inactive';
  }

  var senders = pc.getSenders().filter(function (s) {
    return s.track && s.track.kind === kind;
  });

  var send = senders.length > 0 && senders.reduce(function (acc, s) {
    return acc || s.track.enabled;
  }, false);

  var receivers = pc.getReceivers().filter(function (r) {
    return r.track && r.track.kind === kind;
  });

  var recv = receivers.length > 0 && receivers.reduce(function (acc, r) {
    return acc || r.track.enabled;
  }, false);
  return boolToDirection(send, recv);
}

/**
 * Our services don't support extmap lines in sdps, so we need to remove them
 * @param {string} sdp
 * @returns {string}
 */
function removeExtmap(sdp) {
  return sdp.replace(/a=extmap.*\r\n/g, '');
}
//# sourceMappingURL=webrtc-helpers.js.map
