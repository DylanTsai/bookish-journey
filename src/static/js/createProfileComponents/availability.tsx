import * as React from 'react';
import { ValidatedTextInputMonitor, ValidationResults } from '../textUtils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.min.css';

const MAX_AVAILABILITIES = 3;

export interface Availability {
  start: Date,
  end: Date,
  hoursPerWeek: number
}

export type EnterAvailabilityProps = {
  updateInfo: (availability: Availability[]) => void;
  renderNextBut: (teardown: () => void, titleTxt: string, isDisabled: boolean, extraClassStrings?: string) => JSX.Element;
}

type EnterAvailabilityState = {
  // All entered availabilities
  allAvailabilities: Availability[];
  /**
   * How many of the entered availabilities will be submitted. Only the first
   * [numAvailabilities] entries in [availabilities] will be submitted.
  */
  numAvailabilities: number
}

export class EnterAvailability extends React.Component<EnterAvailabilityProps, EnterAvailabilityState> {

  // dateRangeValidities[i] is true iff state.availabilities[i] has a start date
  // earlier than its end date.
  private dateRangeValidities: boolean[];

  constructor(props: EnterAvailabilityProps) {
    super(props);
    let init_availabilities: Availability[] = [];
    this.dateRangeValidities = [];
    for (let i = 0; i < MAX_AVAILABILITIES; i++) {
      init_availabilities.push({
        start: new Date(),
        end: new Date(),
        hoursPerWeek: 0
      });
      this.dateRangeValidities.push(false);
    }
    this.state = {
      allAvailabilities: init_availabilities,
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
    if (this.state.allAvailabilities.length <= 1) {
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
   * True iff each availability that will be submitted has a start date
   * earlier than its end date.
   */
  private dateRangesAreValid(): boolean {
    return this.dateRangeValidities.reduce(
      (acc, curr, availabilityIdx) => acc && (curr || availabilityIdx > this.state.numAvailabilities)
    );
  }

  /**
   * A start or end date picker
   * @param startOrEnd - "start" if this is a start date picker, "end" if end date picker
   * @param availabilityIdx - index in [state.availabilities] of the Availability 
   * this corresponds to.
   */
  private renderDatePicker(startOrEnd: "start" | "end", availabilityIdx: number): React.ReactElement {
    let isStart: boolean = startOrEnd == "start";
    let setDate = (isStart: boolean, availabilityIdx: number, date: Date) =>
      this.setState(state => {
        let availabilities = state.allAvailabilities;
        availabilities[availabilityIdx][isStart ? "start" : "end"] = date;
        return {
          allAvailabilities: availabilities
        };
      });
    let validate = (newStartDate: Date) => { // if isStart
      let endDate = this.state.allAvailabilities[availabilityIdx].end;
      return newStartDate < endDate
    };
    if (!isStart) {
      validate = (newEndDate: Date) => { // if isStart
        let startDate = this.state.allAvailabilities[availabilityIdx].end;
        return newEndDate > startDate
      };
    }
    return <DatePicker
      selected={this.state.allAvailabilities[availabilityIdx][isStart ? "start" : "end"]}
      onChange={date => {
        setDate(isStart, availabilityIdx, date);
        this.dateRangeValidities[availabilityIdx] = validate(date);
      }}
    />;
  }

  /**
   * An hours-per-week select.
   * @param availabilityIdx - index in [state.availabilities] of the Availability 
   * this corresponds to.
   */
  private renderHoursSelect(availabilityIdx: number): React.ReactElement {
    let updateHours = (idx: number, hours: number) =>
      this.setState(state => {
        let availabilities = state.allAvailabilities;
        availabilities[idx].hoursPerWeek = hours;
        return {
          allAvailabilities: availabilities
        };
      });
    return <select value={this.state.allAvailabilities[availabilityIdx].hoursPerWeek}
      onChange={value => updateHours(availabilityIdx, parseInt(value.target.value))}>
      <option value="1">1-9 hours</option>
      <option value="10">10-19 hours</option>
      <option value="20">20-29 hours</option>
      <option value="30">30-39 hours</option>
      <option value="40">40+ hours (full-time)</option>
    </select>;
  }

  private invalidTimeRange: JSX.Element = <>Start must be before end</>

  /**
   * An availability field with a start date picker, end date picker, and an 
   * hours-per-week select.
   * @param availabilityIdx - index in [state.availabilities] of the Availability 
   * this corresponds to.
   */
  private renderAvailabilityField(availabilityIdx: number) {
    return <div key={`availability-field-${availabilityIdx}`}>
      {this.renderDatePicker(true, availabilityIdx)}
      {this.renderDatePicker(false, availabilityIdx)}
      {this.renderHoursSelect(availabilityIdx)}
      {this.dateRangeValidities[availabilityIdx] ? <></> : this.invalidTimeRange}
    </div>
  }

  private teardown() {
    this.props.updateInfo(this.state.allAvailabilities.splice(0, this.state.numAvailabilities));
  }

  render() {
    console.log("availabilities:");
    console.log(this.state.allAvailabilities)
    return <>
      <div>
        {[...Array(this.state.numAvailabilities).keys()].map(
          (_, idx) => this.renderAvailabilityField(idx)
        )}
      </div>
      <div>
        <button onClick={this.removeAvailabilityField}
          disabled={this.state.numAvailabilities <= 1}>Remove</button>
        <button onClick={this.addAvailabilityField}
          disabled={this.state.numAvailabilities >= 3}>Add</button>
      </div>
      {this.props.renderNextBut(this.teardown, "Save availabilities", !this.dateRangesAreValid())}
    </>
  }
}
