import nodemailer from 'nodemailer';
import { SMTP_USER, SMTP_PASS, SENDER_EMAIL } from '../config/env.js';

const transporter = nodemailer.createTransport({
    host: "smtp.brevo.com",   // smtp-relay requires whitelisted IPs; smtp.brevo.com uses API key only
    port: 587,
    secure: false,            // STARTTLS on port 587
    requireTLS: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    }
});

class MailOptions {
    constructor({ to, text, html, from = SENDER_EMAIL, subject }) {
        this.from = from;
        this.to = to;
        this.subject = subject || `Car Dealership Notification`;
        this.text = text || "Welcome to Car Dealership";
        this.html = html || "";
    }
}

// Email templates
const VERIFICATION_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .header {
            text-align: center;
            padding-bottom: 10px;
            border-bottom: 2px solid #4a90e2;
            margin-bottom: 20px;
        }
        .highlight {
            font-size: 24px;
            font-weight: bold;
            color: #4a90e2;
            letter-spacing: 5px;
            padding: 5px 10px;
            background-color: #f0f7ff;
            border-radius: 3px;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Email Verification</h1>
        </div>
        <p>Hello {{username}},</p>
        <p>Thank you for registering with Car Dealership. To verify your account, please use the following OTP:</p>
        <p style="text-align: center;">
            <span class="highlight">{{otp}}</span>
        </p>
        <p>This OTP will expire in 15 minutes. If you did not request this verification, please ignore this email.</p>
        <div class="footer">
            <p>&copy; 2025 Car Dealership. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
        </div>
    </div>
</body>
</html>
`;

const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .header {
            text-align: center;
            padding-bottom: 10px;
            border-bottom: 2px solid #e74c3c;
            margin-bottom: 20px;
        }
        .highlight {
            font-size: 24px;
            font-weight: bold;
            color: #e74c3c;
            letter-spacing: 5px;
            padding: 5px 10px;
            background-color: #fdefed;
            border-radius: 3px;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset</h1>
        </div>
        <p>Hello,</p>
        <p>We received a request to reset your password for your Car Dealership account ({{email}}). Please use the following OTP to reset your password:</p>
        <p style="text-align: center;">
            <span class="highlight">{{otp}}</span>
        </p>
        <p>This OTP will expire in 15 minutes. If you did not request this password reset, please contact support immediately.</p>
        <div class="footer">
            <p>&copy; 2025 Car Dealership. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
        </div>
    </div>
</body>
</html>
`;

const generateOTP = () => {
    return String(Math.floor(100000 + Math.random() * 900000));
};

export {
    transporter,
    MailOptions,
    VERIFICATION_TEMPLATE,
    PASSWORD_RESET_TEMPLATE,
    generateOTP
};
