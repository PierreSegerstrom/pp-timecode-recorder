const nodemailer = require('nodemailer');

// Load environment variables from .env-file
require('dotenv').config()
const MAIL_ADDRESS = process.env.MAIL_ADDRESS;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD


const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: MAIL_ADDRESS,
        pass: MAIL_PASSWORD
    }
});


function getMailOptions(recordingStartTime)
{
    const recDate = new Date(recordingStartTime);
    const recDateString =
        `${recDate.getFullYear() - 2000}` +
        `-${(recDate.getMonth() + 1).toString().padStart(2, "0")}` +
        `-${recDate.getDate().toString().padStart(2, "0")}`;

    return {
        from: `ProPresenter Recorder <${MAIL_ADDRESS}>`,
        subject: `SRT-fil: Från ${recDateString}`
    };
}


module.exports = { mailTransporter, getMailOptions };