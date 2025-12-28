import { render, screen, fireEvent } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Suggestions from './Suggestions';
import { ROUTES } from '@root/constants';

// 1. Mocking External Libraries (Redux & Router)
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// 2. Mocking Child Components
jest.mock('@components/avatar/Avatar', () => (props) => (
  <div data-testid="avatar">{props.name}</div>
));

jest.mock('@components/button/Button', () => (props) => (
  <button onClick={props.handleClick}>{props.label}</button>
));

describe('Suggestions Component', () => {
  const mockNavigate = jest.fn();

  const mockUsers = [
    { _id: '1', username: 'user1', avatarColor: 'red', profilePicture: '' },
    { _id: '2', username: 'user2', avatarColor: 'blue', profilePicture: '' }
  ];

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    mockNavigate.mockClear();
    useSelector.mockClear();
  });

  test('should render suggestions list with users', () => {
    useSelector.mockReturnValue({ users: mockUsers, isLoading: false });

    render(<Suggestions />);

    expect(screen.getByText('Suggestions')).toBeInTheDocument();

    const items = screen.getAllByTestId('suggestions-item');
    expect(items).toHaveLength(2);

    expect(screen.getAllByText('user1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('user2').length).toBeGreaterThan(0);
  });

  test('should display "No suggestions available" when users list is empty and not loading', () => {
    useSelector.mockReturnValue({ users: [], isLoading: false });

    render(<Suggestions />);

    expect(screen.getByText('No suggestions available')).toBeInTheDocument();
  });

  test('should NOT display "No suggestions available" when loading is true', () => {
    useSelector.mockReturnValue({ users: [], isLoading: true });

    render(<Suggestions />);

    expect(screen.queryByText('No suggestions available')).not.toBeInTheDocument();
  });

  test('should NOT display "View More" button when users count is less than 8', () => {
    useSelector.mockReturnValue({ users: mockUsers, isLoading: false });

    render(<Suggestions />);

    expect(screen.queryByText('View More')).not.toBeInTheDocument();
  });

  test('should display "View More" button when users count is 8 or more and navigate on click', () => {
    const manyUsers = new Array(8).fill({ _id: 'x', username: 'u' });
    useSelector.mockReturnValue({ users: manyUsers, isLoading: false });

    render(<Suggestions />);

    const viewMoreBtn = screen.getByText('View More');
    expect(viewMoreBtn).toBeInTheDocument();

    fireEvent.click(viewMoreBtn);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SOCIAL_PEOPLE);
  });
});
