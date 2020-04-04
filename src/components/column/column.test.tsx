import React from 'react';
import { render, queryByAttribute } from '@testing-library/react';
import { Column } from './column';

test('renders learn react link', () => {
  const { getByText } = render(<Column />);
  const divElement = queryByAttribute('style');
  expect(divElement).toBeInTheDocument();
});
