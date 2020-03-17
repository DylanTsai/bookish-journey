import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, useParams } from 'react-router-dom';
import { ValidatedTextInputMonitor, ValidationResults } from './textUtils';
import styleConsts from '../styles/constants.css';

export type CreatePasswordMainProps = {
  email: string
}

type PwReqs =
  | "gte_6_chars"
  | "contains_capital"
  | "contains_number_or_special";

let PwReqMessages: { [P in PwReqs]: string } = {
  gte_6_chars: "Must be at least 6 characters",
  contains_capital: "Must contain at least one capital letter",
  contains_number_or_special: "Must contain a number or special character"
}

const SimpleEmailInput = ({ match }) => (
  <input value={match.params.email} disabled />
);

export class CreatePasswordMain extends React.Component<CreatePasswordMainProps, { allValid: boolean }> {
  private email: string;
  private pwMonitor: ValidatedTextInputMonitor<PwReqs>

  constructor(props: CreatePasswordMainProps) {
    super(props);
    this.state = {
      allValid: false
    }
    this.email = props.email;
    this.validate.bind(this);
    this.pwMonitor = new ValidatedTextInputMonitor<PwReqs>(
      () => null,
      () => null,
      this.validate,
      () => this.setState({ allValid: true })
    );
  }

  private validate(txt): ValidationResults<PwReqs> {
    return {
      "gte_6_chars": txt.length >= 6,
      "contains_capital": /[A-Z]/.test(txt),
      "contains_number_or_special": /[^A-Za-z]/.test(txt)
    }
  }

  render() {
    let email = <>
      <div id="email">
        <div id="email-heading-container">
          Email
        </div>
        <div id="email-input-container">
          <Route path="/create-password/:email" component={SimpleEmailInput} />
        </div>
      </div>
    </>
    let make_empty_pw_feedback = () =>
      <div style={{ height: parseInt(styleConsts.textHeightDefault) * Object.keys(PwReqMessages).length }} />;
    let make_filled_pw_feedback = (validRes: ValidationResults<PwReqs>) =>
      Object.keys(PwReqMessages).map(
        (req) => {
          let icon = this.pwMonitor.validationResults[req] ? "GOOD" : "BAD";
          let msg = PwReqMessages[req];
          return <div key={req}>{icon}: {msg}</div>
        });
    let pw = <>
      <div id="pw">
        <div id="pw-heading-container">
          New password
        </div>
        <div id="pw-input-container">
          <input type="text" onChange={this.pwMonitor.onChange}></input>
        </div>
        <div id="pw-feedback-container">
          {this.pwMonitor.isEmpty() ?
            make_empty_pw_feedback() : make_filled_pw_feedback(this.pwMonitor.validationResults)
          }
        </div>
      </div>
    </>
    let submit = <div>
      <button id="submit-button" disabled={this.state.allValid}
        onClick={() => console.log("Submitted!")}>Submit</button>
    </div>
    return <>
      <Router>
        insert icon here!
        {email}
        {pw}
        {submit}
      </Router>
    </>
  }
}
ReactDOM.render(<CreatePasswordMain email="imanemail" />,
  document.getElementById("create-password-main-container"));