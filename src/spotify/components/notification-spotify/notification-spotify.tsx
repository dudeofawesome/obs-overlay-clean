import React, { Component } from 'react';
import { Duration, DateTime } from 'luxon';
import { FaPlay, FaPause } from 'react-icons/fa';
import { timer, Subscription } from 'rxjs';

import { SpotifyServiceContext } from '../../../context';
import { Notification } from '../../../components/notification/notification';
import { Row } from '../../../components/row/row';
import { Column } from '../../../components/column/column';
import { SpotifyService } from '../../services/spotify.service';

import './notification-spotify.scss';

export class NotificationSpotify extends Component<
  NotificationSpotifyProps,
  NotificationSpotifyState
> {
  static contextType = SpotifyServiceContext;
  static defaultProps = {
    refresh_interval: Duration.fromObject({ minutes: 1 }),
  };

  private spotify_service?: SpotifyService;
  private _timer?: Subscription;

  constructor(
    props: NotificationSpotifyProps,
    state: NotificationSpotifyState,
  ) {
    super(props);
    this.state = {
      timestamp: DateTime.local(),
      playing: false,
    };
  }

  componentDidMount() {
    this.spotify_service = this.context;
    // this.updateSpotify();
    this._timer = timer(0, 60000).subscribe(async () => {
      if (this.spotify_service?.enabled) {
        const status = await this.spotify_service.getSpotifyStatus();
        if (status != null) {
          this.setState(s => ({
            ...s,
            // timestamp:
            //   res.timestamp != null ? DateTime.fromMillis(res.timestamp) : null,
            playing: status.is_playing,
            song_name: status.item?.name,
            artist_name: status.item?.artists
              ?.slice(
                0,
                status.item?.artists.length <= 3
                  ? status.item?.artists.length
                  : 3,
              )
              .map(a => a.name)
              .join(', '),
            album_name: status.item?.album.name,
            album_art_url: status.item?.album.images[2].url,
          }));
        }
      }
    });
  }

  componentWillUnmount() {
    this._timer?.unsubscribe();
  }

  render() {
    return (
      <Notification
        name="Spotify"
        icon_url="https://lh3.googleusercontent.com/UrY7BAZ-XfXGpfkeWg0zCCeo-7ras4DCoRalC_WXXWTK9q5b0Iw7B0YQMsVxZaNB7DM=s180"
        visible={this.state.song_name != null}
      >
        <Row className="status">
          <div
            className="album-art"
            style={{
              backgroundImage: `url('${this.state.album_art_url}')`,
            }}
          ></div>
          <Column className="info" style={{ justifyContent: 'center' }}>
            <div className="song-name">{this.state.song_name}</div>
            <div className="artist-name">{this.state.artist_name}</div>
            <div className="album-name">{this.state.album_name}</div>
          </Column>
          <div className="play-status">
            {this.state.playing ? <FaPlay /> : <FaPause />}
          </div>
        </Row>
      </Notification>
    );
  }
}

export interface NotificationSpotifyProps {
  refresh_interval?: Duration;
}

export interface NotificationSpotifyState {
  timestamp?: DateTime;
  playing?: boolean;
  song_name?: string;
  artist_name?: string;
  album_name?: string;
  album_art_url?: string;
  song_duration?: Duration;
}
