import dotenv from 'dotenv';
import nodemailer from 'nodemailer'

dotenv.config()

const emailConfig = {
    host: "mail.globaltradingcars.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    }
};

async function sendEmail(prop = { data, customerEmail, template, subject }) {

    const { data, customerEmail, template, subject } = prop;

    const transporter = nodemailer.createTransport(emailConfig);

    const mailOptions = {
        from: `"Global Trading Cars" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: subject,
        html: template(data)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully")
        return { data: info, success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { error: error.message || 'Unknown error', success: false };
    }
}


export default sendEmail 
