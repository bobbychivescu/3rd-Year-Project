import React, { Component } from 'react';
import { API } from 'aws-amplify';
import { Container, Nav, NavItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Icon } from 'react-icons-kit';

const Group = props => (
  <NavItem>
    <Link to={'/groups/' + props.g.name} className="group m-1 p-1">
      <h5>{props.g.name}</h5>
      {props.g.description ? <p>{props.g.description}</p> : <p>no desc</p>}
    </Link>
  </NavItem>
);

class Groups extends Component {
  state = {};

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

  async componentDidMount() {
    if (this.props.user.groups) {
      const response = await API.get('3YP', '/groups', {
        queryStringParameters: {
          names: this.props.user.groups.values
        }
      });
      this.setState({ groups: response.Responses['3ypGroups'] });
    } else {
      //should setState with empty?
      console.log('no groups');
    }
  }

  render() {
    return (
      <Container fluid className="no-padding-mobile">
        <aside className="groupnav my-2">
          <Nav className="flex-md-column w-100 h-100 no-wrap">
            <NavItem>
              <Link to={'/groups/new'} className="group m-1 p-1">
                <h5>Create new group</h5>
              </Link>
            </NavItem>
            {this.state.groups ? (
              this.state.groups.map(g => <Group g={g} />)
            ) : (
              <div />
            )}
          </Nav>
        </aside>
      </Container>
    );
  }
}

export default Groups;
