import React, { Component } from 'react';
import { Button, Card, Input, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Auth, API } from 'aws-amplify';

class Settings extends Component {
  state = {
    pass: '',
    newPass: '',
    TCModal: false,
    PPModal: false
  };

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

  toggleEmailNotifications = async () => {
    const response = await API.put('3YP', '/profile', {
      body: {
        emailNotifications: !this.props.user.emailNotifications
      }
    });
    window.location.reload();
  };

  toggleEmailAvailability = async () => {
    const response = await API.put('3YP', '/profile', {
      body: {
        emailPublic: !this.props.user.emailPublic
      }
    });
    window.location.reload();
  };

  toggleTCModal = () => {
    this.setState(prevState => ({
      TCModal: !prevState.TCModal
    }));
  };

  togglePPModal = () => {
    this.setState(prevState => ({
      PPModal: !prevState.PPModal
    }));
  };

  deleteAccount = async () => {
    if (window.confirm('Are you sure you want to continue?')) {
      API.del('3YP', '/profile');
      const user = await Auth.currentAuthenticatedUser();
      user.deleteUser(() => {
        this.props.onStateChange();
      });
    }
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
        <h4>Email notifications</h4>
        <p>
          You currently{' '}
          {this.props.user.emailNotifications ? (
            <strong>receive</strong>
          ) : (
            <strong>DO NOT receive</strong>
          )}{' '}
          email notifications.
        </p>
        <Button onClick={this.toggleEmailNotifications} className="bg-orange">
          Toggle notification setting
        </Button>
        <hr />
        <h4>Email availability</h4>
        <p>Choose if your contacts can see your email address.</p>
        <p>
          Your email is currently{' '}
          {this.props.user.emailPublic ? (
            <strong>public</strong>
          ) : (
            <strong>private</strong>
          )}
          .
        </p>
        <Button onClick={this.toggleEmailAvailability} className="bg-orange">
          Make email{' '}
          {this.props.user.emailPublic ? (
            <strong>private</strong>
          ) : (
            <strong>public</strong>
          )}
        </Button>
        <hr />
        <h4>Legal stuff</h4>
        <Button onClick={this.toggleTCModal} className="bg-orange">
          Read Terms & Conditions
        </Button>
        <Modal centered isOpen={this.state.TCModal} toggle={this.toggleTCModal}>
          <ModalHeader toggle={this.toggleTCModal}>
            Terms & Conditions
          </ModalHeader>
          <ModalBody>yet to be composed</ModalBody>
        </Modal>

        <Button onClick={this.togglePPModal} className="bg-orange">
          Read Privacy Policy
        </Button>
        <Modal centered isOpen={this.state.PPModal} toggle={this.togglePPModal}>
          <ModalHeader toggle={this.togglePPModal}>Privacy Policy</ModalHeader>
          <ModalBody>yet to be composed</ModalBody>
        </Modal>
        <hr />
        <h4>Sign out of the app</h4>
        <Button onClick={this.signOut} className="bg-orange">
          Sign out
        </Button>
        <hr />
        <h4>Delete account</h4>
        <p>
          <strong>Warning!</strong> This action cannot be reverted.
        </p>
        <p>
          This will permanently delete your account from the app, including your
          login credentials.
        </p>
        <Button onClick={this.deleteAccount} color="danger">
          Delete account
        </Button>
      </div>
    );
  }
}

export default Settings;
