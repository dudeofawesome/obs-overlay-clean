import React, { Component } from 'react';
import { DateTime } from 'luxon';

import './notification.scss';

export class Notification extends Component<NotificationProps> {
  static defaultProps = {
    visible: true,
  };

  render() {
    return (
      <div
        className="notification column"
        style={{ display: this.props.visible ? undefined : 'none' }}
      >
        <div className="header row">
          {this.props.icon_url != null ? (
            <img className="icon" src={this.props.icon_url} alt="app icon" />
          ) : null}
          <div className="name">{this.props.name}</div>
          <div className="spacer"></div>
          {this.props.time ? (
            <div className="time">
              {this.props.time.toRelative({ style: 'narrow' })}
            </div>
          ) : null}
        </div>
        <div className="body">{this.props.children}</div>
      </div>
    );
  }
}

export interface NotificationProps {
  name: string;
  icon_url?: string;
  time?: DateTime;
  visible: boolean;
}
