import recordButtonImage from '../pics/record.svg';
import stopButtonImage from '../pics/stop.svg';
import loadingImage from '../pics/loading.svg';


export const RecordButton = (props) => {
    return (
        <img
            onClick = { props.action }
            src = { recordButtonImage }
            alt = "Recording Button"
        />
    );
}

export const StopButton = (props) => {
    return (
        <img
            onClick = { props.action }
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