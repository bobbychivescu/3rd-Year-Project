import React, { Component } from 'react';
import { Container, Nav, NavItem } from 'reactstrap';
import { Switch, Route, Link } from 'react-router-dom';
import SingleGroup from './SingleGroup';
import CreateGroup from './CreateGroup';

const Group = props => (
  <NavItem>
    <Link to={'/groups/' + props.g.name} className="group m-1 p-1">
      <h5>{props.g.name}</h5>
      {props.g.description ? <p>{props.g.description}</p> : <p />}
    </Link>
  </NavItem>
);

class Groups extends Component {
  state = {};

  render() {
    return (
      <Container fluid className="no-padding-mobile">
        <aside className="groupnav">
          <Nav className="flex-md-column w-100 h-100 no-wrap">
            <NavItem>
              <Link to={'/groups'} className="group m-1 p-1 no-hover">
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
