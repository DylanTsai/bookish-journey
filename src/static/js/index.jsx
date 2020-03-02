// For dashboard React and jsx. Any sizeable React components 
// should go inside modules and be imported here.

import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  render() {
    return <h1> I'm a React Component!</h1>;
  }
}

class LikeButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {

    return React.createElement(
      'button',
      { onClick: () => this.setState({ liked: !this.state.liked }) },
      this.state.liked ? 'Dislike' : 'Like'
    );
  }
}


ReactDOM.render(<App />, document.getElementById("static-react-test"));
ReactDOM.render(<LikeButton />, document.getElementById("stateful-react-test"));
