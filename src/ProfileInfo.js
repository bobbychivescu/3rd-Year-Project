import React, { Component } from 'react';
import { Button, InputGroup, Input } from 'reactstrap';
import { API } from 'aws-amplify';

const noBio = 'no bio added';

class ProfileInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: '',
      bio: '',
      edit: false
    };
  }

  changeNickname = e => {
    this.setState({ nickname: e.target.value });
  };

  changeBio = e => {
    this.setState({ bio: e.target.value });
  };

  save = async () => {
    const response = await API.post('3YP', '/profile', {
      body: {
        nickname: this.state.nickname
          ? this.state.nickname
          : this.props.user.nickname,
        bio: this.state.bio ? this.state.bio : this.props.user.bio
      }
    });
    window.location.reload();
  };

  toggle = () => {
    this.setState({
      edit: !this.state.edit
    });
  };

  render() {
    const user = this.props.user;
    return (
      <div className="my-3 justify-content-around">
        {this.state.edit ? (
          <div>
            <InputGroup size="lg">
              <Input
                placeholder={user.nickname}
                onChange={this.changeNickname}
              />
            </InputGroup>
            <br />
            <InputGroup>
              <Input
                placeholder={user.bio !== noBio ? user.bio : 'add bio...'}
                onChange={this.changeBio}
              />
            </InputGroup>
            <br />
            <Button onClick={this.save}>Save</Button>
            <Button onClick={this.toggle}>Cancel</Button>
          </div>
        ) : (
          <div>
            <h1>{user.nickname}</h1>
            <h3>{user.bio}</h3>
            <Button onClick={this.toggle}>Edit</Button>
          </div>
        )}
      </div>
    );
  }
}

export default ProfileInfo;
