import React, { Component } from 'react';

class About extends Component {

    //TODO: displays content
    // What do I want to write here?
    //  - Overview
    //  - Limitations
    //  - Tools used
    //  - Links
    //  - Acknowledgements
    //  - 
    displayContent() {
      return (
        <span>
          <br/>
          <h2>About</h2>
          <table className="aboutTable">
            <tr>
              <td className="aboutHeader">Overview</td>
              <td className="aboutText">Lorem ipsem blah blah blah</td>
            </tr>
            <tr>
              <td className="aboutHeader">Limitations</td>
              <td className="aboutText">Lorem ipsem blah blah blah</td>
            </tr>
            <tr>
              <td className="aboutHeader">Tools</td>
              <td className="aboutText">Lorem ipsem blah blah blah</td>
            </tr>
            <tr>
              <td className="aboutHeader">Acknowledgements</td>
              <td className="aboutText">Lorem ipsem blah blah blah</td>
            </tr>
            <tr>
              <td className="aboutHeader">Links</td>
              <td className="aboutText">Lorem ipsem blah blah blah</td>
            </tr>
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