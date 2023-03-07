'use strict';

module.exports = function (app, cb) {
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * http://docs.strongloop.com/display/public/LB/Working+with+LoopBack+objects
   * for more info.
   */
  const Member = app.models.Member;
  const Role = app.models.Role;
  const RoleMapping = app.models.RoleMapping;

  const roleExists = (name, callback) => {
    Role.find({
      where: {
        name: name
      }
    }, (err, models) => {
      if (err) return callback(err, null);
      if (models.length == 0) return callback(null, false);
      callback(null, models[0]);
    })
  };

  const attachRoleToUser = (role, user, callback) => {
    role.principals.create({
      principalType: RoleMapping.USER,
      principalId: user.id
    }, (err, principalId) => {
      if (err) return callback(err);
      callback(null, principalId);
    })
  };

  const createRole = (name, callback) => {
    Role.create({
      name: name
    }, (err, role) => {
      if (err) return callback(err);
      return callback(null, role);
    })
  };

  // testUserDefinition
  const testUser = {
    email: 'agente@revee.it',
    password: 'revee1234',
    MemberName: 'Agente',
    MemberSurname: 'Revee',
    MemberPhoneNumber: '00393214567890',
    Admin: true,
    Disabled: false 
  }


  // if testUserDoesNotExists, create it
  Member.findOrCreate({
    where: {
      email: testUser.email
    }
  }, testUser, (err, user) => {
    if (err) return console.error(err);
    console.log(user);
    const roleName = 'admin';
    roleExists(roleName, (err, role) => {
      if (err) return console.log(err);
      if (!role) {
        console.log('Admin role does not exists yet, creating now...');
        return createRole(roleName, (err, role) => {
          if (err) return console.log(err);
          console.log('Admin role created');
          console.log(role);
          attachRoleToUser(role, user, (err, principalId) => {
            if (err) return console.log(err);
            console.log('Role attached to user');
            console.log(principalId);
            return cb();
          })
        })
      }
      console.log('Admin role already exists, attaching to user...');
      attachRoleToUser(role, user, (err, principalId) => {
        if (err) return console.log(err);
        console.log('Role attached to user');
        console.log(principalId);
        return cb();
      })
    })
  });

};

