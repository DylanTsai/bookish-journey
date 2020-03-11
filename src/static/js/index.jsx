// TODO rename this file to be specific to the appropriate page
// React and jsx. Any sizeable React components 
// should go in different files and then be imported here.

import React from "react";
import PropTypes from 'prop-types';
import regeneratorRuntime from "regenerator-runtime"; // NOTE: we need to keep this here!
import * as consts from './constantsDashboard';
import { makeUrl } from './dbUtils';
import { TextInput } from './optionSearchBox';

export class FetchTester extends React.Component {
  columns = [];
  data = [];
  inputColName = "";

  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      last_run: null
    };
    let col_name_url = consts.BASE_URL + "getColNames"
    let col_name_params = { table: "SymbaApi_country" }
    fetch(makeUrl(col_name_url, col_name_params)).then(
      (resp) => resp.text()
    ).then(
      (txt) => {
        this.columns = txt.split(",");
        this.setState({
          fetching: false,
          last_run: null
        });
      }
    )
  }

  existsInput() {
    return len(this.inputColName) > 0
  }

  async fetchColAndUpdateData(colName) {
    this.setState({
      fetching: true,
      last_run: null
    })
    let country_col_url = consts.BASE_URL + "testRetrieveColFromCountry"
    let country_col_params = { col: colName }
    let resp = await fetch(makeUrl(country_col_url, country_col_params));
    let txt = await resp.text()
    if (txt.length > 0) {
      this.data = txt.split(",");
      let now = new Date();
      let dateStr = `${now.getMonth() + 1}/${now.getDate()}, ${now.getFullYear()}`;
      this.setState({
        fetching: false,
        last_run: dateStr
      })
    } else {
      this.data = [];
      this.setState({
        fetching: false,
        last_run: null
      });
    }
  }

  render() {
    let getNextData_but = <button onClick={() => this.fetchColAndUpdateData(this.inputColName)}>
      Get Column Data
    </button>;
    let col_textInput = <TextInput id="col-text-input"
      inputCallback={(newTxt) => { this.inputColName = newTxt; }}
    />;
    let dataContainer = null
    if (this.state.fetching) {
      dataContainer = <div>Fetching...</div>
    } else {
      dataContainer = <span>Available columns: {this.columns.reduce((acc, s) => acc + ", " + s)}</span>;
      if (this.state.last_run == null) {
        dataContainer = <>
          <div>{dataContainer}</div>
          <div>No data yet! Enter something above.</div>
        </>
      } else {
        dataContainer = <>
          <div>{dataContainer}</div>
          <div>Last search was on {this.state.last_run}</div>
          <table border="1">
            <tbody>
              {this.data.map((d) => <tr style={{ borderBottom: "1" }} key={d}><td>{d}</td></tr>)}
            </tbody>
          </table>
        </>
      }
    }
    return <div>
      <div>
        {col_textInput}
        {getNextData_but}
      </div>
      <div>
        {dataContainer}
      </div>
    </div>;
  }
}

export class LikeButton extends React.Component {

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
