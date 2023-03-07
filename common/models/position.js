'use strict';

module.exports = function(Position) {
    let days = [], hours = [], minutes = [];

    for (let i = 0; i < 60; i++) {
        minutes.push(i);
        if (i < 24) hours.push(i);
        if (i < 7) days.push(i);
    }

  /*  Position.validatesInclusionOf('MeetingDay', {in: days});
    Position.validatesInclusionOf('MeetingStartHour', {in: hours});
    Position.validatesInclusionOf('MeetingStartMinute', {in: minutes});
    Position.validatesInclusionOf('MeetingEndHour', {in: hours});
    Position.validatesInclusionOf('MeetingEndMinute', {in: minutes});*/

    const errLog = {
        code: 'notFound.relatedInstance',
        message: 'related instance not found'
    };

    //Position.validateAsync('CategoryId', hasCategoryId, errLog);
    Position.validateAsync('EmploymentId', hasEmploymentId, errLog);
    Position.validateAsync('WardId', hasWardId, errLog);
    Position.validateAsync('EmployeeId', hasEmployeeId, errLog);
    Position.validateAsync('FacilityId', hasFacilityId, errLog);

    /*Position.validatesInclusionOf('MeetingDay', {in: days});
    Position.validatesInclusionOf('MeetingStartHour', {in: hours});
    Position.validatesInclusionOf('MeetingStartMinute', {in: minutes});
    Position.validatesInclusionOf('MeetingEndHour', {in: hours});
    Position.validatesInclusionOf('MeetingEndMinute', {in: minutes});*/

    Position.validateAsync('MeetingDay', hasMeetingDay, errLog);
    Position.validateAsync('MeetingStartHour', hasMeetingStartHour, errLog);
    Position.validateAsync('MeetingStartMinute', hasMeetingStarMinute, errLog);
    Position.validateAsync('MeetingEndHour', hasMeetingEndHour, errLog);
    Position.validateAsync('MeetingEndMinute', hasMeetingEndMinute, errLog);

    /*function hasCategoryId(err, next) {
        if (!this.CategoryId) return next();
        var Category = Position.app.models.Category;
        Category.exists(this.CategoryId, function (error, instance) {
            if (error || !instance) err();
            next();
        });
    }*/
    function hasEmploymentId(err, next) {
        if (!this.EmploymentId) return next();
        var Employment = Position.app.models.Employment;
        Employment.exists(this.EmploymentId, function (error, instance) {
            if (error || !instance) err();
            next();
        });
    }
    function hasWardId(err, next) {
        if (!this.WardId) return next();
        var Ward = Position.app.models.Ward;
        Ward.exists(this.WardId, function (error, instance) {
            if (error || !instance) err();
            next();
        });
    }
    function hasEmployeeId(err, next) {
        if (!this.EmployeeId) return next();
        var Employee = Position.app.models.Employee;
        Employee.exists(this.EmployeeId, function (error, instance) {
            if (error || !instance) err();
            next();
        });
    }
    function hasFacilityId(err, next) {
        if (!this.FacilityId) return next();
        var Facility = Position.app.models.Facility;
        Facility.exists(this.FacilityId, function (error, instance) {
            if (error || !instance) err();
            next();
        });
    }
    function hasMeetingDay(err, next) {
        if (!this.MeetingDay) return next();
        Position.validatesInclusionOf('MeetingDay', {in: days});
        return next();
    }
    function hasMeetingStartHour(err, next) {
        if (!this.MeetingStartHour) return next();
        Position.validatesInclusionOf('MeetingStartHour', {in: hours});
        return next();
    }
    function hasMeetingStarMinute(err, next) {
        if (!this.MeetingStartMinute) return next();
        Position.validatesInclusionOf('MeetingStartMinute', {in: minutes});
        return next();
    }
    function hasMeetingEndHour(err, next) {
        if (!this.MeetingEndHour) return next();
        Position.validatesInclusionOf('MeetingEndHour', {in: hours});
        return next();
    }
    function hasMeetingEndMinute(err, next) {
        if (!this.MeetingEndMinute) return next();
        Position.validatesInclusionOf('MeetingEndMinute', {in: minutes});
        return next();
    }
};
