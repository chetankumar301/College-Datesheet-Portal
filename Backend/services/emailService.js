const nodemailer = require("nodemailer");

const getSmtpConfig = () => ({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
  auth: {
    user: process.env.SMTP_USER || process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
  },
});

const createTransporter = () => {
  const config = getSmtpConfig();

  if (!config.host || !config.auth.user || !config.auth.pass) {
    throw new Error("SMTP configuration is incomplete");
  }

  return nodemailer.createTransport(config);
};

const getLoginUrl = () => {
  return process.env.LOGIN_URL || process.env.FRONTEND_URL || "http://localhost:5173";
};

const sendSubSuperAdminWelcomeEmail = async ({
  to,
  name,
  collegeName,
  username,
  temporaryPassword,
}) => {
  const transporter = createTransporter();
  const loginUrl = getLoginUrl();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || process.env.SMTP_EMAIL;

  const subject = "College Sub Super Admin account created";
  const text = [
    `Hello ${name || "College Sub Super Admin"},`,
    "",
    "Your College Sub Super Admin account has been created.",
    "",
    `College: ${collegeName}`,
    `Username: ${username}`,
    `Temporary Password: ${temporaryPassword}`,
    `Login URL: ${loginUrl}`,
    "",
    "Please log in with this temporary password and create a new password immediately.",
    "You will not be able to access the dashboard until your new password is created.",
    "After that, this temporary password will no longer work.",
  ].join("\n");

  const html = `
    <p>Hello ${name || "College Sub Super Admin"},</p>
    <p>Your College Sub Super Admin account has been created.</p>
    <ul>
      <li><strong>College:</strong> ${collegeName}</li>
      <li><strong>Username:</strong> ${username}</li>
      <li><strong>Temporary Password:</strong> ${temporaryPassword}</li>
      <li><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a></li>
    </ul>
    <p>Please log in with this temporary password and create a new password immediately.</p>
    <p>You will not be able to access the dashboard until your new password is created. After that, this temporary password will no longer work.</p>
  `;

  return transporter.sendMail({ from, to, subject, text, html });
};

module.exports = {
  sendSubSuperAdminWelcomeEmail,
};
