import nodemailer from "nodemailer";
/**
 * @async
 * @example
 * await sendEmail({
 *   to: "recipient@example.com",
 *   subject: "Hello",
 *   message: "This is a test email",
 *   html: "<h1>This is HTML content</h1>"
 * });
 */
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Bessa 3mk aka(BESS GATES)",
    to: options.to,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
