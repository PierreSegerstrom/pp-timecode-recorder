import React, { useState } from 'react';
import './FileHandlingForm.css';

const { REACT_APP_SERVER_IP, REACT_APP_SERVER_PORT } = process.env;


const FileHandlingForm = (props) =>
{
    const [fileName, setFileName] = useState('');
    const [waitingOnEmail, setWaitingOnEmail] = useState(false);

    const sendMail = (newFileName) => {
        // Now waiting for "completed email confirmation"
        setWaitingOnEmail(true);

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
                props.hideFileForm();
                setFileName('');
                setWaitingOnEmail(false);
                console.log("Email was sent!");
            })
            .catch(err => {
                console.error(err);
            });
    }

    return (
        <div>
            <div className="formContainer">
                <form onSubmit={ (e) => {
                    e.preventDefault();
                    if (fileName) sendMail(fileName);
                }}>
                    <label>
                        { waitingOnEmail ? 'Skickar...' : 'Filnamn:' }
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
        </div>
    );
}

export default FileHandlingForm;