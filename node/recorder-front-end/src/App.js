import React, { useState } from 'react';
import { useTransition, animated } from 'react-spring'

import ActionButton from './components/ActionButton';
import FileHandlingForm from './components/FileHandlingForm';
import './App.css';


const App = () => {
    const [showFileForm, setShowFileForm] = useState(false);

    const slideUpFade = useTransition(showFileForm, {
        from:   { y: 100,   opacity: 0 },
        enter:  { y: 0,     opacity: 1 },
        leave:  { y: 100,   opacity: 0 }
    });

    return (
        <div className="App">
            <ActionButton
                revealFileForm = { () => setShowFileForm(true) }
            />
            {slideUpFade(({y, opacity}, item) => (
                item &&
                <animated.div style={{ opacity: opacity }} className="overlay">
                    <animated.div style={{ y: y }}>
                        <FileHandlingForm
                            hideFileForm = { () => setShowFileForm(false) }
                        />
                    </animated.div>
                </animated.div>
            ))}
        </div>
    );
}

export default App;