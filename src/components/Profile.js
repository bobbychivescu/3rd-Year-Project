import React, { Component } from 'react';
import { Container, Col, Row, Spinner } from 'reactstrap';
import ProfileInfo from './ProfileInfo';
import Contacts from './Contacts';
import { API, Storage } from 'aws-amplify';

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
    console.log(new Date().getMilliseconds());
    const url = await Storage.get(this.getPath(this.props.user.userId));
    imageExists(url, result => {
      if (result)
        this.setState({
          imgUrl: url
        });
    });
  }

  async componentDidUpdate() {
    console.log(new Date().getMilliseconds());
    if (!this.state.loadInProgress) {
      this.setState({ loadInProgress: true });
      this.props.contacts.forEach(contact => {
        Storage.get(this.getPath(contact.userId)).then(url => {
          imageExists(url, r => {
            if (r) contact.img = url;
            else contact.img = '/user.png';
            console.log(new Date().getMilliseconds());
            console.log(contact);
            console.log(JSON.stringify(contact));
            this.setState(prevState => ({
              contactsWithPhoto: [...prevState.contactsWithPhoto, contact]
            }));
          });
        });
      });
      // const contacts = await Promise.all(this.props.contacts.map(async contact => {
      //   const url = await Storage.get(this.getPath(contact.userId));
      //   imageExists(url, result => {
      //     if (result) {
      //       contact.img = url;
      //
      //       console.log("in imageExists ");
      //       console.log(new Date().getMilliseconds())
      //       console.log(url);
      //       console.log(contact.img)
      //     } else {
      //       contact.img = '/user.png';
      //     }
      //   });
      //   console.log(contact)
      //   return contact;
      // }))
      // console.log(JSON.stringify(contacts));
      // this.setState({ contactsWithPhoto: contacts });
    }
  }

  onChange = async e => {
    const file = e.target.files[0];
    const res = await Storage.put(this.getPath(this.props.user.userId), file, {
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
