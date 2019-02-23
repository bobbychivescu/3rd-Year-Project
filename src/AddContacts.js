import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  Container,
  Input
} from 'reactstrap';

class AddContacts extends Component {
  state = {
    query: '',
    focused: false
  };

  changeQuery = e => this.setState({ query: e.target.value });

  toggleContacts = () => this.setState({ focused: true });

  render() {
    return (
      <Container>
        <Input
          className="half-on-desktop my-1"
          placeholder="search by username, email..."
          onChange={this.changeQuery}
          onFocus={this.toggleContacts}
        />
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
              <Card className="my-2 bej">
                <CardBody>
                  <h3>{item.nickname}</h3>
                  {item.emailPublic && (
                    <CardSubtitle>{item.email}</CardSubtitle>
                  )}
                  <Button
                    onClick={() => this.props.add(item.userId)}
                    className="bg-orange"
                  >
                    Add
                  </Button>
                </CardBody>
              </Card>
            ))}
      </Container>
    );
  }
}

export default AddContacts;
