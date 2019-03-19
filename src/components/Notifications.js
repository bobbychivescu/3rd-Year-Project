import React, { Component } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { clearNotifications } from '../apiWrapper';

class Notifications extends Component {
  state = {
    open: false
  };

  toggle = () => this.setState(prevState => ({ open: !prevState.open }));

  open = path => {
    console.log(path);
    this.props.history.push(path);
  };

  clear = () => {
    clearNotifications();
    const user = this.props.user;
    user.notifications = null;
    this.props.set({ user: user });
  };

  render() {
    return (
      <Dropdown
        isOpen={this.state.open}
        toggle={this.toggle}
        className="float-right"
      >
        <DropdownToggle caret className="bg-orange">
          Notifications
        </DropdownToggle>
        <DropdownMenu right>
          {this.props.user.notifications &&
            this.props.user.notifications.map(ntf => (
              <DropdownItem onClick={() => this.open(ntf.path)}>
                {ntf.text}
              </DropdownItem>
            ))}

          <DropdownItem divider />
          <DropdownItem
            disabled={!this.props.user.notifications}
            onClick={this.clear}
          >
            Clear list
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default Notifications;
