const getWelcomeEmailTemplate = (fullName, userId, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .user-id { background: #fff; border: 2px solid #dc2626; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; text-align: center; color: #dc2626; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to TerritorioPoker!</h1>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>Thank you for joining TerritorioPoker! We're excited to have you as part of our poker community.</p>
          
          <div class="user-id">
            Your Player ID: ${userId}
          </div>
          
          <p><strong>Important:</strong> Save your Player ID. You can use it to log in along with your email address.</p>
          
          <p>To complete your registration, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666; font-size: 12px;">${verificationUrl}</p>
          
          <p><strong>This link will expire in 24 hours.</strong></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <h3>What's Next?</h3>
          <ul>
            <li>Verify your email address</li>
            <li>Complete your profile</li>
            <li>Join your first game</li>
            <li>Connect with other players</li>
          </ul>
          
          <p>If you didn't create this account, please ignore this email or contact our support team.</p>
          
          <p>Best regards,<br>The TerritorioPoker Team</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 TerritorioPoker. All rights reserved.</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getVerificationSuccessTemplate = (fullName, userId) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .success-icon { font-size: 60px; text-align: center; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Email Verified Successfully!</h1>
        </div>
        <div class="content">
          <div class="success-icon">🎉</div>
          <h2>Congratulations, ${fullName}!</h2>
          <p>Your email has been successfully verified. Your account is now fully activated!</p>
          <p><strong>Your Player ID:</strong> ${userId}</p>
          <p>You can now log in and start playing poker with players from around the world.</p>
          <p>See you at the tables!</p>
          <p>Best regards,<br>The TerritorioPoker Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  getWelcomeEmailTemplate,
  getVerificationSuccessTemplate,
};