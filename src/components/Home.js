import React, { Component } from 'react';
import { API } from 'aws-amplify';
import {
  Container,
  Button,
  Input,
  Row,
  Col,
  Card,
  CardBody,
  CardText
} from 'reactstrap';
import { addMembers } from '../apiWrapper';

class Home extends Component {
  state = {};

  changeSearch = e => this.setState({ search: e.target.value });

  search = async () => {
    const res = await API.get('3YP', '/groups/search/' + this.state.search);
    this.setState({ groups: res.data.Items });
  };

  join = async group => {
    const resp = await addMembers(group, [this.props.user.userId]);
    this.setState({
      groups: this.state.groups.map(g => {
        if (g.name === group.name) {
          g.members = resp.data.Attributes.members;
          return g;
        } else return g;
      })
    });
  };

  render() {
    return (
      <Container>
        <h1 className="text-center">Welcome to 3YP!</h1>
        <h5 className="text-center">Search and join public groups</h5>
        <Input
          onChange={this.changeSearch}
          className="half-on-desktop d-block m-auto"
        />
        <div className="text-center">
          <Button onClick={this.search} className="bg-orange my-1">
            Search
          </Button>
        </div>
        <Row>
          {this.state.groups &&
            this.state.groups.map(g => (
              <Col md="3">
                <Card className="my-2 bej">
                  <CardBody className="text-center">
                    <h3>{g.name}</h3>
                    <CardText>
                      {g.description
                        ? g.description
                        : 'no description available'}
                    </CardText>
                    <hr />
                    {g.members &&
                    g.members.values.includes(this.props.user.userId) ? (
                      <p>
                        <strong>Already a member!</strong>
                      </p>
                    ) : (
                      <Button
                        onClick={() => this.join(g)}
                        className="bg-orange"
                      >
                        Join
                      </Button>
                    )}
                  </CardBody>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>
    );
  }
}

export default Home;
