import React, { Component } from 'react';
import { API } from 'aws-amplify';
class Groups extends Component {
  constructor(props) {
    super(props);
  }

  get = async () => {
    const response = await API.get('3YP', '/groups/mafia');
    console.log(response);
  };

  post = async () => {
    const response = await API.post('3YP', '/groups', {
      body: { name: 'm2afia', endDate: '2019-03-20T00:00:00' }
    });
    console.log(response);
  };

  put = async () => {
    const response = await API.put('3YP', '/groups/mafia', {
      body: { endDate: '2000' }
    });
    console.log(response);
  };

  delete = async () => {
    const response = await API.del('3YP', '/groups/mafia');
    console.log(response);
  };

  render() {
    return (
      <div>
        <button onClick={this.get}>Get</button>
        <button onClick={this.post}>Post</button>
        <button onClick={this.delete}>Del</button>
        <button onClick={this.put}>Put</button>
      </div>
    );
  }
}

export default Groups;
