import React, { Component } from 'react';
import { Container, Col, Row } from 'reactstrap';
import ProfileInfo from './ProfileInfo';
import Contacts from './Contacts';
import { Storage } from 'aws-amplify';

class Profile extends Component {
  state = {
    imgUrl: '/user.png',
    contactsWithPhoto: []
  };

  getPath = id => 'users/' + id + '.png';

  async componentDidMount() {
    const url = await Storage.get(this.getPath(this.props.user.userId));
    this.setState({
      imgUrl: url
    });
  }

  componentDidUpdate() {
    if (this.props.contacts && this.state.contactsWithPhoto.length === 0) {
      this.props.contacts.forEach(contact => {
        Storage.get(this.getPath(contact.userId)).then(url => {
          contact.img = url;
          this.setState(prevState => ({
            contactsWithPhoto: [...prevState.contactsWithPhoto, contact]
          }));
        });
      });
    }
  }

  onChange = async e => {
    const file = e.target.files[0];
    await Storage.put(this.getPath(this.props.user.userId), file, {
      contentType: file.type
    });
    const url = await Storage.get(this.getPath(this.props.user.userId));
    this.setState({
      imgUrl: url
    });
  };

  onError = e => {
    e.target.src = '/user.png';
  };

  render() {
    return (
      <Container>
        <Row>
          <Col xs="12" md="5" className="my-3 text-center">
            <img alt="" src={this.state.imgUrl} onError={this.onError} />
            <input
              type="file"
              id="file"
              accept="image/*"
              onChange={this.onChange}
            />
            <label htmlFor="file" className="btn btn-secondary my-2 bg-orange">
              Choose profile pic
            </label>
            <hr className="hide-in-desktop" />
          </Col>
          <Col xs="12" md="auto">
            <ProfileInfo {...this.props} />
          </Col>
        </Row>
        <hr />
        <Contacts
          contacts={this.state.contactsWithPhoto}
          user={this.props.user}
        />
      </Container>
    );
  }
}

export default Profile;
