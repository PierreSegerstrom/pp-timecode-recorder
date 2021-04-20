const nodemailer = require('nodemailer');


const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'propresenter.recorder@gmail.com',
        pass: 'avteam!!'
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
        from: 'ProPresenter Recorder <propresenter.recorder@gmail.com>',
        subject: `SRT-fil: Från ${recDateString}`
    };
}


module.exports = { mailTransporter, getMailOptions };