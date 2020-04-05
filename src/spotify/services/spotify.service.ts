import { DateTime } from 'luxon';

export class SpotifyService {
  private _enabled?: boolean;
  private _spotify_client_id?: string;
  private _spotify_auth_code?: string;
  private _spotify_refresh_token?: string;
  private _spotify_auth_token?: string;
  private _spotify_auth_token_exp?: DateTime;

  public set enabled(v: boolean) {
    this._enabled = v;
    localStorage.setItem('spotify_enabled', v ? '1' : '0');
  }
  public get enabled(): boolean {
    if (this._enabled == null) {
      this._enabled =
        localStorage.getItem('spotify_enabled') === '1' ? true : false;
    }
    return this._enabled;
  }

  public set spotify_client_id(v: string | undefined) {
    this._spotify_client_id = v;
    if (v != null) {
      localStorage.setItem('spotify_client_id', v);
    } else {
      localStorage.removeItem('spotify_client_id');
    }
  }
  public get spotify_client_id(): string | undefined {
    if (this._spotify_client_id == null) {
      this._spotify_client_id =
        localStorage.getItem('spotify_client_id') ??
        '90f61a9875dc44a28faf437b70e8b01b';
    }
    return this._spotify_client_id;
  }

  public set spotify_auth_code(v: string | undefined) {
    this._spotify_auth_code = v;
    if (v != null) {
      localStorage.setItem('spotify_auth_code', v);
    } else {
      localStorage.removeItem('spotify_auth_code');
    }
  }
  public get spotify_auth_code(): string | undefined {
    if (this._spotify_auth_code == null) {
      this._spotify_auth_code =
        localStorage.getItem('spotify_auth_code') ?? undefined;
    }
    return this._spotify_auth_code;
  }

  public set spotify_refresh_token(v: string | undefined) {
    this._spotify_refresh_token = v;
    if (v != null) {
      localStorage.setItem('spotify_refresh_token', v);
    } else {
      localStorage.removeItem('spotify_refresh_token');
    }
  }
  public get spotify_refresh_token(): string | undefined {
    if (this._spotify_refresh_token == null) {
      this._spotify_refresh_token =
        localStorage.getItem('spotify_refresh_token') ?? undefined;
    }
    return this._spotify_refresh_token;
  }

  public set spotify_auth_token(v: string | undefined) {
    this._spotify_auth_token = v;
    if (v != null) {
      localStorage.setItem('spotify_auth_token', v);
    } else {
      localStorage.removeItem('spotify_auth_token');
    }
  }
  public get spotify_auth_token(): string | undefined {
    if (this._spotify_auth_token == null) {
      this._spotify_auth_token =
        localStorage.getItem('spotify_auth_token') ?? undefined;
    }
    return this._spotify_auth_token;
  }

  public set spotify_auth_token_exp(v: DateTime | undefined) {
    this._spotify_auth_token_exp = v;
    if (v != null) {
      localStorage.setItem('spotify_auth_token_exp', v.valueOf() + '');
    } else {
      localStorage.removeItem('spotify_auth_token_exp');
    }
  }
  public get spotify_auth_token_exp(): DateTime | undefined {
    if (this._spotify_auth_token_exp == null) {
      const storage = localStorage.getItem('spotify_auth_token_exp');
      if (storage != null) {
        this._spotify_auth_token_exp = DateTime.fromMillis(
          Number.parseInt(storage),
        );
      }
    }
    return this._spotify_auth_token_exp;
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
      const login_window = window.open(
        `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_url}&scope=user-read-currently-playing`,
        'Spotify Login',
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
          event.data.type === 'Spotify OAuth'
        ) {
          if (timeout_id != null) {
            window.clearTimeout(timeout_id);
          }
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

export interface SpotifyCurrentlyPlaying {
  context?: SpotifyContext;
  /** Unix Millisecond Timestamp when data was fetched */
  timestamp: number;
  /** Progress into the currently playing track or episode. Can be null. */
  progress_ms?: number;
  /** If something is currently playing. */
  is_playing: boolean;
  /** The currently playing track or episode. Can be null. */
  item?: SpotifyTrack | SpotifyEpisode;
  /** The object type of the currently playing item. */
  currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown';
  /**
   * Allows to update the user interface based on which playback actions are
   * available within the current context
   */
  actions: SpotifyActions;
}

export interface SpotifyContext {
  external_urls: { [key: string]: string };
  href: string;
  type: string;
  uri: string;
}

export interface SpotifyTrack {
  /**
   * The album on which the track appears. The album object includes a link in
   * href to full information about the album.
   */
  album: SpotifyAlbum;
  /**
   * The artists who performed the track. Each artist object includes a link in
   * href to more detailed information about the artist.
   */
  artists: SpotifyArtist[];
  /**
   * A list of the countries in which the track can be played, identified by
   * their [ISO 3166-1 alpha-2](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
   * code.
   */
  available_markets: string[];
  /**
   * The disc number
   * (usually `1` unless the album consists of more than one disc).
   */
  disc_number: number;
  /** The track length in milliseconds. */
  duration_ms: number;
  /**
   * Whether or not the track has explicit lyrics
   * (`true` = yes it does; `false` = no it does not OR unknown).
   */
  explicit: boolean;
  /** Known external IDs for the track. */
  external_ids: SpotifyExternalID;
  /** Known external URLs for this track. */
  external_urls: SpotifyExternalURLs;
  /** A link to the Web API endpoint providing full details of the track. */
  href: string;
  /**
   * The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids)
   * for the track.
   */
  id: string;
  /**
   * Part of the response when
   * [Track Relinking](https://developer.spotify.com/documentation/general/guides/track-relinking-guide/)
   * is applied. If `true`, the track is playable in the given market.
   * Otherwise `false`.
   */
  is_playable: boolean;
  /**
   * Part of the response when [Track Relinking](https://developer.spotify.com/documentation/general/guides/track-relinking-guide/)
   * is applied, and the requested track has been replaced with different track.
   * The track in the `linked_from` object contains information about the
   * originally requested track.
   */
  linked_from: SpotifyLinkedTrack;
  /**
   * Part of the response when [Track Relinking](https://developer.spotify.com/documentation/general/guides/track-relinking-guide/)
   * is applied, the original track is not available in the given market, and
   * Spotify did not have any tracks to relink it with. The track response will
   * still contain metadata for the original track, and a restrictions object
   * containing the reason why the track is not available:
   * `"restrictions" : {"reason" : "market"}`
   */
  restrictions: SpotifyRestrictions;
  name: string;
  /**
   * The popularity of the track. The value will be between 0 and 100, with 100
   * being the most popular. The popularity of a track is a value between 0 and
   * 100, with 100 being the most popular. The popularity is calculated by
   * algorithm and is based, in the most part, on the total number of plays the
   * track has had and how recent those plays are.
   * Generally speaking, songs that are being played a lot now will have a
   * higher popularity than songs that were played a lot in the past. Duplicate
   * tracks (e.g. the same track from a single and an album) are rated
   * independently. Artist and album popularity is derived mathematically from
   * track popularity. Note that the popularity value may lag actual popularity
   * by a few days: the value is not updated in real time.
   */
  popularity: number;
  /** A link to a 30 second preview (MP3 format) of the track. */
  preview_url?: string;
  /**
   * The number of the track. If an album has several discs, the track number
   * is the number on the specified disc.
   */
  track_number: number;
  type: 'track';
  /**
   * The [Spotify URI](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids)
   * for the track.
   */
  uri: string;
  /** Whether or not the track is from a local file. */
  is_local: boolean;
}

export interface SpotifyEpisode {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  [key: string]: any | undefined;
}

export interface SpotifyAlbum {
  /**
   * The field is present when getting an artist’s albums. Compare to
   * `album_type` this field represents relationship between the artist and the
   * album.
   */
  album_group?: 'album' | 'single' | 'compilation' | 'appears_on';
  album_type: 'album' | 'single' | 'compilation';
  /**
   * The artists of the album. Each artist object includes a link in `href` to
   * more detailed information about the artist.
   */
  artists: SpotifyArtist[];
  /**
   * The markets in which the album is available:
   * [ISO 3166-1 alpha-2 country codes](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
   * Note that an album is considered available in a market when at least 1 of
   * its tracks is available in that market.
   */
  available_markets: string[];
  /** URL object 	Known external URLs for this album. */
  external_urls: SpotifyExternalURLs;
  /** A link to the Web API endpoint providing full details of the album. */
  href: string;
  /**
   * The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids)
   * for the album.
   */
  id: string;
  /** The cover art for the album in various sizes, widest first. */
  images: SpotifyImage[];
  /**
   * The name of the album. In case of an album takedown, the value may be an
   * empty string.
   */
  name: string | '';
  /**
   * The date the album was first released, for example `1981`. Depending on
   * the precision, it might be shown as `1981-12` or `1981-12-15`.
   */
  release_date: string;
  /** The precision with which `release_date` value is known. */
  release_date_precision: 'year' | 'month' | 'day';
  /**
   * Part of the response when Track Relinking is applied, the original track
   * is not available in the given market, and Spotify did not have any tracks
   * to relink it with. The track response will still contain metadata for the
   * original track, and a restrictions object containing the reason why the
   * track is not available: `"restrictions" : {"reason" : "market"}`
   */
  restrictions: SpotifyRestrictions;
  type: 'album';
  /**
   * The [Spotify URI](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids)
   * for the album.
   */
  uri: string;
}

export interface SpotifyArtist {
  /** Known external URLs for this artist. */
  external_urls: SpotifyExternalURLs;
  /** A link to the Web API endpoint providing full details of the artist. */
  href: string;
  /**
   * The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids)
   * for the artist.
   */
  id: string;
  name: string;
  type: 'artist';
  /**
   * The [Spotify URI](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids)
   * for the artist.
   */
  uri: string;
}

export interface SpotifyImage {
  url: string;
  width?: number | null;
  height?: number | null;
}

export interface SpotifyRestrictions {
  reason: string;
}

export interface SpotifyExternalID {
  /**
   * [International Standard Recording Code](http://en.wikipedia.org/wiki/International_Standard_Recording_Code)
   */
  isrc?: string;
  /**
   * [International Article Number](http://en.wikipedia.org/wiki/International_Article_Number_%28EAN%29)
   */
  ean?: string;
  /**
   * [Universal Product Code](http://en.wikipedia.org/wiki/Universal_Product_Code)
   */
  upc?: string;
  /** An external identifier for the object. */
  [key: string]: string | undefined;
}

export interface SpotifyExternalURLs {
  /**
   * The [Spotify URL](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids)
   * for the object.
   */
  spotify?: string;
  /** An external, public URL to the object. */
  [key: string]: string | undefined;
}

export interface SpotifyLinkedTrack {
  /** Known external URLs for this track. */
  external_urls: SpotifyExternalURLs;
  /** A link to the Web API endpoint providing full details of the track. */
  href: string;
  /**
   * The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids)
   * for the track.
   */
  id: string;
  type: 'track';
  /**
   * The [Spotify URI](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids)
   * for the track.
   */
  uri: string;
}

export interface SpotifyActions {
  disallows?: {
    resuming?: boolean;
    [key: string]: any;
  };
  [key: string]: any | undefined;
}

export interface SpotifyError {
  error: {
    status: number;
    message: string;
  };
}
