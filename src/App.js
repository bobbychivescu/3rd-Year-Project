import React, { Component } from 'react';
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import { Route, Switch, Link } from 'react-router-dom';
import { SideNav, Nav as BaseNav, NavIcon } from 'react-sidenav';
import { Icon } from 'react-icons-kit';
import { home } from 'react-icons-kit/fa/home';
import { user } from 'react-icons-kit/fa/user';
import { group } from 'react-icons-kit/fa/group';
import { ic_settings } from 'react-icons-kit/md/ic_settings';

import styled from 'styled-components';

import Home from './Home';
Amplify.configure(aws_exports);

const theme = {
  hoverBgColor: '#f5f5f5',
  selectionBgColor: '#f5f5f5',
  selectionIconColor: '#03A9F4'
};

export const Navigation = styled.div`
  width: 100px;
  background: #fff;
  height: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.125);
`;

const Nav = styled(BaseNav)`
  flex-direction: column;
  height: 100px;
`;

export const AppContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
  }

  onItemSelection = arg => {
    if (arg.path === 'home') this.props.history.push('');
    else this.props.history.push('/' + arg.path);
  };

  render() {
    return (
      <AppContainer>
        <Navigation>
          <SideNav
            defaultSelectedPath="1"
            theme={theme}
            onItemSelection={this.onItemSelection}
          >
            <Nav id="home">
              <NavIcon>
                <Icon size={32} icon={home} />
              </NavIcon>
            </Nav>
            <Nav id="profile">
              <NavIcon>
                <Icon size={32} icon={user} />
              </NavIcon>
            </Nav>
            <Nav id="groups">
              <NavIcon>
                <Icon size={32} icon={group} />
              </NavIcon>
            </Nav>
            <Nav id="settings">
              <NavIcon>
                <Icon size={32} icon={ic_settings} />
              </NavIcon>
            </Nav>
          </SideNav>
        </Navigation>
        <Switch>
          <Route
            exact
            path="/"
            render={() => <Home {...this.props} user={this.state.user} />}
          />
          {/*<Route path='/groups' component={Groups}/>*/}
          {/*<Route path='/settings' component={Settings}/>*/}
          <Route
            path="*"
            component={() => (
              <div>
                <h1>404 Not Found!</h1>
              </div>
            )}
          />
        </Switch>
      </AppContainer>
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

export default withAuthenticator(App, true, [], null, myTheme, signUpConfig);
