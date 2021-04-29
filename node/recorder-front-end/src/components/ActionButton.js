import './ActionButton.css';
import { RecordButton, StopButton, LoadingButton } from './Buttons';
import React, { useState, useEffect } from 'react';

const { REACT_APP_SERVER_IP, REACT_APP_SERVER_PORT } = process.env;


const ActionButton = (props) =>
{
    const [isRecording, setIsRecording] = useState(null);

    useEffect(() => {
        fetch(`http://${REACT_APP_SERVER_IP}:${REACT_APP_SERVER_PORT}/api/recording/`, { method: "GET" })
            .then(res => res.json())
            .then(data => {
                setIsRecording(data);
            });
    }, []);

    switch (isRecording)
    {
        case true:
            return <StopButton
                stopRecording = { () => setIsRecording(false) }
                revealFileForm = { props.revealFileForm }
            />
        case false:
            return <RecordButton
                startRecording = { () => setIsRecording(true) }
            />
        default:
            return <LoadingButton />
    }
}

export default ActionButton;