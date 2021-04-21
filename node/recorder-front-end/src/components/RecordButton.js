import './RecordButton.css';
import recordButtonImage from '../pics/record.svg';
import stopButtonImage from '../pics/stop.svg';
import loadingImage from '../pics/loading.svg';

const RecordButton = props =>
{
    switch ( props.isRecording )
    {
        case false:
            return (
                <img
                    onClick = { props.start }
                    src = { recordButtonImage }
                    alt = "Recording Button"
                />
            );
        case true:
            return (
                <img
                    onClick = { props.stop }
                    src = { stopButtonImage }
                    alt = "Stop Button"
                />
            );
        // Awaiting state of recording via fetch
        default:
            return (
                <img
                    src = { loadingImage }
                    alt = "Loading..."
                />
            );
    }
}

export default RecordButton;