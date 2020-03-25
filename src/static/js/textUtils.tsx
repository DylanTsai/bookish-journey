import React from 'react';
import { StateUpdateMachine } from './stateUtils';

/**
 * Class for monitoring state of a text input.
 * Consolidates onChange callbacks for empty text inputs and nonEmpty text inputs
 * into a single onChange function. Pass this onChange into the HTML input element
 * that you want to monitor.
 * @param onEmpty - onChange callback when input changes to ""
 * @param onNotEmpty - onChange callback called otherwise
 * @param debug - set to true to log some info in console
 */
export class TextInputMonitor {
  private _text: string;
  private readonly onEmptyCB: () => void;
  private readonly onNotEmptyCB: (txt: string) => void;
  private readonly debug: boolean;

  constructor(onEmpty: () => void, onNotEmpty: (newTxt: string) => void, debug = true) {
    this._text = "";
    this.onEmptyCB = onEmpty;
    this.onNotEmptyCB = onNotEmpty;
    this.debug = debug;
    this.onChange = this.onChange.bind(this);
  }

  /**
   * The current text in the monitored input element. Do NOT use 
   * in onchange functions for the monitored input element.
   */
  get text(): string {
    return this._text;
  }

  /**
   * True iff the monitored input element has no text in it. Do
   * NOT use in onchange functions for the monitored input element.
   */
  isEmpty(): boolean {
    return this._text.length == 0;
  }

  /**
   * Pass this as [onchange] into the input element in order to monitor that
   * element.
   */
  onChange(event): string {
    if (this.debug) {
      console.log("updating text: " + event.target.value);
    }
    let newText: string = event.target.value;
    this._text = newText;
    newText == "" ? this.onEmptyCB() : this.onNotEmptyCB(newText);
    if (this.debug) {
      console.log("finished updating text: " + event.target.value);
    }
    return newText;
  }
}

/**
 * The type of a validation result, for use with ValidatedTextInputMonitor.
 * Example:
 * ValidationResults<"noSpaces" | "noNumbers"> = {
 *    noSpaces: boolean,
 *    noNumbers: boolean
 * }
 */
export type ValidationResults<T extends keyof any> = {
  [property in T]: boolean
}

/**
 * A [TextInputMonitor] that additionally consolidates input validation into the
 * onChange function. [onValidation] is run before onEmpty and onNotEmpty.
 * 
 * @param onEmpty - as in [TextInputMonitor]
 * @param onNotEmpty - as in [TextInputMonitor] 
 * @param validate [txt] is the validation result of [txt]
 * @param onValidation - guaranteed to be called if [onEmpty] or [onNotEmpty] is
 * called on [newTxt] and [validate(newTxt)] is different from [validate(oldTxt)]
 * @param thisObj - Used to create the [StateUpdateMachine] that is passed into 
 * the callbacks. Pass in the [this] reference of the React component whose 
 * state should be changed.
 * @param debug - as in [TextInputMonitor]
 */
export class ValidatedTextInputMonitor<T extends keyof any, stateT extends Object>
  extends TextInputMonitor {
  private _validationResults: ValidationResults<T>;
  private validate: (newTxt: string) => ValidationResults<T>;
  private onValidation: (validRes: ValidationResults<T>) => void;

  constructor(
    onEmpty: (stateUpdateMachine) => void,
    onNotEmpty: (newTxt: string, stateUpdateMachine: StateUpdateMachine<stateT>) => void,
    validate: (newTxt: string, stateUpdateMachine: StateUpdateMachine<stateT>) => ValidationResults<T>, // TODO take out stateUpdateMachine
    onValidation: (validRes: ValidationResults<T>, stateUpdateMachine) => void,
    thisObj: React.Component<any, stateT>,
    debug = true) {

    let onEmptyCB = () => {
      let stateUpdateMachine: StateUpdateMachine<stateT> = new StateUpdateMachine(thisObj);
      let validationResults: ValidationResults<T> = validate("", stateUpdateMachine);
      this._validationResults = validationResults;
      onValidation(validationResults, stateUpdateMachine);
      onEmpty(stateUpdateMachine);
      stateUpdateMachine.doUpdate();
    }
    let onNotEmptyCB = (newTxt: string) => {
      let stateUpdateMachine: StateUpdateMachine<stateT> = new StateUpdateMachine(thisObj);
      let validationResults: ValidationResults<T> = validate(newTxt, stateUpdateMachine);
      this._validationResults = validationResults;
      onValidation(validationResults, stateUpdateMachine);
      onNotEmpty(newTxt, stateUpdateMachine);
      stateUpdateMachine.doUpdate();
    }
    super(onEmptyCB, onNotEmptyCB, debug);
  }

  componentDidMount() {
    this._validationResults = this.validate("");
    this.onValidation(this._validationResults);
  }

  get validationResults(): ValidationResults<T> {
    return this._validationResults;
  }
}


export type TypeAheadOptionRenderHelpers<optionT> = {
  option: optionT,
  select: () => void
}

export type TypeAheadSelectionRenderHelpers<optionT> = {
  option: optionT,
  deselect: () => void
}

export type TypeAheadInputProps<optionT> = {
  /**
   * @param input - the search query
   * @param prevInput - the last query that had its options fully fetched
   * @param prevOpts - the last fully fetched set of options
   */
  getOptions: (input: string, prevInput: string, prevOpts: optionT[]) => Promise<optionT[]>,

  /**
   * @param input - The text input
   * @param isFetching - true iff the options in optionRenderHelpers are for an old query,
   * and not for [input]
   * @param optionRenderHelpers - useful things for rendering options
   * @param selectionRenderHelpers - useful things for rendering selection
   */

  render: (input: string, isFetching: boolean, onTextChange: (input: string) => void,
    optionRenderHelpers: TypeAheadOptionRenderHelpers<optionT>[],
    selectionRenderHelpers: TypeAheadSelectionRenderHelpers<optionT>[]) => JSX.Element,

  /**
   * Set to true if only one option can be selected at a time
   */
  onlyOneSelection: boolean,

  /**
   * onChange event for when options are selected or deselected
   * @param newSelection - the new selection
   * @param type - "select" if the user selected a new option, otherwise "deselect"
   * @param changedOption - the option that was selected or deselected
   */
  onSelectionChange?: (newSelection: optionT[], type: "select" | "deselect", changedOption: optionT) => void
}

class OptionWithId<optionT> {
  private static counter = 0;
  private _id: number;
  private _value: optionT;
  constructor(value: optionT) {
    this._value = value;
    this._id = ++OptionWithId.counter;
  }

  get id() {
    return this._id
  }

  get value() {
    return this._value
  }
}

type TypeAheadInputState<optionT> = {
  input: string,
  lastProcessedQuery: string,
  lastFetchedOptions: optionT[],
  selection: OptionWithId<optionT>[]
}

export class TypeAheadInput<optionT> extends React.Component<TypeAheadInputProps<optionT>, TypeAheadInputState<optionT>> {

  private lastOptionFetchId: number = 0;

  constructor(props: TypeAheadInputProps<optionT>) {
    super(props);
    this.state = {
      input: "",
      lastProcessedQuery: "",
      lastFetchedOptions: [],
      selection: []
    }
    this.onTextChange = this.onTextChange.bind(this);
    this.select = this.select.bind(this);
    this.deselect = this.deselect.bind(this);
  }

  /**
   * @returns the user input
   */
  get input(): string {
    return this.state.input;
  }

  /**
   * @returns the last input that had its options fully fetched. This is matched
   * with [lastFetchedOptions].
   */
  get lastProcessedQuery(): string {
    return this.state.lastProcessedQuery;
  }

  /**
   * @returns the last set of options that were fully fetched. This is matched
   * with [lastProcessedQuery].
   */
  get lastFetchedOptions(): optionT[] {
    return [...this.state.lastFetchedOptions];
  }

  /**
   * @returns true iff [lastFetchedOptions] does not match up with [state.input];
   * that is, we are currently fetching new options.
   */
  get isFetching(): boolean {
    return this.state.input != this.state.lastProcessedQuery;
  }

  /**
   * @param input - the user input
   */
  private async onTextChange(input: string): Promise<void> {
    this.setState({
      input: input
    })
    let id = ++this.lastOptionFetchId;
    let newOptions = await this.props.getOptions(input, this.state.lastProcessedQuery, this.state.lastFetchedOptions);
    if (id < this.lastOptionFetchId) {
      console.log("onTextChange fetch with optionFetchId=" + id + " is out of date.")
      // then onTextChange was called on a newer input, so we can throw away this change
      return
    }
    this.setState({
      lastProcessedQuery: input,
      lastFetchedOptions: newOptions
    })
  }

  /**
   * Selects [opt]. 
   */
  private select(opt: optionT) {
    let optWId = new OptionWithId(opt);
    let newSelection: OptionWithId<optionT>[] = this.props.onlyOneSelection ? [optWId] : this.state.selection.concat(optWId);
    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(newSelection.map(opt => opt.value), "select", opt);
    }
    this.setState({ selection: newSelection });
  }

  /**
   * Removes [optWId] from the selection. 
   */
  private deselect(optWId: OptionWithId<optionT>) {
    let newSelection = this.state.selection.filter((other) => other.id == optWId.id);
    if (newSelection.length == this.state.selection.length) {
      console.log(`Warning: Tried to deselect "${optWId.value}", but "${optWId.value}" was not in selection.`);
    }
    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(newSelection.map(opt => opt.value), "deselect", optWId.value);
    }
    this.setState({
      selection: newSelection
    });
  }

  /**
   * @returns The current selection.
   */
  get selection(): optionT[] {
    return this.state.selection.map(selWId => selWId.value);
  }

  render() {
    let optionRenderHelpers: TypeAheadOptionRenderHelpers<optionT>[] = this.state.lastFetchedOptions.map(
      (opt) => ({
        option: opt,
        select: () => this.select(opt)
      })
    )
    let selectionRenderHelpers: TypeAheadSelectionRenderHelpers<optionT>[] = this.state.selection.map(
      (optWId) => ({
        option: optWId.value,
        deselect: () => this.deselect(optWId)
      })
    );
    return this.props.render(this.state.input, this.isFetching,
      this.onTextChange, optionRenderHelpers, selectionRenderHelpers);
  }
}

export type TypeAheadInputStaticOptionsProps<optionT> = {
  fetchAllOptions: () => Promise<optionT[]>,
  getOptions: (input: string, allOptions: optionT[], prevInput: string, prevOpts: optionT[]) => optionT[],
  render: (input: string, isFetching: boolean, onTextChange: (input: string) => void,
    optionRenderHelpers: TypeAheadOptionRenderHelpers<optionT>[],
    selectionRenderHelpers: TypeAheadSelectionRenderHelpers<optionT>[]) => JSX.Element,
  onlyOneSelection: boolean,
  onSelectionChange?: (newSelection: optionT[], type: "select" | "deselect", changedOption: optionT) => void
}

export class TypeAheadInputStaticOptions<optionT>
  extends React.Component<TypeAheadInputStaticOptionsProps<optionT>, TypeAheadInputState<optionT>> {
  private allOptions: null | optionT[] = null;
  private typeAheadInput: TypeAheadInput<optionT>;
  constructor(props) {
    super(props);
    let renderProp = (input: string, _: boolean, onTextChange: (input: string) => void,
      optionRenderHelpers: TypeAheadOptionRenderHelpers<optionT>[],
      selectionRenderHelpers: TypeAheadSelectionRenderHelpers<optionT>[]) => {
      let hasNotFetchedOptions = this.allOptions == null;
      return this.props.render(input, hasNotFetchedOptions, onTextChange, optionRenderHelpers, selectionRenderHelpers);
    }
    let getOptionProp = (input: string, prevInput: string, prevOpts: optionT[]) =>
      Promise.resolve(props.getOptions(input, this.allOptions, prevInput, prevOpts));
    this.typeAheadInput = new TypeAheadInput<optionT>({
      getOptions: getOptionProp,
      render: renderProp,
      onlyOneSelection: props.onlyOneSelection
    })
  }

  async componentDidMount() {
    this.allOptions = await this.props.fetchAllOptions();
  }

  render() {
    return this.typeAheadInput.render()
  }
}