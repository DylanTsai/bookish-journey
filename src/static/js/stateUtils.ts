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

  private _changes: ((state: stateT) => Pick<stateT, keyof stateT>)[] // [doUpdate]
  private readonly thisObj: React.Component<any, stateT>;

  constructor(thisObj: React.Component<any, stateT>) {
    this._changes = [];
    this.thisObj = thisObj;
  }

  /**
   * Register a change to the state, which will be applied when doUpdate() is called.
   * @param property - name of property to be set
   * @param value - what to set that property to
   */
  register<propertyT extends keyof stateT>(property: propertyT, value: stateT[propertyT]): void
  /**
   * Register a change to the state, which will be applied when doUpdate() is called.
   * @param func - function that would be passed into setState
   */
  register<propertyT extends keyof stateT>(func: (state: stateT) => Pick<stateT, keyof stateT>): void
  register<propertyT extends keyof stateT>(param1: propertyT | ((state: stateT) => Pick<stateT, keyof stateT>),
    param2?: stateT[propertyT]): void {
    if (param2) {
      let key: propertyT = <propertyT>param1;
      let value: stateT[propertyT] = param2;
      this._changes.push(_ => { return <Pick<stateT, keyof stateT>><unknown>{ [key]: value } });
    } else {
      this._changes.push(<(state: stateT) => Pick<stateT, keyof stateT>>param1);
    }
  }

  /**
   * Apply all registered changes to the state, using the setState function.
   * Changes are applied in the order of registration (though it is not advised 
   * to have noncommutative state changes).
   */
  doUpdate(): void {
    this._changes.map(f => this.thisObj.setState(f));
  }

}