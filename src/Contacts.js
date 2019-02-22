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
                    <CardImg top src="/user.png" className="hide-in-mobile" />
                    <CardBody>
                      <h3>{item.nickname}</h3>
                      <CardSubtitle>
                        {item.emailPublic ? item.email : <button>mail</button>}
                      </CardSubtitle>
                      <CardText className="hide-in-mobile">{item.bio}</CardText>
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
                        <h5>
                          {item.emailPublic ? (
                            item.email
                          ) : (
                            <button>mail</button>
                          )}
                        </h5>
                        <p>{item.bio}</p>
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
