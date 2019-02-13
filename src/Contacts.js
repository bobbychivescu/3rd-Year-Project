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
  ModalHeader
} from 'reactstrap';

class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  render() {
    return (
      <Row>
        {this.props.contacts.map(item => (
          <Col md="2">
            <Card>
              <CardImg top src="/user.png" className="hide-in-mobile" />
              <CardBody>
                <h3>{item}</h3>
                <CardSubtitle>Mail? or button to send email </CardSubtitle>
                <CardText className="hide-in-mobile">
                  TO BE HIDDEN IN MOBILE maybe show in modal?.
                </CardText>
              </CardBody>
              <button onClick={this.toggle} className="hide-in-desktop">
                Show more
              </button>
              <Modal centered isOpen={this.state.modal} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>{item}</ModalHeader>
                <ModalBody>
                  <h5>mail or button</h5>
                  <p>statuslajkdlja aslkjds la alskjdlaj sdl as d</p>
                  <img src="/user.png" />
                </ModalBody>
              </Modal>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }
}

export default Contacts;
