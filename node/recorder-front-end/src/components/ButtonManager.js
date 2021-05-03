import React, { useState, useEffect } from 'react';
import { animated, useSpring, useTransition } from 'react-spring';

import './ButtonManager.css';
import { RecordButton, StopButton, LoadingButton } from './Buttons';

const { REACT_APP_SERVER_IP, REACT_APP_SERVER_PORT } = process.env;

const parseTimeString = (totalTimeDuration) =>
{
    let timeInSeconds = Math.floor(totalTimeDuration / 1000);

    let hours = Math.floor(timeInSeconds/60/60);
    timeInSeconds -= hours * 60 * 60;

    let minutes = Math.floor(timeInSeconds/60);
    timeInSeconds -= minutes * 60;

    return  `${hours.toString().padStart(1, "0")}` +
            `:${minutes.toString().padStart(2, "0")}` +
            `:${timeInSeconds.toString().padStart(2, "0")}`;
}

const ActionButton = (props) =>
{
    const [isRecording, setIsRecording] = useState(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [showTimeDuration, setShowTimeDuration] = useState(false);

    useEffect(() => {
        fetch(`http://${REACT_APP_SERVER_IP}:${REACT_APP_SERVER_PORT}/api/recording/`, { method: "GET" })
            .then(res => res.json())
            .then(data => {
                setIsRecording(data);
            });
    }, []);

    useEffect(() => {
        fetch(`http://${REACT_APP_SERVER_IP}:${REACT_APP_SERVER_PORT}/api/recording_duration/`, { method: "GET" })
            .then(res => res.json())
            .then(data => {
                setRecordingDuration(data.recordingDuration);
            });
    // When recording state is updated in app, re-run (get time)
    }, [showTimeDuration]);

    // Update timer each second
    useEffect(() => {
        const interval = setInterval(() => {
            setRecordingDuration(t => t + 1000);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const moveStop = useTransition(isRecording, {
        from: {
            y: 100,
            height: '0vmin',
            opacity: 0
        },
        enter: {
            y: 0,
            height: '50vmin',
            opacity: 1
        },
        leave: {
            y: 100,
            height: '0vmin',
            opacity: 0
        }
    });

    const moveRecording = useSpring({
        from: {
            height: '50vmin',
            marginBottom: '0vmin',
        },
        to: {
            height: '10vmin',
            marginBottom: '10vmin',
        },
        config: {
            friction: 25
        },
        cancel: !isRecording,
        onRest() {
            setShowTimeDuration(true);
        }
    }); 

    const revealTime = useSpring({
        from: {
            opacity: 0,
            x: -10,
            width: 0
        },
        to: {
            opacity: 1,
            x: 0,
            width: 90
        },
        config: {
            friction: 25
        },
        cancel: !showTimeDuration
    }); 

    if (isRecording == null)
        return <LoadingButton />;

    return <div className='button-container'>
        <animated.div className='recording-container' style={moveRecording} >
            <RecordButton
                isRecording = { isRecording }
                startRecording = { () => setIsRecording(true) }
            />
            <animated.div className='time-container' style={revealTime}>
                <div>{parseTimeString(recordingDuration)}</div>
            </animated.div>
        </animated.div>
        {moveStop((styles, item) => (
            item &&
            <animated.div style={styles}>
                <StopButton
                    stopRecording = { () => setIsRecording(false) }
                    hideButtons = { props.hideButtons }
                />
            </animated.div>
        ))}
    </div>
}

export default ActionButton;