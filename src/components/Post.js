import React, { Component } from 'react';
import { Col, Row, Button } from 'reactstrap';
import { API } from 'aws-amplify';
class Post extends Component {
  state = {};

  id = this.props.post.key.substr(this.props.post.key.lastIndexOf('/') + 1, 36);

  async componentDidMount() {
    const resp = await API.get('3YP', '/posts/' + this.id);
    this.setState({ post: resp });
  }

  yp = () => {
    API.put('3YP', '/posts/add/' + this.id, {
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

    const content = (
      <div>
        {innerContent}
        <Button onClick={this.yp} className="bg-orange mr-1">
          YePee
        </Button>
        {this.state.post && this.state.post.yp && (
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
