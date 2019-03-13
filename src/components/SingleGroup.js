import React, { Component } from 'react';
import { Button, Container } from 'reactstrap';
import { Icon } from 'react-icons-kit';
import { ic_settings } from 'react-icons-kit/md/ic_settings';

import { getGroup } from '../apiWrapper';
import EditGroup from './EditGroup';
import GroupContent from './GroupContent';
class SingleGroup extends Component {
  state = {};

  async componentDidMount() {
    await this.update();
  }

  update = async () => {
    const g = await getGroup(this.props.match.params.name);
    if (g.error) {
      this.setState({ error: this.props.match.params.name });
    } else {
      this.setState({
        group: g,
        settings: false
      });
    }
  };

  async componentDidUpdate() {
    console.log(JSON.stringify(this.state));
    if (this.state.error === this.props.match.params.name) return;
    if (
      !this.state.group ||
      this.state.group.name !== this.props.match.params.name
    ) {
      this.update();
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
        {this.state.group && (
          <div>
            <div className="mx-2">
              <h2 className="d-inline-block">{this.state.group.name}</h2>
              <Button
                onClick={this.toggleSettings}
                className="bg-orange float-right"
              >
                <Icon size="24" icon={ic_settings} />
              </Button>
            </div>

            {this.state.settings ? (
              <EditGroup
                {...this.props}
                group={this.state.group}
                set={this.setAppState}
              />
            ) : (
              <GroupContent {...this.props} group={this.state.group} />
            )}
          </div>
        )}
      </Container>
    );
  }
}

export default SingleGroup;
