import React from 'react';
import { render } from '@testing-library/react';
import GamePortal from './game-portal';

test('renders learn react link', () => {
  const { getByText } = render(<GamePortal />);
  const linkElement = getByText(/./i);
  expect(linkElement).toBeInTheDocument();
});
