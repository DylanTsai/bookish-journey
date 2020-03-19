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

  get text(): string {
    return this._text;
  }

  isEmpty(): boolean {
    return this._text.length == 0;
  }

  onChange(event): string {
    if (this.debug) {
      console.log("updating text: " + event.target.value);
    }
    let newText: string = event.target.value;
    this._text = newText;
    if (newText == "" && this.onEmptyCB) {
      this.onEmptyCB();
    } else {
      this.onNotEmptyCB(newText);
    }
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
export class ValidatedTextInputMonitor<T extends keyof any,
  stateT extends Object = Object>
  extends TextInputMonitor {
  private _validationResults: ValidationResults<T>;
  private validate: (newTxt: string) => ValidationResults<T>;
  private onValidation: (validRes: ValidationResults<T>) => void;

  constructor(
    onEmpty: (stateUpdateMachine) => void,
    onNotEmpty: (newTxt: string, stateUpdateMachine: StateUpdateMachine<stateT>) => void,
    validate: (newTxt: string, stateUpdateMachine: StateUpdateMachine<stateT>) => ValidationResults<T>,
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