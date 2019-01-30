import React, { Component } from 'react';
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import { Route, Switch, Link } from 'react-router-dom';
import { SideNav, Nav } from 'react-sidenav';
import { Icon } from 'react-icons-kit';
import { dashboard } from 'react-icons-kit/fa/dashboard';
import { users } from 'react-icons-kit/fa/users';
import { shoppingCart } from 'react-icons-kit/fa/shoppingCart';
import { cubes } from 'react-icons-kit/fa/cubes';
import { circleO } from 'react-icons-kit/fa/circleO';

import Home from './Home';
Amplify.configure(aws_exports);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
  }

  onItemSelection = arg => {
    console.log(arg);
  };

  render() {
    return (
      <div>
        <SideNav
          defaultSelectedPath="1"
          // theme={theme}
          onItemSelection={this.onItemSelection}
        >
          <Nav id="1">
            <div>
              <Icon icon={dashboard} />
            </div>
            <div>Dashboard</div>
          </Nav>
          <Nav id="2">
            <div>
              <Icon icon={users} />
            </div>
            <div>Users</div>
          </Nav>
          <Nav id="3">
            <div>
              <Icon icon={shoppingCart} />
            </div>
            <div>Deliveries</div>
          </Nav>
          <Nav id="4">
            <div>
              <Icon icon={circleO} />
            </div>
            <div>Orders</div>
          </Nav>
          <Nav id="5">
            <div>
              <Icon icon={cubes} />
            </div>
            <div>Transactions</div>
          </Nav>
        </SideNav>
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

export default withAuthenticator(App, true, [], null, myTheme, signUpConfig);
