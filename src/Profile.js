import React, { Component } from 'react';
import { Container, Col, Row, Spinner } from 'reactstrap';
import ProfileInfo from './ProfileInfo';
import Contacts from './Contacts';
import { Storage } from 'aws-amplify';

var imageExists = require('image-exists');

const imgPath = 'photos/profile.png';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: '/user.png'
    };
  }

  async componentDidMount() {
    const url = await Storage.get(imgPath);
    imageExists(url, result => {
      if (result)
        this.setState({
          imgUrl: url
        });
    });
  }

  onChange = async e => {
    const file = e.target.files[0];
    const res = await Storage.put(imgPath, file, {
      contentType: file.type
    });
    const url = await Storage.get(imgPath);
    this.setState({
      imgUrl: url
    });
  };

  render() {
    const contacts = ['bob', 'mary', 'jane', 'jphn', 'matanumelungada'];
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
        <Contacts contacts={contacts} />
      </Container>
    );
  }
}

export default Profile;
