import React, { Component } from 'react';
import { Duration, DateTime } from 'luxon';
import { FaPlay, FaPause } from 'react-icons/fa';

import './notification-spotify.scss';
import { Notification } from '../../../components/notification/notification';

export class NotificationSpotify extends Component<
  NotificationSpotifyProps,
  NotificationSpotifyState
> {
  static defaultProps = {
    refresh_interval: Duration.fromObject({ minutes: 1 }),
  };
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
    this.updateSpotify();
  }

  componentWillUnmount() {
    // TODO: stop timer
  }

  render() {
    return (
      <Notification
        name="Spotify"
        icon_url="https://lh3.googleusercontent.com/UrY7BAZ-XfXGpfkeWg0zCCeo-7ras4DCoRalC_WXXWTK9q5b0Iw7B0YQMsVxZaNB7DM=s180"
        visible={this.state.song_name != null}
      >
        <div className="row status">
          {/* <img
            className="album-art"
            src={this.state.album_art_url}
            alt={this.state.album_name}
          /> */}
          <div
            className="album-art"
            style={{
              backgroundImage: `url('${this.state.album_art_url}')`,
            }}
          ></div>
          <div className="column info">
            <div className="song-name">{this.state.song_name}</div>
            <div className="artist-name">{this.state.artist_name}</div>
            <div className="album-name">{this.state.album_name}</div>
          </div>
          <div className="play-status">
            {this.state.playing ? <FaPlay /> : <FaPause />}
          </div>
        </div>
      </Notification>
    );
  }

  async updateSpotify() {
    const spotify_access_token_expiration = localStorage.getItem(
      'spotify_access_token_expiration',
    );
    if (
      spotify_access_token_expiration != null &&
      Number.parseInt(spotify_access_token_expiration)
    ) {
    }

    const res = await fetch(
      `https://api.spotify.com/v1/me/player/currently-playing`,
      {
        headers: {
          Authorization: `Bearer ${this.props.api_key}`,
        },
      },
    ).then(r => r.json());

    if (res.error != null && res.error.message === 'The access token expired') {
      await this.refreshSpotifyToken();
      // await this.updateSpotify();
      return;
    }

    let refresh_dur = Duration.fromMillis(60 * 1000);
    if (res.is_playing) {
      refresh_dur = Duration.fromMillis(res.item.duration_ms - res.progress_ms);
    }
    setTimeout(() => this.updateSpotify(), refresh_dur.valueOf());

    this.setState(state => ({
      // timestamp:
      //   res.timestamp != null ? DateTime.fromMillis(res.timestamp) : null,
      playing: res.is_playing,
      song_name: res.item?.name,
      artist_name: (res.item?.artists as any[])
        ?.slice(0, res.item.artists.length <= 3 ? res.item.artists.length : 3)
        .map(a => a.name)
        .join(', '),
      album_name: res.item?.album.name,
      album_art_url: res.item?.album.images[2].url,
    }));
    console.log(res);
  }

  async refreshSpotifyToken() {
    const spotify_refresh_token = window.localStorage.getItem(
      'spotify_refresh_token',
    );
    const res = await fetch(`https://accounts.spotify.com/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        refresh_token: spotify_refresh_token,
        grant_type: 'refresh_token',
      }),
    }).then(r => r.json());

    console.log(res);
    window.localStorage.setItem('spotify_access_token', res.access_token);
    window.localStorage.setItem(
      'spotify_access_token_expiration',
      (Date.now() + res.expires_in * 1000).toString(),
    );
    return res.access_token;
  }

  async getSpotifyTokenFromCode() {
    const code = window.localStorage.getItem('spotify_code');
    const res = await fetch(`https://api.spotify.com/v1/swap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ code }),
    }).then(r => r.json());
    console.log(res);
  }
}

export interface NotificationSpotifyProps {
  api_key: string;
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
