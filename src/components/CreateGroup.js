import React, { Component } from 'react';
import { Container, Input, Button } from 'reactstrap';
import DateTimePicker from 'react-datetime-picker';
import SelectMembers from './SelectMembers';

import { createGroup } from '../apiWrapper';

class CreateGroup extends Component {
  constructor(props) {
    super(props);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.state = {
      private: false,
      date: tomorrow,
      members: []
    };
  }

  changeName = e => this.setState({ name: e.target.value });

  changeDesc = e => this.setState({ desc: e.target.value });

  changeDate = date => this.setState({ date });

  togglePrivate = () => this.setState({ private: !this.state.private });

  addMember = id => this.setState({ members: [...this.state.members, id] });

  create = async () => {
    if (!this.state.name) {
      alert('Name cannot be empty!');
    } else {
      const group = {
        name: this.state.name,
        endDate: this.state.date,
        private: this.state.private,
        members: [...this.state.members, this.props.user.userId]
      };
      if (this.state.desc) group['description'] = this.state.desc;
      if (await createGroup(group)) {
        let groups;
        if (this.props.groups) {
          groups = [group, ...this.props.groups];
        } else {
          groups = [group];
        }
        this.props.setAppState({ groups: groups });
        this.props.history.push('/groups/' + this.state.name);
      } else {
        alert('A group with this name already exists');
      }
    }
  };

  render() {
    var maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return (
      <Container fluid>
        <h2>Create a new group</h2>
        <hr />
        <h4>Name</h4>
        <Input
          placeholder="must be unique..."
          onChange={this.changeName}
          className="half-on-desktop my-1"
        />
        <hr />
        <h4>Description</h4>
        <Input
          placeholder="optional"
          onChange={this.changeDesc}
          className="half-on-desktop my-1"
        />
        <hr />
        <h4>End date</h4>
        <p>
          Choose a date and time when this group will expire and be deleted.
          Maximum is 30 days. Default is one day. The group creator can extend
          the end date at any time.
        </p>
        <DateTimePicker
          minDate={this.state.date}
          maxDate={maxDate}
          onChange={this.changeDate}
          value={this.state.date}
        />
        <hr />
        <h4>Private</h4>
        <p>
          Only members of the group can add other members from their contact
          list to a private group. The default is public.
        </p>
        <label>
          <input
            type="checkbox"
            defaultChecked={false}
            onChange={this.togglePrivate}
            className="m-1"
          />
          PRIVATE
        </label>
        <hr />
        <h4>Add members</h4>
        <SelectMembers
          contacts={this.props.contacts}
          select={this.addMember}
          buttonText="Add"
          members={this.state.members}
        />
        <Button onClick={this.create} className="bg-orange">
          Create group
        </Button>
      </Container>
    );
  }
}

export default CreateGroup;
