import React, { Component } from 'react';
import { Col, Row, Button } from 'reactstrap';
import { API } from 'aws-amplify';
class Post extends Component {
  async componentDidMount() {
    const id = this.props.post.key.substr(
      this.props.post.key.lastIndexOf('/') + 1,
      36
    );
    const resp = await API.get('3YP', '/posts/' + id);
    console.log(resp);
  }

  yp = () => {
    alert('YePee');
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
        {/*YPs*/}
        <Button onClick={this.yp} className="bg-orange">
          YePee
        </Button>
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
