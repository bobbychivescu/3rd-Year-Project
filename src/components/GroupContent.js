import React, { Component } from 'react';
import { Button, Container, Row, Col } from 'reactstrap';
import Dropzone from 'react-dropzone';
import { Storage } from 'aws-amplify';
import { v1 } from 'uuid';
import axios from 'axios';
import { createTextPost, createFilePost } from '../apiWrapper';

import Post from './Post';
class GroupContent extends Component {
  state = {};

  //may need to be moved to component did update to check for new group, path var too
  componentDidMount() {
    console.log(new Date().getMilliseconds());
    this.setState({ currentGroup: this.props.group.name });
    this.update();
  }

  componentDidUpdate() {
    if (this.state.currentGroup !== this.props.group.name) {
      console.log(new Date().getMilliseconds());
      this.setState({ currentGroup: this.props.group.name });
      this.update();
    }
  }

  getPath = () => 'groups/' + this.props.group.name + '/';

  update = async () => {
    //sort by date and fetch metadata
    const list = await Storage.list(this.getPath());
    const posts = await Promise.all(list.map(this.enrich));
    console.log(posts);
    this.setState({
      posts: posts.sort((a, b) => (a.lastModified < b.lastModified ? 1 : -1))
    });
  };

  enrich = async item => {
    const url = await Storage.get(item.key);
    item.url = url;
    if (item.key.endsWith('.txt')) {
      const text = await axios.get(url);
      item.text = text.data;
    }
    return item;
  };

  onDrop = (acceptedFiles, rejectedFiles) => {
    console.log(acceptedFiles);
    this.setState({ files: acceptedFiles });
    console.log(rejectedFiles);
  };

  changeText = e => this.setState({ text: e.target.value });

  //may not need to be async, review at writing in DB
  //will also be in apiWrapper
  createPost = () => {
    if (this.state.text) {
      createTextPost(this.getPath(), this.state.text, this.props.user.userId)
        .then(this.enrich)
        .then(data =>
          this.setState(prevState => ({
            posts: [data, ...prevState.posts]
          }))
        );
    }

    if (this.state.files) {
      this.state.files.forEach(file => {
        createFilePost(this.getPath(), file, this.props.user.userId)
          .then(this.enrich)
          .then(data =>
            this.setState(prevState => ({
              posts: [data, ...prevState.posts]
            }))
          );
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
        {this.state.posts && this.state.posts.map(post => <Post post={post} />)}
      </div>
    );
  }
}

export default GroupContent;
