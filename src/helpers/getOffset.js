'use strict';

var isWindow = function (obj) {
    return obj != null && obj === obj.window;
};

var getWindow = function (elem) {
    return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
};

var getOffset = function (elem) {
    var docElem, win,
        box = {
            top: 0,
            left: 0
        },
        doc = elem && elem.ownerDocument;

    if (!doc) {
        return;
    }

    docElem = doc.documentElement;

    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    if (typeof elem.getBoundingClientRect !== 'undefined') {
        box = elem.getBoundingClientRect();
    }
    win = getWindow(doc);
    return {
        top: box.top + win.pageYOffset - docElem.clientTop,
        left: box.left + win.pageXOffset - docElem.clientLeft
    };
};

module.exports = getOffset;
