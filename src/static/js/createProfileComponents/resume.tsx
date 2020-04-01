import React,{Component} from 'react';
import ReactDom from 'react-dom';
import S3FileUpload from 'react-s3';
import ReactS3 from 'react-s3';
import {uploadFile} from 'react-s3';

const config = {
    bucketName: 'symbabucket',
    dirName: '', /* optional */
    region: 'us-east-2',
    accessKeyId: 'AKIAJTWFNLFMNLTMI6CQ',
    secretAccessKey: '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',
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

class Home extends Component{
    constructor(){
        super();
    }
    upload(e){
        console.log(e.target.files[0]);
        ReactS3.upload(e.target.files[0], config)
            .then( (data)=>{
                console.log(data.location);
                
            })
            .catch( (err) =>{
                alert(err);
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

