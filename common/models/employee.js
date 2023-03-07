'use strict';

module.exports = function (Employee) {
    const errLog = {
        code: 'notFound.relatedInstance',
        message: 'related instance not found'
    };

    Employee.validateAsync('CategoryId', hasCategoryId, errLog);

    function hasCategoryId(err, next) {
        if (!this.CategoryId) return next();
        var Category = Employee.app.models.Category;
        Category.exists(this.CategoryId, function (error, instance) {
            if (error || !instance) err();
            next();
        });
    }

    Employee.sendPrivacyEmail = async (email) => {
        //libreria per gestione email
        require("../mailin.js");
        let employee = await Employee.findOne({ 'where': { 'EmployeeEmail': email } });

        if (!employee) throw "Impossibile trovare l'utente da questa email";

        var rec = new Object();
        rec[email] = `To ${employee.EmployeeName} ${employee.EmployeeSurname}`;
        var client = new Mailin("https://api.sendinblue.com/v2.0", "KZvD8L7jcUNJXISW");
        
        var data = {
            "to": rec,
            "from": ["noreply@revee.it", "Revée"],
            "subject": "Condizioni privacy",
            "html": getCustomizedEmail(employee.EmployeeSurname),
        }

        console.log(data);

        //invio email
        client.send_email(data).on('complete', (data) => {
            console.log(data);
        })
        return true;

    };

    //ricerca entità associata all'userEmail
    Employee.revokePrivacy = (email, cb) => {
        Employee.find({ where: { email: email } }, function (err, entity) {
            if (err) return cb(err);
            if (entity[0]) {
                Employee.updateAll({ EmployeeEmail: email }, { PrivacyAccepted: false, EmployeeName: "Privacy", EmployeeSurname: "Revocata", EmployeeBirthDate: null, EmployeePhoneNumber: "", EmployeeEmail: "", EmployeeTitle: "", EmployeeProfilePictureURL: "", Comment: "" }, function (err, info) {
                });
            }

        });

        cb(null, true);
    };

    Employee.remoteMethod('sendPrivacyEmail', {
        accepts: [
            { arg: 'email', type: 'string', required: true }
        ],
        http: { path: '/sendPrivacyEmail', verb: 'post' },
        returns: { arg: 'success', type: 'Boolean' }
    });

    Employee.remoteMethod('revokePrivacy', {
        accepts: [
            { arg: 'email', type: 'string', required: true }
        ],
        http: { path: '/revokePrivacy', verb: 'post' },
        returns: { arg: 'success', type: 'Boolean' }
    });
};

function getCustomizedEmail(surname) {
    let mailToBeSent = `Gentile Dott. ${surname}, <br>
con la presente la Revee srl, al seguito dell’incontro con il nostro informatore medico scientifico, chiede il Suo consenso per l’inserimento dei Suoi dati  nel ns database dedicato ai clienti che ha come unica finalità una gestione ottimale del rapporto professionale (per coordinare meglio le visite dei nostri informatori medico scientifici). <br>
Per tale motivo, avremo necessità di trattare i suoi dati personali, come potrà leggere nell'informativa estesa che mettiamo a disposizione al seguente link <a href=\"https://www.revee.it/privacy-app/Rev%C3%A8e%20-%20informativa%20App.pdf\">Informativa Privacy</a>.<br>
In ogni momento potrà revocare il consenso al trattamento dei suoi dati a questo link: <a href=\"https://www.revee.it/privacy-app\">Revoca consenso privacy</a>. <br>
Cordiali Saluti, <br>
Revée Team`;

    return mailToBeSent;
}