import React, { Component } from 'react';
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
Amplify.configure(aws_exports);

class App extends Component {
  render() {
    return (
      <div>
        <h1>Main page, or routes, or whatever...</h1>
      </div>
    );
  }
}

const myTheme = {
}

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