const nodemailer = require("nodemailer");

const getEnv = (prefix, key) => process.env[`${prefix}_${key}`] || process.env[`SMTP_${key}`];

const getSmtpConfig = (prefix = "SMTP") => ({
  host: getEnv(prefix, "HOST"),
  port: Number(getEnv(prefix, "PORT") || 587),
  secure: String(getEnv(prefix, "SECURE") || "false").toLowerCase() === "true",
  auth: {
    user: getEnv(prefix, "USER") || getEnv(prefix, "EMAIL"),
    pass: getEnv(prefix, "PASS") || getEnv(prefix, "PASSWORD"),
  },
  from: getEnv(prefix, "FROM") || getEnv(prefix, "USER") || getEnv(prefix, "EMAIL"),
});

const createTransporter = (prefix) => {
  const config = getSmtpConfig(prefix);

  if (!config.host || !config.auth.user || !config.auth.pass) {
    throw new Error("SMTP configuration is incomplete");
  }

  return {
    transporter: nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT || 10000),
      greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT || 10000),
      socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT || 15000),
      auth: config.auth,
    }),
    from: config.from,
  };
};

const getLoginUrl = () => {
  return process.env.LOGIN_URL || process.env.FRONTEND_URL || "http://localhost:5173";
};

const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const sendCredentialEmail = async ({
  to,
  name,
  collegeName,
  username,
  temporaryPassword,
  roleLabel = "Admin",
  smtpPrefix = "SMTP",
  replyTo,
}) => {
  const { transporter, from } = createTransporter(smtpPrefix);
  const loginUrl = getLoginUrl();

  const subject = `${roleLabel} account credentials`;
  const text = [
    `Hello ${name || roleLabel},`,
    "",
    `Your ${roleLabel} account has been created.`,
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
    <p>Hello ${escapeHtml(name || roleLabel)},</p>
    <p>Your ${escapeHtml(roleLabel)} account has been created.</p>
    <ul>
      <li><strong>College:</strong> ${escapeHtml(collegeName)}</li>
      <li><strong>Username:</strong> <code>${escapeHtml(username)}</code></li>
      <li><strong>Temporary Password:</strong> <code>${escapeHtml(temporaryPassword)}</code></li>
      <li><strong>Login URL:</strong> <a href="${escapeHtml(loginUrl)}">${escapeHtml(loginUrl)}</a></li>
    </ul>
    <p>Please log in with this temporary password and create a new password immediately.</p>
    <p>You will not be able to access the dashboard until your new password is created. After that, this temporary password will no longer work.</p>
  `;

  return transporter.sendMail({ from, to, subject, text, html, replyTo });
};

const sendSubSuperAdminWelcomeEmail = (data) => {
  return sendCredentialEmail({
    ...data,
    roleLabel: "College Sub Super Admin",
    smtpPrefix: "SMTP",
  });
};

module.exports = {
  sendCredentialEmail,
  sendSubSuperAdminWelcomeEmail,
};
