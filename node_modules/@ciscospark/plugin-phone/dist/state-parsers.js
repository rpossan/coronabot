'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

exports.activeParticipants = activeParticipants;
exports.direction = direction;
exports.waitForMediaShare = waitForMediaShare;
exports.isActive = isActive;
exports.isCall = isCall;
exports.joined = joined;
exports.joinedOnThisDevice = joinedOnThisDevice;
exports.participantsToCallMemberships = participantsToCallMemberships;
exports.participantToCallMembership = participantToCallMembership;
exports.participantStateToCallMembershipState = participantStateToCallMembershipState;
exports.makeInternalCallId = makeInternalCallId;
exports.mediaDirection = mediaDirection;
exports.participantIsJoined = participantIsJoined;
exports.remoteParticipant = remoteParticipant;
exports.remoteParticipants = remoteParticipants;
exports.remoteAudioMuted = remoteAudioMuted;
exports.remoteVideoMuted = remoteVideoMuted;
exports.shouldRing = shouldRing;
exports.getState = getState;
exports.getStatus = getStatus;
exports.getThisDevice = getThisDevice;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Finds the Locus's active participants
 * @param {Types~Locus} locus
 * @private
 * @returns {Array<Types~LocusParticipant>}
 */
/*!
 * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
 */

function activeParticipants(locus) {
  return (0, _filter3.default)(locus.participants, { state: 'JOINED' });
}

/**
 * Indicates if the locus was activated form this device
 * @param {Types~Locus} locus
 * @private
 * @returns {string} unknown|in|out
 */
function direction(locus) {
  if (!locus || !locus.self) {
    return 'unknown';
  }
  return locus.self.isCreator ? 'out' : 'in';
}

/**
 * Finds the media share share for the call, potentially setting up event
 * listeners to wait for a new Locus
 * @param {Call} call
 * @private
 * @returns {Promise<Types~MediaShare>}
 */
function waitForMediaShare(call) {
  return function curriedFindShare() {
    var promise = new _promise2.default(function (resolve, reject) {
      /**
       * Searches the call's current locus for the screen share entry in media
       * shares
       *
       * @returns {undefined}
       */
      function findShare() {
        try {
          call.logger.info('checking for media share');
          var mediaShare = call.locus.mediaShares.find(function (share) {
            return share.name === 'content';
          });
          if (!mediaShare) {
            call.logger.info('did not find media share, waiting for next locus change');
            call.once('change:locus', findShare);
            return;
          }

          call.logger.info('found media share');
          resolve(mediaShare);
        } catch (err) {
          call.logger.error('something unexpected happened');
          call.logger.error(err);
          reject(err);
        }
      }

      findShare();
    });

    return _promise2.default.race([promise, new _promise2.default(function (resolve, reject) {
      return setTimeout(reject(new Error('Could not find media share after 10000ms')), 10000);
    })]);
  };
}

/**
 * Indicates of the specified locus is active
 * @param {Types~Locus} locus
 * @private
 * @returns {Boolean}
 */
function isActive(locus) {
  return locus.fullState.state === 'ACTIVE';
}

/**
 * Indicates if the specified locus represents a call (in other words, has
 * exactly two participants)
 * @param {Types~Locus} locus
 * @private
 * @returns {Boolean}
 */
function isCall(locus) {
  return locus && locus.fullState && locus.fullState.type === 'CALL';
}

/**
 * Indicates if the current user has joined the Locus
 * @param {Types~Locus} locus
 * @private
 * @returns {Boolean}
 */
function joined(locus) {
  return Boolean(locus.self && participantIsJoined(locus.self));
}

/**
 * Indicates if this device has joined the locus
 * @param {ProxySpark} spark
 * @param {Types~Locus} locus
 * @private
 * @returns {Boolean}
 */
function joinedOnThisDevice(spark, locus) {
  return joined(locus) && spark.internal.device.url === locus.self.deviceUrl;
}

/**
 * Converts a list of participants to a list of memberships
 * @param {SparkCore} spark
 * @param {Types~Locus} locus
 * @private
 * @returns {Array<CallMembership>}
 */
function participantsToCallMemberships(spark, locus) {
  var users = new _map2.default();
  var devices = new _map2.default();

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(locus.participants), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var participant = _step.value;

      if (participant.type === 'USER') {
        users.set(participant.url, participant);
      } else if (participant.type === 'RESOURCE_ROOM') {
        devices.set(participant.url, participant);
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

  var memberships = [];
  users.forEach(function (participant) {
    var membership = participantToCallMembership(spark, locus, participant);
    if (participant.devices) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(participant.devices), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var device = _step2.value;

          if (device.state === 'JOINED' && (0, _get3.default)(device, 'intent.type') === 'OBSERVE') {
            var deviceParticipant = devices.get(device.url);
            membership.audioMuted = remoteAudioMuted(deviceParticipant);
            membership.videoMuted = remoteVideoMuted(deviceParticipant);
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
    }
    memberships.push(membership);
  });

  return memberships;
}

/**
 * Converts a single participant to a membership
 * @param {SparkCore} spark
 * @param {Types~Locus} locus
 * @param {Object} participant
 * @private
 * @returns {CallMembership}
 */
function participantToCallMembership(spark, locus, participant) {
  var personId = void 0,
      personUuid = void 0;
  if (!participant.person.isExternal) {
    personUuid = participant.person.id;
    personId = spark.people.inferPersonIdFromUuid(participant.person.id);
  }

  return {
    _id: participant.id,
    isSelf: locus.self.url === participant.url,
    isInitiator: participant.isCreator || false,
    personUuid: personUuid,
    personId: personId,
    state: participantStateToCallMembershipState(participant),
    audioMuted: remoteAudioMuted(participant),
    videoMuted: remoteVideoMuted(participant)
  };
}

/**
 *
 * Maps participant details to membership state enum
 * @param {LocusParticipant} participant
 * @private
 * @returns {string}
 */
function participantStateToCallMembershipState(participant) {
  var state = participant.state && participant.state.toLowerCase();
  switch (state) {
    case 'idle':
      return 'notified';
    case 'joined':
      return 'connected';
    case 'left':
      return 'disconnected';
    default:
      return state;
  }
}

/**
 * Creates a unique identifier for a call (but not necessarily the "callId" that
 * we'll someday expose as a first-class property)
 *
 * @param {Object} locus
 * @private
 * @returns {string}
 */
function makeInternalCallId(locus) {
  return locus.url + '_' + locus.fullState.lastActive;
}

/**
 * Indicates the direction of the specified media type for the specified
 * participant
 * @param {string} mediaType
 * @param {Types~LocusParticipant} participant
 * @private
 * @returns {string} One of `sendonly`, `recvonly`, `sendrecv`, or `inactive`
 */
function mediaDirection(mediaType, participant) {
  if (!participant) {
    return 'inactive';
  }

  if (!participant.status) {
    return 'inactive';
  }

  return (participant.status[mediaType + 'Status'] || 'inactive').toLowerCase();
}

/**
 * Indicates if the specified participant has joined the Locus
 * @param {Types~LocusParticipant} participant
 * @private
 * @returns {Boolean}
 */
function participantIsJoined(participant) {
  return participant && participant.state === 'JOINED';
}

/**
 * Finds the party in the call that is not the current user
 * @param {Types~Locus} locus
 * @private
 * @returns {Types~LocusParticipant}
 */
function remoteParticipant(locus) {
  return remoteParticipants(locus)[0];
}

/**
 * Finds all participants of the Locus that are not the current user
 * @param {Types~Locus} locus
 * @private
 * @returns {Types~LocusParticipant}
 */
function remoteParticipants(locus) {
  return locus.participants.filter(function (participant) {
    return participant.type === 'USER' && participant.url !== locus.self.url;
  });
}

/**
 * Indicates if the remote party is sending audio
 * @param {Types~LocusParticipant} participant
 * @private
 * @returns {Boolean}
 */
function remoteAudioMuted(participant) {
  return participantIsJoined(participant) && !participant.status.audioStatus.includes('SEND');
}

/**
 * Indicates if the remote party is sending video
 * @param {Types~LocusParticipant} participant
 * @private
 * @returns {Boolean}
 */
function remoteVideoMuted(participant) {
  return participantIsJoined(participant) && !participant.status.videoStatus.includes('SEND');
}

/**
 * Indicates if the `call:incoming` event should be fired for the specified Locus
 * @param {Types~Locus} locus Event which delivered the Locus
 * @param {ProxySpark} spark
 * @private
 * @returns {Boolean}
 */
function shouldRing(locus) {
  return (0, _get3.default)(locus, 'self.alertType.action') !== 'NONE';
}

/**
 * Determines the call state from a locus object
 * @param {Types~Locus} locus
 * @private
 * @returns {string}
 */
function getState(locus) {
  return locus && locus.fullState && locus.fullState.state.toLowerCase();
}

// there's really no good way to split getStatus() up that won't make it less readable
/* eslint-disable complexity */
/**
 * Determines the call state from a locus object. avoids the caching caused by
 * amp state because that leads to out-of-order updates
 * @param {ProxySpark} spark
 * @param {Types~Locus} locus
 * @param {Types~Locus} previousLocus
 * @private
 * @returns {string}
 */
function getStatus(spark, locus, previousLocus) {
  if (locus) {
    var remote = remoteParticipant(locus);

    if (remote) {
      if (joinedOnThisDevice(spark, locus) && remote && participantIsJoined(remote)) {
        return 'connected';
      }
      if (locus.replaces) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = (0, _getIterator3.default)(locus.replaces), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var replaced = _step3.value;

            if (replaced.locusUrl === previousLocus.url && replaced.lastActive === (0, _get3.default)(previousLocus, 'fullState.lastActive')) {
              return 'replaced';
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
      }

      var local = locus.self;
      if (remote.state === 'LEFT' || local.state === 'LEFT') {
        return 'disconnected';
      }

      if (remote.state === 'DECLINED') {
        return 'disconnected';
      }

      if (remote.state === 'NOTIFIED') {
        return 'ringing';
      }
    }
  }
  return 'initiated';
}

/**
 * Finds the `self` entry for the specified locus
 * @param {ProxySpark} spark
 * @param {Types~Locus} locus
 * @returns {Object}
 */
function getThisDevice(spark, locus) {
  return locus && locus.self && locus.self.devices.find(function (item) {
    return item.url === spark.internal.device.url;
  });
}
//# sourceMappingURL=state-parsers.js.map
