import { render, screen, fireEvent } from '@testing-library/react';
import MessageItem from './MessageItem';

// 1. Mocking External Components & Assets
jest.mock('@components/avatar/Avatar', () => (props) => (
  // بنعرض الاسم جوه div عشان نعرف ان الافاتار وصله الاسم صح
  <div data-testid="avatar">{props.name}</div>
));

jest.mock('@assets/images/double-checkmark.png', () => 'double-checkmark.png');

jest.mock('react-icons/fa', () => ({
  FaCheck: ({ className }) => <div data-testid="fa-check" className={className} />,
  FaCircle: ({ className }) => <div data-testid="fa-circle" className={className} />,
}));

describe('MessageItem Component', () => {
  const mockProfile = {
    username: 'sarah',
    avatarColor: 'red',
    profilePicture: ''
  };

  const baseNotification = {
    _id: '1',
    senderUsername: 'john', // المرسل
    senderAvatarColor: 'blue',
    senderProfilePicture: '',
    receiverUsername: 'sarah', // المستقبل
    receiverAvatarColor: 'red',
    receiverProfilePicture: '',
    body: 'Hello there!',
    isRead: false
  };

  const mockOnClick = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should display sender info when logged-in user is receiver', () => {
    render(
      <MessageItem
        notification={baseNotification}
        profile={mockProfile}
        onClick={mockOnClick}
      />
    );

    // ✅ الحل: بدل getByText (اللي بيجيب 2)، نستخدم getByRole عشان نحدد "العنوان" بس
    // H6 بيعتبر heading
    expect(screen.getByRole('heading', { name: 'john' })).toBeInTheDocument();
    expect(screen.getByText('Hello there!')).toBeInTheDocument();
  });

  test('should display receiver info when logged-in user is sender', () => {
    const senderProfile = { username: 'john' };
    render(
      <MessageItem
        notification={baseNotification}
        profile={senderProfile}
        onClick={mockOnClick}
      />
    );

    // ✅ الحل: نفس الكلام، نتأكد ان العنوان هو sarah
    expect(screen.getByRole('heading', { name: 'sarah' })).toBeInTheDocument();
  });

  test('should show FaCircle (unread dot) when user is receiver and message is unread', () => {
    render(
      <MessageItem
        notification={{ ...baseNotification, isRead: false }}
        profile={mockProfile}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByTestId('fa-circle')).toBeInTheDocument();
    expect(screen.queryByTestId('fa-check')).not.toBeInTheDocument();
  });

  test('should show FaCheck (single tick) when user is sender and message is unread', () => {
    const senderProfile = { username: 'john' };
    render(
      <MessageItem
        notification={{ ...baseNotification, isRead: false }}
        profile={senderProfile}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByTestId('fa-check')).toBeInTheDocument();
  });

  test('should show Double Checkmark image when user is sender and message is read', () => {
    const senderProfile = { username: 'john' };
    render(
      <MessageItem
        notification={{ ...baseNotification, isRead: true }}
        profile={senderProfile}
        onClick={mockOnClick}
      />
    );

    const img = screen.getByRole('presentation');

    expect(img).toHaveAttribute('src', 'double-checkmark.png');
    expect(img).toHaveClass('read');
  });

  test('should call onClick when clicked', () => {
    render(
      <MessageItem
        notification={baseNotification}
        profile={mockProfile}
        onClick={mockOnClick}
      />
    );

    fireEvent.click(screen.getByRole('heading', { name: 'john' }));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
