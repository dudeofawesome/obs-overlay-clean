import React, { Component, createRef, RefObject } from 'react';

import { CameraServiceContext } from '../../context';
import { CameraService } from '../../services/camera.service';

import './face-cam.scss';
import '../window/window.scss';

export class FaceCam extends Component<{}, FaceCamState> {
  static contextType = CameraServiceContext;
  private camera_service?: CameraService;
  private video_ref: RefObject<HTMLVideoElement>;

  constructor(props: {}) {
    super(props);
    this.video_ref = createRef();
    this.state = {};
  }

  async componentDidMount() {
    this.camera_service = this.context;
    this.forceUpdate();
  }

  async componentDidUpdate(prevProps: any, prevState: any) {
    if (this.video_ref.current != null) {
      try {
        const media_stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: this.camera_service?.media_device_id },
        });
        this.video_ref.current.srcObject = media_stream;
      } catch (e) {
        console.error(e);
      }
      this.video_ref.current.addEventListener('loadeddata', () => {
        this.video_ref.current?.play();
      });
    }
  }

  render() {
    const enabled = this.camera_service?.enabled;
    return (
      <div
        className="face-cam window"
        style={!enabled ? { marginBottom: '0px' } : {}}
      >
        {this.state?.error_msg}
        {enabled ? <video ref={this.video_ref}></video> : null}
      </div>
    );
  }
}

interface FaceCamState {
  error_msg?: string;
}
