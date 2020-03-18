import * as React from 'react';
import { ValidatedTextInputMonitor, ValidationResults } from '../textUtils';


export interface Availability {
  start: Date,
  end: Date,
  hoursPerWeek: number
}

export type EnterAvailabilityProps = {
  updateInfo: (availability: string, pw: string) => void
}

export type EnterAvailabilityState = {
  emailValid: boolean,
  pwValid: boolean
}

export class EnterAvailability extends React.Component<EnterAvailabilityProps, EnterAvailabilityState> {
  constructor(props: EnterAvailabilityProps) {
    super(props);
  }
  render() {
    return <>TODO: EnterAvailability</>
  }
}