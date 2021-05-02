import React, { useState } from 'react';
import './FileHandlingForm.css';

const { REACT_APP_SERVER_IP, REACT_APP_SERVER_PORT } = process.env;

const FormStatus = {
    READY: 'Filnamn:',
    SENDING: 'Skickar...',
    DONE: 'Skickat!'
}


const FileHandlingForm = (props) =>
{
    const [fileName, setFileName] = useState('');
    const [status, setStatus] = useState(FormStatus.READY);

    const sendMail = (newFileName) => {
        // Don't allow call if submission is already in process
        if (status !== FormStatus.READY) return;

        // Now waiting for "completed email confirmation"
        setStatus(FormStatus.SENDING);

        fetch(`http://${REACT_APP_SERVER_IP}:${REACT_APP_SERVER_PORT}/api/mail_renamed_file`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                newFileName
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Error while trying to send email.");
                }
                // Once mail is sent, update state
                setStatus(FormStatus.DONE);
                props.hideFileForm();
                console.log("Email was sent!");
            })
            .catch(err => {
                console.error(err);
            });
    }

    return (
        <div>
            <form onSubmit={ (e) => {
                e.preventDefault();
                if (fileName) sendMail(fileName);
            }}>
                <label>
                    { status }
                    <input
                        type="text"
                        value={fileName}
                        placeholder="[filnamn].srt"
                        onChange={(e) => setFileName(e.target.value)}
                    />
                </label>
                <input
                    className="submitButton"
                    type="submit"
                    value="Skicka"
                />
            </form>
        </div>
    );
}

export default FileHandlingForm;