import React, { useState } from 'react';
import { animated, useTransition } from 'react-spring';

import ButtonManager from './components/ButtonManager';
import FileHandlingForm from './components/FileHandlingForm';
import './App.css';


const App = () => {
    // Toggle between showing buttons (true), and showing "file form" (false)
    const [appState, setAppState] = useState(true);
    const toggleAppState = () => setAppState(b => !b);

    const toggleButtons = useTransition(appState, {
        from:   { y: 150,   opacity: 0 },
        enter:  { y: 0,     opacity: 1 },
        leave:  { y: -150,  opacity: 0 },
        config: {
            tension: 175,
            friction: 25.0
        }
    });

    const toggleFileForm = useTransition(!appState, {
        from:   { y: 150,   opacity: 0 },
        enter:  { y: 0,     opacity: 1 },
        leave:  { y: -200,  opacity: 0 },
        config: {
            tension: 175,
            friction: 25.0
        },
    });

    return (
        <div className="App">
            {toggleButtons((styles, item) => (
                item &&
                <animated.div style={styles}>
                    <ButtonManager
                        hideButtons = { toggleAppState }
                    />
                </animated.div>
            ))}
            {toggleFileForm(({y, opacity}, item) => (
                item &&
                <animated.div style={{ opacity: opacity }} className="overlay">
                    <animated.div style={{ y: y }}>
                        <FileHandlingForm
                            hideFileForm = { toggleAppState }
                        />
                    </animated.div>
                </animated.div>
            ))}
        </div>
    );
}

export default App;