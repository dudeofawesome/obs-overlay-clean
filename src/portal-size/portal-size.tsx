import React, { Component, createRef } from 'react';
import './portal-size.css';

export class PortalSize extends Component<{}> {
  private test = createRef<HTMLDivElement>();

  // constructor(props: {}) {
  //   super(props);
  //   // const parent = findDOMNode(this)?.parentElement;
  // }

  render() {
    console.log(this.test.current?.offsetWidth);

    return (
      <div className="portal-size" ref={this.test}>
        {/* {parent?.offsetWidth}×{parent?.offsetHeight} */}
        0x0
        {/* {this.refs.child.parentNode.clientWidth} */}
        {this.refs.child}
      </div>
    );
  }
}
