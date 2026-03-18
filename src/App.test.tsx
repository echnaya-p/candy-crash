import { render, screen } from '@testing-library/react';
import App from './App';

test('renders candy crash title', () => {
  render(<App />);
  const titleElement = screen.getByText(/candy crash/i);
  expect(titleElement).toBeInTheDocument();
});
