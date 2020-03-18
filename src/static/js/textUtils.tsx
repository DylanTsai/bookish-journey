import React from 'react';
import { StateUpdateMachine } from './stateUtils';

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
      console.log("updating text: " + event.target.value)
    }
    let newText: string = event.target.value
    this._text = newText;
    if (newText == "" && this.onEmptyCB) {
      this.onEmptyCB()
    } else {
      this.onNotEmptyCB(newText);
    }
    if (this.debug) {
      console.log("finished updating text: " + event.target.value)
    }
    return newText;
  }
}

export type TextInputProps = {
  id: string,
  monitor: TextInputMonitor;
  render: (monitor: TextInputMonitor) => React.ReactNode
}

export type ValidationResults<T extends keyof any> = {
  [property in T]: boolean
}

/** 
 * onValidation is run before onEmpty and onNotEmpty.
 * Upon construction, onValidation is called and validationResults
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