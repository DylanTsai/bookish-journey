import * as React from 'react';
import KeyboardArrowLeftOutlinedIcon from '@material-ui/icons/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@material-ui/icons/KeyboardArrowRightOutlined';

import bs from 'bootstrap/dist/css/bootstrap.min.css';
import index from '../../styles/index.css';
import { clJoin } from '../stringUtils';
import { Superpower } from './superpowers';

export type concentration = {
  superpower: Superpower,
  concentrationName: string
};

export type ConcentrationProps = {
  selectedSuperpowers: Superpower[];
  updateInfo: (selectedConcentrations: concentration[]) => void;
  renderNextBut
}

type ConcentrationState = {
  focusedSuperpower: Superpower;
  selectedConcentrations: boolean[];
  fetchingConcentrations: boolean
};

/**
 * Requires that '==' works on Superpowers.
 */
export class Concentration extends React.Component<ConcentrationProps, ConcentrationState> {

  private possibleConcentrations: concentration[] = []

  constructor(props: ConcentrationProps) {
    super(props);
    let selectedConcentrations = {};
    props.selectedSuperpowers.map(
      (superpower) => selectedConcentrations[superpower] = new Set<concentration>()
    );
    this.state = {
      focusedSuperpower: this.props.selectedSuperpowers[0],
      selectedConcentrations: [],
      fetchingConcentrations: true
    }
  }

  componentDidMount() {
    Promise.resolve([]).then(
      (concentrations) => {
        this.possibleConcentrations = concentrations;
        this.setState({
          selectedConcentrations: concentrations.map(() => false),
          fetchingConcentrations: false
        });
      });
  }

  private concentrationEquals(c1: concentration, c2: concentration): boolean {
    return c1.concentrationName == c2.concentrationName && c2.superpower == c2.superpower;
  }

  // private concentrationIsSelected(
  //   thisConcentration: Concentration,
  //   state: ConcentrationState = this.state
  // ): boolean {
  //   return state.selectedConcentrations.some(
  //     (isSelected, idx) => isSelected && this.possibleConcentrations[idx] == thisConcentration
  //   );
  // }

  /**
   * Toggles whether the concentration with index [idx] in possibleConcentrations
   * is selected.
   */
  private toggleSelection(idx: number) {
    this.setState(state => {
      let copy = [...state.selectedConcentrations];
      copy[idx] = !copy[idx];
      return { selectedConcentrations: copy };
    })
  }

  private renderConcentrationCards(): JSX.Element {
    let focusedConcentrations = this.possibleConcentrations.filter(
      c => c.superpower == this.state.focusedSuperpower
    );
    return <>
      {focusedConcentrations.map((concentration, idx) => {
        let selectedClass = this.state.selectedConcentrations[idx] ? index['power-card-selected'] : index['power-card'];
        let toggleSelect = () => this.toggleSelection(idx);
        return <div className={clJoin({ 'bs': ['row'], 'index': ['superpowers-row'] })}>
          <div className={clJoin({ 'bs': ['card', 'shadow'] }) + ' ' + selectedClass} onClick={toggleSelect}>
            <div className={clJoin({ 'bs': ['card-body', 'text-center', 'd-flex', 'flex-column', 'justify-content-between'] })}>
              <div style={{ height: "100px" }}>
                <h3>
                  {concentration.concentrationName}
                </h3>
              </div>
            </div>
          </div>
        </div>;
      })}
    </>;
  }

  /**
   * The next superpower (to choose concentrations from).
   * Null if the current superpower is the last superpower.
   */
  private nextSuperpower(): Superpower | null {
    let newSuperpowerIdx = this.props.selectedSuperpowers.indexOf(this.state.focusedSuperpower) + 1
    if (newSuperpowerIdx >= this.props.selectedSuperpowers.length) {
      return null;
    }
    return this.props.selectedSuperpowers[newSuperpowerIdx];
  }

  /**
   * The previous superpower (which concentrations were chosen from).
   * Null if the current superpower is the first superpower.
   */
  private prevSuperpower(): Superpower | null {
    let newSuperpowerIdx = this.props.selectedSuperpowers.indexOf(this.state.focusedSuperpower) - 1
    if (newSuperpowerIdx < 0) {
      return null;
    }
    return this.props.selectedSuperpowers[newSuperpowerIdx];
  }

  private renderNavBtns(): JSX.Element {
    let prevBtn: JSX.Element;
    let nextBtn: JSX.Element;
    let prev = this.prevSuperpower();
    if (prev == null) {
      prevBtn = <button className={clJoin({ 'bs': ['btn', 'btn-link'] })}>
        <KeyboardArrowLeftOutlinedIcon />
        Back
      </button>
    } else {
      prevBtn = <button onClick={() => this.setState({ focusedSuperpower: prev! })}>
        <KeyboardArrowLeftOutlinedIcon />
        Edit {prev} Concentrations
      </button>
    }

    let next = this.nextSuperpower();
    if (next == null) {
      let teardown = () => {
        let selection = this.possibleConcentrations.filter(
          (_, idx) => this.state.selectedConcentrations[idx]
        );
        this.props.updateInfo(selection);
      };
      nextBtn = this.props.renderNextBut(teardown, "Next", false);
    } else {
      nextBtn = <button className={clJoin({ 'bs': ['btn', 'btn-link'] })}
        onClick={() => this.setState({ focusedSuperpower: next! })}>
        Edit {next} Concentrations
      <KeyboardArrowRightOutlinedIcon />
      </button>
    }
    return <div className={bs.row}>
      <div className={clJoin({ 'bs': ['col-lg-12', 'col-md-12'], 'index': ['superpowers-row'] })}>
        {prevBtn}
        {nextBtn}
      </div>
    </div>
  }

  render() {
    return <>
      <div className={clJoin({ 'bs': ['col-lg-12', 'col-md-12', 'text-center'] })}>
        <div className={bs.row}>
          <div id="top-icon" className={clJoin({ 'bs': ['col-lg-12', 'col-md-12'] })}>
            <img src="https://via.placeholder.com/100" />
          </div>
        </div>
        <div className={clJoin({ 'bs': ['row'], 'index': ['superpowers-row'] })}>
          <div className={clJoin({ 'bs': ['col-lg-12', 'col-md-12'] })}>
            <h3>Very impressive, what are your areas of <br /> expertise within {this.state.focusedSuperpower}?</h3>
          </div>
        </div>
        <div className={clJoin({ 'bs': ['row'], 'index': ['superpowers-row'] })}>
          <div className={clJoin({ 'bs': ['col-lg-12', 'col-md-12'] })}>
            <h5>Choose as many as you like.</h5>
          </div>
        </div>
        {
          this.state.fetchingConcentrations ?
            <>Loading...</>
            : this.renderConcentrationCards()
        }
        <div className={bs.row}>
          <div className={index.spacer}></div>
        </div>
        {this.renderNavBtns()}
      </div>
    </>;
  }
}