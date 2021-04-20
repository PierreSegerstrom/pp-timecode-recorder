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
                <form onSubmit={ () => this.props.send(this.state.newFileName) }>
                    <label>
                        Nytt filnamn:
                        <input type="text" value={this.state.newFileName} onChange={this.updateWithText} />
                    </label>
                    <input type="submit" value="Skicka email" />
                </form>
            );
        }
        else
        {
            return null;
        }
    }
}

export default FileHandlingForm;