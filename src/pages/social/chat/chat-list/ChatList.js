import Avatar from '@components/avatar/Avatar';
import { Utils } from '@services/utils/utils.services';
import { useDispatch, useSelector } from 'react-redux';
import '@pages/social/chat/chat-list/ChatList.scss';
import { setSelectedChat } from '@redux/reducers/chat/chat.reducer';
import { FaRegComments } from 'react-icons/fa';

const ChatList = () => {
  const dispatch = useDispatch();

  const { conversations, onlineUsers, selectedChat } = useSelector(
    (state) => state.chat
  );
  const { profile } = useSelector((state) => state.user);

  const handleClickOnChat = (chat) => {
    dispatch(setSelectedChat({ chat, myId: profile._id }));
  };

  return (
    <div className="chat-list-container">
      <div className="chat-list-header">
        <h2>Messages</h2>
        <span className="convo-count">({conversations.length})</span>
      </div>

      <div className="chat-list">
        {conversations.length > 0 ? (
          conversations.map((chat) => {
            const otherUser = chat.participants.find(
              (p) => p._id !== profile._id
            );
            const isOnline = onlineUsers.includes(otherUser?._id);
            const unreadCount = chat.unreadCounts[profile._id] || 0;
            const isActive = selectedChat?._id === chat._id;
            const isLastMessageFromMe = chat.lastMessageSenderId === profile._id;

            return (
              <div
                key={chat._id}
                className={`chat-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  handleClickOnChat(chat);
                }}
              >
                <div className="avatar-container">
                  <Avatar
                    src={otherUser?.profilePicture}
                    name={otherUser?.username}
                    avatarSrc={otherUser?.profilePicture}
                    bgColor={otherUser?.avatarColor}
                    size={50}
                  />
                  {isOnline && <span className="online-status-dot"></span>}
                </div>

                <div className="chat-info">
                  <div className="top-row">
                    <span className="name">{otherUser?.username}</span>
                    <span className="time">
                      {Utils.timeAgo(chat.updatedAt)}
                    </span>
                  </div>
                  <div className="bottom-row">
                    <p className={`last-msg ${unreadCount > 0 ? 'unread' : ''}`}>
                      {isLastMessageFromMe && <span className="you-prefix">You: </span>}
                      {chat.lastMessage}
                    </p>
                    {unreadCount > 0 && (
                      <span className="unread-badge">{unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-chat-list">
            <div className="icon-wrapper">
              <FaRegComments />
            </div>
            <h3>No Conversations Yet</h3>
            <p>Start a new chat by visiting a friend's profile!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
