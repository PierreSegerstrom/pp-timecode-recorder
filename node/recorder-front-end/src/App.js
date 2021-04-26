import React, { useState } from 'react';
import ActionButton from './components/ActionButton';
import FileHandlingForm from './components/FileHandlingForm';
import './App.css';


const App = () => {
    const [showFileForm, setShowFileForm] = useState(false);

    return (
        <div className="App">
            <ActionButton
                revealFileForm = { () => setShowFileForm(true) }
            />
            <FileHandlingForm
                show = { showFileForm }
                hideFileForm = { () => setShowFileForm(false) }
            />
        </div>
    );
}

export default App;