const sgMail = require('@sendgrid/mail');

async function recovery(req, user) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    let link = `http://localhost:3000/user/reset/${user.resetPasswordToken}`;
    const mail = {
        to: user.email,
        from: process.env.FROM_EMAIL,
        subject: "Connotate: Password change request",
        text: `Hi ${user.firstName} ${user.lastName} \n 
                Please click on the following link ${link} to reset your password. \n\n 
                If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };
    return new Promise((resolve, reject) => {
        sgMail.send(mail, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        });
    });
}

async function reset(user) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const mail = {
        to: user.email,
        from: process.env.FROM_EMAIL,
        subject: "Connotate: Password was updated",
        text: `Hi ${user.firstName} ${user.lastName} \n 
                This is a confirmation that the password for your account ${user.email} on Connotate has just been changed.\n`
    };
    return new Promise((resolve, reject) => {
        sgMail.send(mail, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        });
    });
}
module.exports = {recovery, reset};
