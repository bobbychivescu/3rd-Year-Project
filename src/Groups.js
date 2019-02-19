import React, { Component } from 'react';
import { API } from 'aws-amplify';
class Groups extends Component {
  constructor(props) {
    super(props);
  }

  get = async () => {
    const response = await API.get('3YP', '/groups/m2afia');
    console.log(response);
  };

  getMore = async () => {
    const response = await API.get('3YP', '/groups', {
      queryStringParameters: {
        names: ['mafia', 'm2afia']
      }
    });
    console.log(response);
  };
  post = async () => {
    const response = await API.post('3YP', '/groups', {
      body: { name: 'mafia', endDate: '2019-03-20T00:00:00' }
    });
    console.log(response);
  };

  put = async () => {
    const response = await API.put('3YP', '/groups/m2afia', {
      body: { endDate: '2000' }
    });
    console.log(response);
  };

  putMemeber = async () => {
    const response = await API.put('3YP', '/groups/add/m2afia', {
      body: { members: ['tache', 'misu'] }
    });
    console.log(response);
  };

  deleteMemeber = async () => {
    const response = await API.put('3YP', '/groups/delete/m2afia', {
      body: { members: ['tache', 'misu'] }
    });
    console.log(response);
  };

  putGroupContacts = async () => {
    const response = await API.put('3YP', '/profile/add', {
      body: { contacts: ['tache', 'misu'], groups: ['m2afie'] }
    });
    console.log(response);
  };

  deleteGroupContacts = async () => {
    const response = await API.put('3YP', '/profile/delete', {
      body: { groups: ['m2afie'] }
    });
    console.log(response);
  };
  delete = async () => {
    const response = await API.del('3YP', '/groups/m2afia');
    console.log(response);
  };
  getMoreC = async () => {
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

  render() {
    return (
      <div>
        <button onClick={this.get}>Get</button>
        <button onClick={this.post}>Post</button>
        <button onClick={this.delete}>Del</button>
        <button onClick={this.put}>Put</button>
        <button onClick={this.putMemeber}>PutMM</button>
        <button onClick={this.deleteMemeber}>delMM</button>
        <button onClick={this.putGroupContacts}>Putgrp</button>
        <button onClick={this.deleteGroupContacts}>delgrp</button>
        <button onClick={this.getMoreC}>getMore</button>
      </div>
    );
  }
}

export default Groups;
