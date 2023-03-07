'use strict';

module.exports = function (app) {
  // Install a `/` route that returns server status
  var router = app.loopback.Router();

  const Member = app.models.Member;

  // deafult server response
  //router.get('/', app.loopback.status());

  // login route
  // Data la configurazione attuale del server serve "/revee/login"
  // prima era semplicemente "/login"
  router.post('/revee/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    Member.login({
      email,
      password
    }, 'user', (err, token) => {
      if (err) return res.status(err.statusCode).send(err);
      res.send(token);
    })
  });

  app.use(router);
/*
  router.get('/visits', function(req, res) {
    var filter = {
        where: {feedId: req.query.id},
        filter: req.query.filter,
        order : req.query.order
    };
    if(req.query.limit == -1)
    {
      var filter = {
          where: {feedId: req.query.id},
          order : req.query.order
      };
    }
    Visit.find(filter, function(err, visits) {
        res.send(visits);
    });
  });*/
};
