import React from "react";
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';


export type VisaStatusProps = {
    updateInfo: (visaStatus: string) => void,
    renderNextBut
  }


  export class EnterVisa extends React.Component<VisaStatusProps>{
private visaData: string[] = ['I am a Lawful U.S Resident', 'I Will Require Sponsorship', 'I Have Temporary Work Status'];
public render() {
  return (
    <DropDownListComponent id="ddlelement" dataSource={this.visaData} placeholder="Select Your Visa Status" />
  );
    }
}
