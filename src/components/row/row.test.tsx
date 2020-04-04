import React from 'react';
import { render, queryByAttribute } from '@testing-library/react';
import { Row } from './row';

test('renders learn react link', () => {
  const { getByText } = render(<Row />);
  const divElement = queryByAttribute('style');
  expect(divElement).toBeInTheDocument();
});
