import ReactDOM from 'react-dom';
import React from 'react';
import { SymbaToolbar } from './symbaToolbar';
import { CreateUserCreds } from './createProfileComponents/createUserCreds';
import { updateStatePartial } from './stateUtils';
import { EnterAvailability, Availability } from './createProfileComponents/EnterAvailability';

type stageOpt =
  | "user_creds"
  | "availability"
  | "PLACEHOLDER"

type createProfileState = {
  stage: stageOpt,
  email: null | string,
  pw: null | string,
  availability: null | Availability[]
}

class CreateProfile extends React.Component<{}, createProfileState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      stage: "user_creds",
      email: null,
      pw: null,
      availability: null,
    };
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }
  render(): React.ReactElement {
    let updateInfoAndProceed;
    switch (this.state.stage) {
      case "user_creds":
        updateInfoAndProceed = (email: string, pw: string) => updateStatePartial(this, { email: email, pw: pw, stage: "availability" })
        return <CreateUserCreds updateInfo={updateInfoAndProceed} />
      case "availability":
        updateInfoAndProceed = (email: string, pw: string) => updateStatePartial(this, { email: email, pw: pw, stage: "PLACEHOLDER" })
        return <EnterAvailability updateInfo={updateInfoAndProceed} />
      case "PLACEHOLDER":
        throw Error("UNIMPLEMENTED")
    }
  }
}




let toolbarContainer = document.getElementById("symba-toolbar-container");
ReactDOM.render(<SymbaToolbar />, toolbarContainer);

let mainContainer = document.getElementById('create-profile-main-container');
ReactDOM.render(<CreateProfile />, mainContainer);