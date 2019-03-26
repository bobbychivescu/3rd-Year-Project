import React, { Component } from 'react';
import './App.css';
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import { Route, Switch, Link } from 'react-router-dom';
import { Icon } from 'react-icons-kit';
import { home } from 'react-icons-kit/fa/home';
import { userCircle } from 'react-icons-kit/fa/userCircle';
import { group } from 'react-icons-kit/fa/group';
import { ic_settings } from 'react-icons-kit/md/ic_settings';
import { Nav, NavItem, Container, Spinner } from 'reactstrap';

import { getUser, getContacts, getGroups, removeStaleData } from './apiWrapper';
import Home from './components/Home';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Groups from './components/Groups';
import Notifications from './components/Notifications';
Amplify.configure(aws_exports);

const Item = props => {
  return (
    <NavItem className="text-center">
      <Link to={props.path} className="orange">
        <Icon size="50" icon={props.icon} />
      </Link>
    </NavItem>
  );
};

class App extends Component {
  state = {};

  //implement periodic all update
  async componentDidMount() {
    await this.updateUser();
    setInterval(this.updateUser, 5 * 60 * 1000);
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
      removeStaleData(this.state, this.setAppState);
    }
  }

  updateUser = async () => {
    this.setState({ user: await getUser() });
    console.log('updated');
  };

  setAppState = state => {
    this.setState(state);
  };

  render() {
    return (
      <div>
        <nav className="topbar">
          <a className="navbar-brand ml-2 orange" href="#">
            3YePee
          </a>
          {this.state.user && (
            <Notifications
              user={this.state.user}
              history={this.props.history}
              set={this.setAppState}
            />
          )}
        </nav>
        <Container fluid className="under-topbar my-2">
          <aside className="sidebar">
            <Nav className="flex-md-column w-100 h-100 justify-content-around bej">
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
                  render={props => (
                    <Settings
                      {...props}
                      afterDelete={this.props.onStateChange}
                      user={this.state.user}
                      setAppState={this.setAppState}
                    />
                  )}
                />
                <Route
                  path="/groups"
                  render={() => (
                    <Groups
                      groups={this.state.groups}
                      user={this.state.user}
                      contacts={this.state.contacts}
                      setAppState={this.setAppState}
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
      </div>
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
