import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardText,
  Col,
  Row,
  Modal,
  ModalBody,
  ModalHeader,
  Input,
  Button
} from 'reactstrap';
import { API } from 'aws-amplify';

class Contacts extends Component {
  state = {
    modal: false,
    query: ''
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  changeQuery = e => {
    this.setState({
      query: e.target.value
    });
  };

  getInTouch = async id => {
    await API.post('3YP', '/profile/contact', {
      body: {
        contact: id,
        userNickname: this.props.user.nickname,
        userEmail: this.props.user.email
      }
    });
    alert('Message sent!');
  };

  onError = e => (e.target.src = '/user.png');

  render() {
    return (
      <div className="text-center">
        <h2>Contacts</h2>
        <Input
          className="half-on-desktop d-block m-auto"
          placeholder="search by username, email..."
          onChange={this.changeQuery}
        />
        <Row>
          {this.props.contacts &&
            this.props.contacts
              .filter(contact => {
                return (
                  contact.nickname.includes(this.state.query) ||
                  (contact.emailPublic &&
                    contact.email.includes(this.state.query))
                );
              })
              .map(item => (
                <Col md="3">
                  <Card className="my-2 bej">
                    <CardImg
                      top
                      src={item.img}
                      onError={this.onError}
                      className="hide-in-mobile"
                      style={{ height: '250px' }}
                    />
                    <CardBody>
                      <h3>{item.nickname}</h3>
                      <CardText className="hide-in-mobile">{item.bio}</CardText>
                      <CardSubtitle>
                        {item.emailPublic ? (
                          item.email
                        ) : (
                          <Button
                            onClick={() => this.getInTouch(item.userId)}
                            className="bg-orange"
                          >
                            Get in touch
                          </Button>
                        )}
                      </CardSubtitle>
                    </CardBody>
                    <Button
                      onClick={this.toggle}
                      className="hide-in-desktop bg-orange"
                    >
                      Show more
                    </Button>
                    <Modal
                      centered
                      isOpen={this.state.modal}
                      toggle={this.toggle}
                    >
                      <ModalHeader toggle={this.toggle}>
                        {item.nickname}
                      </ModalHeader>
                      <ModalBody>
                        {item.emailPublic && <h5>{item.email}</h5>}
                        <p>{item.bio}</p>
                        <img
                          alt=""
                          src={item.img}
                          onError={this.onError}
                          style={{ height: '300px' }}
                        />
                      </ModalBody>
                    </Modal>
                  </Card>
                </Col>
              ))}
        </Row>
      </div>
    );
  }
}

export default Contacts;
