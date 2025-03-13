const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");
const pug = require("pug");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Nwosu Paul <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Use a real email service in production
      return nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false, // false for TLS, true for SSL
        auth: {
          user: "876b6b001@smtp-brevo.com", // Your Brevo email
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    } else {
      // Use Mailtrap for development
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.htmlToText(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcomeEmail", "Welcome to the Natours Family!");
  }
  async resetPassword() {
    await this.send(
      "passwordReset",
      "Your Password reset token (valid for 10mins)"
    );
  }
};
