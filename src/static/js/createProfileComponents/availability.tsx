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

type rangeWithValidity = {
  // is true iff state.availabilities[i] has a start date earlier than its end date.
  validity: boolean;
  availability: Availability;
}

type EnterAvailabilityState = {
  availabilities: rangeWithValidity[];
}

export class EnterAvailability extends React.Component<EnterAvailabilityProps, EnterAvailabilityState> {

  constructor(props: EnterAvailabilityProps) {
    super(props);
    this.state = {
      availabilities: []
    }
    this.removeAvailabilityField = this.removeAvailabilityField.bind(this);
    this.addAvailabilityField = this.addAvailabilityField.bind(this);
    this.teardown = this.teardown.bind(this);
  }

  private defaultAvailability(): rangeWithValidity {
    return {
      validity: false, // because the end date is not strictly after the start date
      availability: {
        start: new Date(),
        end: new Date(),
        hoursPerWeek: HoursAvailableRange._none
      }
    }
  }

  /**
   * Returns the [idx]th availability in the state.
   */
  private getAvail(idx: number): Availability {
    return this.state.availabilities[idx].availability;
  }

  /**
   * Removes the [idx]th availability field from the render.
   * @throws RangeError if there is currently only one availability field.
   */
  private removeAvailabilityField(idx: number): void {
    this.setState(state => {
      let newAvailabilities = [...state.availabilities];
      newAvailabilities.splice(idx, 1);
      return { availabilities: newAvailabilities }
    });
  }

  /**
   * Render an additional availability field.
   * @throws RangeError if there is currently already the max allowed number of
   * availability fields.
   */
  private addAvailabilityField(): void {
    let numAvailabilities = this.state.availabilities.length;
    if (numAvailabilities >= MAX_AVAILABILITIES) {
      throw RangeError(`Can't add more than ${numAvailabilities} availability fields`);
    }
    this.setState(state => ({
      availabilities: [...state.availabilities, this.defaultAvailability()]
    }));
  }

  /**
   * True iff the [idx]th availability has a start date
   * earlier than its end date.
   */
  private rangeIsValid(idx: number) {
    return this.state.availabilities[idx].validity;
  }

  /**
   * True iff each availability in the current state has a start date
   * earlier than its end date.
   */
  private dateRangesAreValid(): boolean {
    return this.state.availabilities.reduce(
      (acc, curr) => acc && curr.validity,
      true
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
        let availabilities = state.availabilities;
        availabilities[availabilityIdx].availability[isStart ? "start" : "end"] = date;
        return {
          availabilities: availabilities
        };
      });
    let validate = (newStartDate: Date) => { // if isStart
      let endDate = this.getAvail(availabilityIdx).end;
      return newStartDate < endDate;
    };
    if (!isStart) {
      validate = (newEndDate: Date) => { // if !isStart
        let startDate = this.getAvail(availabilityIdx).end;
        return newEndDate > startDate
      };
    }
    return <DatePicker
      selected={this.getAvail(availabilityIdx)[isStart ? "start" : "end"]}
      onChange={date => {
        setDate(isStart, availabilityIdx, date);
        this.state.availabilities[availabilityIdx].validity = validate(date);
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
        let availabilities = state.availabilities;
        availabilities[idx].availability.hoursPerWeek = hours;
        return {
          availabilities: availabilities
        };
      });
    }
    return <select value={this.state.availabilities[availabilityIdx].availability.hoursPerWeek} className={`${bs["align-middle"]}`}
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
    if (this.rangeIsValid(availabilityIdx)) {
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
          Time Frame #{availabilityIdx + 1}
        </div>
        <button className={`${bs.btn} ${bs["btn-danger"]}`}
          onClick={() => this.removeAvailabilityField(availabilityIdx)}>
          X
        </button>
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
    this.props.updateInfo([...this.state.availabilities].map(a => a.availability));
  }

  // TODO disable next button if any hours/week was not selected
  render() {
    console.log("availabilities:");
    console.log(this.state.availabilities)
    return <>
      <div className={`${bs['col-lg-12']} ${bs['col-md-12']} ${bs['text-center']}`}>
        {this.headRender}
        <div className={bs.row}>
          <div className={`${bs['col-lg-12']} ${bs['col-md-12']}`}>
            {this.state.availabilities.map(
              (_, idx) => this.renderAvailabilityField(idx)
            )}
          </div>
        </div>
        <div className={bs.row}>
          <button className={`${bs.btn} ${bs["btn-primary"]}`}
            onClick={this.addAvailabilityField}
            disabled={this.state.availabilities.length >= 3}>Add an availability</button>
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
