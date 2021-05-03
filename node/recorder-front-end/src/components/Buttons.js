import { animated, useSpring } from 'react-spring';

import recordButtonImage from '../pics/record.svg';
import stopButtonImage from '../pics/stop.svg';
import loadingImage from '../pics/loading.svg';

// Env variables passed on during build, for dynamic binding of IP address
const { REACT_APP_SERVER_IP, REACT_APP_SERVER_PORT } = process.env;


export const RecordButton = (props) =>
{
    const performRecord = () => {
        fetch(`http://${REACT_APP_SERVER_IP}:${REACT_APP_SERVER_PORT}/api/recording_start/`, { method: "POST" })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Recording is already running!");
                }
                // If response was okay, update state
                props.startRecording();
                console.log("Started recording!");
            })
            .catch(err => console.error(err));
    }

    const pulsatingRecord = useSpring({
        from: { filter: 'contrast(100%) brightness(100%) saturate(50%) hue-rotate(0deg)', delay: 150 },
        to: [
            { filter: 'contrast(110%) brightness(110%) saturate(110%) hue-rotate(-5deg)' },
            { filter: 'contrast(100%) brightness(100%) saturate(50%) hue-rotate(0deg)', delay: 350 }
        ],
        loop: true,
        cancel: !props.isRecording,
        config: {
            duration: 800 // duration for the whole animation form start to end
        }
    });

    return (
        <animated.img style = { pulsatingRecord }
            onClick = { performRecord }
            src = { recordButtonImage }
            alt = "Recording Button"
        />
    );
}


export const StopButton = (props) =>
{
    const performStop = () => {
        fetch(`http://${REACT_APP_SERVER_IP}:${REACT_APP_SERVER_PORT}/api/recording_stop/`, { method: "POST" })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Recording is not active.");
                }
                // If response was okay, update state
                props.stopRecording();
                props.hideButtons();
                console.log("Stopped recording, awaiting instructions for next action.");
            })
            .catch(err => console.error(err));
    }
    
    return (
        <img
            onClick = { performStop }
            src = { stopButtonImage }
            alt = "Stop Button"
        />
    );
}


export const LoadingButton = () => {
    return (
        <img
            src = { loadingImage }
            alt = "Loading..."
        />
    )
}