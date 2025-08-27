// import Brevo from "@getbrevo/brevo";

// export const sendEmail = async (to, subject, html) => {
//   const apiInstance = new Brevo.TransactionalEmailsApi();
//   apiInstance.setApiKey(
//     Brevo.TransactionalEmailsApiApiKeys.apiKey,
//     process.env.BREVO_API_KEY
//   );

//   const sendSmtpEmail = {
//     sender: { email: "admin@trendkari.in" }, 
//     to: [{ email: to }],
//     subject: subject,
//     htmlContent: html,
//   };

//   try {
//     const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
//     console.log("✅ Email sent:", response.messageId);
//   } catch (error) {
//     console.error("❌ Email send error:", error);
//   }
// };






import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true", // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER, // this will be 959b69001@smtp-brevo.com
      pass: process.env.EMAIL_PASS, // your SMTP key
    },
  });

  const mailOptions = {
    from: "admin@trendkari.in", // 👈 sender shown to recipients
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};


//