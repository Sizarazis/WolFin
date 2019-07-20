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


    displayCompanyName() {
        var shortName = this.state.response[0].shortName;
        var longName = this.state.response[0].longName;

        return (
            <div>
                <p> shortName: { shortName } </p>
                <p> longName: { longName } </p>
            </div>
        )
    }

    // Display a prediction
    displayPrediction() {
        return (
            // I should display the stock symbol and current price here
            <section class="prediction"></section>
        )
    }

    // Display General Info
    displayGeneralInfo() {
        var name = this.state.response[0].shortName;
        var sector = this.state.response[0].profile.sector;
        var industry = this.state.response[0].profile.industry;
        var numEmployees = this.state.response[0].profile.fullTimeEmployees;
        var summary = this.state.response[0].profile.longBusinessSummary;

        return (
            <section class="genInfo">
                <table class="genInfoTable">
                    <col class="col1"></col>
                    <col class="col2"></col>
                    <tr>
                        <th>Name: </th>
                        <th2>{ name }</th2>
                    </tr>
                    <tr>
                        <th>Sector: </th>
                        <th2>{ sector }</th2>
                    </tr>
                    <tr>
                        <th>Industry: </th>
                        <th2>{ industry }</th2>
                    </tr>
                    <tr>
                        <th>Full-Time Employees: </th>
                        <th2>{ numEmployees }</th2>
                    </tr>
                </table>
            </section>
        )
    }

    // Display Contact Info
    displayContactInfo() {
        var name = this.state.response[0].shortName;
        var address = this.state.response[0].profile.address1;
        var city = this.state.response[0].profile.city;
        var province = this.state.response[0].profile.state;
        var country = this.state.response[0].profile.country;
        var zip = this.state.response[0].profile.zip;
        var phone = this.state.response[0].profile.phone;
        var website = this.state.response[0].profile.website;

        return (
            <section class="genInfo">
                <h5 class="h5-contact">Contact</h5>
                <table class="contactInfoTable">
                    <col class="col1"></col>
                    <tr>
                        <td>{ name }</td>
                    </tr>
                    <tr>
                        <td>{ address }</td>
                    </tr>
                    <tr>
                        <td>{ city }, { province } { country }</td>
                    </tr>
                    <tr>
                        <td>{ zip }</td>
                    </tr>
                    <tr>
                        <td>{ phone }</td>
                    </tr>
                    <tr>
                        <td>{ website }</td>
                    </tr>
                </table>
            </section>
        )
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
        // var financialsDict = {};
        // for (var key in this.state.response[0].financialData) {
        //     if (this.state.response[0].financialData.hasOwnProperty(key)) {
        //         financialsDict[key] = this.state.response[0].financialData[key];
        //     };
        // }

        // var financialData = 
        //     <div>
        //         {  Object.keys(financialsDict).map((key, index) => ( 
        //             <p key={index}> { key }: { JSON.stringify(financialsDict[key]) }</p> 
        //         ))
        //         }
        //     </div>;
        
        // return financialData;
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
        var header = <div class="header">
                        <h1>WolFin</h1>
                        <p>A simple stock predictor using AWS machine learning tools.</p>
                    </div>;
        var footer = <div class="footer2"><br/></div>;

        if (response.length === 0) {
            return (
                <div className="App">
                    { header }
                    <h3>{ symbol }</h3>
                    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
            );
        }
        else return (
            <div className="App">
                { header }
                <h3>{ this.state.response[0].shortName }</h3>
                <table class="StockPageLayoutGroup">
                    <col width="30%"></col>
                    <col width="70%"></col>
                    <tr>
                        <td class="td1" valign="top">{ this.displayGeneralInfo() }</td>
                        <td valign="top">{ this.state.response[0].profile.longBusinessSummary }</td>
                    </tr>
                </table>               
                { this.displayHistoryArea() }
                { footer }
            </div>
        );
    }
}

export default Stock;