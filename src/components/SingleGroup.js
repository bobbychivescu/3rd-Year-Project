import React, { Component } from 'react';
import { Button, Container } from 'reactstrap';
import { API } from 'aws-amplify';
import { Icon } from 'react-icons-kit';
import { ic_settings } from 'react-icons-kit/md/ic_settings';

import EditGroup from './EditGroup';
import GroupContent from './GroupContent';
class SingleGroup extends Component {
  state = {};

  async componentDidMount() {
    this.setState({
      group: await API.get('3YP', '/groups/' + this.props.match.params.name)
    });
  }

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
    }
  }

  setAppState = state => {
    this.setState(state);
  };

  toggleSettings = () => {
    this.setState(prevState => ({
      settings: !prevState.settings
    }));
  };

  render() {
    return (
      <Container>
        <div className="m-2">
          <h2 className="d-inline-block">{this.props.match.params.name}</h2>
          <Button
            onClick={this.toggleSettings}
            className="bg-orange float-right"
          >
            <Icon size="24" icon={ic_settings} />
          </Button>
        </div>
        {this.state.group && (
          <div>
            {this.state.settings ? (
              <EditGroup
                {...this.props}
                group={this.state.group}
                set={this.setAppState}
              />
            ) : (
              <GroupContent group={this.state.group} />
            )}
          </div>
        )}
      </Container>
    );
  }
}

export default SingleGroup;
