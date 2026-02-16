import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@components/avatar/Avatar';
import MessageBubble from '@pages/social/chat/message-bubble/MessageBubble';
import ChatInput from '@pages/social/chat/chat-input/ChatInput';
import { Utils } from '@services/utils/utils.services';
import { getChatMessages } from '@redux/api/chat';
import { chatService } from '@services/api/chat/chat.service';
import { socketService } from '@services/socket/socket.service';
import useChatScroll from '@hooks/useChatScroll';
import ThemePicker from '../theme-picker/ThemePicker';

const ChatWindowBody = ({
  selectedChat,
  profile,
  onlineUsers,
  messages,
  isLoading,
}) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [replyingMessage, setReplyingMessage] = useState(null);
  const scrollRef = useChatScroll(messages);

  const typingUsers = useSelector(
    (state) => state.chat.typingUsers[selectedChat._id] || []
  );
  const selectedTheme = useSelector((state) => state.chat.selectedTheme);
  const showTyping = typingUsers.length > 0;

  // Extract receiver data (safe to do here as selectedChat is guaranteed)
  const receiver = selectedChat.isGroup
    ? null
    : selectedChat.participants.find((p) => p._id !== profile._id);
  const isReceiverOnline = onlineUsers.includes(receiver?._id);

  // Pagination logic: Triggers when user scrolls to the top
  const handleScroll = (e) => {
    const { scrollTop } = e.currentTarget;

    // Check if scrolled to top, not loading, and more messages exist
    if (
      scrollTop === 0 &&
      !isLoading &&
      messages.length < selectedChat.totalMessages
    ) {
      const nextPage = page + 1;
      setPage(nextPage);

      dispatch(
        getChatMessages({
          conversationId: selectedChat._id,
          receiverId: receiver?._id,
          page: nextPage,
        })
      );
    }
  };

  // Initial fetch when switching between different chats
  useEffect(() => {
    setPage(1);
    dispatch(
      getChatMessages({
        conversationId: selectedChat._id,
        receiverId: receiver?._id,
        page: 1,
      })
    );
  }, [selectedChat._id, receiver?._id, dispatch]);

  useEffect(() => {
    // Check if there are messages and the last one isn't mine
    if (selectedChat && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      // If I'm the receiver and the message is NOT from me
      if (lastMessage.senderId !== profile._id) {
        // API Parameters: conversationId, socketId, messageId
        chatService.markAsRead({
          conversationId: selectedChat._id,
          socketId: socketService.socket.id,
          messageId: lastMessage._id,
        });
      }
    }
  }, [selectedChat, messages, profile._id]);

  return (
    <div className="chat-window-container" data-theme={selectedTheme}>
      {/* Chat Header Section */}
      <div className="chat-header">
        <div className="user-info">
          <Avatar
            name={receiver?.username}
            avatarSrc={receiver?.profilePicture}
            size={45}
          />
          <div className="status-info">
            <span className="name">{receiver?.username}</span>
            {showTyping ? (
              <div className="typing-container">
                <span>typing</span>
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ) : (
              <span
                className={`status ${isReceiverOnline ? 'online' : 'offline'}`}
              >
                {isReceiverOnline ? 'Online' : 'Offline'}
              </span>
            )}
          </div>
        </div>

        <div className="header-actions">
          <ThemePicker />
        </div>
      </div>

      {/* Messages Scrollable Area */}
      <div
        className="messages-container"
        onScroll={handleScroll}
        ref={scrollRef}
      >
        {isLoading && page > 1 && (
          <div className="pagination-loader">
            <div className="dot-pulse">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {messages.map((msg, index) => {
          // Determine if we should show a date separator (Today, Yesterday, etc.)
          const showDateHeader =
            index === 0 ||
            new Date(messages[index - 1].createdAt).toDateString() !==
              new Date(msg.createdAt).toDateString();

          return (
            <div key={msg._id}>
              {showDateHeader && (
                <div className="date-separator">
                  <span>{Utils.chatDate(msg.createdAt)}</span>
                </div>
              )}
              <MessageBubble
                message={msg}
                profileId={profile._id}
                conversation={selectedChat}
                setReplyingMessage={setReplyingMessage}
              />
            </div>
          );
        })}
      </div>

      {/* Message Input Section */}
      <ChatInput
        receiverId={receiver?._id}
        conversationId={selectedChat._id}
        replyingMessage={replyingMessage}
        setReplyingMessage={setReplyingMessage}
      />
    </div>
  );
};

export default ChatWindowBody;
