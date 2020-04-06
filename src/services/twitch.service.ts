import TwitchClient, { HelixFollow } from 'twitch';
import PubSubClient from 'twitch-pubsub-client';
import {
  PubSubListener,
  PubSubSubscriptionMessage,
} from 'twitch-pubsub-client';
import { DateTime, Duration } from 'luxon';
import { Subject, timer, Subscription } from 'rxjs';

import {
  getterBool,
  getterDateTime,
  getterDuration,
  getterString,
  setterBool,
  setterDateTime,
  setterDuration,
  setterString,
} from '../utils/getter-setter';

export class TwitchService {
  private _settings = new _TwitchSettings();

  private _client?: TwitchClient;
  private _pubsub_client?: PubSubClient;
  private _subscriber_listener?: PubSubListener<PubSubSubscriptionMessage>;
  private _follower_check_timer?: Subscription;

  private readonly _scopes = ['chat:read', 'channel_subscriptions'];

  private _new_follower?: Subject<HelixFollow>;
  private _new_subscriber?: Subject<PubSubSubscriptionMessage>;
  private _new_donation?: Subject<any>;
  private _new_donation_bits?: Subject<any>;
  private _new_raid?: Subject<any>;

  public get new_follower() {
    return this._new_follower;
  }
  public get new_subscriber() {
    return this._new_subscriber;
  }
  public get new_donation() {
    return this._new_donation;
  }
  public get new_donation_bits() {
    return this._new_donation_bits;
  }
  public get new_raid() {
    return this._new_raid;
  }

  public get client_id(): string | undefined {
    return (
      getterString<_TwitchSettings>('twitch', 'client_id', this._settings) ??
      'pbcwgkykya4jjufuuybfl91jn2zhro'
    );
  }
  public set client_id(v: string | undefined) {
    setterString<_TwitchSettings>('twitch', 'client_id', v, this._settings);
  }

  public get client_secret(): string | undefined {
    return getterString<_TwitchSettings>(
      'twitch',
      'client_secret',
      this._settings,
    );
  }
  public set client_secret(v: string | undefined) {
    setterString<_TwitchSettings>('twitch', 'client_secret', v, this._settings);
  }

  public get access_token(): string | undefined {
    return getterString<_TwitchSettings>(
      'twitch',
      'access_token',
      this._settings,
    );
  }
  public set access_token(v: string | undefined) {
    setterString<_TwitchSettings>('twitch', 'access_token', v, this._settings);
  }

  public get access_token_exp(): DateTime | undefined {
    return getterDateTime<_TwitchSettings>(
      'twitch',
      'access_token_exp',
      this._settings,
    );
  }
  public set access_token_exp(v: DateTime | undefined) {
    setterDateTime<_TwitchSettings>(
      'twitch',
      'access_token_exp',
      v,
      this._settings,
    );
  }

  public get refresh_token(): string | undefined {
    return getterString<_TwitchSettings>(
      'twitch',
      'refresh_token',
      this._settings,
    );
  }
  public set refresh_token(v: string | undefined) {
    setterString<_TwitchSettings>('twitch', 'refresh_token', v, this._settings);
  }

  public get user_id(): string | undefined {
    return getterString<_TwitchSettings>('twitch', 'user_id', this._settings);
  }
  public set user_id(v: string | undefined) {
    setterString<_TwitchSettings>('twitch', 'user_id', v, this._settings);
  }

  public get user_name(): string | undefined {
    return (
      getterString<_TwitchSettings>('twitch', 'user_name', this._settings) ??
      'DudeOfAwesome'
    );
  }
  public set user_name(v: string | undefined) {
    setterString<_TwitchSettings>('twitch', 'user_name', v, this._settings);
  }

  public get notify_new_followers(): boolean | undefined {
    return getterBool<_TwitchSettings>(
      'twitch',
      'notify_new_followers',
      this._settings,
    );
  }
  public set notify_new_followers(v: boolean | undefined) {
    setterBool<_TwitchSettings>(
      'twitch',
      'notify_new_followers',
      v,
      this._settings,
    );
  }

  public get notify_new_followers_freq(): Duration | undefined {
    return getterDuration<_TwitchSettings>(
      'twitch',
      'notify_new_followers_freq',
      this._settings,
    );
  }
  public set notify_new_followers_freq(v: Duration | undefined) {
    setterDuration<_TwitchSettings>(
      'twitch',
      'notify_new_followers_freq',
      v,
      this._settings,
    );
  }

  public get notify_new_subscribers(): boolean | undefined {
    return getterBool<_TwitchSettings>(
      'twitch',
      'notify_new_subscribers',
      this._settings,
    );
  }
  public set notify_new_subscribers(v: boolean | undefined) {
    setterBool<_TwitchSettings>(
      'twitch',
      'notify_new_subscribers',
      v,
      this._settings,
    );
  }

  public get notify_donations(): boolean | undefined {
    return getterBool<_TwitchSettings>(
      'twitch',
      'notify_donations',
      this._settings,
    );
  }
  public set notify_donations(v: boolean | undefined) {
    setterBool<_TwitchSettings>(
      'twitch',
      'notify_donations',
      v,
      this._settings,
    );
  }

  public get notify_donations_bits(): boolean | undefined {
    return getterBool<_TwitchSettings>(
      'twitch',
      'notify_donations_bits',
      this._settings,
    );
  }
  public set notify_donations_bits(v: boolean | undefined) {
    setterBool<_TwitchSettings>(
      'twitch',
      'notify_donations_bits',
      v,
      this._settings,
    );
  }

  public get notify_raids(): boolean | undefined {
    return getterBool<_TwitchSettings>(
      'twitch',
      'notify_raids',
      this._settings,
    );
  }
  public set notify_raids(v: boolean | undefined) {
    setterBool<_TwitchSettings>('twitch', 'notify_raids', v, this._settings);
  }

  async authenticate() {
    const redirect_url = `${window.location.origin}/oauth/twitch`;
    const auth_code = await this.launchTwitchOAuth();
    const res = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${this.client_id}&client_secret=${this.client_secret}&code=${auth_code}&grant_type=authorization_code&redirect_uri=${redirect_url}`,
      { method: 'POST' },
    )
      .then(r => r.json())
      .then(r => {
        if (r.access_token != null) {
          return r as TwitchAuthToken;
        } else {
          throw r;
        }
      });
    console.log(res);

    this.access_token = res.access_token;
    this.access_token_exp = DateTime.fromMillis(
      Date.now() + res.expires_in * 1000,
    );
    this.refresh_token = res.refresh_token;
  }

  launchTwitchOAuth(hidden: boolean = false): Promise<string> {
    return new Promise((resolve, reject) => {
      const redirect_url = `${window.location.origin}/oauth/twitch`;
      const url =
        `https://id.twitch.tv/oauth2/authorize?client_id=${this.client_id}&` +
        `response_type=code&` +
        `redirect_uri=${redirect_url}&` +
        `scope=${this._scopes.join('+')}`;
      // const login_window = window.open(
      //   url,
      //   'Twitch Login',
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
        // login_iframe.style.display = 'none';
        timeout_id = window.setTimeout(() => {
          reject(new Error('Timed out'));
          // login_window?.close();
          login_iframe.remove();
        }, 5000);
      }

      const receiveOAuthResultMessage = (event: MessageEvent) => {
        // debugger;
        console.log(event);
        if (
          typeof event.data === 'object' &&
          event.data.type === 'Twitch OAuth'
        ) {
          if (timeout_id != null) {
            window.clearTimeout(timeout_id);
          }

          login_iframe.remove();
          window.removeEventListener('message', receiveOAuthResultMessage);

          if (event.data.auth_code != null) {
            resolve(event.data.auth_code);
          } else {
            reject();
          }
        }
      };

      window.addEventListener('message', receiveOAuthResultMessage, false);
    });
  }

  async createClient() {
    if (this.client_id == null) {
      throw new Error('client_id is null');
    } else if (this.user_name == null) {
      throw new Error('user_id is null');
    } else if (this.client_secret == null) {
      throw new Error('client_secret is null');
    } else if (this.refresh_token == null) {
      throw new Error('refresh_token is null');
    } else {
      this._client = TwitchClient.withCredentials(
        this.client_id,
        this.access_token,
        this._scopes,
        {
          clientSecret: this.client_secret,
          refreshToken: this.refresh_token,
          onRefresh: token => {
            this.access_token = token.accessToken;
            this.access_token = token.refreshToken;
          },
        },
      );

      const user = await this._client.helix.users.getUserByName(this.user_name);
      console.log(user);

      if (user == null) {
        throw new Error(`Couldn't find user ${this.user_name}`);
      } else {
        this.user_id = user.id;
      }
    }
  }

  async subscribe() {
    if (this._client == null) {
      console.warn('_client is null. trying to create');
      await this.createClient();
      if (this._client == null) {
        throw new Error('_client is null');
      }
    }
    if (this.user_id == null) {
      throw new Error('user_id is null');
    } else if (this.user_name == null) {
      throw new Error('user_name is null');
    } else {
      if (this.notify_new_followers) {
        if (this.notify_new_followers_freq == null) {
          throw new Error('notify_new_followers_freq is null');
        }
        if (this._new_follower == null) {
          this._new_follower = new Subject();
        }

        const freq = this.notify_new_followers_freq.valueOf();
        if (this._follower_check_timer != null) {
          this._follower_check_timer.unsubscribe();
        }
        this._follower_check_timer = timer(freq, freq).subscribe(async () => {
          const newest_followers = await this.getFollowers();
          console.log(newest_followers);
          const oldest_in_last_cycle_i = newest_followers.data.findIndex(
            follower =>
              DateTime.local().minus(freq) >
              DateTime.fromJSDate(follower.followDate),
          );
          const new_followers = newest_followers.data.slice(
            0,
            oldest_in_last_cycle_i,
          );

          console.log('NEW_FOLLOWERS');
          console.log(new_followers);

          if (new_followers.length !== 0) {
            const a = timer(0, freq / (new_followers.length + 1)).subscribe(
              i => {
                console.log(i);
                if (new_followers[i] == null) {
                  throw new Error('new_followers index exceeded');
                }
                this._new_follower?.next(new_followers[i]);
                if (i >= new_followers.length - 1) {
                  a.unsubscribe();
                }
              },
            );
          }
        });
      }
      if (this.notify_new_subscribers) {
        this._pubsub_client = new PubSubClient();
        await this._pubsub_client.registerUserListener(this._client);

        if (this._new_subscriber == null) {
          this._new_subscriber = new Subject();
        }

        this._subscriber_listener = await this._pubsub_client.onSubscription(
          this.user_id,
          message => {
            console.log(message);
            this._new_subscriber?.next(message);
            console.log(`${message.userDisplayName} just subscribed!`);
          },
        );
      }
      if (this.notify_donations) {
        console.warn('Donation notifications are not supported at this time');
      }
      if (this.notify_raids) {
      }
    }
  }

  unsubscribe() {
    this._subscriber_listener?.remove();
  }

  async getFollowers() {
    if (this._client == null) {
      throw new Error('_client is null');
    } else if (this.user_id == null) {
      throw new Error('user_id is null');
    }

    const followers = await this._client.helix.users.getFollows({
      followedUser: this.user_id,
    });
    if (followers == null) {
      throw new Error('followers is null');
    }

    console.log(followers);
    return followers;
  }
}

class _TwitchSettings {
  client_id?: string;
  client_secret?: string;
  access_token?: string;
  access_token_exp?: DateTime;
  refresh_token?: string;
  user_id?: string;
  user_name?: string;

  notify_new_followers?: boolean;
  notify_new_followers_freq?: Duration;
  notify_new_subscribers?: boolean;
  notify_donations?: boolean;
  notify_donations_bits?: boolean;
  notify_raids?: boolean;
}

export interface TwitchAuthToken {
  access_token: string;
  /** Number of seconds until the token expires */
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: 'bearer' | string;
}
