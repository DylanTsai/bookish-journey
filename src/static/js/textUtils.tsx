import React from 'react';

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
export class ValidatedTextInputMonitor<T extends keyof any> extends TextInputMonitor {
  private _validationResults: ValidationResults<T>;
  private validate: (newTxt: string) => ValidationResults<T>;
  private onValidation: (validRes: ValidationResults<T>) => void

  constructor(onEmpty: () => void, onNotEmpty: (newTxt: string) => void,
    validate: (newTxt: string) => ValidationResults<T>,
    onValidation: (validRes: ValidationResults<T>) => void, debug = true) {

    let onEmptyCB = () => {
      let validationResults: ValidationResults<T> = validate("");
      this._validationResults = validationResults;
      onValidation(validationResults);
      onEmpty();
    }
    let onNotEmptyCB = (newTxt: string) => {
      let validationResults: ValidationResults<T> = validate(newTxt);
      this._validationResults = validationResults;
      onValidation(validationResults);
      onNotEmpty(newTxt);
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