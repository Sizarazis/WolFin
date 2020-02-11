import React, { Component } from 'react';

class About extends Component {

    displayContent() {
      return (
        <span>
          <br/>
          <h2>About</h2>
          <table className="aboutTable">
            <tbody>
              <tr>
                <td className="aboutHeader">Overview</td>
                <td className="aboutText">WolFin is a simple stock predictor that utilizes an AWS DeepAR Forecasting algorithm learned on the last 10 years of historical closing prices of stocks traded on the NYSE, to predict the next closing price of an inputted stock symbol.</td>
              </tr>
              <tr>
                <td className="aboutHeader">Limitations</td>
                <td className="aboutText">This project is limited in scope due to it only taking into account historical closing prices of stocks. There is many more factors that goes into predicting a stock's price.</td>
              </tr>
              <tr>
                <td className="aboutHeader">Tools</td>
                <td className="aboutText">WolFin was developed with the aid of; Javascript, Python, Express.js, React.js, AWS (SageMaker, S3, Lambda, API Gateway), RapidAPI, the Yahoo Finance API, Git, Selenium, and ChromeDriver. </td>
              </tr>
              <tr>
                <td className="aboutHeader">Links</td>
                <td className="aboutText">
                  <text>
                    {"Roadmap: TODO"} 
                    <br/> {"Github: github.com/Sizarazis/WolFin"} 
                    <br/> {"Website Template: dev.to/nburgess/creating-a-react-app-with-react-router-and-an-express-backend-33l3"}
                    <br/> {"Loading Animation: loading.io"}
                  </text>
                </td>
              </tr>
            </tbody>
          </table>
        </span>
      );
    }

    render() {
      var content = <span> { this.displayContent() } </span>;

      return (
        <div className="About">
            { content }
        </div>
    );
  }
}

export default About;