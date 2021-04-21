import React, { Component } from 'react';
import './FileHandlingForm.css';

class FileHandlingForm extends Component
{
    constructor(props)
    { 
        super(props);
        this.state = {
            newFileName: ""
        };
    }

    updateWithText = (event) => {
        this.setState({newFileName: event.target.value});
    }

    render()
    {
        if ( this.props.show )
        {
            return (
                <div className="formContainer">
                    <form onSubmit={ (e) => {
                        e.preventDefault();
                        if (this.state.newFileName) this.props.send(this.state.newFileName)
                    } }>
                        <label>
                            Filnamn:
                            <input type="text" value={`${this.state.newFileName}`} placeholder="[filnamn].srt" onChange={this.updateWithText} />
                        </label>
                        <input className="submitButton" type="submit" value="Skicka" />
                    </form>
                </div>
            );
        }
        else
        {
            return null;
        }
    }
}

export default FileHandlingForm;