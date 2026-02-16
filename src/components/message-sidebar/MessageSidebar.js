// components/message-sidebar/MessageSidebar.js
import Avatar from '@components/avatar/Avatar';
import Dropdown from '@components/dropdown/Dropdown';
import { Utils } from '@services/utils/utils.services';
import { FaRegEnvelopeOpen } from 'react-icons/fa';
import '@components/message-sidebar/MessageSidebar.scss';

const MessageSidebar = ({ profile, messageCount, messageNotifications, openChatPage }) => {

  // دالة مساعدة لجلب بيانات الطرف التاني
  const getOtherParticipant = (participants) => {
    return participants.find(p => p._id !== profile?._id) || {};
  };

  // دالة لعرض محتوى آخر رسالة بناءً على نوعها
  const renderLastMessage = (convo) => {
    const prefix = convo.lastMessageSenderId === profile?._id ? 'You: ' : '';
    if (convo.lastMessageType === 'image') return `${prefix}📷 Image`;
    if (convo.lastMessageType === 'video') return `${prefix}🎥 Video`;
    if (convo.lastMessageType === 'audio') return `${prefix}🎤 Voice Note`;
    return `${prefix}${convo.lastMessage}`;
  };

  return (
    <Dropdown
      title="Messages"
      height={350}
      style={{ right: '0' }}
      subTitle={messageCount > 0 ? messageCount : null}
    >
      <div className="message-sidebar-container">
        {messageNotifications.length > 0 ? (
          <ul className="message-sidebar-list">
            {messageNotifications.map((convo) => {
              const otherUser = getOtherParticipant(convo.participants);
              const unread = convo.unreadCount?.[profile?._id] > 0;

              return (
                <li
                  key={convo._id}
                  className={`message-sidebar-item ${unread ? 'unread' : ''}`}
                  onClick={() => openChatPage(convo)}
                >
                  <div className="message-sidebar-avatar">
                    <Avatar
                      name={otherUser.username}
                      bgColor={otherUser.avatarColor}
                      textColor="#ffffff"
                      size={45}
                      avatarSrc={otherUser.profilePicture}
                    />
                  </div>
                  <div className="message-sidebar-content">
                    <div className="content-header">
                      <span className="username">{otherUser.username}</span>
                      <span className="time">{Utils.formatTime(convo.createdAt)}</span>
                    </div>
                    <p className="last-message">
                      {renderLastMessage(convo)}
                    </p>
                  </div>
                  {unread && <div className="unread-indicator"></div>}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="empty-state">
            <FaRegEnvelopeOpen className="empty-icon" />
            <p>Your inbox is empty</p>
          </div>
        )}
      </div>
    </Dropdown>
  );
};

export default MessageSidebar;
