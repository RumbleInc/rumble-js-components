'use strict';

var moment = require('moment');
require('moment-range');
moment.updateLocale('en', {
    week: {
        dow: 1
    },
    // http://stackoverflow.com/questions/11448340/how-to-get-duration-in-weeks-with-moment-js
    relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: 'seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: function (number) {
            var weeks = Math.round(number / 7);
            if (number < 7) {
                // if less than a week, use days
                return number + ' days';
            } else {
                // pluralize weeks
                return weeks + ' week' + (weeks === 1 ? '' : 's');
            }
        },
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years'
    }
});
moment.relativeTimeThreshold('s', 61);
moment.relativeTimeThreshold('m', 61);
moment.relativeTimeThreshold('h', 25);
moment.relativeTimeThreshold('d', 31);
moment.relativeTimeThreshold('M', 13);
