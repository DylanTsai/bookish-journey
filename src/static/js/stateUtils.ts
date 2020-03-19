import React from 'react'

/**
 * Calls setState with some properties updated.
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
 * (i.e. call setState) later. This is useful for making sure that [this.state]
 * is not mutated during an event handler (as that could cause unexpected behavior
 * if the behavior depends on what the state is). 
 * It can also be used to make sure re-rendering is batched and state updates
 * are matched when doing asynchronous work (where "matched" means you can make
 * sure you don't update one part of the state without updating another part)
 */
export class StateUpdateMachine<baseStateT extends Object, stateT extends baseStateT & any = baseStateT & any> {

  private _changes: Partial<stateT>; // key-value pairs to set in the state during [doUpdate]
  private readonly thisObj: React.Component<any, stateT>;

  constructor(thisObj: React.Component<any, stateT>) {
    this._changes = {};
    this.thisObj = thisObj;
  }

  register<propertyT extends keyof stateT>(property: propertyT,
    value: stateT[propertyT]): void {
    this._changes[property] = value;
  }

  doUpdate(): void {
    let newState: stateT = { ...this.thisObj.state };
    for (let key in this._changes) {
      newState[key] = (<stateT>this._changes)[key];
    }
    this.thisObj.setState(newState);
  }

  get newState(): stateT {
    return { ...this.newState };
  }
}