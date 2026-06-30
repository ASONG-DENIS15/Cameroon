import transporter from '../config/email.js';

/**
 * Send Welcome Email
 */
export const sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Cameroon Tourism - Africa in Miniature',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #009639 0%, #CE1126 100%); color: white; padding: 40px; text-align: center;">
            <h1>Welcome to Cameroon Tourism!</h1>
            <p style="font-size: 18px; margin: 20px 0;">Africa in Miniature</p>
          </div>
          <div style="padding: 40px; background-color: #f8f9fa;">
            <p>Hello <strong>${name}</strong>,</p>
            <p>Welcome to Cameroon Tourism Website! We're excited to have you on board.</p>
            <p>Explore our 30+ attractions across all regions of Cameroon, make bookings, and create unforgettable memories.</p>
            <p style="margin-top: 30px;">Happy exploring!<br><strong>Cameroon Tourism Team</strong></p>
          </div>
          <div style="background-color: #e9ecef; padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>&copy; 2024 Cameroon Tourism. All rights reserved.</p>
          </div>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
};

/**
 * Send Email Verification
 */
export const sendVerificationEmail = async (email, verificationLink) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify Your Email - Cameroon Tourism',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #009639 0%, #CE1126 100%); color: white; padding: 40px; text-align: center;">
            <h1>Verify Your Email</h1>
          </div>
          <div style="padding: 40px; background-color: #f8f9fa;">
            <p>Thank you for registering with Cameroon Tourism!</p>
            <p>Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="background-color: #009639; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email
              </a>
            </div>
            <p>Or copy this link: <a href="${verificationLink}">${verificationLink}</a></p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">This link expires in 24 hours.</p>
          </div>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
};

/**
 * Send Password Reset Email
 */
export const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Reset Your Password - Cameroon Tourism',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #009639 0%, #CE1126 100%); color: white; padding: 40px; text-align: center;">
            <h1>Reset Your Password</h1>
          </div>
          <div style="padding: 40px; background-color: #f8f9fa;">
            <p>We received a request to reset your password.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #CE1126; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>Or copy this link: <a href="${resetLink}">${resetLink}</a></p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">This link expires in 1 hour.</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
};

/**
 * Send Booking Confirmation Email
 */
export const sendBookingConfirmationEmail = async (email, bookingData) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Booking Confirmation - ${bookingData.attractionTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #009639 0%, #CE1126 100%); color: white; padding: 40px; text-align: center;">
            <h1>Booking Confirmed!</h1>
          </div>
          <div style="padding: 40px; background-color: #f8f9fa;">
            <p>Dear ${bookingData.userName},</p>
            <p>Your booking has been confirmed. Here are your details:</p>
            <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3>${bookingData.attractionTitle}</h3>
              <p><strong>Booking Number:</strong> ${bookingData.bookingNumber}</p>
              <p><strong>Date:</strong> ${bookingData.bookingDate}</p>
              <p><strong>Visitors:</strong> ${bookingData.totalVisitors} (${bookingData.adults} adults, ${bookingData.children} children)</p>
              <p><strong>Total Price:</strong> XAF ${bookingData.totalPrice}</p>
              <p><strong>Status:</strong> <span style="color: #009639; font-weight: bold;">${bookingData.status}</span></p>
            </div>
            <p>Please arrive 15 minutes before your scheduled visit.</p>
            <p>For any questions, contact us at ${process.env.EMAIL_FROM}</p>
          </div>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    return false;
  }
};

/**
 * Send Contact Form Reply
 */
export const sendContactReplyEmail = async (email, name, reply) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Response to Your Inquiry - Cameroon Tourism',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #009639 0%, #CE1126 100%); color: white; padding: 40px; text-align: center;">
            <h1>We've Responded to Your Inquiry</h1>
          </div>
          <div style="padding: 40px; background-color: #f8f9fa;">
            <p>Hello ${name},</p>
            <p>Thank you for contacting Cameroon Tourism. Here's our response:</p>
            <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #009639;">
              ${reply}
            </div>
            <p>Best regards,<br><strong>Cameroon Tourism Team</strong></p>
          </div>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Failed to send contact reply email:', error);
    return false;
  }
};
