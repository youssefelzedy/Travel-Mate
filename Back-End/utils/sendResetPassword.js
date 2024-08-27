const nodemailer = require('nodemailer')

// Set up transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youssefsalah2272002@gmail.com',
    pass: 'zrok nmzo ryyh jyto'
  }
})

const sendPasswordResetEmail = async (toEmail, message) => {
  console.log(toEmail, message)
  const mailOptions = {
    from: 'youssefsalah2272002@gmail.com',
    to: toEmail,
    subject: 'Password Reset',
    text: message
  }
  try {
    await transporter.sendMail(mailOptions)
    console.log('Password reset email sent to:', toEmail)
  } catch (error) {
    console.error('Error sending password reset email:', error)
  }
}

module.exports = sendPasswordResetEmail
