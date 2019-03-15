import React, { Component } from 'react';
import { API } from 'aws-amplify';

import { Container, Button, Input } from 'reactstrap';

class Home extends Component {
  state = {};

  changeSearch = e => this.setState({ search: e.target.value });

  search = async () => {
    console.log(this.state.search);
  };

  render() {
    return (
      <Container>
        <h1 className="text-center">Welcome to 3YP!</h1>
        <h5 className="text-center">Search and join public groups</h5>
        <Input
          onChange={this.changeSearch}
          className="half-on-desktop d-block m-auto"
        />
        <div className="text-center">
          <Button onClick={this.search} className="bg-orange my-1">
            Search
          </Button>
        </div>
      </Container>
    );
  }
}

export default Home;
