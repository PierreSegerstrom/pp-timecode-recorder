const net = require('net');
const fs = require('fs');
const mailConfig = require('./mail-config');
const srtFunctions = require('./srt-functions');


// Load environment variables from .env-file
require('dotenv').config()
const PP_PORT = process.env.PP_PORT;
const PP_HOST = process.env.PP_HOST ? process.env.PP_HOST : 'localhost';
const PP_PASSWORD = process.env.PP_PASSWORD;


// Perserving state of server
let _recording = false;
let _currentFile = null;
let _lastFileName = "";


// Values necessary for continous handling of input
let _contentPrev;
let _contentCurr;
let _timePrev;
let _timeCurr;
let _outputString;
let _initTime;
let _identifier;



// *  -----  ***  -----    SOCKET SETUP    -----  ***  -----  * //


let socket = new net.Socket();

// Create socket and bind callbacks
socket.on('connect', connectEventHandler);
socket.on('data',    dataEventHandler);
socket.on('close',   closeEventHandler);
socket.on('error',   errorEventHandler);


// Connect to ProPresenter
makeConnection();




// *  -----  ***  -----    SOCKET HELPERS    -----  ***  -----  * //


function makeConnection() {
    console.log(`Connecting to ProPresenter ${PP_HOST}:${PP_PORT}...`);
    socket.connect(PP_PORT, PP_HOST);
}


function connectEventHandler() {
    console.log('Connected');

    // Login message
    // * ProPresenter 7
    // socket.write(`{"pwd":avteam,"ptl":610,"acn":"ath"}`);
    // * ProPresenter 6
    socket.write(`<StageDisplayLogin>${PP_PASSWORD}</StageDisplayLogin>\r\n`);
}


function dataEventHandler(XMLmessage) {
    // Not recording? Then abort handling data
    if (!_recording) {
        console.log("Not recording. Aborting handling of data message.");
        return;
    }

    // *  -----  ***  -----    Get necessary values    -----  ***  -----  * //
    
    // Calculate timestamp
    _timeCurr = srtFunctions.getTimeStringSinceStart(_initTime);

    // Parse current slide
    _contentCurr = srtFunctions.extractContentFromXML(XMLmessage);

    // No content found in message
    if (_contentCurr == null)
        return;


    // *  -----  ***  -----    Additional checks    -----  ***  -----  * //
    
    // Omit message with zero time length
    if  ( _timePrev == _timeCurr )
        return;

    // Same output as before? Skip output
    else if ( _contentCurr == _contentPrev )
        return;


    // *  -----  ***  -----    Preparing output (based on previous message)    -----  ***  -----  * //

    // Parse SRT-formatted output string
    _outputString = `${_identifier}\n${_timePrev} --> ${_timeCurr}\n${_contentPrev}\n\n`;

    // SRT-files don't accept empty content, we must skip it!
    let emptySlide = ( _contentPrev == "" );

    // Prepare for next message
    _timePrev = _timeCurr;
    _contentPrev = _contentCurr;

    // Blank content? Skip writing it to file
    if ( emptySlide )
        return;


    // *  -----  ***  -----    Sending output    -----  ***  -----  * //

    fs.promises.appendFile(_currentFile, _outputString)
        .then((err) => {
            if (err) throw err;
            console.log(`Wrote to file:\n"${_outputString}"\n`);
            // Only increase identifier if output was successful
            _identifier++;
        })
        .catch(err => console.error(err));
}


function closeEventHandler() {
    console.log('Connection closed. Trying to reconnect...');
    // Try again to reconnect after a second
    setTimeout(makeConnection, 1000);
}


function errorEventHandler() {
    // console.error('Recieved error from socket.');
}








// *  -----  ***  -----    EXPRESS SETUP    -----  ***  -----  * //


const express = require('express');
const app = express();
const cors = require('cors');
const EXPRESS_PORT = process.env.SERVER_PORT;
const EXPRESS_IP = process.env.SERVER_IP;


// Parsing middleware
app.use(cors());
app.use(express.json());


app.get('/api/recording', (req, res) =>
{
    res.send(_recording);
});


app.post('/api/recording_start', (req, res) =>
{
    if (_recording)
    {
        // Status 409: Conflict
        res.sendStatus(409);
    }
    else
    {
        initFileRecording();
        res.sendStatus(200);
    }
});


app.post('/api/recording_stop', (req, res) =>
{
    if (!_recording)
    {
        // Status 409: Conflict
        res.sendStatus(409);
    }
    else
    {
        stopFileRecording();
        res.sendStatus(200);
    }
});


app.post('/api/mail_renamed_file', (req, res) =>
{
    const newFileName = req.body.newFileName;
    let mailOptions = mailConfig.getMailOptions(_initTime);

    // Who to send to?
    mailOptions.to = 'pierre.segerstrom@gmail.com';

    // Add SRT-file as attachment
    mailOptions.attachments = [{
        filename: `${newFileName}.srt`,
        path: `./srt-files/${_lastFileName}.srt`
    }];
           
    mailConfig.mailTransporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error(`Error occured while sending mail: ${err}`);
            // Status: Internal server error
            res.sendStatus(500);
            return;
        }
        console.log(`Email sent, recieved SMTP response: "${info.response}"`);
        // Status: OK
        res.sendStatus(200);
    });
});


// Start Express backend
app.listen(EXPRESS_PORT, EXPRESS_IP, () => {
    console.log(`Example app listening at http://${EXPRESS_IP}:${EXPRESS_PORT}`);
});




// *  -----  ***  -----    EXPRESS HELPERS    -----  ***  -----  * //

function initFileRecording() {
    // Start timer
    _initTime = Date.now();

    fs.promises.open(`./srt-files/${_initTime}.srt`, 'w')
        .then(data => {
            // Storing file handle to file
            _currentFile = data;
            console.log(`Created .srt-file, called "${_initTime}"`);
        })
        .catch(err => console.error(err));

    // Reset values for printing to file
    _contentPrev = "";
    _contentCurr = "";
    _timePrev = "00:00:00,000";
    _timeCurr = "";
    _outputString = "";
    _identifier = 1;

    // Set state
    _recording = true;
    console.log("[REC STATUS]: Started");
}


function stopFileRecording() {
    // Close handle to file
    _currentFile.close();
    
    // Save name of last finished file
    _lastFileName = _initTime;

    // Set state
    _recording = false;
    console.log("[REC STATUS]: Stopped");
}