import React, { Component } from 'react';
import { Col, Row, Button } from 'reactstrap';
import { API } from 'aws-amplify';
class Post extends Component {
  state = {};

  getId = () =>
    this.props.post.key.substr(this.props.post.key.lastIndexOf('/') + 1, 36);

  async componentDidMount() {
    const resp = await API.get('3YP', '/posts/' + this.getId());
    this.setState({ post: resp });
  }

  async componentDidUpdate() {
    if (this.state.post && this.state.post.id !== this.getId())
      this.setState({ post: await API.get('3YP', '/posts/' + this.getId()) });
  }

  //move to wrapper
  yp = () => {
    API.put('3YP', '/posts/add/' + this.getId(), {
      body: { yp: [this.props.user.userId] }
    }).then(res => {
      if (res.data) {
        const p = this.state.post;
        p.yp = res.data.Attributes.yp;
        this.setState({ post: p });
      }
    });
  };

  changeComment = e => this.setState({ comment: e.target.value });

  comment = () => {
    API.put('3YP', '/posts/comment/' + this.getId(), {
      body: {
        comment: {
          user: this.props.user.userId,
          text: this.state.comment
        }
      }
    }).then(res => {
      if (res.data) {
        const p = this.state.post;
        p.comments = res.data.Attributes.comments;
        this.setState({ post: p, comment: '' });
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
      innerContent = <h5>{post.text}</h5>;
    } else {
      innerContent = <img src={post.url} />;
    }

    //check for new post from props change
    const isLoaded = this.state.post && this.state.post.id === this.getId();
    const content = (
      <div>
        {innerContent}
        <Button
          onClick={this.yp}
          disabled={
            isLoaded &&
            this.state.post.yp &&
            this.state.post.yp.values.includes(this.props.user.userId)
          }
          className="bg-orange mr-1"
        >
          YePee
        </Button>
        {isLoaded && this.state.post.yp && (
          <p className="d-inline-block">
            {this.state.post.yp.values.length} YP!
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
          {isLoaded &&
            this.state.post.comments &&
            this.state.post.comments.map(comm => (
              <p>
                <strong>{this.getNickname(comm.user)}</strong> {comm.text}
              </p>
            ))}
          <input
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
