import React, { Component } from 'react';
import { Container, Col, Row, Spinner } from 'reactstrap';
import ProfileInfo from './ProfileInfo';
import Contacts from './Contacts';
import { Storage } from 'aws-amplify';

var imageExists = require('image-exists');

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: '/user.png',
      contactsWithPhoto: []
    };
  }

  getPath = id => 'users/' + id + '.png';

  async componentDidMount() {
    const url = await Storage.get(this.getPath(this.props.user.userId));
    imageExists(url, result => {
      if (result)
        this.setState({
          imgUrl: url
        });
    });
  }

  componentDidUpdate() {
    if (!this.state.loadInProgress) {
      this.setState({ loadInProgress: true });
      this.props.contacts.forEach(contact => {
        Storage.get(this.getPath(contact.userId)).then(url => {
          imageExists(url, r => {
            if (r) contact.img = url;
            else contact.img = '/user.png';
            this.setState(prevState => ({
              contactsWithPhoto: [...prevState.contactsWithPhoto, contact]
            }));
          });
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

  render() {
    return (
      <Container>
        <Row>
          <Col xs="12" md="5" className="my-3 text-center">
            <img src={this.state.imgUrl} className="profile-pic" />
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
        <Contacts contacts={this.state.contactsWithPhoto} />
      </Container>
    );
  }
}

export default Profile;
