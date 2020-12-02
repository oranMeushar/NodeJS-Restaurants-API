const sgMail = require('@sendgrid/mail');

const sendEmail = (email, resetUrl) =>{
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email, 
      from: process.env.SENDER_MAILER,
      subject:'Password Reset',
      html:`<p>You requested a password reset.
      click this<a href="${resetUrl}">link</a> to change your password</p>`
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error(error)
      })
}

module.exports = sendEmail;
