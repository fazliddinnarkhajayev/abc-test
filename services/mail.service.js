const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fazliddinnarkhajayev@gmail.com',
      pass: 'whhn alna ubgz lowe', 
    },
  });

  async function sendMail(to, subject, text) {
    try {
    const mailOptions = {
      from: 'fazliddinnarkhajayev@gmail.com',
      to,
      subject,
      text
    };

      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      return info
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
  module.exports = { sendMail };