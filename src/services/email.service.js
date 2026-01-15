const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendRFPEmail = async ({ to, subject, html }) => {
  const msg = {
    to:to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject:subject,
    html:html
  };

  await sgMail.send(msg);
};
