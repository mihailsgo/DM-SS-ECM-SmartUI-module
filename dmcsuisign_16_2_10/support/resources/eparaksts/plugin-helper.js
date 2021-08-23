/**
 * Plugin helper API. 
 */

var SC_NO_IMPLEMENTATION = "no_implementation";
var SC_FAILING_CHROME = "failing_chrome";
var SC_FAILING_NPAPI = "failing_npapi";
var SC_FAILING_BACKEND = "failing_backend";
var SC_NEW_VERSION = "new_version";
var SC_USER_CANCEL = "user_cancel";

//return version array [MAJOR, MINOR, BUILD]
function parseVersion(value) {
	var version = [0, 0, 0];
	var parts = value.split(".");
	var maxLength = Math.min(version.length, parts.length);
	for (i = 0; i < maxLength; i++) {
		var part = '';
		var partChars = parts[i].split('');
		for (j = 0; j < partChars.length; j++) {
			//collect numbers only
			if (!isNaN(parseInt(partChars[j], 10))) {
				part += partChars[j];

			} else if (part.length > 0) {
				//invalid number
				break;
			}
        }

		//
		var partVersion = parseInt(part, 10);
		if (!isNaN(partVersion)) {
			version[i] = partVersion;
		}
	}

	return version;
}

//returns -1, 0, 1
function compareVersion(oldVersion, newVersion) {
	//compare MAJOR value
	var majorOld = (oldVersion.length >= 1) ? oldVersion[0] : 0;
	var majorNew = (newVersion.length >= 1) ? newVersion[0] : 0;
	if (majorNew > majorOld) {
		//true
		return 1;

	} else if (majorNew == majorOld) {
		//compare MINOR value
		var minorOld = (oldVersion.length >= 2) ? oldVersion[1] : 0;
		var minorNew = (newVersion.length >= 2) ? newVersion[1] : 0;
		if (minorNew > minorOld) {
			//true
			return 1;

		} else if (minorNew == minorOld) {
			//compare BUILD value
			var revOld = (oldVersion.length >= 3) ? oldVersion[2] : 0;
			var revNew = (newVersion.length >= 3) ? newVersion[2] : 0;
			if (revNew > revOld) {
				//true
				return 1;

			} else if (revNew == revOld) {
				//equal
				return 0;
			}
		}
	}

	//false
	return -1;
}

function getBackendError(type, resolvedVersion, requiredVersion) {
	if ((type === null) || (typeof type !== "string")) {
		//string expected, invalid implementation
		return SC_NO_IMPLEMENTATION;
	}

	//
	var typeLower = type.toLowerCase();
	if (typeLower === SC_NO_IMPLEMENTATION) {
		return SC_NO_IMPLEMENTATION;

	} else if ((typeLower === SC_FAILING_CHROME) || (typeLower === SC_FAILING_NPAPI)) {
		return SC_FAILING_BACKEND;

	} else {
		var resolvedVersionArray = parseVersion(resolvedVersion);
		var requiredVersionArray = parseVersion(requiredVersion);
		if (compareVersion(resolvedVersionArray, requiredVersionArray) > 0) {
			return SC_NEW_VERSION;
		}
	}

	//
	return null;
}
