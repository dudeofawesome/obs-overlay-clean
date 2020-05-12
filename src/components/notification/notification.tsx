import React, { Component } from 'react';
import { DateTime } from 'luxon';

import { InfrequentClock } from '../infrequent-clock/infrequent-clock';
import { Row } from '../row/row';
import { Column } from '../column/column';

import './notification.scss';

export class Notification extends Component<NotificationProps> {
  static defaultProps: Partial<NotificationProps> = {
    visible: true,
  };

  render() {
    return (
      <Column
        className="notification"
        style={{ display: this.props.visible ? undefined : 'none' }}
      >
        <Row className="header">
          {this.props.icon_url != null ? (
            <img className="icon" src={this.props.icon_url} alt="app icon" />
          ) : null}
          <div className="name">{this.props.name}</div>
          <div className="spacer"></div>
          {this.props.time != null ? (
            <InfrequentClock
              className="time"
              update_frequency={30000}
              time={this.props.time}
            />
          ) : null}
        </Row>
        <div className="body">{this.props.children}</div>
      </Column>
    );
  }
}

export interface NotificationProps {
  name: string;
  icon_url?: string;
  time?: DateTime;
  visible: boolean;
}
