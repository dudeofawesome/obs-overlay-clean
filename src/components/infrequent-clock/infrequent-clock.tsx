import React, { Component, ComponentProps } from 'react';
import { Subscription, timer } from 'rxjs';
import { DateTime } from 'luxon';

export class InfrequentClock extends Component<
  InfrequentClockProps,
  { i: number }
> {
  static defaultProps: Partial<InfrequentClockProps> = {
    update_frequency: 60000,
  };

  private timer?: Subscription;

  constructor(props: InfrequentClockProps) {
    super(props);
    this.state = { i: -1 };
  }

  componentDidMount() {
    this.setState(s => ({ ...s, i: 0 }));
    this.timer = timer(
      this.props.update_frequency,
      this.props.update_frequency,
    ).subscribe(i => this.setState(s => ({ ...s, i })));
  }

  componentWillUnmount() {
    this.timer?.unsubscribe();
  }

  render() {
    return (
      <div {...this.props} title={this.state?.i.toString()}>
        {this.props.time.toRelative({ style: 'narrow' })}
      </div>
    );
  }
}

type InfrequentClockProps = {
  /** Frequency of updates in ms */
  update_frequency?: number;
  time: DateTime;
} & ComponentProps<'div'>;
