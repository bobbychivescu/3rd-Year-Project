import React, { Component } from 'react';
import { Button, Container } from 'reactstrap';
import Dropzone from 'react-dropzone';

class GroupContent extends Component {
  state = {};

  onDrop = (acceptedFiles, rejectedFiles) => {
    console.log(acceptedFiles);
    this.setState({ files: acceptedFiles });
    console.log(rejectedFiles);
  };

  changeText = e => this.setState({ text: e.target.value });

  createPost = () => {
    console.log(this.state);
    //S3 stuff
  };

  getFileString = () => {
    let files = '';
    this.state.files.map(file => {
      files += file.name + ', ';
    });
    return files.substr(0, files.length - 2);
  };

  render() {
    return (
      <Dropzone
        onDrop={this.onDrop}
        accept="image/*" //might want to add video and audio
      >
        {({ getRootProps, getInputProps, open }) => (
          <div {...getRootProps({ onClick: evt => evt.preventDefault() })}>
            <input {...getInputProps()} />
            <textarea
              value={this.state.text}
              onChange={this.changeText}
              placeholder={
                this.state.files
                  ? this.getFileString()
                  : 'Write post or drop files here'
              }
            />
            <Button onClick={() => open()} className="mr-1 bg-orange">
              Select files
            </Button>
            <Button onClick={this.createPost} className="bg-orange">
              POST
            </Button>
          </div>
        )}
      </Dropzone>
    );
  }
}

export default GroupContent;
