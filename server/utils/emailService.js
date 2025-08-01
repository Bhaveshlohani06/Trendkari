import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
     host: process.env.EMAIL_HOST,         // smtp.zoho.in
  port: process.env.EMAIL_PORT,         // 465
  secure: true,                         // true for 465
  auth: {
    user: process.env.EMAIL_USER,       // admin@trendkari.in
    pass: process.env.ZOHO_PASS,       // App password (not normal Zoho password)
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};


// export const sendWelcomeEmail = async (user) => {
//   const subject = 'Welcome to Trendkari!';
//   const html = `
//     <h1>Hello ${user.name},</h1>
//     <p>Thank you for registering with Trendkari. We are excited to have you on board!</p>
//     <p>Your account details:</p>
//     <ul>
//       <li>Email: ${user.email}</li>
//       <li>Role: ${user.role}</li>
//       <li>Account created on: ${new Date(user.createdAt).toLocaleDateString()}</li>
//     </ul>
//     <p>Best regards,</p>
//     <p>The Trendkari Team</p>
//   `;
//   await sendEmail(user.email, subject, html);
// }