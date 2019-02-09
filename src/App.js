import React, { Component } from 'react';
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import { Route, Switch, Link } from 'react-router-dom';
import { Icon } from 'react-icons-kit';
import { home } from 'react-icons-kit/fa/home';
import { userCircle } from 'react-icons-kit/fa/userCircle';
import { group } from 'react-icons-kit/fa/group';
import { ic_settings } from 'react-icons-kit/md/ic_settings';
import { Nav, NavItem, Container, Row, Col } from 'reactstrap';
import styled from 'styled-components';

import Home from './Home';
Amplify.configure(aws_exports);

const IconColored = styled(Icon)`
  color: red;
  padding-top: 60%;
  padding-bottom: 60%;
  
  @media (max-width: 768px) {
    padding-top: 0%;
    padding-bottom: 0%;
  }
  
  }
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
    console.log(window.innerHeight);
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col xs="12" md="1">
            <Nav>
              <Row>
                <Col xs="3" md="12">
                  <NavItem>
                    <Link to="/">
                      <IconColored size={'60%'} icon={home} />
                    </Link>
                  </NavItem>
                </Col>
                <Col xs="3" md="12">
                  <NavItem>
                    <Link to="/profile">
                      <IconColored size={'60%'} icon={userCircle} />
                    </Link>
                  </NavItem>
                </Col>
                <Col xs="3" md="12">
                  <NavItem>
                    <Link to="/groups">
                      <IconColored size={'60%'} icon={group} />
                    </Link>
                  </NavItem>
                </Col>
                <Col xs="3" md="12">
                  <NavItem>
                    <Link to="/settings">
                      <IconColored size={'60%'} icon={ic_settings} />
                    </Link>
                  </NavItem>
                </Col>
              </Row>
            </Nav>
          </Col>
          <Col>
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
          </Col>
        </Row>
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
