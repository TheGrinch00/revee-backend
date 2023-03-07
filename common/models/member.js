'use strict';

module.exports = function (Member) {

  Member.changeMemberPassword = (id, newPassword, cb) => {
    Member.setPassword(id, newPassword, (err) => {
      if (err) return cb(err);
      cb(null, true);
    })
  };
  Member.changePW = (email, cb) => {
    require("../mailin.js");//libreria per gestione email

    var token = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    //Generazione casuale token
    for (var i = 0; i < 25; i++)
      token += possible.charAt(Math.floor(Math.random() * possible.length));
    Member.find({ where: { email: email } }, function (err, entity) {//ricerca entità associata all'userEmail
      if (err) return cb(err);
      if (!entity[0]) { return cb(null, false); }
      var Change = Member.app.models.changeRq;
      Change.create({ "token": token, "email": email, "date": Date.now() }, function (err, results) {//inserimento token in tabella change.rq (con data ed email)

        var reqID = results["id"];//recupero id (unico) token appena creato per poterlo inviare via email

        var rec = new Object();
        rec[email] = "to someone";

        var client = new Mailin("https://api.sendinblue.com/v2.0", "KZvD8L7jcUNJXISW");
        var data = {
          "to": rec,
          "from": ["noreply@revee.it", "Revée"],
          "subject": "Richiesta cambio password",
          "html": "Gentile utente, <br>Abbiamo ricevuto una richiesta di reimpostare la tua password tramite la funzione Password dimenticata?. <br>Precisiamo che non inviamo mai informazioni personali via email. La tua password &egrave; nota solo a te e rimane valida fino a quando non decidi di cambiarla o reimpostarla.<br>Per reimpostare la password, basta cliccare sul seguente link o incollarlo sul tuo browser. Il " + "link &egrave; valido solo per 24h.<br>Link reimpostazione: <br><br>" +
            "<a href=\"https://www.revee.it/cambio-password/?token=" + token + "&id=" + reqID + "\"> https://www.revee.it/cambio-password/?token=" + token + "&id=" + reqID + " </a>" +
            "<br> <br>Ti preghiamo di NON rispondere a questa email che &egrave; stata inviata automaticamente dal sistema.<br>Se non hai fatto questa richiesta, forse un altro utente ha immesso il tuo nome profilo per errore. Nel qual caso, basta ignorare questo messaggio ed effettuare l'accesso come al solito. Per la tua sicurezza, il link di reimpostazione verr&agrave; quindi annullato ma ti conisgliamo di cambiare comunque la passworkd.<br><br>Rev&eacute;e Team"
        }

        console.log(data);

        //invio email
        client.send_email(data).on('complete', function (data) {
          console.log(data);
        });

        cb(null, true);
      });
    });

  };
  Member.confNewPW = (id, token, newPassword, cb) => {
    var ChangeRQ = Member.app.models.changeRq;
    ChangeRQ.find({ where: { id: id } }, function (err, entity) {
      if (err) return cb(err);
      if (!entity[0]) { return cb(null, false); }
      var creationDate = entity[0]["date"];
      var foundToken = entity[0]["token"];
      var userEmail = entity[0]["email"];
      if (Date.now() - creationDate <= 60 * 60 * 1000 && foundToken == token)//contrllo che il token non sia scaduto ( durata token: 1 ora)
      {
        console.log(newPassword);
        Member.find({ where: { email: userEmail } }, function (err, entity) {//ricerca entità associata all'userEmail
          if (err) return cb(err);
          if (!entity[0]) { return cb(null, false); }
          var userID = entity[0]["id"];//prento id user
          Member.setPassword(userID, newPassword, (err) => {//imposto nuova password (metodo di loopback)
            if (err) return cb(err);
            //cb(null, true);
          });
        });
        ChangeRQ.destroyById(id, function (err) {//distuggo token associato alla richiesta
          console.log("Destoyed");
        });

        cb(null, true);
      }
      else {
        //in caso di token scaduto distuggo semplicemente il token restituendo false
        ChangeRQ.destroyById(id, function (err) {
          console.log("Destoyed");
        });
        cb(null, false);
      }
    });

  };
  Member.remoteMethod('changePW', {
    accepts: [
      { arg: 'email', type: 'string', required: true }
    ],
    http: { path: '/changePW', verb: 'post' },
    returns: { arg: 'success', type: 'Boolean' }
  });

  Member.remoteMethod('confNewPW', {
    accepts: [
      { arg: 'id', type: 'number', required: true },
      { arg: 'token', type: 'string', required: true },
      { arg: 'newPassword', type: 'string', required: true }
    ],
    http: { path: '/confNewPW', verb: 'post' },
    returns: { arg: 'success', type: 'Boolean' }
  });

  Member.remoteMethod('changeMemberPassword', {
    accepts: [
      { arg: 'id', type: 'number', required: true },
      { arg: 'newPassword', type: 'string', required: true }
    ],
    http: { path: '/:id/changeMemberPassword', verb: 'post' },
    returns: { arg: 'success', type: 'Boolean' }
  });
};
