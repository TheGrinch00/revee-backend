'use strict';

module.exports = function(Facility) {
    const errLog = {
        code: 'notFound.relatedInstance',
        message: 'related instance not found'
    };
    
    Facility.validateAsync('TypeId', hasTypeId, errLog);
    Facility.validateAsync('DivisionId', hasDivisionId, errLog);

    function hasTypeId(err, next) {
        if (!this.TypeId) return next();
        var FacilityType = Facility.app.models.FacilityType;
        FacilityType.exists(this.TypeId, function (error, instance) {
            if (error || !instance) err();
            next();
        });
    }
    function hasDivisionId(err, next) {
        if (!this.DivisionId) return next();
        var Division = Facility.app.models.Division;
        Division.exists(this.DivisionId, function (error, instance) {
            if (error || !instance) err();
            next();
        });
    }
};
