import { useSelector } from 'react-redux';
import ChatWindowBody from './ChatWindowBody';
import '@pages/social/chat/chat-window/ChatWindow.scss';

const ChatWindow = () => {
  // Pulling global chat state from Redux
  const { selectedChat, messages, onlineUsers, isLoading } = useSelector((state) => state.chat);
  const { profile } = useSelector((state) => state.user);

  // Rule: Early return for Empty State. This prevents Hook errors in child components.
  if (!selectedChat) {
    return (
      <div className="chat-window-empty">
        <div className="welcome-box">
          <h2>Welcome to Chatty!</h2>
          <p>Select a conversation to start messaging.</p>
        </div>
      </div>
    );
  }

  // If a chat is selected, mount the body and pass required data as props
  return (
    <ChatWindowBody
      selectedChat={selectedChat}
      messages={messages}
      onlineUsers={onlineUsers}
      isLoading={isLoading}
      profile={profile}
    />
  );
};

export default ChatWindow;
