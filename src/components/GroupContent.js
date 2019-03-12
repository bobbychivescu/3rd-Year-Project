import React, { Component } from 'react';
import { Button, Container, Row, Col } from 'reactstrap';
import Dropzone from 'react-dropzone';
import { v1 } from 'uuid';
import { createTextPost, createFilePost, getPosts } from '../apiWrapper';

import Post from './Post';
class GroupContent extends Component {
  state = {};

  //may need to be moved to component did update to check for new group, path var too
  componentDidMount() {
    this.setState({ currentGroup: this.props.group.name });
    this.update();
  }

  componentDidUpdate() {
    if (this.state.currentGroup !== this.props.group.name) {
      this.setState({ currentGroup: this.props.group.name });
      this.update();
    }
  }

  getPath = () => 'groups/' + this.props.group.name + '/';

  update = async () => {
    this.setState({
      posts: await getPosts(this.getPath())
    });
  };

  onDrop = (acceptedFiles, rejectedFiles) => {
    console.log(acceptedFiles);
    this.setState({ files: acceptedFiles });
    console.log(rejectedFiles);
  };

  changeText = e => this.setState({ text: e.target.value });

  createPost = () => {
    if (this.state.text) {
      createTextPost(
        this.getPath(),
        this.state.text,
        this.props.user.userId
      ).then(data =>
        this.setState(prevState => ({
          posts: [data, ...prevState.posts]
        }))
      );
    }

    if (this.state.files) {
      this.state.files.forEach(file => {
        createFilePost(this.getPath(), file, this.props.user.userId).then(
          data =>
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

  updatePost = post => {
    this.setState(prevState => ({
      posts: prevState.posts.map(p => {
        if (p.id === post.id) return post;
        return p;
      })
    }));
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
        {this.state.posts &&
          this.state.posts.map(post => (
            <Post
              user={this.props.user}
              contacts={this.props.contacts}
              post={post}
              update={this.updatePost}
            />
          ))}
      </div>
    );
  }
}

export default GroupContent;
