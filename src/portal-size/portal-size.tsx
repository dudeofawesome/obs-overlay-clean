import React, { Component, createRef } from 'react';
import './portal-size.css';

export class PortalSize extends Component<{}> {
  private test = createRef<HTMLDivElement>();

  // constructor(props: {}) {
  //   super(props);
  //   // const parent = findDOMNode(this)?.parentElement;
  // }

  componentDidMount() {
    this.setState({});
  }

  render() {
    const width = this.test.current?.parentElement?.offsetWidth;
    const height = this.test.current?.parentElement?.offsetHeight;
    const top = this.test.current?.parentElement?.offsetTop;
    const left = this.test.current?.parentElement?.offsetLeft;
    const right =
      window.innerWidth -
      ((this.test.current?.parentElement?.offsetLeft ?? 0) + (width ?? 0));

    return (
      <div
        className="portal-size"
        ref={this.test}
        onClick={e => e.stopPropagation()}
      >
        <div>
          {width ?? '?'}×{height ?? '?'}
        </div>
        <div className="details">
          <div>Top: {top ?? '?'}</div>
          <div>Left: {left ?? '?'}</div>
          <div>Right: {right !== 0 ? right : '?'}</div>
        </div>
      </div>
    );
  }
}
