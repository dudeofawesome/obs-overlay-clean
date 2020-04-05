import TwitchClient, { HelixFollow } from 'twitch';
import PubSubClient from 'twitch-pubsub-client';
import {
  PubSubListener,
  PubSubSubscriptionMessage,
} from 'twitch-pubsub-client';
import { DateTime, Duration } from 'luxon';
import { Subject, timer, Subscription } from 'rxjs';

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
    return this._getterString('client_id') ?? 'pbcwgkykya4jjufuuybfl91jn2zhro';
  }
  public set client_id(v: string | undefined) {
    this._setterString('client_id', v);
  }

  public get client_secret(): string | undefined {
    return this._getterString('client_secret');
  }
  public set client_secret(v: string | undefined) {
    this._setterString('client_secret', v);
  }

  public get access_token(): string | undefined {
    return this._getterString('access_token');
  }
  public set access_token(v: string | undefined) {
    this._setterString('access_token', v);
  }

  public get access_token_exp(): DateTime | undefined {
    return this._getterDateTime('access_token_exp');
  }
  public set access_token_exp(v: DateTime | undefined) {
    this._setterDateTime('access_token_exp', v);
  }

  public get refresh_token(): string | undefined {
    return this._getterString('refresh_token');
  }
  public set refresh_token(v: string | undefined) {
    this._setterString('refresh_token', v);
  }

  public get user_id(): string | undefined {
    return this._getterString('user_id');
  }
  public set user_id(v: string | undefined) {
    this._setterString('user_id', v);
  }

  public get user_name(): string | undefined {
    return this._getterString('user_name') ?? 'DudeOfAwesome';
  }
  public set user_name(v: string | undefined) {
    this._setterString('user_name', v);
  }

  public get notify_new_followers(): boolean | undefined {
    return this._getterBool('notify_new_followers');
  }
  public set notify_new_followers(v: boolean | undefined) {
    this._setterBool('notify_new_followers', v);
  }

  public get notify_new_followers_freq(): Duration | undefined {
    return this._getterDuration('notify_new_followers_freq');
  }
  public set notify_new_followers_freq(v: Duration | undefined) {
    this._setterDuration('notify_new_followers_freq', v);
  }

  public get notify_new_subscribers(): boolean | undefined {
    return this._getterBool('notify_new_subscribers');
  }
  public set notify_new_subscribers(v: boolean | undefined) {
    this._setterBool('notify_new_subscribers', v);
  }

  public get notify_donations(): boolean | undefined {
    return this._getterBool('notify_donations');
  }
  public set notify_donations(v: boolean | undefined) {
    this._setterBool('notify_donations', v);
  }

  public get notify_donations_bits(): boolean | undefined {
    return this._getterBool('notify_donations_bits');
  }
  public set notify_donations_bits(v: boolean | undefined) {
    this._setterBool('notify_donations_bits', v);
  }

  public get notify_raids(): boolean | undefined {
    return this._getterBool('notify_raids');
  }
  public set notify_raids(v: boolean | undefined) {
    this._setterBool('notify_raids', v);
  }

  private _getterString(key: keyof _TwitchSettings): string | undefined {
    if (this._settings[key] == null) {
      this._settings[key] = (localStorage.getItem(`twitch_${key}`) ??
        undefined) as any;
    }
    return this._settings[key] as string | undefined;
  }
  private _getterBool(key: keyof _TwitchSettings): boolean | undefined {
    if (this._settings[key] == null) {
      const v = localStorage.getItem(`twitch_${key}`);
      if (v === 'true') this._settings[key] = true as any;
      else if (v === 'false') this._settings[key] = false as any;
      else this._settings[key] = undefined;
    }
    return this._settings[key] as boolean | undefined;
  }
  private _getterDateTime(key: keyof _TwitchSettings): DateTime | undefined {
    if (this._settings[key] == null) {
      const val = localStorage.getItem(`twitch_${key}`);
      if (val != null) {
        return DateTime.fromMillis(parseInt(val));
      } else {
        return undefined;
      }
    }
    return this._settings[key] as DateTime | undefined;
  }
  private _getterDuration(key: keyof _TwitchSettings): Duration | undefined {
    if (this._settings[key] == null) {
      const val = localStorage.getItem(`twitch_${key}`);
      if (val != null) {
        return Duration.fromMillis(parseInt(val));
      } else {
        return undefined;
      }
    }
    return this._settings[key] as Duration | undefined;
  }

  private _setterString(
    key: keyof _TwitchSettings,
    value: string | undefined,
  ): void {
    this._settings[key] = value as any;
    if (value != null) {
      localStorage.setItem(`twitch_${key}`, value);
    } else {
      localStorage.removeItem(`twitch_${key}`);
    }
  }
  private _setterBool(
    key: keyof _TwitchSettings,
    value: boolean | undefined,
  ): void {
    this._settings[key] = value as any;
    if (value != null) {
      localStorage.setItem(`twitch_${key}`, value ? 'true' : 'false');
    } else {
      localStorage.removeItem(`twitch_${key}`);
    }
  }
  private _setterDateTime(
    key: keyof _TwitchSettings,
    value: DateTime | undefined,
  ): void {
    this._settings[key] = value as any;
    if (value != null) {
      localStorage.setItem(`twitch_${key}`, value.toMillis() + '');
    } else {
      localStorage.removeItem(`twitch_${key}`);
    }
  }
  private _setterDuration(
    key: keyof _TwitchSettings,
    value: Duration | undefined,
  ): void {
    this._settings[key] = value as any;
    if (value != null) {
      localStorage.setItem(`twitch_${key}`, value.valueOf() + '');
    } else {
      localStorage.removeItem(`twitch_${key}`);
    }
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
      const login_window = window.open(
        `https://id.twitch.tv/oauth2/authorize?client_id=${
          this.client_id
        }&response_type=code&redirect_uri=${redirect_url}&scope=${this._scopes.join(
          '+',
        )}`,
        'Twitch Login',
        'toolbar=no, menubar=no, width=600, height=700',
      );

      let timeout_id: number;

      if (!hidden) {
        login_window?.focus();
      } else {
        timeout_id = window.setTimeout(() => {
          reject(new Error('Timed out'));
          login_window?.close();
        }, 5000);
      }

      const receiveOAuthResultMessage = (event: MessageEvent) => {
        console.log(event);
        if (
          typeof event.data === 'object' &&
          event.data.type === 'Twitch OAuth'
        ) {
          if (timeout_id != null) {
            window.clearTimeout(timeout_id);
          }
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
