import {
  getterBool,
  getterString,
  setterBool,
  setterString,
} from '../utils/getter-setter';

export class CameraService {
  private _settings = new _CameraSettings();

  public get media_device_id(): string | undefined {
    return getterString<_CameraSettings>('media_device_id', this._settings);
  }
  public set media_device_id(v: string | undefined) {
    setterString<_CameraSettings>('media_device_id', v, this._settings);
  }
  public get enabled(): boolean | undefined {
    return getterBool<_CameraSettings>('enabled', this._settings);
  }
  public set enabled(v: boolean | undefined) {
    setterBool<_CameraSettings>('enabled', v, this._settings);
  }
  public get autofocus(): boolean | undefined {
    return getterBool<_CameraSettings>('autofocus', this._settings);
  }
  public set autofocus(v: boolean | undefined) {
    setterBool<_CameraSettings>('autofocus', v, this._settings);
  }

  public async getMediaDevices(): Promise<MediaDeviceInfo[] | undefined> {
    return (await navigator.mediaDevices?.enumerateDevices()).filter(
      dev => dev.kind === 'videoinput',
    );
  }
}

class _CameraSettings {
  readonly prefix = 'camera';

  media_device_id?: string;

  enabled?: boolean;
  autofocus?: boolean;
}
