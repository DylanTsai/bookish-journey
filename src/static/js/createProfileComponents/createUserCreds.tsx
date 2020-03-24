import * as React from 'react';
import bs from 'bootstrap/dist/css/bootstrap.min.css';
import styleConsts from '../../styles/constants.css';
import { ValidatedTextInputMonitor, ValidationResults } from '../textUtils';
import { StateUpdateMachine } from '../stateUtils';

type PwReqs =
  | "gte_6_chars"
  | "contains_capital"
  | "contains_number_or_special";

let PwReqMessages: { [P in PwReqs]: string } = {
  gte_6_chars: "Must be at least 6 characters",
  contains_capital: "Must contain at least one capital letter",
  contains_number_or_special: "Must contain a number or special character"
}

export type CreateUserCredsProps = {
  updateInfo: (email: string, pw: string) => void
}

export type CreateUserCredsState = {
  emailValid: boolean,
  pwValid: boolean
}

export class CreateUserCreds extends React.Component<CreateUserCredsProps, CreateUserCredsState> {
  private pwMonitor: ValidatedTextInputMonitor<PwReqs, CreateUserCredsState>

  constructor(props: CreateUserCredsProps) {
    super(props);
    this.state = {
      emailValid: false,
      pwValid: false
    }
    this.validate.bind(this);
    this.pwMonitor = new ValidatedTextInputMonitor<PwReqs, CreateUserCredsState>(
      () => null,
      () => null,
      this.validate,
      (validRes: ValidationResults<PwReqs>,
        stateUpdateMachine: StateUpdateMachine<CreateUserCredsState>) => {
        let validPw: boolean = Object.values(validRes).every(b => b);
        stateUpdateMachine.register("pwValid", validPw);
      },
      this
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
    let name = <>
      <form id="text" className={bs['text-left']}>
        <div id="name-heading-container">
          Name
        </div>
        <div id="name-input-container">
          <input className={bs["form-control"]} />
        </div>
      </form>
    </>
    let email = <>
      <form id="email" className={bs['text-left']}>
        <div id="email-heading-container">
          Email
        </div>
        <div id="email-input-container">
          <input className={bs["form-control"]} type="email" value={"TODO: use ValidatedTextInput to verify email creds and put email into state"} disabled />
        </div>
      </form>
    </>
    let make_empty_pw_feedback = () =>
      <div style={{ height: parseInt(styleConsts.textHeightDefault) * Object.keys(PwReqMessages).length }} />;
    let make_filled_pw_feedback = (validRes: ValidationResults<PwReqs>) =>
      Object.keys(PwReqMessages).map(
        (req) => {
          let icon = this.pwMonitor.validationResults[req] ? "✅" : "❌";
          let msg = PwReqMessages[req];
          return <div key={req}>{icon}: {msg}</div>
        });
    let pw = <>
      <div id="pw" className={bs["text-left"]}>
        <div id="pw-heading-container">
          New password
        </div>
        <div id="pw-input-container">
          <input type="password" className={bs["form-control"]} onChange={this.pwMonitor.onChange}></input>
        </div>
        <div id="pw-feedback-container">
          {this.pwMonitor.isEmpty() ?
            make_empty_pw_feedback() : make_filled_pw_feedback(this.pwMonitor.validationResults)
          }
        </div>
      </div>
    </>
    let submitBtn = <div>
      <button className={`${bs.btn} ${bs["btn-info"]}`} id="submit-button" disabled={!this.state.pwValid}
        onClick={() => { this.props.updateInfo("TODO email", this.pwMonitor.text) }}>
        Create Account
      </button>
    </div>
    return (
      <div className={`${bs.card} ${bs['w-100']} ${bs.shadow} ${bs['text-center']}`}>
        <div className={bs['card-body']}>
          <img className={`${bs['mx-auto']} ${bs['d-block']}`} src="/dist/img/symba-s@1x.png" width={50} />
          <h4 className={bs['card-title']}>Welcome to Symba</h4>
          {name}
          {email}
          {pw}
          {submitBtn}
        </div>
      </div>
    )
  }
}
