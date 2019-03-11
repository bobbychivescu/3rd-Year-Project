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

  render() {
    const post = this.props.post;
    let innerContent;
    if (post.key.endsWith('.txt')) {
      innerContent = <h5>{post.text}</h5>;
    } else {
      innerContent = <img src={post.url} />;
    }

    //check for new post from props change
    const isLoaded = this.state.post && this.state.post.yp;
    const content = (
      <div>
        {innerContent}
        <Button
          onClick={this.yp}
          disabled={
            isLoaded &&
            this.state.post.yp.values.includes(this.props.user.userId)
          }
          className="bg-orange mr-1"
        >
          YePee
        </Button>
        {isLoaded && (
          <p className="d-inline-block">
            {this.state.post.yp.values.length} YP!
          </p>
        )}
      </div>
    );
    return (
      <Row>
        <Col md="6" className="m-md-2">
          {content}
          <hr />
        </Col>
      </Row>
    );
  }
}

export default Post;
