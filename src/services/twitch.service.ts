import TwitchClient from 'twitch';
import PubSubClient from 'twitch-pubsub-client';
import {
  PubSubListener,
  PubSubSubscriptionMessage,
} from 'twitch-pubsub-client';
import { DateTime } from 'luxon';

export class TwitchService {
  private _settings = new _TwitchSettings();

  private _client?: TwitchClient;
  private _pubsub_client?: PubSubClient;
  private _subscriber_listener?: PubSubListener<PubSubSubscriptionMessage>;

  constructor() {
    this.subscribe()
      .then(v => console.log(v))
      .catch(err => console.log(err));
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
    return this._getterString('user_id') ?? 'DudeOfAwesome';
  }
  public set user_id(v: string | undefined) {
    this._setterString('user_id', v);
  }

  public get notify_new_followers(): boolean | undefined {
    return this._getterBool('notify_new_followers');
  }
  public set notify_new_followers(v: boolean | undefined) {
    this._setterBool('notify_new_followers', v);
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
        `https://id.twitch.tv/oauth2/authorize?client_id=${this.client_id}&response_type=code&redirect_uri=${redirect_url}&scope=chat:read`,
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

  async subscribe() {
    if (this.client_id == null) {
      throw new Error('client_id is null');
    } else if (this.user_id == null) {
      throw new Error('user_id is null');
    } else if (this.client_secret == null) {
      throw new Error('client_secret is null');
    } else if (this.refresh_token == null) {
      throw new Error('refresh_token is null');
    } else {
      // this._client = TwitchClient.withClientCredentials(
      //   this.client_id,
      //   this.access_token,
      // );
      this._client = TwitchClient.withCredentials(
        this.client_id,
        this.access_token,
        undefined,
        {
          clientSecret: this.client_secret,
          refreshToken: this.refresh_token,
          onRefresh: token => {
            this.access_token = token.accessToken;
            this.access_token = token.refreshToken;
          },
        },
      );

      this._pubsub_client = new PubSubClient();
      await this._pubsub_client.registerUserListener(this._client);

      this._subscriber_listener = await this._pubsub_client.onSubscription(
        this.user_id,
        message => {
          console.log(`${message.userDisplayName} just subscribed!`);
        },
      );
    }
  }

  unsubscribe() {
    this._subscriber_listener?.remove();
  }
}

class _TwitchSettings {
  client_id?: string;
  client_secret?: string;
  access_token?: string;
  access_token_exp?: DateTime;
  refresh_token?: string;
  user_id?: string;

  notify_new_followers?: boolean;
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
