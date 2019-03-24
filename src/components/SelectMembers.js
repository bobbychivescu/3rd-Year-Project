import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  Container,
  Row,
  COl,
  Input,
  Col
} from 'reactstrap';

class SelectMembers extends Component {
  state = {
    query: '',
    focused: false
  };

  changeQuery = e => this.setState({ query: e.target.value });

  toggleContacts = () => this.setState({ focused: true });

  toggleBack = () => this.setState({ focused: false });

  render() {
    return (
      <Container>
        <Input
          className="half-on-desktop my-1 mr-1 d-inline-block"
          placeholder="search by username, email..."
          onChange={this.changeQuery}
          onFocus={this.toggleContacts}
        />
        <Button onClick={this.toggleBack} className="bg-orange">
          Hide
        </Button>
        <Row>
          {this.state.focused &&
            this.props.contacts
              .filter(contact => {
                return (
                  !this.props.members.includes(contact.userId) &&
                  (contact.nickname.includes(this.state.query) ||
                    (contact.emailPublic &&
                      contact.email.includes(this.state.query)))
                );
              })
              .map(item => (
                <Col md="3">
                  <Card className="my-2 bej">
                    <CardBody>
                      <h3>{item.nickname}</h3>
                      {item.emailPublic && (
                        <CardSubtitle>{item.email}</CardSubtitle>
                      )}
                      <Button
                        onClick={() => this.props.select(item.userId)}
                        className="bg-orange"
                      >
                        {this.props.buttonText}
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              ))}
        </Row>
      </Container>
    );
  }
}

export default SelectMembers;
