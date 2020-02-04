import React, { Component } from 'react';

class About extends Component {

    //TODO: displays content
    displayContent() {
      return (
        <span>
          <h2>About</h2>
          <p>This is text that will explain what the project is about.</p>
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