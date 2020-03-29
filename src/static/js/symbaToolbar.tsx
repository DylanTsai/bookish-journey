import React from 'react';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import BusinessCenterOutlinedIcon from '@material-ui/icons/BusinessCenterOutlined';
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';
import bs from 'bootstrap/dist/css/bootstrap.min.css';
import index from '../styles/index.css';

export class SymbaToolbar extends React.Component {
  render() {
    return <nav id="toolbar" className={`${bs.navbar} ${bs['navbar-expand-lg']} ${bs['fixed-top']} ${bs['navbar-light']} ${bs['bg-light']} ${index.toolbar}`}>
      <a className={bs['navbar-brand']} href="#">Symba</a>
      <button className={bs['navbar-toggler']} type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className={bs['navbar-toggler-icon']}></span>
      </button>
      <div className={`${bs.collapse} ${bs['navbar-collapse']}`}>
        <div className={`${bs['navbar-nav']} ${bs['ml-auto']} ${bs['mr-1']} ${index['right-nav-list']}`}>
          <a className={`${bs['nav-item']} ${bs['nav-link']} ${bs.active}`} href='#'><BusinessCenterOutlinedIcon /> Internships</a>
          <a className={`${bs['nav-item']} ${bs['nav-link']} ${bs.active}`} href='#'><ForumOutlinedIcon /></a>
          <a className={`${bs['nav-item']} ${bs['nav-link']} ${bs.active}`} href='#'><AccountCircleOutlinedIcon /></a>
        </div>
      </div>
    </nav>
  }
}