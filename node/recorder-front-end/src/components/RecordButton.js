import './RecordButton.css';

const RecordButton = props =>
{
    switch ( props.isRecording )
    {
        case false:
            // TODO: Render "start-image"
            return (
                <button onClick={ props.start }>
                    Starta!
                </button>
            );
        case true:
            // TODO: Render "stop-image"
            return (
                <button onClick={ props.stop }>
                    Stoppa.
                </button>
            );
        // Awaiting state of recording via fetch
        default:
            // TODO: Render "loading-gif"
            return null;
    }
}

export default RecordButton;