import * as React from 'react';
import { ValidatedTextInputMonitor, ValidationResults } from '../textUtils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.min.css';
import { strict } from 'assert';

const MAX_AVAILABILITIES = 3;

export interface Availability {
  start: Date,
  end: Date,
  hoursPerWeek: number
}

export type EnterAvailabilityProps = {
  updateInfo: (availability: Availability[]) => void;
  renderNextBut: (teardown: () => void) => React.ReactElement;
}

type EnterAvailabilityState = {
  // All entered availabilities
  availabilities: Availability[];
  /**
   * How many of the entered availabilities will be submitted. Only the first
   * [numAvailabilities] entries in [availabilities] will be submitted.
  */
  numAvailabilities: number
}

export class EnterAvailability extends React.Component<EnterAvailabilityProps, EnterAvailabilityState> {
  constructor(props: EnterAvailabilityProps) {
    super(props);
    let init_availabilities: Availability[] = []
    for (let i = 0; i < MAX_AVAILABILITIES; i++) {
      init_availabilities.push({
        start: new Date(),
        end: new Date(),
        hoursPerWeek: 0
      })
    }
    this.state = {
      availabilities: init_availabilities,
      numAvailabilities: 1
    }
    this.removeAvailabilityField = this.removeAvailabilityField.bind(this);
    this.addAvailabilityField = this.addAvailabilityField.bind(this);
    this.teardown = this.teardown.bind(this);
  }

  /**
   * Removes the last availability field from the render.
   */
  private removeAvailabilityField(): void {
    console.log("here");
    if (this.state.availabilities.length <= 1) {
      throw RangeError("Must have at least 1 availability field");
    }
    this.setState(state => ({
      numAvailabilities: state.numAvailabilities - 1
    }));
  }

  /**
   * Render an additional availability field.
   */
  private addAvailabilityField(): void {
    if (this.state.numAvailabilities >= MAX_AVAILABILITIES) {
      throw RangeError(`Can't add more than ${this.state.numAvailabilities} availability fields`);
    }
    this.setState(state => ({
      numAvailabilities: state.numAvailabilities + 1
    }));
  }

  /**
   * A start or end date picker
   * @param isStart - true if this is a start date picker, false if end date picker
   * @param availabilityIdx - index in [state.availabilities] of the Availability 
   * this corresponds to.
   */
  private renderDatePicker(isStart: boolean, availabilityIdx: number): React.ReactElement {
    let setDate = (isStart: boolean, availabilityIdx: number, date: Date) =>
      this.setState(state => {
        let availabilities = state.availabilities;
        availabilities[availabilityIdx][isStart ? "start" : "end"] = date;
        return {
          availabilities: availabilities
        };
      });
    return <DatePicker
      selected={this.state.availabilities[availabilityIdx][isStart ? "start" : "end"]}
      onChange={date => setDate(isStart, availabilityIdx, date)}
    />;
  }

  /**
   * An hours-per-week input.
   * @param availabilityIdx - index in [state.availabilities] of the Availability 
   * this corresponds to.
   */
  private renderHoursInput(availabilityIdx: number): React.ReactElement {
    let updateHours = (idx: number, hours: number) =>
      this.setState(state => {
        let availabilities = state.availabilities;
        availabilities[idx].hoursPerWeek = hours;
        return {
          availabilities: availabilities
        };
      });
    return <input type="text"
      onChange={event => updateHours(availabilityIdx, parseInt(event.target.value))}
    />;
  }

  /**
   * An availability field with a start date picker, end date picker, and an 
   * hours-per-week input.
   * @param availabilityIdx - index in [state.availabilities] of the Availability 
   * this corresponds to.
   */
  private renderAvailabilityField(availabilityIdx: number) {
    return <div key={`availability-field-${availabilityIdx}`}>
      {this.renderDatePicker(true, availabilityIdx)}
      {this.renderDatePicker(false, availabilityIdx)}
      {this.renderHoursInput(availabilityIdx)}
    </div>
  }

  private teardown() {
    this.props.updateInfo(this.state.availabilities.splice(0, this.state.numAvailabilities));
  }

  render() {
    console.log("availabilities:");
    console.log(this.state.availabilities)
    return <>
      <div>
        {[...Array(this.state.numAvailabilities).keys()].map(
          (_, idx) => this.renderAvailabilityField(idx)
        )}
      </div>
      <div>
        <button onClick={this.removeAvailabilityField}>Remove</button>
        <button onClick={this.addAvailabilityField}>Add</button>
      </div>
      {this.props.renderNextBut(this.teardown)}
    </>
  }
}
