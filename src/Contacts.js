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

class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      query: ''
    };
  }

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
          {this.props.contacts
            .filter(contact => {
              return contact.includes(this.state.query);
            })
            .map(item => (
              <Col md="3">
                <Card className="my-2 bej">
                  <CardImg top src="/user.png" className="hide-in-mobile" />
                  <CardBody>
                    <h3>{item}</h3>
                    <CardSubtitle>Mail? or button to send email </CardSubtitle>
                    <CardText className="hide-in-mobile">
                      TO BE HIDDEN IN MOBILE maybe show in modal?.
                    </CardText>
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
      </div>
    );
  }
}

export default Contacts;
