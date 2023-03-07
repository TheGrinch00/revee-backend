'use strict';

module.exports = function(Productvisit) {
    const errLog = {
        code: 'notFound.relatedInstance',
        message: 'related instance not found'
    };

    Productvisit.validateAsync('ProductId', hasProductId, errLog);
    Productvisit.validateAsync('VisitId', hasVisitId, errLog);

    function hasProductId(err, next) {
        if (!this.ProductId) return next();
        var Product = Productvisit.app.models.Product;
        Product.exists(this.ProductId, function (error, instance) {
            if (error || !instance) err();
            next();
        });
    }
    function hasVisitId(err, next) {
        if (!this.VisitId) return next();
        var Visit = Productvisit.app.models.Visit;
        Visit.exists(this.VisitId, function (error, instance) {
            if (error || !instance) err();
            next();
        });
    }
};
