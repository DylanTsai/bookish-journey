import React from 'react'

/**
 * Calls setState with 
 * @param cls React Component to call setState() from
 * @param property Property to change
 * @param value Value to set property to
 */
export function updateStatePartial<stateT extends Object, clsT extends React.Component<any, stateT & any>>
  (cls: clsT, changes: Partial<stateT>) {
  let newState: stateT & any = { ...cls.state };
  for (let key in changes) {
    if (changes[key]) {
      newState[key] = (<stateT>changes)[key];
    }
  }
  cls.setState(newState);
}

/**
 * Utility to register changes to the state, and then apply those changes
 * (i.e. call setState) later. This is useful.
 */
export class StateUpdateMachine<baseStateT extends Object, stateT extends baseStateT & any = baseStateT & any> {

  private _changes: Partial<stateT>;
  private readonly cls: React.Component<any, stateT>;

  constructor(thisObj: React.Component<any, stateT>) {
    this._changes = {};
    this.cls = thisObj;
  }

  register<propertyT extends keyof stateT>(property: propertyT,
    value: stateT[propertyT]): void {
    this._changes[property] = value;
  }

  doUpdate(): void {
    let newState: stateT = { ...this.cls.state };
    for (let key in this._changes) {
      newState[key] = (<stateT>this._changes)[key];
    }
    this.cls.setState(newState);
  }

  get newState(): stateT {
    return { ...this.newState };
  }
}