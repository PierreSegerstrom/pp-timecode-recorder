import React, { useState } from 'react';
import './FileHandlingForm.css';


const FileHandlingForm = (props) => {
    const [fileName, setFileName] = useState('');

    return (
        <div>
            { props.show &&
                <div className="formContainer">
                    <form onSubmit={ (e) => {
                        e.preventDefault();
                        if (fileName) props.send(fileName);
                    }}>
                        <label>
                            Filnamn:
                            <input
                                type="text"
                                value={fileName}
                                placeholder="[filnamn].srt"
                                onChange={(e) => setFileName(e.target.value)}
                            />
                        </label>
                        <input
                            className="submitButton"
                            type="submit"
                            value="Skicka"
                        />
                    </form>
                </div>
            }
        </div>
    );
}

export default FileHandlingForm;