import React, { Component } from 'react';
import './App.css';
import Amplify, { API, Auth } from 'aws-amplify';
import aws_exports from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import { Route, Switch, Link } from 'react-router-dom';
import { Icon } from 'react-icons-kit';
import { home } from 'react-icons-kit/fa/home';
import { userCircle } from 'react-icons-kit/fa/userCircle';
import { group } from 'react-icons-kit/fa/group';
import { ic_settings } from 'react-icons-kit/md/ic_settings';
import { Nav, NavItem, Container, Spinner } from 'reactstrap';

import { getUser, getContacts, getGroups } from './apiWrapper';
import Home from './Home';
import Profile from './Profile';
import Settings from './Settings';
import Groups from './Groups';
Amplify.configure(aws_exports);

const Item = props => {
  return (
    <NavItem className="text-center">
      <Link to={props.path} className="orange">
        <Icon size="32" icon={props.icon} />
      </Link>
    </NavItem>
  );
};

class App extends Component {
  state = {};

  async componentDidMount() {
    this.setState({ user: await getUser() });
  }

  async componentDidUpdate() {
    if (!this.state.contacts && this.state.user.contacts) {
      //called after user was set
      this.setState({
        contacts: await getContacts(this.state.user.contacts.values)
      });
    } else if (!this.state.groups && this.state.user.groups) {
      //called after contacts were set
      this.setState({ groups: await getGroups(this.state.user.groups.values) });
    } else {
      //called after groups were set
      console.log('handle stale data');
      console.log(this.state);
    }
  }

  setAppState = state => {
    this.setState(state);
  };

  render() {
    return (
      <Container fluid className="h-100">
        <nav className="topbar">
          <a className="navbar-brand" href="#">
            3YP
          </a>
        </nav>
        <aside className="sidebar my-2">
          <Nav className="flex-md-column w-100 h-100 justify-content-around">
            <Item path="/" icon={home} />
            <Item path="/profile" icon={userCircle} />
            <Item path="/groups" icon={group} />
            <Item path="/settings" icon={ic_settings} />
          </Nav>
        </aside>
        <main className="content">
          {this.state.user ? (
            <Switch>
              <Route
                exact
                path="/"
                render={() => <Home user={this.state.user} />} //will probs need more params
              />
              <Route
                path="/profile"
                render={() => (
                  <Profile
                    user={this.state.user}
                    contacts={this.state.contacts}
                    setAppState={this.setAppState}
                  />
                )}
              />
              <Route
                path="/settings"
                render={() => (
                  <Settings
                    user={this.state.user}
                    setAppState={this.setAppState}
                  />
                )}
              />
              <Route
                path="/groups"
                render={props => (
                  <Groups
                    {...props}
                    groups={this.state.groups}
                    user={this.state.user}
                    contacts={this.state.contacts}
                  />
                )}
              />
              <Route
                path="*"
                component={() => (
                  <div>
                    <h1>404 Not Found!</h1>
                  </div>
                )}
              />
            </Switch>
          ) : (
            <Spinner color="warning" className="m-5" />
          )}
        </main>
      </Container>
    );
  }
}

const myTheme = {};

const signUpConfig = {
  hideAllDefaults: true,
  signUpFields: [
    {
      label: 'Username',
      key: 'username',
      required: true,
      placeholder: 'Email',
      type: 'email',
      displayOrder: 1
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      placeholder: 'Password',
      type: 'password',
      displayOrder: 2
    }
  ]
};

export default withAuthenticator(App, false, [], null, myTheme, signUpConfig);
