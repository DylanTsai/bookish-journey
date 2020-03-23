import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export class SymbaToolbar extends React.Component {
  render() {
    return <nav className="navbar navbar-light bg-light">
      <a className="navbar-brand" href="#">Symba</a>
      <span>Internships</span>
      <span>icon</span>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
    </nav>
  }
}