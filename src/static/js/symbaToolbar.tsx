import React from 'react';
import bs from 'bootstrap/dist/css/bootstrap.min.css';
import index from '../styles/index.css';

export class SymbaToolbar extends React.Component {
  render() {
    return <nav id="toolbar" className={`${bs.navbar} ${bs['fixed-top']} ${bs['navbar-light']} ${bs['bg-light']} ${index.toolbar}`}>
      <a className={bs['navbar-brand']} href="#">Symba</a>
      <span className={`${bs['ml-auto']} ${bs['mr-1']}"`}>Internships</span>
      <span>icon</span>
    </nav>
  }
}