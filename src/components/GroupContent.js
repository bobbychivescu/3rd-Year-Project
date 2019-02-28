import React, { Component } from 'react';
import { Button, Container, Row, Col } from 'reactstrap';
import Dropzone from 'react-dropzone';
import { Storage } from 'aws-amplify';
import { v1 } from 'uuid';
import axios from 'axios';

class GroupContent extends Component {
  state = {};
  path = 'groups/' + this.props.group.name + '/';

  //may need to be moved to component did update to check for new group, path var too
  async componentDidMount() {
    //sort by date
    const list = await Storage.list(this.path);
    this.setState({
      posts: await Promise.all(
        list.map(async item => {
          const url = await Storage.get(item.key);
          item.url = url;
          if (item.key.endsWith('.txt')) {
            const text = await axios.get(url);
            item.text = text.data;
          }
          return item;
        })
      )
    });
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    console.log(acceptedFiles);
    this.setState({ files: acceptedFiles });
    console.log(rejectedFiles);
  };

  changeText = e => this.setState({ text: e.target.value });

  //may not need to be async, review at writing in DB
  //will also be in apiWrapper
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
        {this.state.posts &&
          this.state.posts.map(post => {
            let content;
            if (post.key.endsWith('.txt')) {
              content = <h5>{post.text}</h5>;
            } else {
              content = <img src={post.url} />;
            }
            return (
              <Row>
                <Col md="6" className="m-md-2">
                  {content}
                </Col>
              </Row>
            );
          })}
      </div>
    );
  }
}

export default GroupContent;
