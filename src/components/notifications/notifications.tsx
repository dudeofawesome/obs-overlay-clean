import React, { Component, ClassAttributes } from 'react';
import { DateTime } from 'luxon';
import { HelixFollow } from 'twitch';

import { Notification } from '../notification/notification';
import { TwitchServiceContext } from '../../context';
import { TwitchService } from '../../services/twitch.service';
import { NotificationSpotify } from '../../spotify/components/notification-spotify/notification-spotify';

import './notifications.scss';
import '../window/window.scss';

export class Notifications extends Component<
  ClassAttributes<void>,
  NotificationsState
> {
  static contextType = TwitchServiceContext;
  private twitch_service?: TwitchService;

  constructor(props: ClassAttributes<void>) {
    super(props);
    this.state = { followers: [] };
  }

  componentDidMount() {
    this.twitch_service = this.context;

    this.subscribeTwitch();
  }

  async subscribeTwitch() {
    await this.twitch_service?.subscribe();

    this.twitch_service?.new_follower?.subscribe(follower => {
      console.log('Notifications got a new follower');
      this.setState(s => ({ ...s, followers: [follower, ...s.followers] }));
    });
  }

  render() {
    // const notifications: JSX.Element[] = [0, 1, 2, 3, 4, 5, 6].map(
    //   (notification, i) => (
    //     <Notification
    //       key={i.toString()}
    //       name="Twitch Thing"
    //       time={DateTime.local().minus(
    //         Duration.fromObject({ minutes: Math.random() * 50 }),
    //       )}
    //     >
    //       test
    //     </Notification>
    //   ),
    // );
    // if (spotify_api_key != null) {
    //   notifications.push(
    //     <NotificationSpotify
    //       key={'spotify'}
    //       api_key={spotify_api_key}
    //     ></NotificationSpotify>,
    //   );
    // }

    const notifications = this.state.followers.map((follower, i) => (
      <Notification
        key={i.toString()}
        name="New Follower"
        time={DateTime.fromJSDate(follower.followDate)}
      >
        {follower.userDisplayName} just followed!
      </Notification>
    ));

    return (
      <div className="notifications">
        {notifications.sort((a, b) => {
          // TODO: this whole thing is probably wrong
          if (a.props.time == null) {
            return -1;
          } else if (b.props.time == null) {
            return 1;
          } else {
            // TODO: this might not return a negative
            return (b.props.time as DateTime)
              .diff(a.props.time as DateTime)
              .valueOf();
          }
        })}
      </div>
    );
  }
}

interface NotificationsState {
  followers: HelixFollow[];
}
