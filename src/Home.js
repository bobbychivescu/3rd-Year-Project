import React, { Component } from 'react';
import { API } from 'aws-amplify';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  get = async () => {
    const response = await API.get('3YP', '/profile');
    console.log(response);
  };

  post = async () => {
    const response = await API.post('3YP', '/profile', {
      body: { nickname: 'superBoiii' }
    });
    console.log(response);
  };

  delete = async () => {
    const response = await API.del('3YP', '/profile');
    console.log(response);
  };

  render() {
    return (
      <div>
        <button onClick={this.get}>Get</button>
        <button onClick={this.post}>Post</button>
        <button onClick={this.delete}>Del</button>
      </div>
    );
  }
}

export default Home;
