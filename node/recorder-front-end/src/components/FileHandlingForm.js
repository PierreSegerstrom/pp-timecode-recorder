import React, { useState } from 'react';
import { animated, useSpring } from 'react-spring';

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

    const [runShake, setRunShake] = useState(false);
    const shake = useSpring({
        from: { x: 0 },
        to: { x: 1 },
        config: {
            mass: 1.0,
            tension: 2000,
            friction: 25.0
        },
        cancel: !runShake,
        reset: runShake,
        onRest() { setRunShake(false); }
    });

    return (
        <div>
            <form onSubmit={ (e) => {
                e.preventDefault();
                if (fileName) sendMail(fileName);
                else setRunShake(true);
            }}>
                <label>
                    { status }
                    <animated.input style={{
                        transform: shake.x
                        .to({
                          range: [0, 0.10, 0.20, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
                          output: [0, 20, -20, 15, -15, 10, -10, 5, 0]
                        })
                        .to(x => `translate3d(${x}px, 0px, 0px)`)
                    }}
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