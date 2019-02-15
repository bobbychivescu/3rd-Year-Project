import React, { Component } from 'react';
import { Button, Input } from 'reactstrap';
import { Auth, API } from 'aws-amplify';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pass: '',
      newPass: ''
    };
  }

  changePass = e => {
    this.setState({
      pass: e.target.value
    });
  };

  changeNewPass = e => {
    this.setState({
      newPass: e.target.value
    });
  };

  changePassword = async () => {
    const user = await Auth.currentAuthenticatedUser();
    Auth.changePassword(user, this.state.pass, this.state.newPass)
      .then(data => alert(data + ' New password set!'))
      .catch(err => alert(err.message));
  };

  signOut = () => {
    Auth.signOut().then(() => {
      this.props.onStateChange('SignedOut');
    });
  };

  render() {
    return (
      <div className="settings">
        <h1>Settings</h1>
        <hr />
        <h4>Change password</h4>
        <Input
          placeholder="old password"
          type="password"
          onChange={this.changePass}
          className="half-on-desktop my-1"
        />
        <Input
          placeholder="new password"
          type="password"
          onChange={this.changeNewPass}
          className="half-on-desktop my-1"
        />
        <Button onClick={this.changePassword} className="bg-orange">
          Change password
        </Button>
        <hr />
        <h4>Sign out of the app</h4>
        <Button onClick={this.signOut} className="bg-orange">
          Sing out
        </Button>
      </div>
    );
  }
}

export default Settings;
