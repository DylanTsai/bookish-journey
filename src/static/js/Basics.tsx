import React from 'react';
import { ValidationResults } from './textUtils';

/**
 * Standardized horizontal line.
 * TODO: take in any props needed
 */
export class FadedHorizontalLine extends React.Component {
  render() {
    return <></>;
  }
}


export type BasicCardProps = {
  title?: string;
}
/**
 * Standard card with shadow and background color.
 * Each direct child is rendered with a [FadedHorizontalLine] put between
 * them.
 */
export class BasicCard extends React.Component<BasicCardProps> {

  render() {
    let rawChildren = React.Children.toArray(this.props.children);
    let processedChildren = rawChildren.reduce(
      (acc, curr) => <>
        {acc}
        <FadedHorizontalLine />
        {curr}
      </>
    );
    let title = <></>;
    if (this.props.title !== undefined) {
      title = <div></div> // TODO the title
    }
    return <>
      <div> {/* TODO styles for the card */}
        {title}
        {processedChildren}
      </div>
    </>
  }
}

/**
 * A card that usually goes inside of the BasicCard.
 * Background color but no shadow.
 */
export class InnerContentCard extends React.Component {
  render() {
    return <>
      <div>
        {this.props.children}
      </div>
    </>
  }
}

type RoundedThumbnailProps = {
  size: number // the diameter of the thumbnail, in px
  margin?: number // in px. Defaults to ___
  imagePath: string // The path to the image
}
/**
 * A circular thumbnail of [imagePath]. The displayed portion is a filled circle 
 * inscribed into a square that tightly bounds imagePath.
 */
export class RoundedThumbnail extends React.Component<RoundedThumbnailProps> {

  /**
   * This might look something like:
   * <div with height&width explicitly specified (sideLength = props.size + 2*props.margin)>
   *  <circle with size explicitly set>
   *    <image that expands to div size or circle size/>
   *  </circle>
   * </div>
   */
  render() {
    return <></>
  }
}

type FileInputProps = {
  validFileTypes: string[];
  maxFileSizeBytes: number;
  onValidUpload: (file: File) => any;
}
type FileInputState = {
  file: null | File // null if no file uploaded
  fileIsValid: null | boolean; // null if no file uploaded
  fileValidation: null | ValidationResults<"type" | "size">; // null if not file uploaded
}
/**
 * An element that prettily displays single-file input.
 */
export class FileInput extends React.Component<FileInputProps, FileInputState> {

  constructor(props: FileInputProps) {
    super(props);
    this.resetState();
    this.onFileUpload = this.onFileUpload.bind(this);
    this.onFileDelete = this.onFileDelete.bind(this);
  }

  private resetState() {
    let initState: FileInputState = {
      file: null,
      fileIsValid: null,
      fileValidation: null
    }
    this.setState(initState);
  }

  private fileValidation(file: File): ValidationResults<"type" | "size"> {
    let isCorrectType = this.props.validFileTypes.includes(file.type)
    let isGoodSize = file.size <= this.props.maxFileSizeBytes;
    return {
      type: isCorrectType,
      size: isGoodSize
    }
  }

  private onFileUpload(event: React.ChangeEvent<HTMLInputElement>): void {
    let file: File = event.target.files.item(0);
    let valid = this.fileValidation(file);
    let fileIsValid = Object.values(valid).every(t => t);
    if (fileIsValid) {
      this.props.onValidUpload(file);
    }
    this.setState({
      file: file,
      fileIsValid: fileIsValid,
      fileValidation: valid
    });
  }

  private onFileDelete(): void {
    this.resetState();
  }

  private renderFileErrorMsg(): JSX.Element {
    if (this.state.fileIsValid == false) {
      return <div>
        {this.state.fileValidation.size ? <></> : "booo the size is too big"}
        {this.state.fileValidation.type ? <></> : "ew this file is totally not my type"}
      </div>
    }
    return <></>
  }

  render() {
    if (this.state.fileIsValid != true) { // then fileIsValid is either null or false
      return <>
        <input type="file" onChange={this.onFileUpload} />
        {this.renderFileErrorMsg()}
        }
      </>
    }
    return <div>
      <div> {/* Displaying the  . Use [this.state.file.] */}

      </div>
      <button onClick={this.onFileDelete}> {/* The "x" button to remove the uploaded file */}
      </button>
    </div>;
  }
}