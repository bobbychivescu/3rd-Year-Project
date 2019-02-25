import React, { Component } from 'react';
import { API } from 'aws-amplify';
import { Container, Nav, NavItem } from 'reactstrap';
import { Switch, Route, Link } from 'react-router-dom';
import SingleGroup from './SingleGroup';
import CreateGroup from './CreateGroup';

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

  // async componentDidMount() {
  //   if (this.props.user.groups) {
  //     const response = await API.get('3YP', '/groups', {
  //       queryStringParameters: {
  //         names: this.props.user.groups.values
  //       }
  //     });
  //     console.log(response);
  //     this.setState({ groups: response });
  //   } else {
  //     //should setState with empty?
  //     console.log('no groups');
  //   }
  // }

  render() {
    return (
      <Container fluid className="no-padding-mobile">
        <aside className="groupnav">
          <Nav className="flex-md-column w-100 h-100 no-wrap">
            <NavItem>
              <Link to={'/groups'} className="group m-1 p-1">
                <h5>Create new group</h5>
              </Link>
            </NavItem>
            {this.props.groups ? (
              this.props.groups.map(g => <Group g={g} />)
            ) : (
              <div />
            )}
          </Nav>
        </aside>
        <main className="groups-content">
          <Switch>
            <Route
              exact
              path="/groups"
              render={props => <CreateGroup {...props} {...this.props} />}
            />
            <Route
              path="/groups/:name"
              render={props => <SingleGroup {...props} {...this.props} />}
            />
          </Switch>
        </main>
      </Container>
    );
  }
}

export default Groups;
