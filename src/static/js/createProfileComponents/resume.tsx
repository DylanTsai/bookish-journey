import React,{Component} from 'react';
import ReactDom from 'react-dom';
import ReactS3 from 'react-s3';
// S3FileUpload ,ReactS3, uploadFile

const config = {
    bucketName: 'symbabucket',
    dirName: 'test', /* optional */
    region: 'us-east-2',
    accessKeyId: 'AKIAJ3UH47GMOD76NT7Q',
    secretAccessKey: '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',
}

export type ResumeProps = {
    updateInfo: (resumeUploaded: boolean) => void,
    renderSubmitBtn: (teardown: () => void, titleTxt: string, isDisabled: boolean) => JSX.Element
  }

/*
S3FileUpload
    .uploadFile(file, config)
    .then(data => console.log(data))
    .catch(err => console.error(err))
 */

  /**
   * {
   *   Response: {
   *     bucket: "your-bucket-name",
   *     key: "photos/image.jpg",
   *     location: "https://your-bucket.s3.amazonaws.com/photos/image.jpg"
   *   }
   * }
   */

export class ResumeUpload extends Component<ResumeProps, {}> {
    constructor(props){
        super(props);
    }
    upload(e){
        console.log(e.target.files[0]);
        ReactS3.upload(e.target.files[0], config)
            .then( (data)=>{
                console.log(data.location);
                this.props.updateInfo(true);
            })
            .catch( (err) =>{
                alert(err);
                this.props.updateInfo(false);
            })
    }
    render() {
        return (
            <div>
                <h3>
                    AWS s3 Upload
                </h3>
                <input
                type = "file"
                onChange = {this.upload}
                />
            </div>
        );
      }
}

