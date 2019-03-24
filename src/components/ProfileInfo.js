import React, { Component } from 'react';
import { Button, InputGroup, Input } from 'reactstrap';
import { API } from 'aws-amplify';

class ProfileInfo extends Component {
  state = {
    nickname: '',
    bio: '',
    edit: false
  };

  changeNickname = e => {
    this.setState({ nickname: e.target.value });
  };

  changeBio = e => {
    this.setState({ bio: e.target.value });
  };

  save = async () => {
    const toEdit = {};
    if (this.state.nickname) toEdit['nickname'] = this.state.nickname;
    if (this.state.bio) toEdit['bio'] = this.state.bio;

    if (this.state.nickname || this.state.bio) {
      const response = await API.put('3YP', '/profile', {
        body: toEdit
      });
      const user = { ...this.props.user, ...response.data.Attributes };
      this.props.setAppState({ user: user });
      this.toggle();
    }
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
        <p className="mb-0">{user.email}</p>
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
                placeholder={user.bio ? user.bio : 'add bio...'}
                onChange={this.changeBio}
              />
            </InputGroup>
            <br />
            <Button onClick={this.save} className="mr-1 bg-orange">
              Save
            </Button>
            <Button onClick={this.toggle} className="bg-orange">
              Cancel
            </Button>
          </div>
        ) : (
          <div>
            <h1>{user.nickname}</h1>
            {user.bio ? <h3>{user.bio}</h3> : <div />}
            <Button onClick={this.toggle} className="bg-orange">
              Edit info
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default ProfileInfo;
