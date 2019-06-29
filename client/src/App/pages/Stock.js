import React, { Component } from 'react';

class Stock extends Component {
    // Initialize the state
    constructor(props){
        super(props);
        this.state = {
            symbol: this.props.location.pathname,
            list: []
        }
    }

    // Fetch the list on first mount
    componentDidMount() {
        this.getStock();
    }

    // Retrieves the list of items from the Express app
    getStock = () => {
        fetch('/api/' + this.state.symbol) 
            .then(res => res.json())
            .then(list => this.setState({ list }))
    }

    render() {
        const { list } = this.state;

        return (
            <div className="App">
                <h1>List of Items</h1>
                {/* Check to see if any items are found*/}
                {list.length ? (
                    <div>
                        {/* Render the list of items */}
                        {list.map((item) => {
                            return(
                                <div>
                                    {item}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div>
                        <h2>No List Items Found</h2>
                    </div>
                )
                }
            </div>
        );
    }
}

export default Stock;

/*
LOADING CSS:
<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
*/