import React from 'react';
import { render, queryByAttribute } from '@testing-library/react';
import { TrueCenter } from './center';

test('renders learn react link', () => {
  const { getByText } = render(<TrueCenter />);
  const divElement = queryByAttribute('style');
  expect(divElement).toBeInTheDocument();
});
