import React from 'react';
import { render } from '@testing-library/react';
import SideBar from './side-bar';

test('renders learn react link', () => {
  const { getByText } = render(<SideBar />);
  const linkElement = getByText(/./i);
  expect(linkElement).toBeInTheDocument();
});
