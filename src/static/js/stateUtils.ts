import React from 'react'

/**
 * Utility to register changes to the state, and then apply those changes
 * (i.e. call setState) later. This is useful for making sure that [this.state]
 * is not mutated during an event handler (as that could cause unexpected behavior
 * if the behavior depends on what the state is). 
 * It can also be used to make sure re-rendering is batched and state updates
 * are matched when doing asynchronous work (where "matched" means you can make
 * sure you don't update one part of the state without updating another part)
 * 
 * TODO apply singleton pattern to StateUpdateMachine https://refactoring.guru/design-patterns/singleton/typescript/example
 */
export class StateUpdateMachine<stateT> {

  private _changes: Partial<stateT>; // key-value pairs to set in the state during [doUpdate]
  private readonly thisObj: React.Component<any, stateT>;

  constructor(thisObj: React.Component<any, stateT>) {
    this._changes = {};
    this.thisObj = thisObj;
  }

  /**
   * @returns The state that would be set if [doUpdate] were called.
   */
  get newStateStagedForChange(): stateT {
    let newState: stateT = { ...this.thisObj.state };
    for (let key in this._changes) {
      newState[key] = (<stateT>this._changes)[key];
    }
    return newState;
  }

  /**
   * Register a change to the state, which will be applied when doUpdate() is called. 
   * Registering a change to an already-registered property will overwrite that previous change.
   * @param property - name of property to be set
   * @param value - what to set that property to
   */
  register<propertyT extends keyof stateT>(property: propertyT, value: stateT[propertyT]): void {
    this._changes[property] = value;
  }

  /**
   * Apply all registered changes to the state, using the setState function.
   */
  doUpdate(): void {
    this.thisObj.setState(this.newStateStagedForChange);
  }

}