import * as React from 'react';
import bs from 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.min.css';
import index from '../../styles/index.css';
import KeyboardArrowLeftOutlinedIcon from '@material-ui/icons/KeyboardArrowLeftOutlined';
import { Superpowers } from './superpowers';

const MAX_AVAILABILITIES = 3;

export interface Availability {
  start: Date,
  end: Date,
  hoursPerWeek: HoursAvailableRange
}

export enum HoursAvailableRange {
  _none = "Not selected",
  _1_to_9 = "1-9 hours",
  _10_to_19 = "10-19 hours",
  _20_to_29 = "20-29 hours",
  _30_to_39 = "30-39 hours",
  _40_plus = "40+ hours (full-time)"
}

export type EnterAvailabilityProps = {
  updateInfo: (availability: Availability[]) => void;
  renderNextBut: (teardown: () => void, titleTxt: string, isDisabled: boolean) => JSX.Element;
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
        hoursPerWeek: HoursAvailableRange._none
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
   * @throws RangeError if there is currently only one availability field.
   */
  private removeAvailabilityField(): void {
    if (this.state.allAvailabilities.length <= 1) {
      throw RangeError("Must have at least 1 availability field");
    }
    this.setState(state => ({
      numAvailabilities: state.numAvailabilities - 1
    }));
  }

  /**
   * Render an additional availability field.
   * @throws RangeError if there is currently already the max allowed number of
   * availability fields.
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

  private headRender: JSX.Element = <>
    <div className={bs.row}>
      <div id="top-icon" className={`${bs['col-lg-12']} ${bs['col-md-12']}`}>
        <img src="https://via.placeholder.com/100" />
      </div>
      <div className={`${bs.row} ${index['superpowers-row']}`}>
        <div className={`${bs['col-lg-12']} ${bs['col-md-12']}`}>
          <h3>Let us know when you’re available to start an internship</h3>
        </div>
      </div>
      <div className={`${bs.row} ${index['superpowers-row']}`}>
        <div className={`${bs['col-lg-12']} ${bs['col-md-12']}`}>
          <h3>You can always update your availability later.</h3>
        </div>
      </div>
    </div>
  </>;

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
      validate = (newEndDate: Date) => { // if !isStart
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
    let updateHours = (idx: number, hours: HoursAvailableRange) => {
      if (!Object.values(HoursAvailableRange).includes(hours)) { // just a sanity check
        throw TypeError(`"${hours}" is not a valid range of available hours.`);
      }
      this.setState(state => {
        let availabilities = state.allAvailabilities;
        availabilities[idx].hoursPerWeek = hours;
        return {
          allAvailabilities: availabilities
        };
      });
    }
    return <select value={this.state.allAvailabilities[availabilityIdx].hoursPerWeek} className={`${bs["align-middle"]}`}
      onChange={value => updateHours(availabilityIdx, value.target.value as HoursAvailableRange)}>
      <option value={HoursAvailableRange._none} disabled>{HoursAvailableRange._none}</option>
      <option value={HoursAvailableRange._1_to_9}>{HoursAvailableRange._1_to_9}</option>
      <option value={HoursAvailableRange._10_to_19}>{HoursAvailableRange._10_to_19}</option>
      <option value={HoursAvailableRange._20_to_29}>{HoursAvailableRange._20_to_29}</option>
      <option value={HoursAvailableRange._30_to_39}>{HoursAvailableRange._30_to_39}</option>
      <option value={HoursAvailableRange._40_plus}>{HoursAvailableRange._40_plus}</option>
    </select>;
  }

  private renderTimeRangeErrMsg(availabilityIdx: number): JSX.Element {
    if (this.dateRangeValidities[availabilityIdx]) {
      return <></>;
    }
    return <>
      <div className={`${bs.row}`} key={`availability-field-err-${availabilityIdx}`}>
        <div className={bs["col-6"]}>
          <div key={`invalid-time-range-${availabilityIdx}`} style={{ color: "red", textAlign: "start" }}>
            Start date must be earlier than end date
          </div>
        </div>
      </div >
    </>;
  }

  /**
   * An availability field with a start date picker, end date picker, and an 
   * hours-per-week select.
   * Assumes that this element will be inside a bootstrap column.
   * @param availabilityIdx - index in [state.availabilities] of the Availability 
   * this corresponds to.
   */
  private renderAvailabilityField(availabilityIdx: number) {
    return <>
      <div className={`${bs.row} ${index["superpowers-row"]}`} key={`availability-field-header-${availabilityIdx}`}>
        <div>
          Time Frame #{availabilityIdx}
        </div>
      </div>
      <div className={bs.row} key={`availability-field-labels-${availabilityIdx}`}>
        <div className={bs["col-3"]} style={{ textAlign: "start" }}>
          Start Date
        </div>
        <div className={bs["col-3"]} style={{ textAlign: "start" }}>
          End Date
        </div>
        <div className={bs["col-3"]} style={{ textAlign: "start" }}>
          Hours per week
        </div>
      </div>
      <div className={bs.row} key={`availability-field-inputs-${availabilityIdx}`}>
        <div className={bs["col-3"]}>
          {this.renderDatePicker("start", availabilityIdx)}
        </div>
        <div className={bs["col-3"]}>
          {this.renderDatePicker("end", availabilityIdx)}
        </div>
        <div className={bs["col-3"]}>
          {this.renderHoursSelect(availabilityIdx)}
        </div>
      </div>
      {this.renderTimeRangeErrMsg(availabilityIdx)}
    </>;
  }

  private teardown() {
    this.props.updateInfo([...this.state.allAvailabilities].splice(0, this.state.numAvailabilities));
  }

  // TODO disable next button if any hours/week was not selected
  render() {
    console.log("availabilities:");
    console.log(this.state.allAvailabilities)
    return <>
      <div className={`${bs['col-lg-12']} ${bs['col-md-12']} ${bs['text-center']}`}>
        {this.headRender}
        <div className={bs.row}>
          <div className={`${bs['col-lg-12']} ${bs['col-md-12']}`}>
            {[...Array(this.state.numAvailabilities).keys()].map(
              (_, idx) => this.renderAvailabilityField(idx)
            )}
          </div>
        </div>
        <div className={bs.row}>
          <button className={`${bs.btn} ${bs["btn-danger"]}`}
            onClick={this.removeAvailabilityField}
            disabled={this.state.numAvailabilities <= 1}>Remove an availability</button>
          <button className={`${bs.btn} ${bs["btn-primary"]}`}
            onClick={this.addAvailabilityField}
            disabled={this.state.numAvailabilities >= 3}>Add an availability</button>
        </div>
        <div className={bs.row}>
          <div className={index.spacer}></div>
        </div>
        <div className={bs.row}>
          <div className={`${bs['col-lg-12']} ${bs['col-md-12']} ${index['superpowers-row']}`}>
            <button className={`${bs.btn} ${bs['btn-link']}`}>
              <KeyboardArrowLeftOutlinedIcon />
              Back
            </button>
            {this.props.renderNextBut(this.teardown, "Save availabilities", !this.dateRangesAreValid())}
          </div>
        </div>
      </div>
    </>
  }
}
