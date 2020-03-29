import 'babel-polyfill';
import ReactDOM from 'react-dom';
import React from 'react';
import bs from 'bootstrap/dist/css/bootstrap.min.css';
import index from '../styles/index.css';
import { SymbaToolbar } from './symbaToolbar';
import { CreateUserCreds } from './createProfileComponents/createUserCreds';
import { EnterAvailability, Availability } from './createProfileComponents/availability';
import { EnterSkills } from './createProfileComponents/skill';
import { Superpowers } from './createProfileComponents/superpowers';

const stageOrder = [
  "superpower",
  "skill",
  "user_creds",
  "welcome",
  "location",
  "school",
  "visa",
  "expertise",
  "resume",
  "availability"
] as const;

if ((new Set(stageOrder)).size != stageOrder.length) {
  throw Error("stageOrder should not have duplicate entries");
}

export type stageOpt = typeof stageOrder[number];

class CreateProfileNavigator {
  private readonly getCurrStage: () => stageOpt;
  private readonly navTo: (newStage: stageOpt) => void;
  private readonly afterLastStage: () => void;

  constructor(
    getCurrStage: () => stageOpt,
    setStage: (newStage: stageOpt) => void,
    afterLastStage: () => void) {
    this.getCurrStage = getCurrStage;
    this.navTo = setStage;
    this.afterLastStage = afterLastStage;
  }

  /**
   * @returns The next stage, or null if this is the last stage.
   */
  private nextStage(): stageOpt | null {
    let i: number = stageOrder.indexOf(this.getCurrStage()) + 1
    return i > stageOrder.length ? null : stageOrder[i];
  }

  /**
   * @returns The previous stage, or null if this is the first stage.
   */
  private prevStage(): stageOpt | null {
    let i: number = stageOrder.indexOf(this.getCurrStage()) - 1
    return i < 0 ? null : stageOrder[i];
  }

  /**
   * @returns True if this is not the last stage.
   */
  hasNext(): boolean { return this.nextStage() != null; }

  /**
   * @returns True if this is not the first stage.
   */
  hasPrev(): boolean { return this.prevStage() != null; }

  /**
   * Navigates to the next stage. If this is the last stage, called
   * [afterLastStage].
   */
  navToNext(): void {
    if (!this.hasNext()) {
      this.afterLastStage();
    }
    this.navTo(this.nextStage() as stageOpt);
  }

  /**
   * Navigates to the previous stage.
   * @throws 
   *  If this is the last stage, called
   * [afterLastStage].
   */
  navToPrev(): void {
    if (!this.hasPrev()) {
      throw RangeError("No next stage to navigate to!");
    }
    this.navTo(this.prevStage() as stageOpt);
  }
}

type createProfileState = {
  stage: stageOpt,
  email: null | string,
  pw: null | string,
  skills: string[],
  availability: null | Availability[],
  selectedCats: string[]
}

class CreateProfile extends React.Component<{}, createProfileState> {
  private readonly navigator: CreateProfileNavigator;

  constructor(props: {}) {
    super(props);
    this.state = {
      stage: stageOrder[0],
      email: null,
      pw: null,
      skills: [],
      availability: null,
      selectedCats: []
    };
    this.navigator = new CreateProfileNavigator(
      () => this.state.stage,
      (stage) => this.setState({ stage: stage }),
      () => {
        throw Error("Unimplemented");
      }
    );
    this.renderNextBut = this.renderNextBut.bind(this);
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  /**
   * The button that brings up the next stage in the profile creation process.
   * @param teardown - Called before navigating to the next stage. Use this
   * callback to save variables or clear state in the stage-specific component(s).
   * @param titleTxt - Text to display on button.
   * @param isDisabled - True if button should be disabled, false otherwise.
   * @param extraClassStrings - Optional space-separated list of class strings to 
   * add further styles onto the button.
   */
  renderNextBut(teardown: () => void, titleTxt: string, isDisabled: boolean) {
    return <button
      className={index.navNextBtn + ` ${bs.btn} ${bs["btn-info"]}`}
      disabled={isDisabled}
      onClick={() => { teardown(); this.navigator.navToNext() }}>
      {titleTxt}
    </button>;
  }

  render(): React.ReactElement {
    let updateInfo, bodyElement;
    switch (this.state.stage) { // set bodyElement
      case "user_creds":
        updateInfo = (email: string, pw: string) => this.setState({ email: email, pw: pw });
        bodyElement = <CreateUserCreds updateInfo={updateInfo} renderNextBut={this.renderNextBut} />;
        break;
      case "welcome":
        throw Error("UNIMPLEMENTED");
        break;
      case "location":
        throw Error("UNIMPLEMENTED");
        break;
      case "school":
        throw Error("UNIMPLEMENTED");
        break;
      case "visa":
        throw Error("UNIMPLEMENTED");
        break;
      case "superpower":
        updateInfo = (selectedCats: string[]) => this.setState({ selectedCats });
        bodyElement = <Superpowers updateInfo={updateInfo} renderNextBut={this.renderNextBut} />
        break;
      case "expertise":
        throw Error("UNIMPLEMENTED");
        break;
      case "skill":
        bodyElement = <EnterSkills updateInfo={skills => this.setState({ skills: skills })} renderSubmitBtn={this.renderNextBut} />
        break;
      case "resume":
        throw Error("UNIMPLEMENTED");
        break;
      case "availability":
        updateInfo = (availability: Availability[]) => this.setState({ availability: availability });
        bodyElement = <EnterAvailability updateInfo={updateInfo} renderNextBut={this.renderNextBut} />
        break;
    }

    return <div className={`${bs.row} ${bs['w-100']}`}>{bodyElement}</div>;
  }
}


let toolbarContainer = document.getElementById("symba-toolbar-container");
ReactDOM.render(<SymbaToolbar />, toolbarContainer);

// Apply bootstrap classes to main container
let mainBSClasses = [
  bs['container-fluid'], bs['d-flex'], bs['justify-content-center'],
  bs['align-items-center'], bs['h-100'], index["create-profile-main-container"]
];
let mainContainer = document.getElementById('create-profile-main-container');
mainContainer ?.classList.add(...mainBSClasses);
ReactDOM.render(<CreateProfile />, mainContainer);