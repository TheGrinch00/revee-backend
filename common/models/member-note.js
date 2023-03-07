'use strict';

module.exports = function(Membernote) {
    const errLog = {
        code: 'notFound.relatedInstance',
        message: 'related instance not found'
    };

    Membernote.validateAsync('MemberId', hasMemberId, errLog);
    Membernote.validateAsync('PositionId', hasPositionId, errLog);

    function hasMemberId(err, next) {
        if (!this.MemberId) return next();
        var Member = Membernote.app.models.Member;
        Member.exists(this.MemberId, function (error, instance) {
            if (error || !instance) err();
            next();
        });
    }
    function hasPositionId(err, next) {
        if (!this.PositionId) return next();
        var Position = Membernote.app.models.Position;
        Position.exists(this.PositionId, function (error, instance) {
            if (error || !instance) err();
            next();
        });
    }
};
