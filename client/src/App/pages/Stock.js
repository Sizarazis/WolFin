import React, { Component } from 'react';

class Stock extends Component {
    // Initialize the state
    constructor(props){
        super(props);
        this.state = {
            symbol: this.props.location.pathname,
            response: []
        }
    }

    // Fetch the stock info on first mount
    componentDidMount() {
        this.getStock();
    }


    // Build the profile data area
    displayProfileData() {
        var profileDict = {};
        for (var key in this.state.response[0].profile) {
            if (this.state.response[0].profile.hasOwnProperty(key)) {
                profileDict[key] = this.state.response[0].profile[key];
            };
        }

        var profile = 
            <div>
                {  Object.keys(profileDict).map((key, index) => ( 
                    <p key={index}> { key }: { JSON.stringify(profileDict[key]) }</p> 
                ))
                }
            </div>;
        
        return profile;
    }

        // Build the details data area
        displayDetailsData() {
            var detailsDict = {};
            for (var key in this.state.response[0].details) {
                if (this.state.response[0].details.hasOwnProperty(key)) {
                    detailsDict[key] = this.state.response[0].details[key];
                };
            }
    
            var details = 
                <div>
                    {  Object.keys(detailsDict).map((key, index) => ( 
                        <p key={index}> { key }: { JSON.stringify(detailsDict[key]) }</p> 
                    ))
                    }
                </div>;
            
            return details;
        }

    // Build the financial data area
    displayFinancialData() {
        var financialsDict = {};
        for (var key in this.state.response[0].financialData) {
            if (this.state.response[0].financialData.hasOwnProperty(key)) {
                financialsDict[key] = this.state.response[0].financialData[key];
            };
        }

        var financialData = 
            <div>
                {  Object.keys(financialsDict).map((key, index) => ( 
                    <p key={index}> { key }: { JSON.stringify(financialsDict[key]) }</p> 
                ))
                }
            </div>;
        
        return financialData;
    }

    // Build the historical data chart area
    displayHistoryArea() {
        var history = 
            <div>
                <p>{ JSON.stringify(this.state.response[1]) }</p>
            </div>;
        
        return history;
    }


    // Retrieves the stock data from the Express app
    getStock = () => {
        fetch('/api/' + this.state.symbol) 
            .then(res => res.json())
            .then(response => this.setState({ response }), "unfulfilled")
        }

    render() {
        const symbol  = this.state.symbol.substring(1, this.state.symbol.length);
        const response = this.state.response;

        if (response.length == 0) {
            return (
                <div className="App">
                    <h1>WolFin</h1>
                    <h3>{ symbol }</h3>
                    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
            );
        }
        else return (
            <div className="App">
                <h1>WolFin</h1>
                <h3>{ symbol }</h3>
                { this.displayProfileData() }
                { this.displayDetailsData() }
                { this.displayFinancialData() }
                <hr/>
                { this.displayHistoryArea() }
            </div>
        );
    }
}

export default Stock;