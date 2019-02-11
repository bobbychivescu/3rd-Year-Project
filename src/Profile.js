import React, { Component } from 'react';
import { Container, Col, Row, Spinner } from 'reactstrap';
import ProfileInfo from './ProfileInfo';

class Profile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col xs="12" md="4" className="my-3">
            <img src="https://www.petmd.com/sites/default/files/Acute-Dog-Diarrhea-47066074.jpg" />
          </Col>
          <Col xs="12" md="auto">
            {this.props.user ? (
              <ProfileInfo user={this.props.user} />
            ) : (
              <Spinner color="warning" />
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Profile;
