import React, { Component } from 'react';

class About extends Component {

    //TODO: displays content
    displayContent() {
      return (
        <div>
          <h2>About</h2>
          <p>This is text that will explain what the project is about.</p>
        </div>
      );
    }

    render() {
      var content = <div> { this.displayContent() } </div>;

      return (
        <div className="App">
            { content }
        </div>
    );
  }
}

export default About;