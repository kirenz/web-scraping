(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
 * "Trampolines" the `ConsentString` class into the global namespace,
 * from the npm module it comes from to allow usage in `sync.html`
 *
 * Expected usage:
 *   npx browserify lib/trampolineConsentString.js -o public/browserify-consent-string.js
 */

const { ConsentString } = require('consent-string');
window.ConsentString = ConsentString;

},{"consent-string":6}],2:[function(require,module,exports){
(function (global){
/*! http://mths.be/base64 v0.1.0 by @mathias | MIT license */
;(function(root) {

	// Detect free variables `exports`.
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`.
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code, and use
	// it as `root`.
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var InvalidCharacterError = function(message) {
		this.message = message;
	};
	InvalidCharacterError.prototype = new Error;
	InvalidCharacterError.prototype.name = 'InvalidCharacterError';

	var error = function(message) {
		// Note: the error messages used throughout this file match those used by
		// the native `atob`/`btoa` implementation in Chromium.
		throw new InvalidCharacterError(message);
	};

	var TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	// http://whatwg.org/html/common-microsyntaxes.html#space-character
	var REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;

	// `decode` is designed to be fully compatible with `atob` as described in the
	// HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
	// The optimized base64-decoding algorithm used is based on @atk’s excellent
	// implementation. https://gist.github.com/atk/1020396
	var decode = function(input) {
		input = String(input)
			.replace(REGEX_SPACE_CHARACTERS, '');
		var length = input.length;
		if (length % 4 == 0) {
			input = input.replace(/==?$/, '');
			length = input.length;
		}
		if (
			length % 4 == 1 ||
			// http://whatwg.org/C#alphanumeric-ascii-characters
			/[^+a-zA-Z0-9/]/.test(input)
		) {
			error(
				'Invalid character: the string to be decoded is not correctly encoded.'
			);
		}
		var bitCounter = 0;
		var bitStorage;
		var buffer;
		var output = '';
		var position = -1;
		while (++position < length) {
			buffer = TABLE.indexOf(input.charAt(position));
			bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
			// Unless this is the first of a group of 4 characters…
			if (bitCounter++ % 4) {
				// …convert the first 8 bits to a single ASCII character.
				output += String.fromCharCode(
					0xFF & bitStorage >> (-2 * bitCounter & 6)
				);
			}
		}
		return output;
	};

	// `encode` is designed to be fully compatible with `btoa` as described in the
	// HTML Standard: http://whatwg.org/html/webappapis.html#dom-windowbase64-btoa
	var encode = function(input) {
		input = String(input);
		if (/[^\0-\xFF]/.test(input)) {
			// Note: no need to special-case astral symbols here, as surrogates are
			// matched, and the input is supposed to only contain ASCII anyway.
			error(
				'The string to be encoded contains characters outside of the ' +
				'Latin1 range.'
			);
		}
		var padding = input.length % 3;
		var output = '';
		var position = -1;
		var a;
		var b;
		var c;
		var d;
		var buffer;
		// Make sure any padding is handled outside of the loop.
		var length = input.length - padding;

		while (++position < length) {
			// Read three bytes, i.e. 24 bits.
			a = input.charCodeAt(position) << 16;
			b = input.charCodeAt(++position) << 8;
			c = input.charCodeAt(++position);
			buffer = a + b + c;
			// Turn the 24 bits into four chunks of 6 bits each, and append the
			// matching character for each of them to the output.
			output += (
				TABLE.charAt(buffer >> 18 & 0x3F) +
				TABLE.charAt(buffer >> 12 & 0x3F) +
				TABLE.charAt(buffer >> 6 & 0x3F) +
				TABLE.charAt(buffer & 0x3F)
			);
		}

		if (padding == 2) {
			a = input.charCodeAt(position) << 8;
			b = input.charCodeAt(++position);
			buffer = a + b;
			output += (
				TABLE.charAt(buffer >> 10) +
				TABLE.charAt((buffer >> 4) & 0x3F) +
				TABLE.charAt((buffer << 2) & 0x3F) +
				'='
			);
		} else if (padding == 1) {
			buffer = input.charCodeAt(position);
			output += (
				TABLE.charAt(buffer >> 2) +
				TABLE.charAt((buffer << 4) & 0x3F) +
				'=='
			);
		}

		return output;
	};

	var base64 = {
		'encode': encode,
		'decode': decode,
		'version': '0.1.0'
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return base64;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = base64;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (var key in base64) {
				base64.hasOwnProperty(key) && (freeExports[key] = base64[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.base64 = base64;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./encode'),
    encodeConsentString = _require.encodeConsentString,
    _getMaxVendorId = _require.getMaxVendorId,
    encodeVendorIdsToBits = _require.encodeVendorIdsToBits,
    encodePurposeIdsToBits = _require.encodePurposeIdsToBits;

var _require2 = require('./decode'),
    decodeConsentString = _require2.decodeConsentString;

var _require3 = require('./utils/definitions'),
    vendorVersionMap = _require3.vendorVersionMap;
/**
 * Regular expression for validating
 */


var consentLanguageRegexp = /^[a-z]{2}$/;
var cachedString = void 0;

var ConsentString = function () {
  function ConsentString() {
    var baseString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, ConsentString);

    this.maxVendorId = 0;
    this.created = new Date();
    this.lastUpdated = new Date();
    this.version = 1;
    this.vendorList = null;
    this.vendorListVersion = null;
    this.cmpId = null;
    this.cmpVersion = null;
    this.consentScreen = null;
    this.consentLanguage = null;
    this.allowedPurposeIds = [];
    this.allowedVendorIds = [];

    // Decode the base string
    if (baseString) {
      cachedString = baseString;
      Object.assign(this, decodeConsentString(baseString));
    }
  }

  _createClass(ConsentString, [{
    key: 'getConsentString',
    value: function getConsentString() {
      var updateDate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var retr = void 0;

      /**
       * check for cached string that was passed in.  This avoids having to
       * decode the consent string and even to have a vendorlist
       */
      if (cachedString && !updateDate) {
        retr = cachedString;
      } else {
        if (!this.vendorList) {
          throw new Error('ConsentString - A vendor list is required to encode a consent string');
        }

        if (updateDate === true) {
          this.lastUpdated = new Date();
        }

        retr = encodeConsentString({
          version: this.getVersion(),
          vendorList: this.vendorList,
          allowedPurposeIds: this.allowedPurposeIds,
          allowedVendorIds: this.allowedVendorIds,
          created: this.created,
          lastUpdated: this.lastUpdated,
          cmpId: this.cmpId,
          cmpVersion: this.cmpVersion,
          consentScreen: this.consentScreen,
          consentLanguage: this.consentLanguage,
          vendorListVersion: this.vendorListVersion
        });

        cachedString = retr;
      }
      return retr;
    }
  }, {
    key: 'getLastUpdated',
    value: function getLastUpdated() {
      return this.lastUpdated;
    }
  }, {
    key: 'setLastUpdated',
    value: function setLastUpdated() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      cachedString = '';
      if (date) {
        this.lastUpdated = new Date(date);
      } else {
        this.lastUpdated = new Date();
      }
    }
  }, {
    key: 'getCreated',
    value: function getCreated() {
      return this.created;
    }
  }, {
    key: 'setCreated',
    value: function setCreated() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      cachedString = '';
      if (date) {
        this.created = new Date(date);
      } else {
        this.created = new Date();
      }
    }
  }, {
    key: 'getMaxVendorId',
    value: function getMaxVendorId() {
      if (!this.maxVendorId) {
        if (this.vendorList) {
          this.maxVendorId = _getMaxVendorId(this.vendorList.vendors);
        }
      }
      return this.maxVendorId;
    }
  }, {
    key: 'getParsedVendorConsents',
    value: function getParsedVendorConsents() {
      return encodeVendorIdsToBits(_getMaxVendorId(this.vendorList.vendors), this.allowedVendorIds);
    }
  }, {
    key: 'getParsedPurposeConsents',
    value: function getParsedPurposeConsents() {
      return encodePurposeIdsToBits(this.vendorList.purposes, this.allowedPurposeIds);
    }
  }, {
    key: 'getMetadataString',
    value: function getMetadataString() {
      return encodeConsentString({
        version: this.getVersion(),
        created: this.created,
        lastUpdated: this.lastUpdated,
        cmpId: this.cmpId,
        cmpVersion: this.cmpVersion,
        consentScreen: this.consentScreen,
        vendorListVersion: this.vendorListVersion
      });
    }
  }, {
    key: 'getVersion',
    value: function getVersion() {
      return this.version;
    }
  }, {
    key: 'getVendorListVersion',
    value: function getVendorListVersion() {
      return this.vendorListVersion;
    }
  }, {
    key: 'setGlobalVendorList',
    value: function setGlobalVendorList(vendorList) {
      if ((typeof vendorList === 'undefined' ? 'undefined' : _typeof(vendorList)) !== 'object') {
        throw new Error('ConsentString - You must provide an object when setting the global vendor list');
      }

      if (!vendorList.vendorListVersion || !Array.isArray(vendorList.purposes) || !Array.isArray(vendorList.vendors)) {
        // The provided vendor list does not look valid
        throw new Error('ConsentString - The provided vendor list does not respect the schema from the IAB EU’s GDPR Consent and Transparency Framework');
      }

      // does a vendorList already exist and is it a different version
      if (!this.vendorList || this.vendorListVersion !== vendorList.vendorListVersion) {
        cachedString = '';
        // Cloning the GVL
        // It's important as we might transform it and don't want to modify objects that we do not own
        this.vendorList = {
          vendorListVersion: vendorList.vendorListVersion,
          lastUpdated: vendorList.lastUpdated,
          purposes: vendorList.purposes,
          features: vendorList.features,

          // Clone the list and sort the vendors by ID (it breaks our range generation algorithm if they are not sorted)
          vendors: vendorList.vendors.slice(0).sort(function (firstVendor, secondVendor) {
            return firstVendor.id < secondVendor.id ? -1 : 1;
          })
        };
        this.vendorListVersion = vendorList.vendorListVersion;
      }
    }
  }, {
    key: 'getGlobalVendorList',
    value: function getGlobalVendorList() {
      return this.vendorList;
    }
  }, {
    key: 'setCmpId',
    value: function setCmpId(id) {
      if (id !== this.cmpId) {
        cachedString = '';
        this.cmpId = id;
      }
    }
  }, {
    key: 'getCmpId',
    value: function getCmpId() {
      return this.cmpId;
    }
  }, {
    key: 'setCmpVersion',
    value: function setCmpVersion(version) {
      if (version !== this.cmpVersion) {
        cachedString = '';
        this.cmpVersion = version;
      }
    }
  }, {
    key: 'getCmpVersion',
    value: function getCmpVersion() {
      return this.cmpVersion;
    }
  }, {
    key: 'setConsentScreen',
    value: function setConsentScreen(screenId) {
      if (screenId !== this.consentScreen) {
        cachedString = '';
        this.consentScreen = screenId;
      }
    }
  }, {
    key: 'getConsentScreen',
    value: function getConsentScreen() {
      return this.consentScreen;
    }
  }, {
    key: 'setConsentLanguage',
    value: function setConsentLanguage(language) {
      if (consentLanguageRegexp.test(language) === false) {
        throw new Error('ConsentString - The consent language must be a two-letter ISO639-1 code (en, fr, de, etc.)');
      }

      if (language !== this.consentLanguage) {
        cachedString = '';
        this.consentLanguage = language;
      }
    }
  }, {
    key: 'getConsentLanguage',
    value: function getConsentLanguage() {
      return this.consentLanguage;
    }
  }, {
    key: 'setPurposesAllowed',
    value: function setPurposesAllowed(purposeIds) {
      cachedString = '';
      this.allowedPurposeIds = purposeIds;
    }
  }, {
    key: 'getPurposesAllowed',
    value: function getPurposesAllowed() {
      return this.allowedPurposeIds;
    }
  }, {
    key: 'setPurposeAllowed',
    value: function setPurposeAllowed(purposeId, value) {
      var purposeIndex = this.allowedPurposeIds.indexOf(purposeId);

      cachedString = '';

      if (value === true) {
        if (purposeIndex === -1) {
          this.allowedPurposeIds.push(purposeId);
        }
      } else if (value === false) {
        if (purposeIndex !== -1) {
          this.allowedPurposeIds.splice(purposeIndex, 1);
        }
      }
    }
  }, {
    key: 'isPurposeAllowed',
    value: function isPurposeAllowed(purposeId) {
      return this.allowedPurposeIds.indexOf(purposeId) !== -1;
    }
  }, {
    key: 'setVendorsAllowed',
    value: function setVendorsAllowed(vendorIds) {
      cachedString = '';
      this.allowedVendorIds = vendorIds;
    }
  }, {
    key: 'getVendorsAllowed',
    value: function getVendorsAllowed() {
      return this.allowedVendorIds;
    }
  }, {
    key: 'setVendorAllowed',
    value: function setVendorAllowed(vendorId, value) {
      var vendorIndex = this.allowedVendorIds.indexOf(vendorId);

      cachedString = '';
      if (value === true) {
        if (vendorIndex === -1) {
          this.allowedVendorIds.push(vendorId);
        }
      } else if (value === false) {
        if (vendorIndex !== -1) {
          this.allowedVendorIds.splice(vendorIndex, 1);
        }
      }
    }
  }, {
    key: 'isVendorAllowed',
    value: function isVendorAllowed(vendorId) {
      return this.allowedVendorIds.indexOf(vendorId) !== -1;
    }
  }], [{
    key: 'decodeMetadataString',
    value: function decodeMetadataString(encodedMetadata) {
      var decodedString = decodeConsentString(encodedMetadata);
      var metadata = {};
      vendorVersionMap[decodedString.version].metadataFields.forEach(function (field) {
        metadata[field] = decodedString[field];
      });
      return metadata;
    }
  }]);

  return ConsentString;
}();

module.exports = {
  ConsentString: ConsentString
};
},{"./decode":4,"./encode":5,"./utils/definitions":8}],4:[function(require,module,exports){
'use strict';

var _require = require('./utils/bits'),
    decodeBitsToIds = _require.decodeBitsToIds,
    decodeFromBase64 = _require.decodeFromBase64;

/**
 * Decode consent data from a web-safe base64-encoded string
 *
 * @param {string} consentString
 */


function decodeConsentString(consentString) {
  var _decodeFromBase = decodeFromBase64(consentString),
      version = _decodeFromBase.version,
      cmpId = _decodeFromBase.cmpId,
      vendorListVersion = _decodeFromBase.vendorListVersion,
      purposeIdBitString = _decodeFromBase.purposeIdBitString,
      maxVendorId = _decodeFromBase.maxVendorId,
      created = _decodeFromBase.created,
      lastUpdated = _decodeFromBase.lastUpdated,
      isRange = _decodeFromBase.isRange,
      defaultConsent = _decodeFromBase.defaultConsent,
      vendorIdBitString = _decodeFromBase.vendorIdBitString,
      vendorRangeList = _decodeFromBase.vendorRangeList,
      cmpVersion = _decodeFromBase.cmpVersion,
      consentScreen = _decodeFromBase.consentScreen,
      consentLanguage = _decodeFromBase.consentLanguage;

  var consentStringData = {
    version: version,
    cmpId: cmpId,
    vendorListVersion: vendorListVersion,
    allowedPurposeIds: decodeBitsToIds(purposeIdBitString),
    maxVendorId: maxVendorId,
    created: created,
    lastUpdated: lastUpdated,
    cmpVersion: cmpVersion,
    consentScreen: consentScreen,
    consentLanguage: consentLanguage
  };

  if (isRange) {
    /* eslint no-shadow: off */
    var idMap = vendorRangeList.reduce(function (acc, _ref) {
      var isRange = _ref.isRange,
          startVendorId = _ref.startVendorId,
          endVendorId = _ref.endVendorId;

      var lastVendorId = isRange ? endVendorId : startVendorId;

      for (var i = startVendorId; i <= lastVendorId; i += 1) {
        acc[i] = true;
      }

      return acc;
    }, {});

    consentStringData.allowedVendorIds = [];

    for (var i = 1; i <= maxVendorId; i += 1) {
      if (defaultConsent && !idMap[i] || !defaultConsent && idMap[i]) {
        if (consentStringData.allowedVendorIds.indexOf(i) === -1) {
          consentStringData.allowedVendorIds.push(i);
        }
      }
    }
  } else {
    consentStringData.allowedVendorIds = decodeBitsToIds(vendorIdBitString);
  }

  return consentStringData;
}

module.exports = {
  decodeConsentString: decodeConsentString
};
},{"./utils/bits":7}],5:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('./utils/bits'),
    encodeToBase64 = _require.encodeToBase64,
    padRight = _require.padRight;

/**
 * Encode a list of vendor IDs into bits
 *
 * @param {integer} maxVendorId Highest vendor ID in the vendor list
 * @param {integer[]} allowedVendorIds Vendors that the user has given consent to
 */


function encodeVendorIdsToBits(maxVendorId) {
  var allowedVendorIds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var vendorString = '';

  for (var id = 1; id <= maxVendorId; id += 1) {
    vendorString += allowedVendorIds.indexOf(id) !== -1 ? '1' : '0';
  }

  return padRight(vendorString, Math.max(0, maxVendorId - vendorString.length));
}

/**
 * Encode a list of purpose IDs into bits
 *
 * @param {*} purposes List of purposes from the vendor list
 * @param {*} allowedPurposeIds List of purpose IDs that the user has given consent to
 */
function encodePurposeIdsToBits(purposes) {
  var allowedPurposeIds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Set();

  var maxPurposeId = 0;
  for (var i = 0; i < purposes.length; i += 1) {
    maxPurposeId = Math.max(maxPurposeId, purposes[i].id);
  }
  for (var _i = 0; _i < allowedPurposeIds.length; _i += 1) {
    maxPurposeId = Math.max(maxPurposeId, allowedPurposeIds[_i]);
  }

  var purposeString = '';
  for (var id = 1; id <= maxPurposeId; id += 1) {
    purposeString += allowedPurposeIds.indexOf(id) !== -1 ? '1' : '0';
  }

  return purposeString;
}

/**
 * Convert a list of vendor IDs to ranges
 *
 * @param {object[]} vendors List of vendors from the vendor list (important: this list must to be sorted by ID)
 * @param {integer[]} allowedVendorIds List of vendor IDs that the user has given consent to
 */
function convertVendorsToRanges(vendors, allowedVendorIds) {
  var range = [];
  var ranges = [];

  var idsInList = vendors.map(function (vendor) {
    return vendor.id;
  });

  for (var index = 0; index < vendors.length; index += 1) {
    var id = vendors[index].id;

    if (allowedVendorIds.indexOf(id) !== -1) {
      range.push(id);
    }

    // Do we need to close the current range?
    if ((allowedVendorIds.indexOf(id) === -1 // The vendor we are evaluating is not allowed
    || index === vendors.length - 1 // There is no more vendor to evaluate
    || idsInList.indexOf(id + 1) === -1 // There is no vendor after this one (ie there is a gap in the vendor IDs) ; we need to stop here to avoid including vendors that do not have consent
    ) && range.length) {
      var startVendorId = range.shift();
      var endVendorId = range.pop();

      range = [];

      ranges.push({
        isRange: typeof endVendorId === 'number',
        startVendorId: startVendorId,
        endVendorId: endVendorId
      });
    }
  }

  return ranges;
}

/**
 * Get maxVendorId from the list of vendors and return that id
 *
 * @param {object} vendors
 */
function getMaxVendorId(vendors) {
  // Find the max vendor ID from the vendor list
  var maxVendorId = 0;

  vendors.forEach(function (vendor) {
    if (vendor.id > maxVendorId) {
      maxVendorId = vendor.id;
    }
  });
  return maxVendorId;
}
/**
 * Encode consent data into a web-safe base64-encoded string
 *
 * @param {object} consentData Data to include in the string (see `utils/definitions.js` for the list of fields)
 */
function encodeConsentString(consentData) {
  var maxVendorId = consentData.maxVendorId;
  var _consentData$vendorLi = consentData.vendorList,
      vendorList = _consentData$vendorLi === undefined ? {} : _consentData$vendorLi,
      allowedPurposeIds = consentData.allowedPurposeIds,
      allowedVendorIds = consentData.allowedVendorIds;
  var _vendorList$vendors = vendorList.vendors,
      vendors = _vendorList$vendors === undefined ? [] : _vendorList$vendors,
      _vendorList$purposes = vendorList.purposes,
      purposes = _vendorList$purposes === undefined ? [] : _vendorList$purposes;

  // if no maxVendorId is in the ConsentData, get it

  if (!maxVendorId) {
    maxVendorId = getMaxVendorId(vendors);
  }

  // Encode the data with and without ranges and return the smallest encoded payload
  var noRangesData = encodeToBase64(_extends({}, consentData, {
    maxVendorId: maxVendorId,
    purposeIdBitString: encodePurposeIdsToBits(purposes, allowedPurposeIds),
    isRange: false,
    vendorIdBitString: encodeVendorIdsToBits(maxVendorId, allowedVendorIds)
  }));

  var vendorRangeList = convertVendorsToRanges(vendors, allowedVendorIds);

  var rangesData = encodeToBase64(_extends({}, consentData, {
    maxVendorId: maxVendorId,
    purposeIdBitString: encodePurposeIdsToBits(purposes, allowedPurposeIds),
    isRange: true,
    defaultConsent: false,
    numEntries: vendorRangeList.length,
    vendorRangeList: vendorRangeList
  }));

  return noRangesData.length < rangesData.length ? noRangesData : rangesData;
}

module.exports = {
  convertVendorsToRanges: convertVendorsToRanges,
  encodeConsentString: encodeConsentString,
  getMaxVendorId: getMaxVendorId,
  encodeVendorIdsToBits: encodeVendorIdsToBits,
  encodePurposeIdsToBits: encodePurposeIdsToBits
};
},{"./utils/bits":7}],6:[function(require,module,exports){
'use strict';

var _require = require('./consent-string'),
    ConsentString = _require.ConsentString;

var _require2 = require('./decode'),
    decodeConsentString = _require2.decodeConsentString;

var _require3 = require('./encode'),
    encodeConsentString = _require3.encodeConsentString;

module.exports = {
  ConsentString: ConsentString,
  decodeConsentString: decodeConsentString,
  encodeConsentString: encodeConsentString
};
},{"./consent-string":3,"./decode":4,"./encode":5}],7:[function(require,module,exports){
'use strict';

/* eslint no-use-before-define: off */

var base64 = require('base-64');

var _require = require('./definitions'),
    versionNumBits = _require.versionNumBits,
    vendorVersionMap = _require.vendorVersionMap;

function repeat(count) {
  var string = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';

  var padString = '';

  for (var i = 0; i < count; i += 1) {
    padString += string;
  }

  return padString;
}

function padLeft(string, padding) {
  return repeat(Math.max(0, padding)) + string;
}

function padRight(string, padding) {
  return string + repeat(Math.max(0, padding));
}

function encodeIntToBits(number, numBits) {
  var bitString = '';

  if (typeof number === 'number' && !isNaN(number)) {
    bitString = parseInt(number, 10).toString(2);
  }

  // Pad the string if not filling all bits
  if (numBits >= bitString.length) {
    bitString = padLeft(bitString, numBits - bitString.length);
  }

  // Truncate the string if longer than the number of bits
  if (bitString.length > numBits) {
    bitString = bitString.substring(0, numBits);
  }

  return bitString;
}

function encodeBoolToBits(value) {
  return encodeIntToBits(value === true ? 1 : 0, 1);
}

function encodeDateToBits(date, numBits) {
  if (date instanceof Date) {
    return encodeIntToBits(date.getTime() / 100, numBits);
  }
  return encodeIntToBits(date, numBits);
}

function encodeLetterToBits(letter, numBits) {
  return encodeIntToBits(letter.toUpperCase().charCodeAt(0) - 65, numBits);
}

function encodeLanguageToBits(language) {
  var numBits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 12;

  return encodeLetterToBits(language.slice(0, 1), numBits / 2) + encodeLetterToBits(language.slice(1), numBits / 2);
}

function decodeBitsToInt(bitString, start, length) {
  return parseInt(bitString.substr(start, length), 2);
}

function decodeBitsToDate(bitString, start, length) {
  return new Date(decodeBitsToInt(bitString, start, length) * 100);
}

function decodeBitsToBool(bitString, start) {
  return parseInt(bitString.substr(start, 1), 2) === 1;
}

function decodeBitsToLetter(bitString) {
  var letterCode = decodeBitsToInt(bitString);
  return String.fromCharCode(letterCode + 65).toLowerCase();
}

function decodeBitsToLanguage(bitString, start, length) {
  var languageBitString = bitString.substr(start, length);

  return decodeBitsToLetter(languageBitString.slice(0, length / 2)) + decodeBitsToLetter(languageBitString.slice(length / 2));
}

function encodeField(_ref) {
  var input = _ref.input,
      field = _ref.field;
  var name = field.name,
      type = field.type,
      numBits = field.numBits,
      encoder = field.encoder,
      validator = field.validator;


  if (typeof validator === 'function') {
    if (!validator(input)) {
      return '';
    }
  }
  if (typeof encoder === 'function') {
    return encoder(input);
  }

  var bitCount = typeof numBits === 'function' ? numBits(input) : numBits;

  var inputValue = input[name];
  var fieldValue = inputValue === null || inputValue === undefined ? '' : inputValue;

  switch (type) {
    case 'int':
      return encodeIntToBits(fieldValue, bitCount);
    case 'bool':
      return encodeBoolToBits(fieldValue);
    case 'date':
      return encodeDateToBits(fieldValue, bitCount);
    case 'bits':
      return padRight(fieldValue, bitCount - fieldValue.length).substring(0, bitCount);
    case 'list':
      return fieldValue.reduce(function (acc, listValue) {
        return acc + encodeFields({
          input: listValue,
          fields: field.fields
        });
      }, '');
    case 'language':
      return encodeLanguageToBits(fieldValue, bitCount);
    default:
      throw new Error('ConsentString - Unknown field type ' + type + ' for encoding');
  }
}

function encodeFields(_ref2) {
  var input = _ref2.input,
      fields = _ref2.fields;

  return fields.reduce(function (acc, field) {
    acc += encodeField({ input: input, field: field });

    return acc;
  }, '');
}

function decodeField(_ref3) {
  var input = _ref3.input,
      output = _ref3.output,
      startPosition = _ref3.startPosition,
      field = _ref3.field;
  var type = field.type,
      numBits = field.numBits,
      decoder = field.decoder,
      validator = field.validator,
      listCount = field.listCount;


  if (typeof validator === 'function') {
    if (!validator(output)) {
      // Not decoding this field so make sure we start parsing the next field at
      // the same point
      return { newPosition: startPosition };
    }
  }

  if (typeof decoder === 'function') {
    return decoder(input, output, startPosition);
  }

  var bitCount = typeof numBits === 'function' ? numBits(output) : numBits;

  switch (type) {
    case 'int':
      return { fieldValue: decodeBitsToInt(input, startPosition, bitCount) };
    case 'bool':
      return { fieldValue: decodeBitsToBool(input, startPosition) };
    case 'date':
      return { fieldValue: decodeBitsToDate(input, startPosition, bitCount) };
    case 'bits':
      return { fieldValue: input.substr(startPosition, bitCount) };
    case 'list':
      return decodeList(input, output, startPosition, field, listCount);
    case 'language':
      return { fieldValue: decodeBitsToLanguage(input, startPosition, bitCount) };
    default:
      throw new Error('ConsentString - Unknown field type ' + type + ' for decoding');
  }
}

function decodeList(input, output, startPosition, field, listCount) {
  var listEntryCount = 0;

  if (typeof listCount === 'function') {
    listEntryCount = listCount(output);
  } else if (typeof listCount === 'number') {
    listEntryCount = listCount;
  }

  var newPosition = startPosition;
  var fieldValue = [];

  for (var i = 0; i < listEntryCount; i += 1) {
    var decodedFields = decodeFields({
      input: input,
      fields: field.fields,
      startPosition: newPosition
    });

    newPosition = decodedFields.newPosition;
    fieldValue.push(decodedFields.decodedObject);
  }

  return { fieldValue: fieldValue, newPosition: newPosition };
}

function decodeFields(_ref4) {
  var input = _ref4.input,
      fields = _ref4.fields,
      _ref4$startPosition = _ref4.startPosition,
      startPosition = _ref4$startPosition === undefined ? 0 : _ref4$startPosition;

  var position = startPosition;

  var decodedObject = fields.reduce(function (acc, field) {
    var name = field.name,
        numBits = field.numBits;

    var _decodeField = decodeField({
      input: input,
      output: acc,
      startPosition: position,
      field: field
    }),
        fieldValue = _decodeField.fieldValue,
        newPosition = _decodeField.newPosition;

    if (fieldValue !== undefined) {
      acc[name] = fieldValue;
    }

    if (newPosition !== undefined) {
      position = newPosition;
    } else if (typeof numBits === 'number') {
      position += numBits;
    }

    return acc;
  }, {});

  return {
    decodedObject: decodedObject,
    newPosition: position
  };
}

/**
 * Encode the data properties to a bit string. Encoding will encode
 * either `selectedVendorIds` or the `vendorRangeList` depending on
 * the value of the `isRange` flag.
 */
function encodeDataToBits(data, definitionMap) {
  var version = data.version;


  if (typeof version !== 'number') {
    throw new Error('ConsentString - No version field to encode');
  } else if (!definitionMap[version]) {
    throw new Error('ConsentString - No definition for version ' + version);
  } else {
    var fields = definitionMap[version].fields;
    return encodeFields({ input: data, fields: fields });
  }
}

/**
 * Take all fields required to encode the consent string and produce the URL safe Base64 encoded value
 */
function encodeToBase64(data) {
  var definitionMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : vendorVersionMap;

  var binaryValue = encodeDataToBits(data, definitionMap);

  if (binaryValue) {
    // Pad length to multiple of 8
    var paddedBinaryValue = padRight(binaryValue, 7 - (binaryValue.length + 7) % 8);

    // Encode to bytes
    var bytes = '';
    for (var i = 0; i < paddedBinaryValue.length; i += 8) {
      bytes += String.fromCharCode(parseInt(paddedBinaryValue.substr(i, 8), 2));
    }

    // Make base64 string URL friendly
    return base64.encode(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  return null;
}

function decodeConsentStringBitValue(bitString) {
  var definitionMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : vendorVersionMap;

  var version = decodeBitsToInt(bitString, 0, versionNumBits);

  if (typeof version !== 'number') {
    throw new Error('ConsentString - Unknown version number in the string to decode');
  } else if (!vendorVersionMap[version]) {
    throw new Error('ConsentString - Unsupported version ' + version + ' in the string to decode');
  }

  var fields = definitionMap[version].fields;

  var _decodeFields = decodeFields({ input: bitString, fields: fields }),
      decodedObject = _decodeFields.decodedObject;

  return decodedObject;
}

/**
 * Decode the (URL safe Base64) value of a consent string into an object.
 */
function decodeFromBase64(consentString, definitionMap) {
  // Add padding
  var unsafe = consentString;
  while (unsafe.length % 4 !== 0) {
    unsafe += '=';
  }

  // Replace safe characters
  unsafe = unsafe.replace(/-/g, '+').replace(/_/g, '/');

  var bytes = base64.decode(unsafe);

  var inputBits = '';
  for (var i = 0; i < bytes.length; i += 1) {
    var bitString = bytes.charCodeAt(i).toString(2);
    inputBits += padLeft(bitString, 8 - bitString.length);
  }

  return decodeConsentStringBitValue(inputBits, definitionMap);
}

function decodeBitsToIds(bitString) {
  return bitString.split('').reduce(function (acc, bit, index) {
    if (bit === '1') {
      if (acc.indexOf(index + 1) === -1) {
        acc.push(index + 1);
      }
    }
    return acc;
  }, []);
}

module.exports = {
  padRight: padRight,
  padLeft: padLeft,
  encodeField: encodeField,
  encodeDataToBits: encodeDataToBits,
  encodeIntToBits: encodeIntToBits,
  encodeBoolToBits: encodeBoolToBits,
  encodeDateToBits: encodeDateToBits,
  encodeLanguageToBits: encodeLanguageToBits,
  encodeLetterToBits: encodeLetterToBits,
  encodeToBase64: encodeToBase64,
  decodeBitsToIds: decodeBitsToIds,
  decodeBitsToInt: decodeBitsToInt,
  decodeBitsToDate: decodeBitsToDate,
  decodeBitsToBool: decodeBitsToBool,
  decodeBitsToLanguage: decodeBitsToLanguage,
  decodeBitsToLetter: decodeBitsToLetter,
  decodeFromBase64: decodeFromBase64
};
},{"./definitions":8,"base-64":2}],8:[function(require,module,exports){
'use strict';

/**
 * Number of bits for encoding the version integer
 * Expected to be the same across versions
 */
var versionNumBits = 6;

/**
 * Definition of the consent string encoded format
 *
 * From https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/Draft_for_Public_Comment_Transparency%20%26%20Consent%20Framework%20-%20cookie%20and%20vendor%20list%20format%20specification%20v1.0a.pdf
 */
var vendorVersionMap = {
  /**
   * Version 1
   */
  1: {
    version: 1,
    metadataFields: ['version', 'created', 'lastUpdated', 'cmpId', 'cmpVersion', 'consentScreen', 'vendorListVersion'],
    fields: [{ name: 'version', type: 'int', numBits: 6 }, { name: 'created', type: 'date', numBits: 36 }, { name: 'lastUpdated', type: 'date', numBits: 36 }, { name: 'cmpId', type: 'int', numBits: 12 }, { name: 'cmpVersion', type: 'int', numBits: 12 }, { name: 'consentScreen', type: 'int', numBits: 6 }, { name: 'consentLanguage', type: 'language', numBits: 12 }, { name: 'vendorListVersion', type: 'int', numBits: 12 }, { name: 'purposeIdBitString', type: 'bits', numBits: 24 }, { name: 'maxVendorId', type: 'int', numBits: 16 }, { name: 'isRange', type: 'bool', numBits: 1 }, {
      name: 'vendorIdBitString',
      type: 'bits',
      numBits: function numBits(decodedObject) {
        return decodedObject.maxVendorId;
      },
      validator: function validator(decodedObject) {
        return !decodedObject.isRange;
      }
    }, {
      name: 'defaultConsent',
      type: 'bool',
      numBits: 1,
      validator: function validator(decodedObject) {
        return decodedObject.isRange;
      }
    }, {
      name: 'numEntries',
      numBits: 12,
      type: 'int',
      validator: function validator(decodedObject) {
        return decodedObject.isRange;
      }
    }, {
      name: 'vendorRangeList',
      type: 'list',
      listCount: function listCount(decodedObject) {
        return decodedObject.numEntries;
      },
      validator: function validator(decodedObject) {
        return decodedObject.isRange;
      },
      fields: [{
        name: 'isRange',
        type: 'bool',
        numBits: 1
      }, {
        name: 'startVendorId',
        type: 'int',
        numBits: 16
      }, {
        name: 'endVendorId',
        type: 'int',
        numBits: 16,
        validator: function validator(decodedObject) {
          return decodedObject.isRange;
        }
      }]
    }]
  }
};

module.exports = {
  versionNumBits: versionNumBits,
  vendorVersionMap: vendorVersionMap
};
},{}]},{},[1]);
