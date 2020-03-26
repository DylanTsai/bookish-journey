import React, { RefObject } from 'react';
import { StateUpdateMachine } from './stateUtils';
import regeneratorRuntime from "regenerator-runtime"; // NOTE: we need to keep this here! (I think)
import { SelectPopup } from './selectPopup';
import { curryOne, applyPartial } from './typeUtils';

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


type TypeAheadOptionRenderHelpers<optionT> = {
  option: optionT,
  select: () => void
}

export type TypeAheadSelectionRenderHelpers<optionT> = {
  option: optionT,
  deselect: () => void
}


type TypeAheadInputProps<optionT> = {
  /**
   * The initial input value (to run [getOptions] on in the very beginning).
   * Defaults to emptry string.
   */
  init?: string

  /**
   * True if options should be fetched when input is the empty string. 
   * Otherwise, the options are always set to [] for the empty string.
   * Defaults to false.
   */
  getOptionsOnEmptyStr?: boolean
}

/**
 * The model for [TypeAheadView]. See [TypeAheadView] for more information.
 * 
 * [getOptions] - `getOptions input` gets the options corresponding to the 
 * search query [input].
 * [optionEq] - True iff [option1] and [option2] are the same option.
 * [onlyOneSelection] - If true, selecting one option deselects the previous
 * option, so there is no more than one option selected at a time.
 * [getOptionsOnEmptyStr] - If True, options should be fetched when input is the 
 * empty string. Otherwise, an input of "" corresponds to an empty set of options.
 * Defaults to false.
 * [initInput] - The input box's initial input. Defaults to "".
 */
export class TypeAheadModel<optionT> {
  private _input: string;
  private lastOptionFetchId: number = 0;
  private _lastProcessedQuery: string | undefined;
  private _lastFetchedOptions: optionT[] | undefined;
  private _selection: optionT[] = [];
  private onlyOneSelection: boolean;
  private getOptionsOnEmptyStr: boolean;
  private getOptions: (input: string) => Promise<optionT[]>;
  private refreshView: () => void = () => null;
  optionEq: (a: optionT, b: optionT) => boolean;

  constructor(
    getOptions: (input: string) => Promise<optionT[]>,
    optionEq: (a: optionT, b: optionT) => boolean,
    onlyOneSelection: boolean, getOptionsOnEmptyStr: boolean,
    initInput: string = ""
  ) {
    this.onlyOneSelection = onlyOneSelection;
    this.getOptionsOnEmptyStr = getOptionsOnEmptyStr;
    this.getOptions = getOptions;
    this.optionEq = optionEq;
    this._input = initInput;
    this.onTextChange(initInput);

    this.select = this.select.bind(this);
    this.deselect = this.deselect.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.clearInput = this.clearInput.bind(this);
  }

  /**
   * `supplyOnInputChange f` binds the first parameter of `f` to the 
   * typeAheadModel's onTextChange. This is used to [TypeAheadView]
   * to help render the input.
   */
  supplyOnInputChange<ret>(f: ((onInputChange: (input: string) => void) => ret)): ret {
    return applyPartial<ret>(f, this.onTextChange);
  }

  /**
   * Clears the input.
   */
  clearInput(): void {
    this.onTextChange("");
  }

  /**
   * Adds a callback that will refresh a view that relies on this typeAheadModel. 
   * @param refreshView - The callback that refreshes the view. It is 
   * most likely the React Component's `() => this.forceUpdate()`.
   */
  addViewCallBack(refreshView: () => void) {
    let temp = this.refreshView;
    this.refreshView = () => { temp; refreshView() };
    refreshView(); // refresh only for the new callback
  }

  /**
   * @returns the user input
   */
  get input(): string {
    return this._input;
  }

  /**
   * @returns the last input that had its options fully fetched. This is matched
   * with [lastFetchedOptions].
   */
  get lastProcessedQuery(): string | undefined {
    return this._lastProcessedQuery;
  }

  /**
   * @returns the last set of options that were fully fetched. This is matched
   * with [lastProcessedQuery].
   */
  get lastFetchedOptions(): optionT[] | undefined {
    return this._lastFetchedOptions ? [...this._lastFetchedOptions] : undefined;
  }

  /**
   * @returns true iff [lastFetchedOptions] does not match up with [state.input];
   * that is, we are currently fetching new options.
   */
  get isFetching(): boolean {
    return this._input != this._lastProcessedQuery;
  }

  /**
   * @param input - the user input
   */
  private async onTextChange(input: string): Promise<void> {
    this._input = input;
    let id = ++this.lastOptionFetchId;
    if (input == "" && !this.getOptionsOnEmptyStr) {
      this._lastProcessedQuery = "";
      this._lastFetchedOptions = [];
      this.refreshView();
      return;
    }
    let newOptions = await this.getOptions(input);
    if (id < this.lastOptionFetchId) {
      console.log("onTextChange fetch with optionFetchId=" + id + " is out of date.")
      // then onTextChange was called on a newer input, so we can throw away this change
      return
    }
    this._lastProcessedQuery = input;
    this._lastFetchedOptions = newOptions;
    this.refreshView();
  }

  /**
   * Selects [opt]. 
   */
  private select(opt: optionT) {
    if (this.onlyOneSelection) {
      this._selection = [opt]
    } else {
      let alreadySelected = this._selection.some((other) => this.optionEq(other, opt));
      if (!alreadySelected) {
        this._selection.push(opt);
      }
    }
    this.refreshView();
  }

  /**
   * Removes [opt] from the selection. 
   */
  private deselect(opt: optionT) {
    let newSelection = this._selection.filter((other) => !this.optionEq(other, opt));
    if (newSelection.length == this._selection.length) {
      console.log(`Warning: Tried to deselect "${opt}", but "${opt}" was not in selection.`);
    }
    this._selection = newSelection;
    this.refreshView();
  }

  /**
   * @returns The current selection.
   */
  get selection(): optionT[] {
    return [...this._selection];
  }

  /**
   * @returns information for each option that is helpful in rendering
   */
  get optionRenderHelpers(): TypeAheadOptionRenderHelpers<optionT>[] {
    if (this._lastFetchedOptions === undefined) {
      return [];
    }
    return this._lastFetchedOptions.map(
      (opt) => ({
        option: opt,
        select: () => this.select(opt)
      })
    );
  }

  /**
   * @returns information for each selected option that is helpful in rendering
   */
  get selectionRenderHelpers(): TypeAheadSelectionRenderHelpers<optionT>[] {
    return this._selection.map(
      (sel) => ({
        option: sel,
        deselect: () => this.deselect(sel)
      })
    );
  }
}

/**
 * A modification  of the TypeAheadModel where the asynchronous work is done only
 * once, at the beginning, to fetch all possible options. Then, [getOptions] always
 * returns a subset of those options.
 * Until [fetchAllOptions] finishes, uses the empty list for the set of 
 * all options.
 */
export class TypeAheadStaticOptionsModel<optionT> extends TypeAheadModel<optionT> {
  private allOptions: optionT[];
  private fetched: boolean;
  constructor(fetchAllOptions: () => Promise<optionT[]>,
    getOptions: (input: string, allOptions: optionT[]) => optionT[],
    optionEq: (a: optionT, b: optionT) => boolean,
    onlyOneSelection: boolean, getOptionsOnEmptyStr: boolean,
    initInput: string = "") {
    super(
      (input) => Promise.resolve(getOptions(input, this.allOptions)),
      optionEq,
      onlyOneSelection,
      getOptionsOnEmptyStr,
      initInput
    );
    this.fetched = false;
    this.allOptions = [];
    fetchAllOptions().then(
      (opts) => {
        this.allOptions = opts;
        this.fetched = true;
      }
    )
  }

  get isFetching(): boolean {
    return !this.fetched;
  }

  /**
   * Returns all possible options.
   */
  get allPossibleOptions(): optionT[] {
    return this.allOptions;
  }
}

export type TypeAheadViewProps<optionT, inputBoxT extends Element> = {
  model: TypeAheadModel<optionT>;
  renderOption: (opt: optionT, isFocused: boolean) => JSX.Element;
  renderInputBox: (onInputChange: (input: string) => void, inputBoxRef: RefObject<inputBoxT>,
    setVisibility: (b: boolean) => void) => Element;
}

/**
 * Useful for each option. Used as the option type in TypeAheadView's SelectPopup. 
 */
type optionInfo<optionT> = {
  option: optionT,
  index: number,
  select: () => void,
  render: (isFocused: boolean) => JSX.Element
}

export class TypeAheadView<optionT, inputBoxT extends Element>
  extends React.Component<TypeAheadViewProps<optionT, inputBoxT>, {}> {

  constructor(props: TypeAheadViewProps<optionT, inputBoxT>) {
    super(props);
  }

  componentDidMount() {
    this.props.model.addViewCallBack(() => this.forceUpdate());
  }

  render() {
    return <SelectPopup
      renderAnchor={this.props.model.supplyOnInputChange(curryOne(this.props.renderInputBox))}
      renderOption={(opt: optionInfo<optionT>, isSelected: boolean) => opt.render(isSelected)}
      select={(opt: optionInfo<optionT>) => opt.select()}
      options={this.props.model.optionRenderHelpers.map(
        (helper, i) => ({
          option: helper.option,
          index: i,
          select: helper.select, // TODO clear input on select
          render: (isFocused) => this.props.renderOption(helper.option, isFocused)
        })
      )}
      onEnterSelect={this.props.model.clearInput}
      isLoading={() => this.props.model.isFetching}
      virtualizedListProps={{
        height: 60,
        rowHeight: 20
      }}
    />;
  }

}
