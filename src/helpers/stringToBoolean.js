'use strict';

module.exports = function stringToBoolean(string) {
    if (typeof string === 'string') {
        switch (string.toLowerCase()) {
            case 'true':
            case 'yes':
            case '1':
                return true;
            case 'false':
            case 'no':
            case '0':
            case null:
                return false;
            default:
                return Boolean(string);
        }
    } else {
        return Boolean(string);
    }
};
