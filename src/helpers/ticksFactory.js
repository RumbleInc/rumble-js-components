'use strict';

var _ = require('lodash'),
    moment = require('moment');

var ticksFactory = function (options) {

    options = _.defaults(_.clone(options), {
        showEndDate: false,
        maxTicks: 0,
        distance: 1,
        distanceType: 'day'
    });

    var maxTicks = options.maxTicks;
    if (maxTicks && options.showEndDate) {
        maxTicks--;
    }

    return function (fromDate, toDate) {

        var result = [];
        var momentFrom = moment(fromDate);
        var momentTo = moment(toDate);
        if (!momentFrom.isValid() || !momentTo.isValid()) {
            return result;
        }
        momentFrom.startOf(options.distanceType);
        momentTo.startOf(options.distanceType);

        var diff = moment.range(momentFrom, momentTo).diff(options.distanceType);
        var delta = (maxTicks && diff > maxTicks) ? Math.ceil(diff / maxTicks) : options.distance;

        while (!momentFrom.isAfter(momentTo, options.distanceType)) {
            result.push(momentFrom.clone().toDate());
            momentFrom.add(delta, options.distanceType);
        }

        if (options.showEndDate) {
            if (!momentTo.clone()
                    .subtract(Math.max(Math.round(delta / 2), 1), options.distanceType)
                    .isAfter(_.last(result))) {
                result.splice(result.length - 1, 1);
            }
            result.push(momentTo.toDate());
        }

        return _.unique(result);

    };

};

module.exports = ticksFactory;
