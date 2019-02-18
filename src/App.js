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
import { Nav, NavItem, Container } from 'reactstrap';

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
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
  }

  async componentDidMount() {
    const response = await API.get('3YP', '/profile');
    if (response.hasOwnProperty('nickname')) {
      this.setState({ user: response });
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
      const text = 'Welcome to the app ' + response3.nickname;
      const response4 = await API.post('3YP', '/email', {
        body: {
          to: user.attributes.email,
          subject: 'Welcome',
          text: text
        }
      });
      this.setState({ user: response3 });
    }
  }

  render() {
    return (
      <Container fluid className="h-100">
        <aside className="sidebar my-2">
          <Nav className="flex-md-column w-100 h-100 justify-content-around">
            <Item path="/" icon={home} />
            <Item path="/profile" icon={userCircle} />
            <Item path="/groups" icon={group} />
            <Item path="/settings" icon={ic_settings} />
          </Nav>
        </aside>
        <main className="content">
          <Switch>
            <Route
              exact
              path="/"
              render={() => <Home {...this.props} user={this.state.user} />}
            />
            <Route
              path="/profile"
              render={() => <Profile {...this.props} user={this.state.user} />}
            />
            <Route
              path="/settings"
              render={() => <Settings {...this.props} user={this.state.user} />}
            />
            <Route
              path="/groups"
              render={() => <Groups {...this.props} user={this.state.user} />}
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
