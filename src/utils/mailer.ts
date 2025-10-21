import nodemailer from 'nodemailer';

//* On configure le transporteur d'email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST as string,
  port: parseInt(process.env.EMAIL_PORT as string),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendEmail(options: { to: string, subject: string, html: string }): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_FROM as string,
    to: options.to as string | string[],
    subject: options.subject as string,
    html: options.html as string,
  };

  await transporter.sendMail(mailOptions);
}

export default sendEmail;