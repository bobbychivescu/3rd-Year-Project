import React, { Component } from 'react';
import { Col, Row, Button, Input } from 'reactstrap';
import { API } from 'aws-amplify';
import { notify } from '../apiWrapper';
class Post extends Component {
  state = {};

  getId = () =>
    this.props.post.key.substr(this.props.post.key.lastIndexOf('/') + 1, 36);

  //move to wrapper
  yp = () => {
    API.put('3YP', '/posts/add/' + this.getId()).then(res => {
      if (res.data) {
        const p = this.props.post;
        p.yp = res.data.Attributes.yp;
        this.props.update(p);
      }
    });
    if (this.props.post.createdBy !== this.props.user.userId)
      notify([this.props.post.createdBy], {
        text: this.props.user.nickname + ' up-voted your post',
        path: '/groups/' + this.props.groupName + '#' + this.props.post.id
      });
  };

  changeComment = e => this.setState({ comment: e.target.value });

  comment = () => {
    API.put('3YP', '/posts/comment/' + this.getId(), {
      body: {
        text: this.state.comment
      }
    }).then(res => {
      if (res.data) {
        const p = this.props.post;
        p.comments = res.data.Attributes.comments;
        this.props.update(p);
        if (this.props.post.createdBy !== this.props.user.userId)
          notify([this.props.post.createdBy], {
            text: this.props.user.nickname + ' commented on your post',
            path: '/groups/' + this.props.groupName + '#' + this.props.post.id
          });
      }
    });
  };

  getNickname = id => {
    const user = this.props.contacts.find(c => c.userId === id);
    if (user) return user.nickname;
    else return this.props.user.nickname;
  };

  render() {
    const post = this.props.post;
    let innerContent;
    if (post.key.endsWith('.txt')) {
      innerContent = (
        <div>
          <p className="mb-0">
            <strong>{this.getNickname(post.createdBy)}</strong> said:
          </p>
          <h5>{post.text}</h5>
        </div>
      );
    } else {
      innerContent = (
        <div>
          <p>
            <strong>{this.getNickname(post.createdBy)}</strong> added a photo:
          </p>
          <img alt="" src={post.url} />
        </div>
      );
    }

    const content = (
      <div>
        {innerContent}
        <Button
          onClick={this.yp}
          disabled={
            this.props.post.yp &&
            this.props.post.yp.values.includes(this.props.user.userId)
          }
          className="bg-orange mr-1"
        >
          YePee
        </Button>
        {this.props.post.yp && (
          <p className="d-inline-block">
            {this.props.post.yp.values.length} YP!
          </p>
        )}
      </div>
    );
    return (
      <Row className="pt-3">
        <Col md="6">
          {content}
          <hr />
        </Col>
        <Col md="6">
          {this.props.post.comments &&
            this.props.post.comments.map(comm => (
              <p>
                <strong>{this.getNickname(comm.user)}</strong> {comm.text}
              </p>
            ))}
          <Input
            value={this.state.comment}
            onChange={this.changeComment}
            className="comment-input"
          />
          <Button onClick={this.comment} className="bg-orange ml-1">
            Add comment
          </Button>
          <hr />
        </Col>
      </Row>
    );
  }
}

export default Post;
