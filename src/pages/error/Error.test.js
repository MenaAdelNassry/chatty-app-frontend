import { render, screen, fireEvent } from '@testing-library/react';
import Error from './Error';
import { ROUTES } from '@root/constants';

// 1. Mocking useNavigate
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Error Component', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  test('should render error text and 404 message correctly', () => {
    render(<Error />);

    expect(screen.getByText('Oops!')).toBeInTheDocument();
    expect(screen.getByText('Error 404: Page Not Found')).toBeInTheDocument();
  });

  test('should render back home button', () => {
    render(<Error />);

    const button = screen.getByRole('button', { name: /Back Home/i });
    expect(button).toBeInTheDocument();
  });

  test('should navigate to AUTH route when button is clicked', () => {
    render(<Error />);

    const button = screen.getByRole('button', { name: /Back Home/i });

    fireEvent.click(button);

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith(ROUTES.AUTH);
  });
});
