// For dashboard React and jsx. Any sizeable React components 
// should go inside modules and be imported here.

import React from "react";
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import regeneratorRuntime from "regenerator-runtime"; // you need to keep this!
import { timingSafeEqual } from "crypto";

// TODO put this in separate (utilities) file
function makeUrl(url, params) {
  let url_obj = new URL(url);
  if (params) {
    Object.keys(params).forEach(key => url_obj.searchParams.append(key, params[key]))
    // params.forEach(p => url_obj.searchParams.set(p.key, p.value));
  }
  return url_obj;
}

let BASE_URL = "http://localhost:5000/" // TODO put this in shared (constants) file

class privateVar {
  constructor(init) {
    this._data = init;
  }

  get data() {
    return this._data;
  }

  set data(newData) {
    this._data = newData;
  }
}

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this._text = new privateVar("");
  }

  get text() {
    return this._text;
  }

  isEmpty() {
    return this._text.length = 0;
  }

  render() {
    let updateText = (s) => { this._text = s };
    let full_onchange_callback = (event) => {
      let newText = event.target.value
      updateText(newText);
      this.props.inputCallback(newText);
    }
    return <input
      type="text" id={this.props.id}
      onChange={full_onchange_callback.bind(this)}
    />;
  }
}

TextInput.propTypes = {
  id: PropTypes.string.isRequired,
  inputCallback: PropTypes.func
}

class FetchTester extends React.Component {
  columns = [];
  data = [];
  inputColName = "";

  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      last_run: null
    };
    let col_name_url = BASE_URL + "getColNames"
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
    let country_col_url = BASE_URL + "testRetrieveColFromCountry"
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
      inputCallback={
        (newTxt) => {
          this.inputColName = newTxt;
        }
      }
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


ReactDOM.render(<FetchTester />, document.getElementById("fetch-tester"));
ReactDOM.render(<LikeButton />, document.getElementById("stateful-react-test"));
