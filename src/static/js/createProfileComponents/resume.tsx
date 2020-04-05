import React,{Component} from 'react';
import ReactDom from 'react-dom';
import S3FileUpload from 'react-s3';
import { uploadFile } from 'react-s3';
// S3FileUpload ,ReactS3, uploadFile

// Endpoint : http://symbabucket.s3-website.us-east-2.amazonaws.com
const config = {
    bucketName: 'symbabucket', //chekc this bucket name 
    //dirName: 'test', /* optional */
    region: 'us-east-2',
    accessKeyId: 'AKIAU6CD3WPKYG3X55I3',
    secretAccessKey: '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',
    //User ARN: arn:aws:iam::339444741077:user/Zhihao_Symba
}

// export type ResumeProps = {
//     updateInfo: (resumeUploaded: boolean) => void,
//     renderSubmitBtn: (teardown: () => void, titleTxt: string, isDisabled: boolean) => JSX.Element
//   }

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

export class ResumeUpload extends Component<{}> { ///>
    constructor(props){
        super(props);
    }
    upload(e){
        console.log(e.target.files[0]);
        
        uploadFile(e.target.files[0], config)
            .then(data=>{
                console.log(data);
                console.log(data.location);
                //this.props.updateInfo(true);
            })
            .catch(err =>{
                console.error(err)
                alert(err);
                //this.props.updateInfo(false);
            })
    }
    render() {
        return (
            <div>
                <h3>
                    Hi !123
                    AWS s3 Upload QQ
                    Hi !!!!!
                </h3>
                <input
                type = "file"
                onChange = {this.upload}
                />
            </div>
        );
      }
}

