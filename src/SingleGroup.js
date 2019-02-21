import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { API } from 'aws-amplify';

class SingleGroup extends Component {
  async componentDidMount() {
    const response = await API.get(
      '3YP',
      '/groups/' + this.props.match.params.name
    );
    console.log(response);
  }
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
