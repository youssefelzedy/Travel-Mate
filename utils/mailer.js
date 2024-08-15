const nodemailer = require('nodemailer');

// Set up transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youssefsalah2272002@gmail.com',
    pass: 'zrok nmzo ryyh jyto'
  }
});
// Function to send verification email
const sendVerificationEmail = async (toEmail, verificationLink) => {

  const mailOptions = {
    from: 'youssefsalah2272002@gmail.com',
    to: toEmail,
    subject: 'Email Verification',
    html: `<p>Please verify your email by clicking the following link: <a href="${verificationLink}">Verify Email</a></p>`
  };
  try {
    await transporter.sendMail(mailOptions);

    console.log('Verification email sent to:', toEmail);
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

module.exports = sendVerificationEmail;

// exports.sendPasswordResetEmail = async (toEmail, resetToken) => {
//   const mailOptions = {
//     from: 'youssefsalah2272002@gmail.com',
//     to: toEmail,
//     subject: 'Password Reset',
//     html: `<p>Please reset your password by adding this token to your password reset form: <a href="${resetToken}">Reset Password</a></p>`
//   };
//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Password reset email sent to:', toEmail);
//   } catch (error) {
//     console.error('Error sending password reset email:', error);
//   }
// };


