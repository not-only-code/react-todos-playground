var _ = require('lodash');

var Utils = {
  KEY_ENTER: 13,
  STATES: {
    ALL: '#/',
    ACTIVE: '#/active',
    COMPLETED: '#/completed'
  },
  keyGen: function(length) {
    if (_.isUndefined(length) || !_.isNumber(length)) {
      length = 6;
    }
    if (length > 16) {
      length = 16;
    }
    return Math.random().toString(36).substring(2, parseInt(length, 10)+2).toUpperCase();
  },
  getCurrentState: function() {
    return window.location.hash.toLowerCase();
  }
};

module.exports = Utils;