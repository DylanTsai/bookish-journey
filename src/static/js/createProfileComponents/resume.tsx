import React,{Component} from 'react';
import ReactDom from 'react-dom';
import S3FileUpload from 'react-s3';
import { uploadFile } from 'react-s3';

import KeyboardArrowLeftOutlinedIcon from '@material-ui/icons/KeyboardArrowLeftOutlined';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import bs from 'bootstrap/dist/css/bootstrap.min.css';
import index from '../../styles/index.css';
import styleConsts from '../../styles/constants.css';
import { clJoin } from '../stringUtils';

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

export type ResumeProps = {
    updateInfo: (resumeAddress: string) => void,
    renderSubmitBtn: (teardown: () => void, titleTxt: string, isDisabled: boolean) => JSX.Element
  }

export class ResumeUpload extends Component<ResumeProps, {}> {
    constructor(props){
        super(props);
        this.state = {
            file: null,
            address: null
        };
    }
    upload = (event) => {
        event.preventDefault();
        console.log(this.state.file);
        uploadFile(this.state.file, config)
            .then(data=>{
                console.log(data);
                console.log(data.location);
                alert("Upload Success");
                this.props.updateInfo(data.location);
                this.setState({address: data.location});
            })
            .catch(err =>{
                console.error(err)
                alert(err);
            })
    }
    handleFileUpload = (event) => {
        console.log(event.target.files[0]);
        this.setState({file: event.target.files[0]});
    }

    render() {
        let nextBtn = this.props.renderNextBut(teardown, "Next", false);

        return (
            <div>
                <h3>
                    Hi !
                    AWS s3 Upload Here
                </h3>
                <form onSubmit={this.upload}>
                    <input type='file' onChange={this.handleFileUpload} />
                <button type='submit'>Send</button>
                </form>
          </div>
          
        );
      }
}

