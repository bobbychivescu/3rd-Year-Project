import React, { Component } from 'react';
import { Button, Container, Input } from 'reactstrap';
import DateTimePicker from 'react-datetime-picker';
import SelectMembers from './SelectMembers';
import { API } from 'aws-amplify';

class EditGroup extends Component {
  constructor(props) {
    super(props);
    const d = new Date(this.props.group.endDate);
    this.state = {
      private: this.props.group.private,
      members: [],
      membersToRemove: [],
      date: d
    };
    console.log(props);
  }

  changeDesc = e => this.setState({ desc: e.target.value });

  changeDate = date => this.setState({ date });

  togglePrivate = () => this.setState({ private: !this.state.private });

  addMember = id => this.setState({ members: [...this.state.members, id] });
  removeMember = id =>
    this.setState({ membersToRemove: [...this.state.membersToRemove, id] });

  save = async () => {
    let updatedGroup = {};
    if (this.state.membersToRemove.length) {
      const response = await API.put(
        '3YP',
        '/groups/delete/' + this.props.group.name,
        {
          body: { members: this.state.membersToRemove }
        }
      );
      updatedGroup['members'] = response.data.Attributes.members;
    }

    const group = {};
    if (this.state.desc) {
      group['description'] = this.state.desc;
    }
    if (this.state.private !== this.props.group.private) {
      group['private'] = this.state.private;
    }
    if (
      this.state.date.getTime() !== new Date(this.props.group.endDate).getTime()
    ) {
      group['endDate'] = this.state.date;
    }

    if (Object.keys(group).length !== 0) {
      const response = await API.put(
        '3YP',
        '/groups/' + this.props.group.name,
        {
          body: group
        }
      );
      updatedGroup = { ...updatedGroup, ...response.data.Attributes };
    }

    //add memebers directly
    if (this.state.members.length) {
      const response = await API.put(
        '3YP',
        '/groups/add/' + this.props.group.name,
        {
          body: { members: this.state.members }
        }
      );
      updatedGroup['members'] = response.data.Attributes.members;
    }

    updatedGroup = { ...this.props.group, ...updatedGroup };
    this.props.set({ group: updatedGroup, settings: false });
  };

  render() {
    var maxDate = new Date(this.props.group.endDate);
    maxDate.setDate(maxDate.getDate() + 30);
    return (
      <Container fluid>
        <h2>Edit Group Settings</h2>
        <hr />
        {this.props.user.userId === this.props.group.createdBy && (
          <div>
            <h4>Remove members</h4>
            <SelectMembers
              contacts={this.props.contacts.filter(contact => {
                return this.props.group.members.values.includes(contact.userId);
              })}
              select={this.removeMember}
              buttonText="Remove"
              members={this.state.membersToRemove}
            />
            <hr />
            <h4>Description</h4>
            <Input
              placeholder={
                this.props.group.description
                  ? this.props.group.description
                  : 'optional'
              }
              onChange={this.changeDesc}
              className="half-on-desktop my-1"
            />
            <hr />
            <h4>End date</h4>
            <p>
              {/*Current end date is {new Date(this.props.group.endDate)}.*/}
              Choose a date and time when this group will expire and be deleted.
            </p>
            <DateTimePicker
              minDate={new Date()}
              maxDate={maxDate}
              onChange={this.changeDate}
              value={this.state.date}
            />
            <hr />
            <h4>Private</h4>
            <p>
              Only members of the group can add other members from their contact
              list to a private group.
            </p>
            <label>
              <input
                type="checkbox"
                defaultChecked={this.state.private}
                onChange={this.togglePrivate}
                className="m-1"
              />
              PRIVATE
            </label>
            <hr />
          </div>
        )}
        <h4>Add members</h4>
        <SelectMembers
          contacts={this.props.contacts}
          select={this.addMember}
          buttonText="Add"
          members={[...this.props.group.members.values, ...this.state.members]}
        />
        <Button onClick={this.save} className="bg-orange">
          Save
        </Button>
      </Container>
    );
  }
}

export default EditGroup;
