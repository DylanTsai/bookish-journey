import React from "react";
import PropTypes from 'prop-types';
import regeneratorRuntime from "regenerator-runtime"; // NOTE: we need to keep this here!

/**
 * TODO: select options
 */
export class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this._text = "";
  }

  get text() {
    return this._text;
  }

  isEmpty() {
    return this._text.length = 0;
  }

  render() {
    let full_onchange_callback = (event) => {
      console.log("updating text: " + event.target.value)
      let newText = event.target.value
      this._text = newText;
      if (newText == "" && this.props.onEmptyCallback) {
        this.props.onEmptyCallback()
      } else {
        this.props.onChange(newText);
      }
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
  onChange: PropTypes.func,
  onEmptyCallback: PropTypes.func // onEmptyCallback supersedes (replaces) onChangeCallback
  // when input is empty
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

  select(opt) {
    let newSelection = this.props.onlyOneSelection ? [opt] : this.state.selection.concat(opt);
    onSelectionChange();
    this.setState({
      options: this.state.options,
      selection: newSelection
    });
  }

  deselect(opt) {
    let newSelection = this.state.selection.filter(opt);
    if (newSelection.length == this.state.selection.length) {
      console.log(`Warning: Tried to deselect "${opt}", but "${opt}" was not in selection.`);
    }
    onSelectionChange();
    this.setState({
      options: this.state.options,
      selection: newSelection
    });
  }


  getSelection() {
    // return copy to ensure selection isn't modified outside here
    return [...this.state.selection];
  }

  getOptions() {
    return [...this.state.options];
  }

  async onTextChange(newText) {
    this.text = newText;
    let id = ++this.latestGetOptionId;
    let newOptions = await this.props.getOptions(newText, this.lastFetchedText, this.state.options);
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
      <TextInput id={this.props.id} onChange={this.onTextChange} />
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
    optionToHTML: optionT -> (() -> void) -> JSX element
    [optionToHTML opt select] Returns the JSX rendering of [opt].
    [select] is a function that selects [opt]
  */
  optionToHTML: PropTypes.func.isRequired,
  /*
    selectionToHTML: optionT -> (() -> void -> JSX element
    [selectionToHTML sel deselect] returns the JSX rendering of [sel]. 
    [deselect] is a function that deselects [sel].
  */
  selectionToHTML: PropTypes.func.isRequired,

  /*
    onSelectionChange: list<optionT> -> list<optionT> -> void
    [onSelectionChange newSelection oldSelection] is called after any selection
    or deselection.
  */
  onSelectionChange: PropTypes.func,

  /*
    True if user can only select one option, as opposed 
    to being able to select a list of options.
    Even if onlyOneSelection is true, the type of the selections
    is still a list; it's just a singleton list.
  */
  onlyOneSelection: PropTypes.bool

}

export class SkillSearchBox extends React.Component {

  skillsCache = {}

  constructor(props) {
    super(props);
    this.getAndCacheOptions.bind(this);
    this.state = {
      ready: false
    }
    this.fetchAllFromDb().then(
      () => {
        this.setState({ ready: true })
      }
    )
    this.getAndCacheOptions = this.getAndCacheOptions.bind(this)
  }

  fetchAllFromDb() {
    return Promise.resolve(["rawrrrr", "im an option"]);
  }

  getAndCacheOptions(searchText, prevQuery, oldOptions) {
    console.log(this.skillsCache)
    if (searchText in this.skillsCache) {
      return this.skillsCache[searchText];
    }
    this.fetchAllFromDb()
    let options = ["rawrrrr", "im an option"]
    this.skillsCache[searchText] = options
    return options
  }

  render() {
    return <OptionSearchBox
      id="imanid"
      getOptions={this.getAndCacheOptions}
      optionToHTML={(opt, selectCB) => <button onClick={selectCB}>opt</button>}
      selectionToHTML={(sel, deselectCB) => <button onClick={deselectCB}>opt</button>}
      onlyOneSelection={false}
    />

  }
}