'use strict';

module.exports = function(Visit) {
    const errLog = {
        code: 'notFound.relatedInstance',
        message: 'related instance not found'
    };
    Visit.validateAsync('MemberId', hasMemberId, errLog);
    Visit.validateAsync('PositionId', hasPositionId, errLog);
    Visit.validateAsync('EmployeeId', hasEmployeeId, errLog);

    Visit.beforeRemote('find', function(ctx, unused, next) {
      if(typeof(ctx.args.filter) != "undefined") {
        if(ctx.args.filter['limit'] == -1)
          delete ctx.args.filter['limit'];
        }
        next();
    });
    /*function checkFirstVisit(err, next){
      var Employee = Visit.app.models.Employee;
      Employee.findById(this.EmployeeId, function (error, instance){
        if (error || !instance) err();
        instance.
        next();
      });
    }*/
    function hasMemberId(err, next) {
        if (!this.MemberId) return next();
        var Member = Visit.app.models.Member;
        Member.exists(this.MemberId, function (error, instance) {
            if (error || !instance) err();
            next();
        });
    }
    function hasPositionId(err, next) {
        if (!this.PositionId) return next();
        var Position = Visit.app.models.Position;
        Position.exists(this.PositionId, function (error, instance) {
            if (error || !instance) err();
            next();
        });
    }
    function hasEmployeeId(err, next) {
        if (!this.EmployeeId) return next();
        var empID = this.EmployeeId;
        var Employee = Visit.app.models.Employee;
        Employee.exists(this.EmployeeId, function (error, instance) {
            if (error || !instance) err();
            Employee.findById(empID, function(err, user)
            {
              if(user.FirstVisit == null || typeof(user.FirstVisit) == "undefined")
              {
                Employee.updateAll({id: empID}, {FirstVisit: Date.now()}, function(err, info) {
                });
              }
              Employee.updateAll({id: empID}, {LastVisit: Date.now()}, function(err, info) {
              });
            });

            next();
        });
    }
};
