import React, { Component } from 'react';
import RecordButton from './components/RecordButton';
import FileHandlingForm from './components/FileHandlingForm';
import './App.css';

class App extends Component
{
    constructor(props)
    { 
        super(props);
        this.state = {
            recording: null,
            showFileActions: false
        };
    }

    checkRecordingStatus()
    {
        fetch("/api/recording/", { method: "GET" })
            .then(res => res.json())
            .then(data => {
                this.setState({ recording: data });
            });
    }

    startRecording = () =>
    {
        fetch("/api/recording_start", { method: "POST" })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Recording is already running!");
                }
                // If response was okay, set state
                this.setState({ recording: true });
                console.log("Started recording!");
            })
            .catch(err => console.error(err));
    }

    stopRecording = () =>
    {
        fetch("/api/recording_stop", { method: "POST" })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Recording is not active.");
                }
                // If response was okay, set state
                this.setState({ recording: false, showFileActions: true });
                console.log("Stopped recording, awaiting instructions for next action.");
            })
            .catch(err => console.error(err));
    }

    sendMail = (newFileName) =>
    {
        // Reset state once function is called
        this.setState({ showFileActions: false });

        // Proceed to send mail
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
                console.log("Sent email!");
            })
            .catch(err => {
                console.error(err);
            });
    }
    

    // *  -----  ***  -----    LIFE CYCLE    -----  ***  -----  * //

    componentDidMount()
    {
        // Update state based on API request
        this.checkRecordingStatus();
    }

    render()
    {
        return (
            <div className="App">
                <RecordButton
                    isRecording = {this.state.recording}
                    start = {this.startRecording}
                    stop = {this.stopRecording}
                />
                <FileHandlingForm
                    show = {this.state.showFileActions}
                    send = {this.sendMail}
                />
            </div>
        );
    }
}

export default App;