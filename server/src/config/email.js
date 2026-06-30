import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create Email Transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify Connection
transporter.verify().then(() => {
  console.log('✅ Email service connected successfully');
}).catch(error => {
  console.warn('⚠️  Email service not available:', error.message);
});

export default transporter;
