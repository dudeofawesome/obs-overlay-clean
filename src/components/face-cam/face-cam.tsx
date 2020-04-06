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

  async componentDidUpdate() {
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
    return (
      <div className="face-cam window">
        {this.state?.error_msg}
        {this.camera_service?.enabled ? (
          <video ref={this.video_ref}></video>
        ) : null}
      </div>
    );
  }
}

interface FaceCamState {
  error_msg?: string;
}
