import React, { Component } from 'react';
import { Button, Container } from 'reactstrap';
import Dropzone from 'react-dropzone';
import { Storage } from 'aws-amplify';
import { v1 } from 'uuid';

class GroupContent extends Component {
  state = {};
  path = 'groups/' + this.props.group.name + '/';

  async componentDidMount() {
    //do smth with dis
    const list = await Storage.list(this.path);
    console.log(list);
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    console.log(acceptedFiles);
    this.setState({ files: acceptedFiles });
    console.log(rejectedFiles);
  };

  changeText = e => this.setState({ text: e.target.value });

  //may not need to be async, review at writing in DB
  createPost = async () => {
    if (this.state.text) {
      const id = v1();
      const r = await Storage.put(this.path + id + '.txt', this.state.text);
    }

    if (this.state.files) {
      this.state.files.forEach(async file => {
        const id = v1();
        const r = await Storage.put(this.path + id + '.png', file, {
          contentType: file.type
        });
      });
    }
    this.setState({ text: '', files: null });
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
      <div>
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
      </div>
    );
  }
}

export default GroupContent;
