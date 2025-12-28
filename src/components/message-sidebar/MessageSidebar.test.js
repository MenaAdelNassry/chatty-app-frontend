import { render, screen, fireEvent } from '@testing-library/react';
import MessageSidebar from './MessageSidebar';

// 1. Mocking Dropdown
jest.mock('@components/dropdown/Dropdown', () => ({ children, title, subTitle }) => (
  <div data-testid="mock-dropdown">
    <h1>{title}</h1>
    <span>{subTitle}</span>
    <div data-testid="dropdown-content">{children}</div>
  </div>
));

// 2. Mocking MessageItem
jest.mock('@components/message-sidebar/message-item/MessageItem', () => (props) => (
  <div data-testid="message-item" onClick={props.onClick}>
    Message Item for {props.notification._id}
  </div>
));

describe('MessageSidebar Component', () => {
  const mockProfile = { username: 'sarah' };
  const mockOpenChatPage = jest.fn();

  const notifications = [
    { _id: '1', body: 'msg 1', senderUsername: 'john' },
    { _id: '2', body: 'msg 2', senderUsername: 'doe' }
  ];

  beforeEach(() => {
    mockOpenChatPage.mockClear();
  });

  test('should render dropdown with correct title and count', () => {
    render(
      <MessageSidebar
        profile={mockProfile}
        messageCount={5}
        messageNotifications={notifications}
        openChatPage={mockOpenChatPage}
      />
    );

    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('should render list of MessageItems when notifications exist', () => {
    render(
      <MessageSidebar
        profile={mockProfile}
        messageCount={2}
        messageNotifications={notifications}
        openChatPage={mockOpenChatPage}
      />
    );

    const items = screen.getAllByTestId('message-item');
    expect(items).toHaveLength(2);
  });

  test('should render "No messages yet" when list is empty', () => {
    render(
      <MessageSidebar
        profile={mockProfile}
        messageCount={0}
        messageNotifications={[]}
        openChatPage={mockOpenChatPage}
      />
    );

    expect(screen.getByText('No messages yet')).toBeInTheDocument();
    expect(screen.queryByTestId('message-item')).not.toBeInTheDocument();
  });

  test('should call openChatPage with correct notification when item is clicked', () => {
    render(
      <MessageSidebar
        profile={mockProfile}
        messageCount={2}
        messageNotifications={notifications}
        openChatPage={mockOpenChatPage}
      />
    );

    const items = screen.getAllByTestId('message-item');

    fireEvent.click(items[0]);

    expect(mockOpenChatPage).toHaveBeenCalledTimes(1);
    expect(mockOpenChatPage).toHaveBeenCalledWith(notifications[0]);
  });
});
