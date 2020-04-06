import { DateTime } from 'luxon';

import { SpotifyCurrentlyPlaying, SpotifyError } from './spotify';
import {
  getterBool,
  getterDateTime,
  getterString,
  setterBool,
  setterDateTime,
  setterString,
} from '../../utils/getter-setter';

export class SpotifyService {
  private _settings = new _SpotifySettings();

  public set enabled(v: boolean | undefined) {
    setterBool<_SpotifySettings>('spotify', 'enabled', v, this._settings);
  }
  public get enabled(): boolean | undefined {
    return getterBool<_SpotifySettings>('spotify', 'enabled', this._settings);
  }

  public set spotify_client_id(v: string | undefined) {
    setterString<_SpotifySettings>('spotify', 'client_id', v, this._settings);
  }
  public get spotify_client_id(): string | undefined {
    return (
      getterString<_SpotifySettings>('spotify', 'client_id', this._settings) ??
      '90f61a9875dc44a28faf437b70e8b01b'
    );
  }

  public set spotify_auth_code(v: string | undefined) {
    setterString<_SpotifySettings>('spotify', 'auth_code', v, this._settings);
  }
  public get spotify_auth_code(): string | undefined {
    return getterString<_SpotifySettings>(
      'spotify',
      'auth_code',
      this._settings,
    );
  }

  public set spotify_refresh_token(v: string | undefined) {
    setterString<_SpotifySettings>(
      'spotify',
      'refresh_token',
      v,
      this._settings,
    );
  }
  public get spotify_refresh_token(): string | undefined {
    return getterString<_SpotifySettings>(
      'spotify',
      'refresh_token',
      this._settings,
    );
  }

  public set spotify_auth_token(v: string | undefined) {
    setterString<_SpotifySettings>('spotify', 'auth_token', v, this._settings);
  }
  public get spotify_auth_token(): string | undefined {
    return getterString<_SpotifySettings>(
      'spotify',
      'auth_token',
      this._settings,
    );
  }

  public set spotify_auth_token_exp(v: DateTime | undefined) {
    setterDateTime<_SpotifySettings>(
      'spotify',
      'auth_token_exp',
      v,
      this._settings,
    );
  }
  public get spotify_auth_token_exp(): DateTime | undefined {
    return getterDateTime<_SpotifySettings>(
      'spotify',
      'auth_token_exp',
      this._settings,
    );
  }

  async getSpotifyStatus(): Promise<SpotifyCurrentlyPlaying> {
    if (
      this.spotify_auth_token_exp != null &&
      this.spotify_auth_token_exp >= DateTime.local()
    ) {
      // use auth token to get
      const res = await fetch(
        `https://api.spotify.com/v1/me/player/currently-playing`,
        {
          headers: {
            Authorization: `Bearer ${this.spotify_auth_token}`,
          },
        },
      )
        .then(r => r.json())
        .then(r => {
          if (r.error != null) {
            throw r;
          } else {
            return r as SpotifyCurrentlyPlaying;
          }
        })
        .catch((e: SpotifyError) => {
          if (e.error.message === 'The access token expired') {
            // TODO: refresh the token
            console.error(e.error);
            throw new Error(e.error.message);
          } else if (e.error.message === 'Invalid access token') {
            console.error(e.error);
            throw new Error(e.error.message);
          } else {
            console.error(e.error);
            throw new Error(e.error.message);
          }
        });

      return res;
    } else {
      // TODO: refresh the token
      console.error('Spotify token is expired');
      await this.launchSpotifyOAuth();
      if (
        this.spotify_auth_token_exp != null &&
        this.spotify_auth_token_exp >= DateTime.local()
      ) {
        return await this.getSpotifyStatus();
      } else {
        console.log('Spotify token is still expired');
        throw new Error('Spotify token is still expired');
      }
    }
  }

  launchSpotifyOAuth(hidden: boolean = false): Promise<void> {
    return new Promise((resolve, reject) => {
      const client_id = this.spotify_client_id;
      const redirect_url = `${window.location.origin}/spotify-oauth`;
      const url =
        `https://accounts.spotify.com/authorize?client_id=${client_id}&` +
        `response_type=token&` +
        `redirect_uri=${redirect_url}&` +
        `scope=user-read-currently-playing`;
      // const login_window = window.open(
      //   url,
      //   'Spotify Login',
      //   'toolbar=no, menubar=no, width=600, height=700',
      // );
      const login_iframe = document.createElement('iframe');
      login_iframe.src = url;
      document.body.appendChild(login_iframe);

      let timeout_id: number;

      if (!hidden) {
        // login_window?.focus();
        login_iframe.className = 'window active';
        login_iframe.style.position = 'fixed';
        login_iframe.style.top = '0px';
        login_iframe.style.left = '0px';
        login_iframe.style.marginTop = '50%';
        login_iframe.style.marginLeft = '50%';
        login_iframe.style.width = '400px';
        login_iframe.style.height = '500px';
        login_iframe.style.transform = 'translate(-50%, -50%)';
      } else {
        timeout_id = window.setTimeout(() => {
          reject(new Error('Timed out'));
          // login_window?.close();
          login_iframe.remove();
        }, 5000);
      }

      const receiveOAuthResultMessage = (event: MessageEvent) => {
        console.log(event);
        if (
          typeof event.data === 'object' &&
          event.data.type === 'Spotify OAuth'
        ) {
          if (timeout_id != null) {
            window.clearTimeout(timeout_id);
          }
          login_iframe.remove();
          window.removeEventListener('message', receiveOAuthResultMessage);

          if (event.data.href.startsWith('http')) {
            resolve();
          } else {
            reject();
          }
        }
      };

      window.addEventListener('message', receiveOAuthResultMessage, false);
    });
  }
}

class _SpotifySettings {
  enabled?: boolean;

  client_id?: string;
  auth_code?: string;
  refresh_token?: string;
  auth_token?: string;
  auth_token_exp?: DateTime;
}
