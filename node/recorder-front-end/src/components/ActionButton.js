import './ActionButton.css';
import { RecordButton, StopButton, LoadingButton } from './Buttons';

const BUTTON_STATE = (start, stop) => ({
    false: <RecordButton action={start} />,
    true: <StopButton action={stop} />,
    null: <LoadingButton />
});

const ActionButton = (props) =>
{
    return <div>{ BUTTON_STATE(props.start, props.stop)[props.isRecording] }</div>
}

export default ActionButton;