import recordButtonImage from '../pics/record.svg';
import stopButtonImage from '../pics/stop.svg';
import loadingImage from '../pics/loading.svg';


export const RecordButton = (props) =>
{
    const performRecord = () => {
        fetch("/api/recording_start", { method: "POST" })
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

    return (
        <img
            onClick = { performRecord }
            src = { recordButtonImage }
            alt = "Recording Button"
        />
    );
}


export const StopButton = (props) =>
{
    const performStop = () => {
        fetch("/api/recording_stop", { method: "POST" })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Recording is not active.");
                }
                // If response was okay, update state
                props.stopRecording();
                props.revealFileForm();
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