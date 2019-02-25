import React, { Component } from 'react';
import { Button, Container } from 'reactstrap';
import { API } from 'aws-amplify';
import { Icon } from 'react-icons-kit';
import { ic_settings } from 'react-icons-kit/md/ic_settings';

import EditGroup from './EditGroup';

class SingleGroup extends Component {
  state = {
    settings: false
  };

  async componentDidUpdate() {
    if (
      !this.state.group ||
      this.state.group.name !== this.props.match.params.name
    ) {
      const response = await API.get(
        '3YP',
        '/groups/' + this.props.match.params.name
      );
      this.setState({ group: response, settings: false });
      console.log(response);
    }
  }

  toggleSettings = () => {
    this.setState(prevState => ({
      settings: !prevState.settings
    }));
  };

  render() {
    return (
      <Container>
        <div>{this.props.match.params.name}</div>
        <div>{this.props.user.nickname}</div>
        <Button onClick={this.toggleSettings} className="bg-orange">
          <Icon size="24" icon={ic_settings} />
        </Button>
        {this.state.group && (
          <div>
            {this.state.settings ? (
              <EditGroup {...this.props} group={this.state.group} />
            ) : (
              <div>rest of posts</div>
            )}
          </div>
        )}
      </Container>
    );
  }
}

export default SingleGroup;
