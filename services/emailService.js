// services/emailService.js
const { sendEmail } = require('../config/email');
const { 
  getWelcomeEmailTemplate, 
  getVerificationSuccessTemplate 
} = require('../utils/emailTemplates');

/**
 * Send welcome email with verification link
 */
const sendWelcomeEmail = async (user, verificationToken) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    const emailHtml = getWelcomeEmailTemplate(user.fullName, user.userId, verificationUrl);
    
    const result = await sendEmail({
      to: user.email,
      subject: 'Welcome to TerritorioPoker - Verify Your Email',
      html: emailHtml,
    });

    return result;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send email verification success notification
 */
const sendVerificationSuccessEmail = async (user) => {
  try {
    const emailHtml = getVerificationSuccessTemplate(user.fullName, user.userId);
    
    const result = await sendEmail({
      to: user.email,
      subject: 'Email Verified - Welcome to TerritorioPoker!',
      html: emailHtml,
    });

    return result;
  } catch (error) {
    console.error('Error sending verification success email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendVerificationSuccessEmail,
};