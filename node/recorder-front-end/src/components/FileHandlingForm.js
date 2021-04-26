import React, { useState } from 'react';
import './FileHandlingForm.css';


const FileHandlingForm = (props) =>
{
    const [fileName, setFileName] = useState('');

    const sendMail = (newFileName) => {
        fetch("/api/mail_renamed_file", {
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
                console.log("Email was sent!");
            })
            .catch(err => {
                console.error(err);
            });
    }

    return (
        <div>
            { props.show &&
                <div className="formContainer">
                    <form onSubmit={ (e) => {
                        e.preventDefault();
                        if (fileName) sendMail(fileName);
                    }}>
                        <label>
                            Filnamn:
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
            }
        </div>
    );
}

export default FileHandlingForm;