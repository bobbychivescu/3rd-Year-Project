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
    console.log(url);
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
      contentType: 'image/png'
    });
    window.location.reload();
  };

  render() {
    const contacts = ['bob', 'mary', 'jane', 'jphn', 'mata'];
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col xs="12" md="4" className="my-3">
            <img src={this.state.imgUrl} />
          </Col>
          <Col xs="12" md="auto">
            {this.props.user.nickname ? (
              <ProfileInfo user={this.props.user} />
            ) : (
              <Spinner color="warning" />
            )}
            <input
              type="file"
              id="file"
              accept="image/png"
              onChange={this.onChange}
            />
            <label for="file" className="btn btn-secondary">
              Choose file
            </label>
          </Col>
        </Row>
        <Contacts contacts={contacts} />
      </Container>
    );
  }
}

export default Profile;
