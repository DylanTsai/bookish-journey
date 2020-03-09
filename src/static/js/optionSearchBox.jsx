import React from "react";
import PropTypes from 'prop-types';
import regeneratorRuntime from "regenerator-runtime"; // NOTE: we need to keep this here!

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
/**
 * TODO: select options
 */
export class TextInput extends React.Component {
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
      console.log("updating text: " + event.target.value)
      let newText = event.target.value
      updateText(newText);
      this.props.inputCallback(newText);
      console.log("finished updating text: " + event.target.value)
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

/*
  Inner component for all option search boxes
*/
class OptionSearchBox extends React.Component {

  input = ""; // text that the user inputted

  constructor(props) {
    super(props);
    this.lastFetchedText = ""; // the latest text that we fetched options for
    this.latestGetOptionId = 0; // for validating get option
    this.options = []
    this.selection = [];
    this.state = {
      options: [],
      selection: []
    }

    this.onTextChange = this.onTextChange.bind(this);
  }

  getInput() {
    return this.input;
  }

  getLastFetchedText() {
    return this.lastFetchedText;
  }

  getSelection() {
    // return copy to ensure selection isn't modified outside here
    return [...this.selection];
  }

  getOptions() {
    return [...this.options];
  }

  async onTextChange(newText) {
    this.text = newText;
    let id = ++this.latestGetOptionId;
    let newOptions = await this.props.getOptions(this.lastFetchedText, newText, this.options);
    if (id < this.latestGetOptionId) {
      console.log(this.props.id + ": onTextChange fetch with id=" + id + " is out of date.")
      // then onTextChange was called on a new version, so we can throw away this change
      return
    }
    this.lastFetchedText = newText
    this.setState({
      options: newOptions,
      selection: this.state.selection
    })
    console.log(this.state.options)
  }

  onSelect(selectionValue) {
    if (this.props.onlyOneSelection) {
      this.setState({
        options: this.state.options,
        selection: [selectionValue]
      })
    } else {
      this.state.selection.push(selectionValue);
      this.forceUpdate();
    }
  }
  render() {
    return <>
      <TextInput id={this.props.id} inputCallback={this.onTextChange} />
      <div>
        SELECTION:
        </div>
      <div>
        {
          this.state.selection.map(
            sel => <span>{this.props.selectionToHTML(sel)}</span>
          )
        }
      </div>
      <div>
        OPTIONS:
        </div>
      <div>
        {this.state.options.map(
          opt => <span>{this.props.optionToHTML(opt)}</span>
        )}
      </div>
    </>
  }
}
OptionSearchBox.propTypes = {
  // Let optionT be the type of the options
  id: PropTypes.string,
  /*
    getOptions: string, string, list<string> -> Promise<list<optionT>>
    [getOptions newText oldText oldOptions] Returns a Promise that,
    once evaluated, returns the options corresponding to [newText].
    [oldText] is the last input for which options have been
    successfully fetched.
  */
  getOptions: PropTypes.func.isRequired,
  /*
    optionToHTML: optionT -> JSX element
    [optionToHTML opt] Returns the JSX rendering of [opt].
  */
  optionToHTML: PropTypes.func.isRequired,
  /*
    selectionToHTML: optionT -> JSX element
    [selectionToHTML sel] Returns the JSX rendering of [sel];
    that is, what it shows up as inside the text box.
  */
  selectionToHTML: PropTypes.func.isRequired,

  /*
    True if user can only select one option, as opposed 
    to being able to select a list of options.
    Even if onlyOneSelection is true, the type of the selections
    is still a list; it's just a singleton list.
  */
  onlyOneSelection: PropTypes.bool

}

export class SkillSearchBox extends React.Component {

  render() {
    return <OptionSearchBox
      id="imanid"
      getOptions={(newText, oldText, oldOptions) => ["rawrrrr", "im an option"]}
      optionToHTML={opt => opt}
      selectionToHTML={sel => sel}
      onlyOneSelection={false}
    />

  }
}