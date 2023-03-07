'use strict';

module.exports = function(Division) {
    const errLog = {
        code: 'notFound.relatedInstance',
        message: 'related instance not found'
    };

    Division.validateAsync('ZoneId', hasZoneId, errLog);

    function hasZoneId(err, next) {
        if (!this.ZoneId) return next();
        var Zone = Division.app.models.Zone;
        Zone.exists(this.ZoneId, function (error, instance) {
            if (error || !instance) err();
            next();
        });
    }
};
