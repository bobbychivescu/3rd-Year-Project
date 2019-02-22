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
    const response = await API.get('3YP', '/profile');
    if (response.hasOwnProperty('nickname')) {
      this.setState({ user: response });
      if (response.contacts) {
        const resp5 = await API.get('3YP', '/profile/contacts', {
          queryStringParameters: {
            ids: response.contacts.values
          }
        });
        this.setState({ contacts: resp5 });
      }
    } else {
      // first login
      const user = await Auth.currentAuthenticatedUser();
      const response2 = await API.post('3YP', '/profile', {
        body: {
          email: user.attributes.email
        }
      });
      console.log(response2);
      const response3 = await API.get('3YP', '/profile');
      this.setState({ user: response3 });
      const text = 'Welcome to the app ' + response3.nickname;
      const response4 = await API.post('3YP', '/email', {
        body: {
          to: user.attributes.email,
          subject: 'Welcome',
          text: text
        }
      });
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
                render={() => <Home user={this.state.user} />}
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
