import React, { Component } from 'react';
import { API } from 'aws-amplify';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  get = async () => {
    const response = await API.get('3YP', '/profile/contacts', {
      queryStringParameters: {
        ids: [
          'eu-west-1:b8ca0ea7-bee5-455d-927f-91bcb1e9937a',
          'eu-west-1:d8c090a8-3d22-411f-b4f0-3b77b9aa000e'
        ]
      }
    });
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
