import React from 'react';
import { render, queryByAttribute } from '@testing-library/react';
import { InfrequentClock } from './infrequent-clock';

test('renders learn react link', () => {
  const { getByText } = render(<InfrequentClock />);
  const divElement = queryByAttribute('style');
  expect(divElement).toBeInTheDocument();
});
