import ReactDOM from 'react-dom';
import React from 'react';
import { SymbaToolbar } from './symbaToolbar';
import { CreateUserCreds } from './createProfileComponents/createUserCreds';
import { EnterAvailability, Availability } from './createProfileComponents/EnterAvailability';

const stageOrder = [
  "user_creds",
  "availability",
  "PLACEHOLDER"
] as const;

if ((new Set(stageOrder)).size != stageOrder.length) {
  throw Error("stageOrder should not have duplicate entries");
}

export type stageOpt = typeof stageOrder[number];

class CreateProfileNavigator {
  private readonly getCurrStage:   () => stageOpt;
  private readonly navTo:          (newStage: stageOpt) => void;
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
  availability: null | Availability[]
}

class CreateProfile extends React.Component<{}, createProfileState> {
  private readonly navigator: CreateProfileNavigator;

  constructor(props: {}) {
    super(props);
    this.state = {
      stage: "user_creds",
      email: null,
      pw: null,
      availability: null,
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
   */
  renderNextBut(teardown: () => void) {
    return <button onClick={() => { teardown(); this.navigator.navToNext() }} />;
  }

  render(): React.ReactElement {
    let updateInfo;
    switch (this.state.stage) {
      case "user_creds":
        updateInfo = (email: string, pw: string) => this.setState({ email: email, pw: pw })
        return <CreateUserCreds updateInfo={updateInfo} />
      case "availability":
        updateInfo = (email: string, pw: string) => this.setState({ email: email, pw: pw })
        return <EnterAvailability updateInfo={updateInfo} />
      case "PLACEHOLDER":
        throw Error("UNIMPLEMENTED")
    }
  }
}




let toolbarContainer = document.getElementById("symba-toolbar-container");
ReactDOM.render(<SymbaToolbar />, toolbarContainer);

let mainContainer = document.getElementById('create-profile-main-container');
ReactDOM.render(<CreateProfile />, mainContainer);