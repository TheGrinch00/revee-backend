'use strict';

module.exports = function(Alloweddivision) {
    const errLog = {
        code: 'notFound.relatedInstance',
        message: 'related instance not found'
    };

    Alloweddivision.validateAsync('MemberId', hasMemberId, errLog);
    Alloweddivision.validateAsync('DivisionId', hasDivisionId, errLog);

    function hasMemberId(err, next) {
        if (!this.MemberId) return next();
        var Member = Alloweddivision.app.models.Member;
        Member.exists(this.MemberId, function (error, instance) {
            if (error || !instance) err();
            next();
        });
    }
    function hasDivisionId(err, next) {
        if (!this.DivisionId) return next();
        var Division = Alloweddivision.app.models.Division;
        Division.exists(this.DivisionId, function (error, instance) {
            if (error || !instance) err();
            next();
        });
    }
};
