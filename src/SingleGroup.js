import React, { Component } from 'react';
import { Container } from 'reactstrap';

class SingleGroup extends Component {
  render() {
    return (
      <Container fluid>
        <div>{this.props.match.params.name}</div>
        <div>{this.props.user.nickname}</div>
      </Container>
    );
  }
}

export default SingleGroup;
