import React, { Component } from 'react';

class Stock extends Component {
    // Initialize the state
    constructor(props){
        super(props);
        this.state = {
            state: "loading",
            symbol: this.props.location.pathname.toUpperCase().substring(11),
            response: []
        }
 
        this.displayContent = this.displayContent.bind(this);
    }

    // Fetch the stock info on first mount
    componentDidMount() {
        this.timeoutPromise(10000, fetch('/api/predictor/' + this.state.symbol))
        .then(res => {
            console.log(res);
            if (res[0] === "error") {
                this.setState({ state:"error", response:res[1] })
            }
            else {
                this.setState({ state:"fulfilled", response:res });
            }  
        })
        .catch(error => {
            this.setState({ state:"error", response:error });
        });
    }

    timeoutPromise(ms, promise) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
            reject(new Error("Timed out."))
          }, ms);

          promise.then(
            (res) => {
                clearTimeout(timeoutId);
                resolve(res.json());
            },
            (err) => {
                clearTimeout(timeoutId);
                reject(err.json());
            }
          );
        })
    }

    // Display result content
    displayContent() {
        var lastEntry = this.state.response[1].body.chart.result[0].indicators.adjclose[0].adjclose.length - 1;
        var previousAdjClose = this.state.response[1].body.chart.result[0].indicators.adjclose[0].adjclose[lastEntry];
        var upTick = this.state.response[2] >= previousAdjClose;

        var content = <div></div>;
        
        if (upTick) {
            content = 
            <div className="Stock">
                <h3>{ this.state.response[0].longName } ({ this.state.symbol })</h3>
                <div className="delineator"></div>
                <br/>
                <table className="predictionTable">
                    <tr>
                        <td><span><p>LAST CLOSE (USD)</p></span></td>
                        <td><span><p>PREDICTED CLOSE (USD)</p></span></td>
                    </tr>
                    <tr>
                        <td className="lastClose">{ Math.round(previousAdjClose * 100)/100 }</td>
                        <td className="upPrediction">{ Math.round(this.state.response[2] * 100)/100 }</td>
                    </tr>
                </table>
            </div>;
        }
        else {
            content = 
            <div className="Stock">
                <h3>{ this.state.response[0].longName } ({ this.state.symbol })</h3>
                <div className="delineator"></div>
                <br/>
                <table className="predictionTable">
                    <tr>
                        <td><span><p>LAST CLOSE (USD)</p></span></td>
                        <td><span><p>PREDICTED CLOSE (USD)</p></span></td>
                    </tr>
                    <tr>
                        <td className="lastClose">{ Math.round(previousAdjClose * 100)/100 }</td>
                        <td className="downPrediction">{ Math.round(this.state.response[2] * 100)/100 }</td>
                    </tr>
                </table>
            </div>
        }

        return content;
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

    render() {
        const symbol  = this.state.symbol;
        var content = <div></div>;
        console.log(this.state.state);

        // Display loading screen
        if (this.state.state === "loading") {
            content = 
                <div className="loading">
                    <p>Querying { symbol }</p>
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>;
        }
        //TODO: Display error screen
        else if (this.state.state === "error") {
            content = 
                <div className="error">
                    <h3>ERROR</h3>
                    <p> { this.state.response } </p>
                </div>
        }
        // Display result
        else {
            content = 
                <div>{ this.displayContent() }</div>;
        }
        return (
            <div>
                <br/>
                { content }
            </div>
        );
    }
}

export default Stock;