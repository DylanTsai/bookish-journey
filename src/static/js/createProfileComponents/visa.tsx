import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Select } from '../selectPopup.tsx';
import React from 'react';
import { textHeightDefault } from '../../styles/constants.css';
​
​
export type VisaStatusProps = {
	updateInfo: (visaStatus: string) => void,
	renderNextBut
}
​
​
export class EnterVisa extends React.Component<VisaStatusProps>{
  private visaData: string[] = ['I am a Lawful U.S Resident', 'I Will Require Sponsorship', 'I Have Temporary Work Status'];
​
  constructor(props) {
    super(props);
    this.renderSelectBox = this.renderSelectBox.bind(this);
  }
  private renderSelectBox(selection: string | null, forwardRef: React.RefObject<HTMLDivElement>): HTMLDivElement {
  if (selection === null) {
      selection = "Select Your Visa Status"
  }
  return <div style={{ width: 250 }} ref={forwardRef}>{selection}</div> as unknown as HTMLDivElement
 }
  public render() {
    return <Select
       renderOption={str => <div>{str}</div>}
       options={this.visaData}
       renderSelectBox={this.renderSelectBox}
       virtualizedListProps={{
         height: parseInt(textHeightDefault) * this.visaData.length,
         rowHeight: parseInt(textHeightDefault)
    }}/>
  }
}
